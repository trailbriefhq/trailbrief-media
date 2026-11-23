import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BODY, C, COND, clamp } from "../brand";

// Shared pieces for narrated story videos (AI voice + captions).
// Voice timings come from Speko audio_transcribe (ms in the RAW voice);
// audio/voice.sh speeds the voice up 8%, so every time is divided by 1.08.
export const SPEED = 1.08;
export const fr = (ms: number) => Math.round((ms / SPEED / 1000) * 30);

export type Word = [text: string, startMs: number, endMs: number];

// Safe zone for TikTok / Reels / Shorts: keep text between x 70–930 and y 180–1420

// ---------- polyline helpers (routes drawn along a path) ----------
export type Pt = [number, number];
const seg = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);
export const polyLen = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + seg(pts[i], p), 0);
export const pointAt = (pts: Pt[], t: number): Pt => {
  const total = polyLen(pts);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    const l = seg(pts[i - 1], pts[i]);
    if (d <= l || i === pts.length - 1) {
      const k = l === 0 ? 0 : Math.min(1, d / l);
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
    }
    d -= l;
  }
  return pts[pts.length - 1];
};
export const partial = (pts: Pt[], t: number): string => {
  if (t <= 0) return "";
  const total = polyLen(pts);
  let d = Math.min(1, t) * total;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const l = seg(pts[i - 1], pts[i]);
    if (d >= l) {
      out.push(pts[i]);
      d -= l;
    } else {
      const k = d / l;
      out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]);
      break;
    }
  }
  return out.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
};

// ---------- word-by-word captions ----------
// Chunks of 3-4 words. A chunk ends at . , ? ! and never ends on a little word
// like "to" or "the" (that word moves to the next chunk). The spoken word is gold.
const LITTLE = new Set(["a", "an", "the", "to", "of", "in", "at", "by", "and", "or", "it", "his", "her", "their", "on", "for"]);
const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const little = LITTLE.has(w[0].toLowerCase());
    // keep names and numbers together: "Mount Whitney", "Clarence King", "Lower 48"
    const next = words[i + 1]?.[0] ?? "";
    const joined = /^[A-Z]/.test(w[0]) && !/[.,?!]$/.test(w[0]) && /^[A-Z0-9]/.test(next);
    if (/[.,?!]$/.test(w[0]) || (cur.length >= 3 && !little && !joined) || cur.length >= 5) {
      chunks.push(cur);
      cur = [];
    }
  });
  if (cur.length) chunks.push(cur);
  return chunks;
};

export const Captions: React.FC<{ words: Word[]; hideFrom?: number; y?: number }> = ({
  words,
  hideFrom = Infinity,
  y = 1300,
}) => {
  const frame = useCurrentFrame();
  if (frame >= hideFrom) return null;
  const chunks = chunkWords(words);
  const idx = chunks.findIndex((c, i) => {
    const start = fr(c[0][1]);
    const next = chunks[i + 1] ? fr(chunks[i + 1][0][1]) : fr(c[c.length - 1][2]) + 12;
    return frame >= start && frame < next;
  });
  if (idx < 0) return null;
  const c = chunks[idx];
  const pop = interpolate(frame - fr(c[0][1]), [0, 4], [0.92, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: y,
          maxWidth: 860,
          padding: "14px 30px 10px",
          borderRadius: 22,
          backgroundColor: "rgba(20,8,26,0.62)",
          fontFamily: COND,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.05,
          textTransform: "uppercase",
          textAlign: "center",
          letterSpacing: "0.01em",
          transform: `scale(${pop.toFixed(3)})`,
        }}
      >
        {c.map((w, i) => {
          const on = frame >= fr(w[1]);
          const text = w[0].replace(/[,.]$/, "");
          return (
            <span key={i} style={{ color: on ? (frame < fr(w[2]) + 3 ? C.gold : C.cream) : "rgba(255,241,226,0.45)" }}>
              {text}
              {i < c.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- real photos from the library (trailbrief-media/library, copied to public/library) ----------
// Every photo must show what the narration is saying at that moment (Bryce, Nov 23), carry an
// on-screen credit + year, and crossfade (0.5 s) in and out over the map: no dip to black.
const FADE = 15;
export const PhotoScene: React.FC<{
  src: string;
  from: number;
  to: number; // the photo is fully gone at `to` (it fades out over the last 0.5 s, revealing the map)
  credit: string;
  focus?: string; // CSS object-position, e.g. "60% 50%"
  zoom?: [number, number]; // slow, steady push-in
  framed?: boolean; // small photos: an archive print over a blurred copy
  color?: boolean; // modern color photo: no black-and-white grade, no tint
  tag?: string; // what the photo shows, tied to the narration ("KING'S PEAK")
  sub?: string;
  subAt?: number;
  origin?: string; // transform-origin for the zoom (zoom into the subject, e.g. "50% 70%")
}> = ({ src, from, to, credit, focus = "50% 50%", zoom = [1.0, 1.06], framed = false, color = false, tag, sub, subAt, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const opacity = Math.min(interpolate(frame, [from, from + FADE], [0, 1], clamp), interpolate(frame, [to - FADE, to], [1, 0], clamp));
  const z = interpolate(frame, [from, to], zoom, clamp);
  const file = staticFile(`library/${src}`);
  const grade = color ? "saturate(1.05) contrast(1.04)" : "grayscale(1) contrast(1.15) brightness(0.86)";
  const Tint = () =>
    color ? null : (
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.amber} 120%)`, mixBlendMode: "color", opacity: 0.5 }} />
    );
  const tagIn = interpolate(frame, [from + 6, from + 16], [0, 1], clamp);
  const subIn = subAt === undefined ? 0 : interpolate(frame, [subAt, subAt + 8], [0, 1], clamp);
  const Tag = () =>
    tag ? (
      <div style={{ opacity: tagIn, transform: `translateY(${((1 - tagIn) * 14).toFixed(1)}px)` }}>
        <div style={{ display: "inline-block", backgroundColor: C.gold, color: C.plum, fontFamily: COND, fontWeight: 700, fontSize: 64, textTransform: "uppercase", padding: "6px 26px 0", borderRadius: 10 }}>
          {tag}
        </div>
        {sub ? (
          <div style={{ opacity: subIn, marginTop: 8, display: "inline-block", backgroundColor: "rgba(20,8,26,0.85)", padding: "6px 18px 2px", borderRadius: 8, fontFamily: COND, fontWeight: 600, fontSize: 46, color: C.cream, textTransform: "uppercase" }}>
            {sub}
          </div>
        ) : null}
      </div>
    ) : null;
  return (
    <AbsoluteFill style={{ opacity }}>
      {framed ? (
        <>
          <AbsoluteFill style={{ backgroundColor: C.plum }}>
            <Img src={file} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `${grade} blur(28px) brightness(0.5)`, transform: "scale(1.2)" }} />
          </AbsoluteFill>
          <Tint />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 120 }}>
            <div style={{ position: "relative", width: 840, padding: "14px 14px 0", backgroundColor: C.cream, boxShadow: "0 30px 80px rgba(8,2,12,0.6)", transform: "rotate(-1.5deg)" }}>
              <div style={{ overflow: "hidden", position: "relative" }}>
                <Img src={file} style={{ width: "100%", display: "block", objectFit: "cover", objectPosition: focus, filter: grade, transform: `scale(${z.toFixed(4)})`, transformOrigin: origin }} />
                <Tint />
              </div>
              <div style={{ padding: "8px 4px 10px", fontFamily: BODY, fontWeight: 500, fontSize: 19, lineHeight: 1.3, color: C.sub }}>{credit}</div>
              <div style={{ position: "absolute", left: -18, top: -44, transform: "rotate(-3deg)", textAlign: "left" }}>
                <Tag />
              </div>
            </div>
          </AbsoluteFill>
        </>
      ) : (
        <>
          <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.plum }}>
            <Img src={file} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, filter: grade, transform: `scale(${z.toFixed(4)})`, transformOrigin: origin }} />
          </AbsoluteFill>
          <Tint />
          {tag ? (
            <AbsoluteFill style={{ alignItems: "center", paddingTop: 1010 }}>
              <Tag />
            </AbsoluteFill>
          ) : null}
        </>
      )}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(20,8,26,0.85) 0%, rgba(20,8,26,0.2) 32%, rgba(20,8,26,0) 50%, rgba(20,8,26,0.35) 72%, rgba(20,8,26,0.85) 100%)",
        }}
      />
      {framed ? null : (
        <div style={{ position: "absolute", left: 70, top: 1212, maxWidth: 860, fontFamily: BODY, fontWeight: 500, fontSize: 24, color: "rgba(255,241,226,0.78)" }}>
          {credit}
        </div>
      )}
    </AbsoluteFill>
  );
};
