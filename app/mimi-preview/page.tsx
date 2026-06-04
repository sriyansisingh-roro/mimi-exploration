"use client";

import { useState } from "react";
import Mimi from "@/components/mimi/Mimi";
import type { MimiState } from "@/components/mimi/types";

const STATES: { id: MimiState; label: string; hint: string }[] = [
  { id: "idle", label: "Idle", hint: "breathing · slow blink" },
  { id: "listening", label: "Listening", hint: "head tilt · eyes track" },
  { id: "thinking", label: "Thinking", hint: "soft bob · sparkle" },
  { id: "celebrating", label: "Celebrating", hint: "small smile · soft hop" },
  { id: "resting", label: "Resting", hint: "sleepy · off to the side" },
  { id: "concerned", label: "Concerned", hint: "soft · present · quiet" },
];

export default function MimiPreviewPage() {
  const [state, setState] = useState<MimiState>("idle");

  return (
    <main
      className="min-h-dvh w-full flex flex-col items-center px-6 py-12"
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg-warm) 0%, var(--color-bg) 45%, var(--color-bg-cool) 100%)",
      }}
    >
      <div className="w-full max-w-xl text-center">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          State preview
        </h1>
      </div>

      {/* stage */}
      <div
        className="mt-10 flex h-80 w-full max-w-xl items-center justify-center rounded-[32px] bg-white"
        style={{ boxShadow: "0px 32px 90px rgba(45, 49, 74, 0.10)" }}
      >
        <Mimi state={state} size={220} />
      </div>

      {/* current state label */}
      <div className="mt-6 text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
          style={{ background: "var(--color-bg-cool)", color: "var(--color-primary)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--color-primary)" }}
          />
          {STATES.find((s) => s.id === state)?.label}
          <span style={{ color: "var(--color-muted)" }}>
            · {STATES.find((s) => s.id === state)?.hint}
          </span>
        </span>
      </div>

      {/* state switcher */}
      <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
        {STATES.map((s) => {
          const active = s.id === state;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setState(s.id)}
              className="rounded-2xl px-4 py-3 text-left transition-all"
              style={{
                background: active ? "var(--color-primary)" : "#ffffff",
                color: active ? "#ffffff" : "var(--color-ink)",
                border: active ? "1px solid var(--color-primary)" : "1px solid var(--color-bg-cool)",
                boxShadow: active
                  ? "0px 12px 28px rgba(108, 115, 255, 0.28)"
                  : "0px 6px 18px rgba(45, 49, 74, 0.06)",
              }}
            >
              <span className="block text-sm font-semibold">{s.label}</span>
              <span
                className="block text-xs"
                style={{ color: active ? "rgba(255,255,255,0.8)" : "var(--color-muted)" }}
              >
                {s.hint}
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
