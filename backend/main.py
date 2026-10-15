import hmac
import hashlib
import os
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]
UNLOCK_SECRET = os.environ["UNLOCK_SECRET"].encode()
REGISTRATION_OPEN = datetime.fromisoformat(os.environ["REGISTRATION_OPEN"])
REGISTRATION_CLOSE = datetime.fromisoformat(os.environ["REGISTRATION_CLOSE"])
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# Must match the keywords in frontend/src/lib/content.js
KEYWORDS = {
    "recon": "recon",
    "keyring": "DEFCON-2026-NITW",
}

UNLOCK_TTL_SECONDS = 30 * 60

SCHEMA = """
create table if not exists teams (
    id bigint generated always as identity primary key,
    team_name text not null unique,
    university text not null,
    course text not null,
    year_sem text not null,
    created_at timestamptz not null default now()
);
create table if not exists participants (
    id bigint generated always as identity primary key,
    team_id bigint not null references teams(id) on delete cascade,
    position int not null,
    full_name text not null,
    roll_no text not null,
    email text not null,
    phone text not null
);
"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    with psycopg.connect(DATABASE_URL) as conn:
        conn.execute(SCHEMA)
    yield


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


limiter = Limiter(key_func=client_ip)
app = FastAPI(title="DEFCON 2.0 Registration API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "X-Unlock-Token"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    # Send a readable message so the frontend can display it directly
    first = exc.errors()[0]
    field = ".".join(str(p) for p in first["loc"][1:]) or "input"
    return JSONResponse(status_code=422, content={"detail": f"Invalid {field}: {first['msg']}"})


# ---------- Unlock token (proves the challenges were solved on the server) ----------

def make_unlock_token() -> str:
    expires = str(int(time.time()) + UNLOCK_TTL_SECONDS)
    sig = hmac.new(UNLOCK_SECRET, expires.encode(), hashlib.sha256).hexdigest()
    return f"{expires}.{sig}"


def is_valid_unlock_token(token: str | None) -> bool:
    if not token or "." not in token:
        return False
    expires, sig = token.split(".", 1)
    expected = hmac.new(UNLOCK_SECRET, expires.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(sig, expected) and int(expires) > time.time()


class UnlockRequest(BaseModel):
    recon: str = Field(max_length=100)
    keyring: str = Field(max_length=100)


@app.post("/api/unlock")
@limiter.limit("20/minute")
def unlock(request: Request, body: UnlockRequest):
    ok = (
        hmac.compare_digest(body.recon.strip(), KEYWORDS["recon"])
        and hmac.compare_digest(body.keyring.strip(), KEYWORDS["keyring"])
    )
    if not ok:
        raise HTTPException(status_code=403, detail="Challenge keywords are incorrect.")
    return {"token": make_unlock_token(), "expires_in": UNLOCK_TTL_SECONDS}


# ---------- Registration ----------

class Member(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=100)
    roll: str = Field(min_length=2, max_length=50)
    email: EmailStr
    phone: str = Field(pattern=r"^\+?[0-9][0-9 \-]{6,18}$")


class TeamRegistration(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    teamName: str = Field(min_length=2, max_length=60)
    university: str = Field(min_length=2, max_length=120)
    course: str = Field(min_length=2, max_length=120)
    yearSem: str = Field(min_length=2, max_length=60)
    participants: list[Member] = Field(min_length=1, max_length=4)


@app.get("/api/status")
def status():
    now = datetime.now(timezone.utc)
    return {
        "open": REGISTRATION_OPEN <= now <= REGISTRATION_CLOSE,
        "opens_at": REGISTRATION_OPEN.isoformat(),
        "closes_at": REGISTRATION_CLOSE.isoformat(),
    }


@app.post("/api/register", status_code=201)
@limiter.limit("5/minute")
def register(
    request: Request,
    team: TeamRegistration,
    x_unlock_token: str | None = Header(default=None),
):
    now = datetime.now(timezone.utc)
    if now < REGISTRATION_OPEN:
        raise HTTPException(status_code=403, detail=f"Registration opens at {REGISTRATION_OPEN:%d %b %Y, %H:%M %Z}.")
    if now > REGISTRATION_CLOSE:
        raise HTTPException(status_code=403, detail="Registration is closed.")
    if not is_valid_unlock_token(x_unlock_token):
        raise HTTPException(status_code=403, detail="Solve all challenges before registering.")

    try:
        with psycopg.connect(DATABASE_URL) as conn:
            row = conn.execute(
                """insert into teams (team_name, university, course, year_sem)
                   values (%s, %s, %s, %s) returning id""",
                (team.teamName, team.university, team.course, team.yearSem),
            ).fetchone()
            team_id = row[0]
            for position, m in enumerate(team.participants, start=1):
                conn.execute(
                    """insert into participants (team_id, position, full_name, roll_no, email, phone)
                       values (%s, %s, %s, %s, %s, %s)""",
                    (team_id, position, m.name, m.roll, m.email, m.phone),
                )
    except psycopg.errors.UniqueViolation:
        raise HTTPException(status_code=409, detail="A team with this name is already registered.")

    return {"message": f"Team '{team.teamName}' registered with {len(team.participants)} member(s)!"}