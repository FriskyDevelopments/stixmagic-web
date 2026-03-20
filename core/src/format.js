export function formatAnnouncement(template, input) {
  return template.replaceAll('{title}', input.title).replaceAll('{chatTitle}', input.chatTitle);
}

export function formatSessionStatus(session) {
  const queue = session.speakerQueue.length > 0 ? session.speakerQueue.map((name, index) => `${index + 1}. ${name}`).join('\n') : 'No one is queued.';
  const invited = session.invitedParticipantIds.length;
  const started = session.startedAt ? new Date(session.startedAt).toISOString() : 'Not started';

  return [
    `Room: ${session.chatTitle}`,
    `State: ${session.state}`,
    `Started: ${started}`,
    `Invited participants tracked: ${invited}`,
    `Announcements sent: ${session.announcementsSent}`,
    'Speaker queue:',
    queue
  ].join('\n');
}
