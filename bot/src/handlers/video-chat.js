import { buildAnnouncement, sessionStore } from '../services/runtime.js';

export async function handleVideoChatEvent(api, message) {
  const chatId = message.chat.id;
  const chatTitle = message.chat.title ?? 'this group';

  if (message.video_chat_started) {
    sessionStore.start(String(chatId), chatTitle);
    sessionStore.incrementAnnouncements(String(chatId), chatTitle);
    await api.sendMessage(chatId, buildAnnouncement(chatTitle));
    return true;
  }

  if (message.video_chat_ended) {
    const session = sessionStore.end(String(chatId), chatTitle);
    await api.sendMessage(chatId, `Voice chat ended in ${session.chatTitle}. Session closed.`);
    return true;
  }

  if (message.video_chat_participants_invited?.users) {
    const participantIds = message.video_chat_participants_invited.users.map((user) => String(user.id));
    const session = sessionStore.addInvitedParticipants(String(chatId), chatTitle, participantIds);
    await api.sendMessage(chatId, `Tracked ${participantIds.length} invited participant(s). Total invited tracked: ${session.invitedParticipantIds.length}.`);
    return true;
  }

  return false;
}
