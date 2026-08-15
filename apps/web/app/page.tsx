import {
  ArchitectureOverview,
  CTASection,
  FeatureGrid,
  Hero,
  HeroAssetShowcase,
  HowItWorks,
  Panel,
  Roadmap,
} from "@stixmagic/ui";
import { loadPipelineManifest } from "./integrations/manifest";

const features = [
  {
    tag: "Telegram-native",
    title: "Automate group reactions",
    description:
      "Turn a sticker or emoji into a reply, animation, sticker, or action button without leaving Telegram.",
  },
  {
    tag: "Control Center",
    title: "Rules you can actually manage",
    description:
      "See connected groups, active rules, and cooldown settings from one focused Mini App.",
  },
  {
    tag: "Magic assets",
    title: "A visual language built in",
    description:
      "Use curated motion alphabets, neon signals, DJ visuals, and reaction packs as your response layer.",
  },
  {
    tag: "Safe by design",
    title: "Admin-only configuration",
    description:
      "Telegram launch data, explicit admin access, idempotent webhooks, and queued execution protect the loop.",
  },
];

export default async function HomePage() {
  const manifest = await loadPipelineManifest();
  const showcaseAssets = manifest.assets.slice(0, 6);

  return (
    <div className="space-y-12 pb-10">
      <Hero
        badge="STIK MΛGIC · Telegram reaction engine"
        title="Make every sticker do something."
        subtitle="Connect a Telegram group, map any sticker or emoji to a magical response, and manage the whole reaction loop from one control center."
        primaryCta="Open Control Center"
        primaryHref="/dashboard"
        secondaryCta="Browse Magic Packs"
        secondaryHref="/packs"
        previewSlot={<HeroAssetShowcase items={showcaseAssets} />}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="text-xs uppercase tracking-wider text-accent-cyan">
            One trigger. One response. Instant magic.
          </p>
          <h2 className="mt-3 text-xl font-semibold text-text">
            Your group, now programmable.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Choose an emoji or sticker, define what STIK MΛGIC should send back,
            and switch the rule on. The Mini App keeps every group and reaction
            visible without turning setup into bot-command archaeology.
          </p>
        </Panel>
        <Panel variant="secondary">
          <p className="text-xs uppercase tracking-wider text-accent-violet">
            Live MVP
          </p>
          <h2 className="mt-3 text-xl font-semibold text-text">
            A complete reaction loop.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Group discovery, rule management, queued matching, and Telegram Bot
            API responses now form one coherent product flow. The public build
            uses safe demo data until the production API runtime is connected.
          </p>
        </Panel>
      </section>

      <FeatureGrid items={features} />

      <ArchitectureOverview />

      <HowItWorks />

      <Roadmap />

      <CTASection />
    </div>
  );
}
