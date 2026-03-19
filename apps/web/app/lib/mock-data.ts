import type { TelegramGroup, ReactionRule } from '@stixmagic/types';

export const MOCK_GROUPS: TelegramGroup[] = [
  {
    id: '1',
    name: 'Stix Magic Fans',
    username: '@stixmagic_fans',
    memberCount: 1247,
    isAdmin: true,
    settings: {
      reactionsEnabled: true,
      maxReactionsPerMessage: 3,
      cooldownSeconds: 30
    },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Dev Workspace',
    username: '@devworkspace',
    memberCount: 42,
    isAdmin: true,
    settings: {
      reactionsEnabled: false,
      maxReactionsPerMessage: 1,
      cooldownSeconds: 60
    },
    createdAt: '2024-03-01'
  },
  {
    id: '3',
    name: 'Community Hub',
    username: '@stixmagic_community',
    memberCount: 3890,
    isAdmin: true,
    settings: {
      reactionsEnabled: true,
      maxReactionsPerMessage: 5,
      cooldownSeconds: 15
    },
    createdAt: '2024-04-20'
  }
];

export const MOCK_RULES: Record<string, ReactionRule[]> = {
  '1': [
    {
      id: 'r1',
      groupId: '1',
      name: 'Magic Activation',
      triggerType: 'sticker',
      triggerValue: 'sticker_abc123',
      responseType: 'message',
      responseContent: '✨ Magic activated!',
      enabled: true,
      createdAt: '2024-02-01',
      updatedAt: '2024-02-01'
    },
    {
      id: 'r2',
      groupId: '1',
      name: 'Sparkle Response',
      triggerType: 'emoji',
      triggerValue: '✨',
      responseType: 'sticker',
      responseContent: 'sticker_sparkle_id',
      enabled: true,
      createdAt: '2024-02-10',
      updatedAt: '2024-02-15'
    },
    {
      id: 'r3',
      groupId: '1',
      name: 'Fire Emoji Burst',
      triggerType: 'emoji',
      triggerValue: '🔥',
      responseType: 'animation',
      responseContent: 'animation_fire_burst',
      enabled: false,
      createdAt: '2024-03-05',
      updatedAt: '2024-03-05'
    }
  ],
  '2': [
    {
      id: 'r4',
      groupId: '2',
      name: 'Dev Poke',
      triggerType: 'sticker',
      triggerValue: 'sticker_poke_id',
      responseType: 'message',
      responseContent: '👋 Hey developer!',
      enabled: true,
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10'
    }
  ],
  '3': []
};

export function getGroup(id: string): TelegramGroup | undefined {
  return MOCK_GROUPS.find((g) => g.id === id);
}

export function getRules(groupId: string): ReactionRule[] {
  return MOCK_RULES[groupId] ?? [];
}
