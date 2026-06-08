"use client";

import Link from "next/link";
import { Instrument_Serif, Manrope } from "next/font/google";
import Mimi from "@/components/mimi/Mimi";
import MimiSprout from "@/components/mimi/sprout/MimiSprout";
import MimiPenguin from "@/components/mimi/penguin/MimiPenguin";
import MimiGlow from "@/components/mimi/glow/MimiGlow";

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
  {
    key: "glow",
    title: "Glow",
    href: "/mimi-glow",
    preview: <MimiGlow state="idle" size={150} />,
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
        <header style={{ textAlign: "center", marginBottom: 48 }}>
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
            Five ways to meet Mimi.
          </h1>
        </header>

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
