'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  disconnectGoogleCalendar,
  loadGoogleCalendarStatus,
  startGoogleCalendarConnection,
  testGoogleCalendarConnection,
  type GoogleCalendarIntegrationStatus
} from '../../lore-api';

type CalendarEvent = { id: string | null; title: string; start: string | null; end: string | null; link: string | null };

export default function IntegrationsExperience() {
  const [status, setStatus] = useState<GoogleCalendarIntegrationStatus | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setBusy(true);
    const next = await loadGoogleCalendarStatus();
    setStatus(next);
    setBusy(false);
    if (!next) setMessage('An authenticated LORE admin session is required.');
  };

  useEffect(() => { void refresh(); }, []);

  const connect = async () => {
    setBusy(true);
    setMessage('Opening the Nango authorization flow…');
    const result = await startGoogleCalendarConnection();
    setBusy(false);
    if (!result?.connectLink) {
      setMessage('Nango is not configured or the authorization session could not be created.');
      return;
    }
    window.open(result.connectLink, '_blank', 'noopener,noreferrer');
    setMessage(`Authorization session opened. It expires ${new Date(result.expiresAt).toLocaleString()}.`);
    await refresh();
  };

  const test = async () => {
    setBusy(true);
    setMessage('Requesting the next events through Nango…');
    const result = await testGoogleCalendarConnection();
    setBusy(false);
    if (!result) {
      setMessage('The test action failed. Check the trace ID in the server logs.');
      return;
    }
    setEvents(result.events);
    setMessage(`Connection test succeeded at ${new Date(result.lastSyncedAt).toLocaleString()}.`);
    await refresh();
  };

  const disconnect = async () => {
    setBusy(true);
    const result = await disconnectGoogleCalendar();
    setBusy(false);
    setEvents([]);
    setMessage(result ? 'Google Calendar disconnected and local state cleared.' : 'Disconnect failed; review the server trace.');
    await refresh();
  };

  return (
    <main className="lore-integrations-page">
      <header className="lore-integrations-header"><Link href="/" className="lore-inline-link">← Return to the index</Link><span className="lore-label">LORE / ADMIN / INTEGRATIONS</span></header>
      <section className="lore-integrations-hero"><p className="lore-label">ONE CONNECTION / NO TOKENS IN THE CLIENT</p><h1>Give the Archive one careful door to the outside.</h1><p>Nango owns OAuth credential storage and refresh. Fenrir stores only the tenant-scoped connection ID and the operational state needed to run a safe test action.</p></section>
      <section className="lore-integration-card" aria-labelledby="google-calendar-title">
        <div className="lore-integration-card-top"><div><p className="lore-label">PROVIDER / GOOGLE CALENDAR</p><h2 id="google-calendar-title">Google Calendar</h2></div><span className={`lore-integration-status is-${status?.status ?? 'unknown'}`}>{status?.status?.replaceAll('_', ' ') ?? 'checking'}</span></div>
        <p className="lore-integration-copy">The MVP0 operation is intentionally narrow: read the next events from the primary calendar. The member-facing LORE experience receives only published results, never account credentials.</p>
        <div className="lore-integration-actions"><button type="button" className="lore-button lore-button-primary" onClick={connect} disabled={busy || status?.status === 'connected'}>Connect provider <span aria-hidden="true">↗</span></button><button type="button" className="lore-button lore-button-quiet" onClick={test} disabled={busy || status?.status !== 'connected'}>Test connection <span aria-hidden="true">→</span></button><button type="button" className="lore-button lore-button-quiet" onClick={disconnect} disabled={busy || status?.status !== 'connected'}>Disconnect <span aria-hidden="true">×</span></button></div>
        {status?.connection ? <p className="lore-integration-meta">Connected {new Date(status.connection.createdAt).toLocaleDateString()} · connection ID held server-side · {status.connection.errors.length ? `${status.connection.errors.length} provider error(s)` : 'no provider errors'}</p> : null}
        {message ? <p className="lore-integration-message" role="status">{message}</p> : null}
      </section>
      {events.length ? <section className="lore-integration-events"><p className="lore-label">SAFE TEST RESULT</p><h2>Next events</h2><div className="lore-integration-event-list">{events.map((event) => <article key={event.id ?? `${event.title}-${event.start}`}><strong>{event.title}</strong><span>{event.start ? new Date(event.start).toLocaleString() : 'No start time'}</span></article>)}</div></section> : null}
      <section className="lore-integrations-note"><p className="lore-label">SECURITY CONTRACT</p><p>All integration routes require the LORE admin role. Webhooks are accepted only with the Nango HMAC signing key. Logs contain trace IDs and error categories, not tokens, authorization headers, event payloads, or private account details.</p></section>
    </main>
  );
}
