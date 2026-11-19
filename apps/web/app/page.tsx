import {
  ArchitectureOverview,
  CTASection,
  FeatureGrid,
  HowItWorks,
  Roadmap,
} from "@stixmagic/ui";
import { CinematicHero, StingerIntro } from "./components/CinematicHero";
import { Reveal } from "./components/Reveal";

const features = [
  {
    tag: "Telegram-native",
    title: "Automate group reactions",
    description:
      "Turn a sticker or emoji into a reply, animation, sticker, or action button without leaving Telegram.",
  },
  {
    tag: "Control center",
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

export default function HomePage() {
  return (
    <div className="pb-10">
      <StingerIntro />

      <CinematicHero
        primaryCta="Open the control center ✦"
        primaryHref="/dashboard"
        secondaryCta="Browse magic packs"
        secondaryHref="/packs"
      />

      <Reveal>
        <hr className="stx-wand-seam" aria-hidden="true" />
      </Reveal>

      <section className="grid gap-4 pt-14 lg:grid-cols-2">
        <Reveal className="stx-glass stx-glow-card p-7">
          <p className="stx-eyebrow" style={{ color: "var(--stx-violet)" }}>
            One trigger · one response
          </p>
          <h2 className="stx-h2 mt-4">Your group, now programmable.</h2>
          <p className="stx-lede mt-3">
            Choose an emoji or sticker, define what STIX MΛGIC should send back,
            and switch the rule on. The Mini App keeps every group and reaction
            visible without turning setup into bot-command archaeology.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="stx-glass stx-glass-raised stx-glow-card p-7">
          <p className="stx-eyebrow">Live MVP</p>
          <h2 className="stx-h2 mt-4">A complete reaction loop.</h2>
          <p className="stx-lede mt-3">
            Group discovery, rule management, queued matching, and Telegram Bot
            API responses now form one coherent product flow. The public build
            uses safe demo data until the production API runtime is connected.
          </p>
        </Reveal>
      </section>

      <Reveal className="pt-14">
        <FeatureGrid items={features} />
      </Reveal>

      <Reveal className="pt-14">
        <ArchitectureOverview />
      </Reveal>

      <Reveal className="pt-14">
        <HowItWorks />
      </Reveal>

      <Reveal className="pt-14">
        <Roadmap />
      </Reveal>

      <Reveal className="pt-14">
        <CTASection />
      </Reveal>
    </div>
  );
}
