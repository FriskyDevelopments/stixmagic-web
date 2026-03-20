const TELEGRAM_API_BASE = 'https://api.telegram.org';

export class TelegramApi {
  constructor(token) {
    this.token = token;
    this.baseUrl = `${TELEGRAM_API_BASE}/bot${token}`;
    this.offset = 0;
  }

  async request(method, payload = undefined) {
    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined
    });

    if (!response.ok) {
      throw new Error(`Telegram API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Telegram API error on ${method}: ${data.description}`);
    }

    return data.result;
  }

  async sendMessage(chatId, text) {
    return this.request('sendMessage', { chat_id: chatId, text });
  }

  async setMyCommands(commands) {
    return this.request('setMyCommands', { commands });
  }

  async getUpdates() {
    const updates = await this.request('getUpdates', {
      offset: this.offset,
      timeout: 30,
      allowed_updates: ['message']
    });

    if (updates.length > 0) {
      this.offset = updates[updates.length - 1].update_id + 1;
    }

    return updates;
  }
}
