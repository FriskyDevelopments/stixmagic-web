export type Platform = 'telegram' | 'discord' | 'slack';

export type AssetFormat = 'gif' | 'webm' | 'webp' | 'png' | 'mp4';

export type PackCategory =
  | 'motion-alphabet'
  | 'neon-signals'
  | 'dj-pack'
  | 'cloud-pack'
  | 'overlay-starter'
  | 'emoji-set'
  | 'symbols';

export const PACK_CATEGORY_LABELS: Record<PackCategory, string> = {
  'motion-alphabet': 'Motion Alphabet',
  'neon-signals': 'Neon Signals',
  'dj-pack': 'DJ Pack',
  'cloud-pack': 'Cloud Pack',
  'overlay-starter': 'Overlay Starter',
  'emoji-set': 'Emoji Set',
  symbols: 'Symbols'
};

/** Sentinel value for pack/asset preview URLs that are pending pipeline integration. */
export const PENDING_PREVIEW_URL = '' as const;

export type AssetTag = 'animated' | 'looping' | 'overlay' | 'sticker' | 'letter' | 'symbol' | 'neon' | 'music';

/** Preview display state for asset thumbnails. */
export type PreviewState = 'pending' | 'loading' | 'ready' | 'failed';

/** Access tier for a pack — used for plan-aware UI gating (no billing logic here). */
export type PlanTier = 'free' | 'premium' | 'pro';

export interface AssetPreviewItem {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  formats: AssetFormat[];
  tags: AssetTag[];
  packId: string;
}

export interface ProductPack {
  id: string;
  name: string;
  category: PackCategory;
  description: string;
  previewUrl: string;
  assetCount: number;
  tags: AssetTag[];
  formats: AssetFormat[];
  featured: boolean;
  /** Optional plan tier — rendered as a badge in pack cards when present. */
  plan?: PlanTier;
}

export interface GeneratorStyle {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: PackCategory;
}

export interface PipelineManifest {
  version: string;
  generatedAt: string;
  packs: ProductPack[];
  assets: AssetPreviewItem[];
}

// ---------------------------------------------------------------------------
// Runtime manifest validation
// ---------------------------------------------------------------------------

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

const VALID_PACK_CATEGORIES: ReadonlyArray<PackCategory> = [
  'motion-alphabet',
  'neon-signals',
  'dj-pack',
  'cloud-pack',
  'overlay-starter',
  'emoji-set',
  'symbols'
];

const VALID_ASSET_FORMATS: ReadonlyArray<AssetFormat> = ['gif', 'webm', 'webp', 'png', 'mp4'];
const VALID_ASSET_TAGS: ReadonlyArray<AssetTag> = [
  'animated',
  'looping',
  'overlay',
  'sticker',
  'letter',
  'symbol',
  'neon',
  'music'
];
const VALID_PLAN_TIERS: ReadonlyArray<PlanTier> = ['free', 'premium', 'pro'];

function isStr(v: unknown): v is string {
  return typeof v === 'string';
}
function isNum(v: unknown): v is number {
  return typeof v === 'number';
}
function isBool(v: unknown): v is boolean {
  return typeof v === 'boolean';
}
function isArr(v: unknown): v is unknown[] {
  return Array.isArray(v);
}
function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function validateProductPack(raw: unknown): ValidationResult<ProductPack> {
  if (!isObj(raw)) return { ok: false, error: 'pack is not an object' };
  const id = String(raw.id ?? '');
  if (!isStr(raw.id) || !raw.id) return { ok: false, error: 'pack.id must be a non-empty string' };
  if (!isStr(raw.name) || !raw.name) return { ok: false, error: `pack(${id}).name must be a non-empty string` };
  if (!isStr(raw.category) || !VALID_PACK_CATEGORIES.includes(raw.category as PackCategory)) {
    return { ok: false, error: `pack(${id}).category is not a valid PackCategory` };
  }
  if (!isStr(raw.description)) return { ok: false, error: `pack(${id}).description must be a string` };
  if (!isStr(raw.previewUrl)) return { ok: false, error: `pack(${id}).previewUrl must be a string` };
  if (!isNum(raw.assetCount)) return { ok: false, error: `pack(${id}).assetCount must be a number` };
  if (!isBool(raw.featured)) return { ok: false, error: `pack(${id}).featured must be a boolean` };
  if (!isArr(raw.tags)) return { ok: false, error: `pack(${id}).tags must be an array` };
  if (!isArr(raw.formats)) return { ok: false, error: `pack(${id}).formats must be an array` };

  const tags = (raw.tags as unknown[]).filter(
    (t): t is AssetTag => isStr(t) && VALID_ASSET_TAGS.includes(t as AssetTag)
  );
  const formats = (raw.formats as unknown[]).filter(
    (f): f is AssetFormat => isStr(f) && VALID_ASSET_FORMATS.includes(f as AssetFormat)
  );
  const plan =
    isStr(raw.plan) && VALID_PLAN_TIERS.includes(raw.plan as PlanTier)
      ? (raw.plan as PlanTier)
      : undefined;

  return {
    ok: true,
    data: {
      id: raw.id,
      name: raw.name,
      category: raw.category as PackCategory,
      description: raw.description,
      previewUrl: raw.previewUrl,
      assetCount: raw.assetCount,
      tags,
      formats,
      featured: raw.featured,
      ...(plan !== undefined ? { plan } : {})
    }
  };
}

export function validateAssetPreviewItem(raw: unknown): ValidationResult<AssetPreviewItem> {
  if (!isObj(raw)) return { ok: false, error: 'asset is not an object' };
  const id = String(raw.id ?? '');
  if (!isStr(raw.id) || !raw.id) return { ok: false, error: 'asset.id must be a non-empty string' };
  if (!isStr(raw.name) || !raw.name) return { ok: false, error: `asset(${id}).name must be a non-empty string` };
  if (!isStr(raw.description)) return { ok: false, error: `asset(${id}).description must be a string` };
  if (!isStr(raw.previewUrl)) return { ok: false, error: `asset(${id}).previewUrl must be a string` };
  if (!isStr(raw.packId)) return { ok: false, error: `asset(${id}).packId must be a string` };
  if (!isArr(raw.formats)) return { ok: false, error: `asset(${id}).formats must be an array` };
  if (!isArr(raw.tags)) return { ok: false, error: `asset(${id}).tags must be an array` };

  const formats = (raw.formats as unknown[]).filter(
    (f): f is AssetFormat => isStr(f) && VALID_ASSET_FORMATS.includes(f as AssetFormat)
  );
  const tags = (raw.tags as unknown[]).filter(
    (t): t is AssetTag => isStr(t) && VALID_ASSET_TAGS.includes(t as AssetTag)
  );

  return {
    ok: true,
    data: {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      previewUrl: raw.previewUrl,
      formats,
      tags,
      packId: raw.packId
    }
  };
}

export function validatePipelineManifest(raw: unknown): ValidationResult<PipelineManifest> {
  if (!isObj(raw)) return { ok: false, error: 'manifest is not an object' };
  if (!isStr(raw.version)) return { ok: false, error: 'manifest.version must be a string' };
  if (!isStr(raw.generatedAt)) return { ok: false, error: 'manifest.generatedAt must be a string' };
  if (!isArr(raw.packs)) return { ok: false, error: 'manifest.packs must be an array' };
  if (!isArr(raw.assets)) return { ok: false, error: 'manifest.assets must be an array' };

  const packs: ProductPack[] = [];
  for (const item of raw.packs) {
    const result = validateProductPack(item);
    if (result.ok) {
      packs.push(result.data);
    } else {
      console.warn(`[manifest] skipping invalid pack entry: ${result.error}`);
    }
  }

  const assets: AssetPreviewItem[] = [];
  for (const item of raw.assets) {
    const result = validateAssetPreviewItem(item);
    if (result.ok) {
      assets.push(result.data);
    } else {
      console.warn(`[manifest] skipping invalid asset entry: ${result.error}`);
    }
  }

  return {
    ok: true,
    data: {
      version: raw.version,
      generatedAt: raw.generatedAt,
      packs,
      assets
    }
  };
}

export type ActionType = 'send_message' | 'run_command' | 'call_webhook' | 'bot_reaction';
export type BotRuntimeMode = 'polling' | 'webhook';

export type MaskType =
  | 'default'
  | 'circle'
  | 'square'
  | 'oval'
  | 'diamond'
  | 'star'
  | 'heart';

export interface User {
  id: string;
  username: string;
  platform: Platform;
  createdAt: string;
}

export interface StickerMetadata {
  width: number;
  height: number;
  format: 'webp' | 'png' | 'webm';
  sizeBytes: number;
  maskType: MaskType;
  interactive: boolean;
}

export interface Sticker {
  id: string;
  packId: string;
  imageUrl: string;
  metadata: StickerMetadata;
  triggerId: string;
  createdAt: string;
}

export interface StickerPack {
  id: string;
  name: string;
  ownerId: string;
  stickers: Sticker[];
  createdAt: string;
  updatedAt: string;
}

export interface Trigger {
  id: string;
  stickerId: string;
  actionType: ActionType;
  actionPayload: Record<string, unknown>;
  enabled: boolean;
  createdAt: string;
}

export interface MaskDefinition {
  id: MaskType;
  name: string;
  description: string;
  category: 'classic' | 'expressive';
}

export interface StickerCreatedEvent {
  type: 'sticker.created';
  occurredAt: string;
  stickerId: string;
  packId: string;
}

export interface StickerUsedEvent {
  type: 'sticker.used';
  occurredAt: string;
  platform: Platform;
  stickerId: string;
  actorId: string;
  chatId: string;
}

export type DomainEvent = StickerCreatedEvent | StickerUsedEvent;

export type TriggerType = 'sticker' | 'emoji';

export type ResponseType = 'message' | 'sticker' | 'animation' | 'button_action';

export interface GroupSettings {
  reactionsEnabled: boolean;
  maxReactionsPerMessage: number;
  cooldownSeconds: number;
}

export interface TelegramGroup {
  id: string;
  name: string;
  username?: string;
  memberCount: number;
  isAdmin: boolean;
  settings: GroupSettings;
  createdAt: string;
}

export interface ReactionRule {
  id: string;
  groupId: string;
  name: string;
  triggerType: TriggerType;
  triggerValue: string;
  responseType: ResponseType;
  responseContent: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramMiniAppUser {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface TelegramMiniAppInitData {
  queryId?: string;
  authDate?: string;
  hash?: string;
  user?: TelegramMiniAppUser;
  chatType?: string;
  chatInstance?: string;
  startParam?: string;
}

export interface TelegramMiniAppContext {
  launchSource: 'bot_command' | 'deep_link' | 'direct';
  initDataUnsafe: TelegramMiniAppInitData | null;
  rawInitData?: string;
}

export interface TelegramSurfaceLinks {
  botUsername: string;
  miniAppUrl: string;
  botStartUrl: string;
  miniAppStartUrl: string;
}

export interface TelegramPlatformConfig {
  productName: string;
  platform: 'telegram';
  runtimeMode: BotRuntimeMode;
  botUsername: string;
  miniAppUrl: string;
  apiBaseUrl: string;
  webhookUrl?: string;
  links: TelegramSurfaceLinks;
}

export interface TelegramMiniAppBootstrap {
  config: TelegramPlatformConfig;
  context: TelegramMiniAppContext;
  groups: TelegramGroup[];
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

export interface CreateStickerRequest {
  packId: string;
  imageUrl: string;
  metadata: StickerMetadata;
  triggerId: string;
}

export interface CreatePackRequest {
  name: string;
  ownerId: string;
}

export interface CreateTriggerRequest {
  stickerId: string;
  actionType: ActionType;
  actionPayload: Record<string, unknown>;
}

export interface CreateReactionRuleRequest {
  name: string;
  triggerType: TriggerType;
  triggerValue: string;
  responseType: ResponseType;
  responseContent: string;
  enabled: boolean;
}

export const BUILTIN_MASKS: MaskDefinition[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Keeps the full image intact for fast sticker generation.',
    category: 'classic'
  },
  {
    id: 'circle',
    name: 'Circle',
    description: 'Perfect for profile-style stickers with balanced framing.',
    category: 'classic'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Clean geometric mask built for UI iconography and logos.',
    category: 'classic'
  },
  {
    id: 'oval',
    name: 'Oval',
    description: 'Soft portrait-style crop for expressive character stickers.',
    category: 'expressive'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    description: 'Sharp angular crop that feels dynamic in chat streams.',
    category: 'expressive'
  },
  {
    id: 'star',
    name: 'Star',
    description: 'High-energy badge mask for reaction-focused sticker packs.',
    category: 'expressive'
  },
  {
    id: 'heart',
    name: 'Heart',
    description: 'Community favorite mask for emotive and social moments.',
    category: 'expressive'
  }
];
