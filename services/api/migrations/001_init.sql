CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  telegram_user_id BIGINT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telegram_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT,
  member_count INTEGER NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  reactions_enabled BOOLEAN NOT NULL DEFAULT true,
  max_reactions_per_message INTEGER NOT NULL DEFAULT 3,
  cooldown_seconds INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reaction_rules (
  id UUID PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES telegram_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_value TEXT NOT NULL,
  response_type TEXT NOT NULL,
  response_content TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sticker_packs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  telegram_pack_name TEXT,
  telegram_pack_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS triggers (
  id UUID PRIMARY KEY,
  sticker_id UUID,
  action_type TEXT NOT NULL,
  action_payload JSONB NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stickers (
  id UUID PRIMARY KEY,
  pack_id UUID NOT NULL REFERENCES sticker_packs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  metadata JSONB NOT NULL,
  trigger_id UUID REFERENCES triggers(id),
  telegram_file_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_status_run_at_idx ON jobs(status, run_at);

CREATE TABLE IF NOT EXISTS telegram_webhook_updates (
  update_id BIGINT PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB NOT NULL
);

INSERT INTO telegram_groups (id, name, username, member_count, is_admin, reactions_enabled, max_reactions_per_message, cooldown_seconds, created_at)
VALUES
  ('1', 'Stix Magic Fans', '@stixmagic_fans', 1247, true, true, 3, 30, '2024-01-15T00:00:00Z'),
  ('2', 'Dev Workspace', '@devworkspace', 42, true, false, 1, 60, '2024-03-01T00:00:00Z'),
  ('3', 'Community Hub', '@stixmagic_community', 3890, true, true, 5, 15, '2024-04-20T00:00:00Z')
ON CONFLICT (id) DO NOTHING;
