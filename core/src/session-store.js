function createEmptySession(chatId, chatTitle) {
  return {
    chatId,
    chatTitle,
    state: 'idle',
    startedAt: undefined,
    endedAt: undefined,
    invitedParticipantIds: [],
    speakerQueue: [],
    announcementsSent: 0
  };
}

export class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  get(chatId, chatTitle) {
    const existing = this.sessions.get(chatId);
    if (existing) {
      existing.chatTitle = chatTitle;
      return existing;
    }

    const session = createEmptySession(chatId, chatTitle);
    this.sessions.set(chatId, session);
    return session;
  }

  start(chatId, chatTitle) {
    const session = this.get(chatId, chatTitle);
    session.state = 'live';
    session.startedAt = new Date().toISOString();
    session.endedAt = undefined;
    session.speakerQueue = [];
    session.invitedParticipantIds = [];
    session.announcementsSent = 0;
    return session;
  }

  end(chatId, chatTitle) {
    const session = this.get(chatId, chatTitle);
    session.state = 'idle';
    session.endedAt = new Date().toISOString();
    session.speakerQueue = [];
    return session;
  }

  addToQueue(chatId, chatTitle, userLabel) {
    const session = this.get(chatId, chatTitle);
    if (!session.speakerQueue.includes(userLabel)) {
      session.speakerQueue.push(userLabel);
    }
    return session;
  }

  removeFromQueue(chatId, chatTitle, userLabel) {
    const session = this.get(chatId, chatTitle);
    session.speakerQueue = session.speakerQueue.filter((entry) => entry !== userLabel);
    return session;
  }

  addInvitedParticipants(chatId, chatTitle, participantIds) {
    const session = this.get(chatId, chatTitle);
    session.invitedParticipantIds = [...new Set([...session.invitedParticipantIds, ...participantIds])];
    return session;
  }

  incrementAnnouncements(chatId, chatTitle) {
    const session = this.get(chatId, chatTitle);
    session.announcementsSent += 1;
    return session;
  }
}
