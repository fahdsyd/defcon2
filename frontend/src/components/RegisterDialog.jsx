import { useEffect, useState } from 'react';
import { KEYWORDS } from '../lib/content';

const API = import.meta.env.VITE_API_URL;
const emptyMember = () => ({ name: '', roll: '', email: '', phone: '' });

export default function RegisterDialog({ onClose }) {
  const [token, setToken] = useState(null);
  const [unlockError, setUnlockError] = useState(null);
  const [team, setTeam] = useState({ teamName: '', university: 'NIT Warangal', course: '', yearSem: '' });
  const [members, setMembers] = useState([emptyMember()]);
  const [status, setStatus] = useState(null); // { type: 'ok'|'err', text }
  const [submitting, setSubmitting] = useState(false);

  const count = members.length;
  const width = { 1: 520, 2: 600, 3: 680, 4: 760 }[count];

  // Ask the server to verify the challenge keywords and issue an unlock token
  useEffect(() => {
    let cancelled = false;
    async function unlock() {
      try {
        const res = await fetch(`${API}/api/unlock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recon: KEYWORDS.recon, keyring: KEYWORDS.keyring }),
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) setToken(data.token);
        else setUnlockError(data.detail || 'Could not verify challenges.');
      } catch {
        if (!cancelled) setUnlockError('Backend not reachable. Start the FastAPI server and try again.');
      }
    }
    unlock();
    return () => { cancelled = true; };
  }, []);

  function updateMember(i, field, value) {
    setMembers((m) => m.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }

  function addMember() {
    if (count < 4) setMembers((m) => [...m, emptyMember()]);
  }

  function removeMember(i) {
    if (count > 1 && i > 0) setMembers((m) => m.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch(`${API}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Unlock-Token': token,
        },
        body: JSON.stringify({ ...team, participants: members }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: 'err', text: data.detail || 'Registration failed.' });
      } else {
        setStatus({ type: 'ok', text: data.message || 'Team registered!' });
      }
    } catch {
      setStatus({ type: 'err', text: 'Backend not reachable. Start the FastAPI server and try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className={`dialog participants-${count}`}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Team registration"
      >
        <div className="dialog-header">
          <span>TEAM REGISTRATION</span>
          <button type="button" className="close" onClick={onClose}>[x]</button>
        </div>

        {unlockError && (
          <div className="dialog-body">
            <div className="tone-err">{unlockError}</div>
          </div>
        )}

        {!token && !unlockError && (
          <div className="dialog-body">
            <div className="tone-ok">Verifying challenge clearance...</div>
          </div>
        )}

        {token && (
          <form onSubmit={handleSubmit} className="dialog-body">
            <fieldset>
              <legend>Team</legend>
              <label>Team name<input required value={team.teamName} onChange={(e) => setTeam({ ...team, teamName: e.target.value })} /></label>
              <label>University<input required value={team.university} onChange={(e) => setTeam({ ...team, university: e.target.value })} /></label>
              <label>Course / Degree<input required placeholder="e.g. B.Tech CSE" value={team.course} onChange={(e) => setTeam({ ...team, course: e.target.value })} /></label>
              <label>Year & Semester<input required placeholder="e.g. 3rd Year, Sem 1" value={team.yearSem} onChange={(e) => setTeam({ ...team, yearSem: e.target.value })} /></label>
            </fieldset>

            {members.map((m, i) => (
              <fieldset key={i}>
                <legend>
                  {i === 0 ? 'Team Leader' : `Member ${i + 1}`}
                  {i > 0 && (
                    <button type="button" className="remove" onClick={() => removeMember(i)}>remove</button>
                  )}
                </legend>
                <label>Full name<input required value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} /></label>
                <label>Roll no / Reg no<input required value={m.roll} onChange={(e) => updateMember(i, 'roll', e.target.value)} /></label>
                <label>Email<input required type="email" value={m.email} onChange={(e) => updateMember(i, 'email', e.target.value)} /></label>
                <label>Phone<input required type="tel" value={m.phone} onChange={(e) => updateMember(i, 'phone', e.target.value)} /></label>
              </fieldset>
            ))}

            <div className="dialog-note">
              {count < 4 ? (
                <button type="button" className="add" onClick={addMember}>+ add member ({count}/4)</button>
              ) : (
                <span>Team is full (4/4).</span>
              )}
              <span className="note">One person can belong to only one team.</span>
            </div>

            {status && <div className={status.type === 'ok' ? 'tone-ok' : 'tone-err'}>{status.text}</div>}

            <button type="submit" className="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}