"use client";

import Link from "next/link";
import { Instrument_Serif, Manrope } from "next/font/google";
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
const C = {
  primary: "#6C73FF",
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
  title: string;
  href: string;
  preview: React.ReactNode;
};

const CARDS: CharCard[] = [
  {
    key: "original",
    title: "Original",
    href: "/mimi-preview",
    preview: <Mimi state="idle" size={150} />,
  },
  {
    key: "sprout",
    title: "Sprout",
    href: "/mimi-sprout",
    preview: <MimiSprout mood="happy" view="front" size={150} />,
  },
  {
    key: "penguin",
    title: "Penguin",
    href: "/mimi-penguin",
    preview: <MimiPenguin mood="happy" size={150} />,
  },
  {
    key: "new-character",
    title: "Pocket Cloud",
    href: "/mimi-new-character",
    preview: (
      <img
        src="/mimi-concepts/pocket-cloud.png"
        alt=""
        loading="eager"
        decoding="async"
        style={{
          width: 230,
          maxWidth: "78%",
          aspectRatio: "3 / 2",
          objectFit: "cover",
          objectPosition: "left top",
          borderRadius: 22,
          border: `1px solid ${C.line}`,
          boxShadow: "0 22px 48px -34px rgba(37,42,68,.55)",
        }}
      />
    ),
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
      <div style={{ padding: "22px 24px 24px" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-instrument)",
            fontWeight: 400,
            fontSize: 30,
            letterSpacing: "-0.01em",
            color: C.ink,
          }}
        >
          {card.title}
        </h2>
      </div>
    </Link>
  );
}

// Featured: the finalized animated set (states, avatars, admin) on /mimi-motion
const FINAL_PREVIEW = [
  { src: "/mimi-motion-svg/states/01-idle.svg", alt: "Idle" },
  { src: "/mimi-motion-svg/states/03-thinking.svg", alt: "Thinking" },
  { src: "/mimi-motion-svg/states/05-celebrating.svg", alt: "Celebrating" },
  { src: "/mimi-admin-concepts/p1-focused.svg", alt: "Admin" },
];

function FinalCard() {
  return (
    <Link
      href="/mimi-motion"
      style={{
        display: "block",
        textDecoration: "none",
        background: "#fff",
        border: `1px solid ${C.line}`,
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(37,42,68,.04), 0 30px 70px -50px rgba(37,42,68,.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          padding: "36px 24px",
          background: `linear-gradient(135deg, ${C.warm} 0%, ${C.bg} 45%, ${C.cool} 100%)`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {FINAL_PREVIEW.map((p) => (
          <img key={p.src} src={p.src} alt={p.alt} width={150} height={150} style={{ borderRadius: 16 }} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          padding: "22px 28px 24px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-instrument)",
              fontWeight: 400,
              fontSize: 34,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            Final Mimi
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.soft }}>States · Avatars · Admin</p>
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 22px",
            borderRadius: 999,
            background: C.primary,
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: "0 18px 40px -22px rgba(108,115,255,.8)",
          }}
        >
          Open <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div
      className={`${instrument.variable} ${manrope.variable}`}
      style={{
        fontFamily: "var(--font-manrope)",
        minHeight: "100vh",
        background: C.bg,
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 40px 90px" }}>
        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-instrument)",
              fontWeight: 400,
              fontSize: 58,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            Meet Mimi.
          </h1>
        </header>

        <FinalCard />

        <h2
          style={{
            margin: "72px 0 20px",
            fontFamily: "var(--font-instrument)",
            fontWeight: 400,
            fontSize: 30,
            color: C.ink,
          }}
        >
          Earlier explorations
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            gap: 24,
          }}
        >
          {CARDS.map((c) => (
            <Card key={c.key} card={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
