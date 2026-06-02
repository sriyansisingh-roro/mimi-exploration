"use client";

import Link from "next/link";
import { Instrument_Serif, Manrope, Space_Grotesk } from "next/font/google";
import Mimi from "@/components/mimi/Mimi";
import MimiSprout from "@/components/mimi/sprout/MimiSprout";
import MimiPenguin from "@/components/mimi/penguin/MimiPenguin";

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const C = {
  primary: "#6C73FF",
  accent: "#FF9A8B",
  ink: "#252A44",
  soft: "#7C7F95",
  bg: "#FBFAFF",
  cool: "#F2F4FF",
  warm: "#FFF8F1",
  line: "#E6E7F5",
  leaf: "#69BD6E",
};

type CharCard = {
  key: string;
  tag: string;
  title: string;
  blurb: string;
  href: string;
  preview: React.ReactNode;
  dotColor: string;
};

const CARDS: CharCard[] = [
  {
    key: "original",
    tag: "V1 · 6 STATES",
    title: "Original",
    blurb:
      "The first plush sprout — six grounded states with Framer Motion. Where Mimi began.",
    href: "/mimi-preview",
    dotColor: C.primary,
    preview: <Mimi state="idle" size={150} />,
  },
  {
    key: "sprout",
    tag: "SPROUT · 10 MOODS",
    title: "Sprout",
    blurb:
      "The seed-body refined to ten expressions and full-body poses, rebuilt in plain SVG + CSS.",
    href: "/mimi-sprout",
    dotColor: C.leaf,
    preview: <MimiSprout mood="happy" view="front" size={150} />,
  },
  {
    key: "penguin",
    tag: "PENGUIN · 10 MOODS",
    title: "Penguin",
    blurb:
      "A soft clay penguin chick — lavender hood, tiny beak, ten moods of warm companionship.",
    href: "/mimi-penguin",
    dotColor: C.accent,
    preview: <MimiPenguin mood="happy" size={150} />,
  },
];

function Card({ card }: { card: CharCard }) {
  return (
    <Link
      href={card.href}
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        background: "#fff",
        border: `1px solid ${C.line}`,
        borderRadius: 28,
        overflow: "hidden",
        boxShadow:
          "0 1px 2px rgba(37,42,68,.04), 0 30px 70px -50px rgba(37,42,68,.35)",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: 240,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(135deg, ${C.warm} 0%, ${C.bg} 45%, ${C.cool} 100%)`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {card.preview}
      </div>
      <div style={{ padding: "22px 24px 26px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "5px 11px",
            borderRadius: 999,
            background: C.cool,
            border: `1px solid ${C.line}`,
            fontFamily: "var(--font-grotesk)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: C.soft,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 99,
              background: card.dotColor,
            }}
          />
          {card.tag}
        </div>
        <h2
          style={{
            margin: "14px 0 0",
            fontFamily: "var(--font-instrument)",
            fontWeight: 400,
            fontSize: 30,
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          {card.title}
        </h2>
        <p
          style={{
            margin: "8px 0 16px",
            fontSize: 14,
            lineHeight: 1.55,
            color: C.soft,
          }}
        >
          {card.blurb}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-manrope)",
            fontSize: 14,
            fontWeight: 700,
            color: C.primary,
          }}
        >
          View character →
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div
      className={`${instrument.variable} ${manrope.variable} ${grotesk.variable}`}
      style={{
        fontFamily: "var(--font-manrope)",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 40px 90px" }}>
        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: C.cool,
              border: `1px solid ${C.line}`,
              fontFamily: "var(--font-grotesk)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: C.primary,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                background: C.leaf,
              }}
            />
            MIMI · CHARACTER EXPLORATIONS
          </div>
          <h1
            style={{
              margin: "22px 0 0",
              fontFamily: "var(--font-instrument)",
              fontWeight: 400,
              fontSize: 58,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Three ways to meet Mimi.
          </h1>
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: 560,
              fontSize: 16,
              lineHeight: 1.6,
              color: C.soft,
            }}
          >
            A calm, patient companion for wewa.life. Each direction is a full
            character study — pick one to see all its moods.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {CARDS.map((c) => (
            <Card key={c.key} card={c} />
          ))}
        </div>

        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: C.soft,
            fontSize: 13,
          }}
        >
          <span>
            Mimi — companion character for{" "}
            <b style={{ color: C.primary }}>
              wewa<span style={{ color: C.leaf }}>.</span>life
            </b>
          </span>
        </div>
      </div>
    </div>
  );
}
