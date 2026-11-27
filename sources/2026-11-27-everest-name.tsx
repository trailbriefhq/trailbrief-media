import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, COND, Grain, LogoMark, Rise, Slam, Topo, Vignette, clamp } from "../brand";
import { Captions, Pt, Word, fr } from "./story-kit";

// "Why is it called Mount Everest?" — narrated story (AI voice "Puck", Speko) + on-screen text + original music.
// Post: Fri Nov 27, 2026, 11 AM ET. Facts and sources: videos/2026-11/2026-11-27-everest-name.facts.md
// (trailbrief-media). No photos: the library has no Everest photo and new public-domain photos can't be fetched
// in the cloud run, so a stylized skyline (an illustration, not a survey drawing, no elevations), a quote panel
// (Everest's own words, RGS Proceedings vol. I, 1857) and a timeline carry the story. Safe zone: x 70–930, y 180–1420.

export const EVEREST_NAME_FRAMES = 1236; // 41.2 s

// Raw-voice word timings from Speko audio_transcribe (synthesis 6d5a41b0, Nov 27 2026; transcript matched the
// script word for word). Display text follows the facts file: "Peak XV" (the survey's own label) and "Qomolangma"
// (Library of Congress spelling; the voice says "Cho-mo-lang-ma", which is how that pinyin spelling is read).
export const WORDS: Word[] = [
  ["Mount", 0, 300], ["Everest", 300, 800], ["is", 900, 1000], ["named", 1000, 1300], ["after", 1300, 1600], ["a", 1600, 1650],
  ["man", 1650, 2000], ["who", 2000, 2100], ["was", 2100, 2500], ["pleased", 2600, 3000], ["by", 3000, 3200], ["the", 3200, 3300],
  ["honor,", 3300, 3700], ["but", 3800, 4100], ["raised", 4200, 4600], ["objections", 4600, 5200], ["to", 5200, 5300], ["it.", 5300, 5400],
  ["Surveyors", 6200, 6600], ["in", 6600, 6700], ["India", 6700, 7200], ["logged", 7200, 7600], ["it", 7600, 7700], ["as", 7700, 7900],
  ["Peak", 7900, 8300], ["XV.", 8300, 9100],
  ["In", 9200, 9300], ["the", 9300, 9400], ["1850s,", 9400, 10200], ["their", 10200, 10400], ["calculations", 10400, 11200],
  ["showed", 11200, 11500], ["it", 11500, 11700], ["was", 11700, 11900], ["the", 11900, 12100], ["highest", 12100, 12800],
  ["peak", 12800, 13100], ["on", 13100, 13300], ["Earth.", 13300, 13600],
  ["In", 14300, 14400], ["1856,", 14400, 15600], ["Surveyor", 15600, 16000], ["General", 16000, 16500], ["Andrew", 16500, 16900],
  ["Waugh", 16900, 17300], ["said", 17300, 17600], ["he", 17600, 17700], ["could", 17700, 17800], ["find", 17800, 18100],
  ["no", 18100, 18300], ["local", 18300, 18700], ["name,", 18700, 19100], ["so", 19200, 19400], ["he", 19400, 19500],
  ["named", 19500, 19800], ["it", 19800, 19900], ["after", 19900, 20200], ["his", 20200, 20400], ["predecessor,", 20400, 21200],
  ["George", 21300, 21700], ["Everest.", 21700, 22300],
  ["In", 22400, 22600], ["1857,", 22600, 23800], ["Everest", 23800, 24200], ["told", 24200, 24500], ["the", 24500, 24600],
  ["Royal", 24600, 25000], ["Geographical", 25000, 25700], ["Society", 25700, 26300], ["there", 26800, 26900], ["were", 26900, 27000],
  ["objections.", 27000, 27900], ["People", 28100, 28400], ["in", 28400, 28600], ["India", 28600, 28900], ["couldn't", 28900, 29200],
  ["pronounce", 29200, 29700], ["it,", 29700, 29900], ["and", 29900, 30100], ["it", 30100, 30200], ["couldn't", 30200, 30400],
  ["be", 30400, 30500], ["written", 30500, 30800], ["in", 30800, 30900], ["Persian", 30900, 31500], ["or", 31500, 31600],
  ["Hindi.", 31600, 32100],
  ["Yet", 32700, 32900], ["an", 32900, 33100], ["18th-century", 33100, 34000], ["map", 34000, 34300], ["had", 34300, 34500],
  ["already", 34500, 34900], ["recorded", 34900, 35400], ["its", 35400, 35500], ["Tibetan", 35500, 35900], ["name,", 35900, 36300],
  ["Qomolangma.", 36700, 37600],
  ["In", 37900, 38000], ["Nepali,", 38000, 38500], ["it's", 38500, 38800], ["Sagarmatha.", 38800, 39700],
  ["More", 40500, 40600], ["mountain", 40600, 40900], ["stories", 40900, 41300], ["at", 41300, 41500], ["trailbrief.app", 41500, 42500],
];

// Story beats (frames)
const T = {
  sub: fr(2000), // "…who was pleased by the honor, but raised objections to it"
  peak: fr(6200), // "Surveyors in India…"
  peakWord: fr(7900), // "Peak Fifteen"
  s1850: fr(9200), // "In the 1850s…"
  highest: fr(12100), // "…the highest peak on Earth"
  waugh: fr(14300), // "In 1856, Surveyor General Andrew Waugh…"
  noname: fr(17300), // "…said he could find no local name"
  george: fr(21300), // "George Everest"
  s1857: fr(22400), // "In 1857, Everest told the Royal Geographical Society…"
  objections: fr(26800), // "…there were objections"
  pron: fr(28100), // "People in India couldn't pronounce it"
  written: fr(30100), // "…and it couldn't be written in Persian or Hindi"
  map: fr(32700), // "Yet an 18th-century map…"
  qomo: fr(36700), // the Tibetan name
  sagar: fr(38800), // "Sagarmatha"
  end: fr(40500), // "More mountain stories at trailbrief.app"
};
const FADE = 15;
const win = (frame: number, from: number, to: number, f = FADE) =>
  Math.min(interpolate(frame, [from, from + f], [0, 1], clamp), interpolate(frame, [to - f, to], [1, 0], clamp));

// ---------- the world: a stylized Himalayan skyline (illustration, no elevations) ----------
const W = 2160;
const PEAK: Pt = [1180, 740];
const CREST: Pt[] = [
  [-200, 1260], [0, 1240], [140, 1150], [260, 1190], [380, 1070], [470, 1110], [560, 1010], [640, 1050], [720, 960],
  [800, 1005], [880, 910], [960, 965], [1040, 860], [1110, 812], PEAK, [1240, 792], [1290, 776], [1335, 826],
  [1400, 884], [1480, 862], [1560, 950], [1660, 920], [1760, 1010], [1860, 980], [1980, 1080], [2160, 1110], [2360, 1150],
];
const BACK: Pt[] = [
  [-200, 1100], [100, 1020], [300, 1060], [520, 960], [760, 990], [980, 930], [1420, 940], [1640, 990], [1880, 950],
  [2100, 1020], [2360, 1060],
];
const NEAR: Pt[] = [
  [-200, 1340], [120, 1300], [300, 1330], [480, 1280], [700, 1320], [920, 1270], [1120, 1315], [1320, 1265],
  [1520, 1310], [1740, 1270], [1960, 1320], [2360, 1290],
];
const STATIONS: Pt[] = [
  [600, 1640],
  [1100, 1700],
  [1700, 1650],
];
const closed = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ") + " L2360 2400 L-200 2400 Z";
const open = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

// Camera keyframes: [frame, centerX, centerY, scale]
const CAM: [number, number, number, number][] = [
  [0, 1080, 1000, 0.62],
  [T.peak - 4, 1090, 1000, 0.66],
  [T.peak + 34, 1180, 1060, 0.72],
  [T.s1850 - 4, 1180, 1060, 0.75],
  [T.s1850 + 30, 1240, 900, 0.95],
  [T.waugh - 4, 1240, 900, 0.98],
  [T.waugh + 30, 1180, 760, 0.9],
  [T.s1857 - 4, 1180, 760, 0.93],
  [T.s1857 + 30, 1180, 820, 0.8],
  [T.qomo - 10, 1180, 820, 0.82],
  [T.qomo + 24, 1180, 640, 0.88],
  [EVEREST_NAME_FRAMES, 1180, 650, 0.84],
];
const useCamera = () => {
  const f = useCurrentFrame();
  const i = Math.max(0, CAM.findIndex((k, j) => j === CAM.length - 1 || (f >= k[0] && f < CAM[j + 1][0])));
  const a = CAM[i];
  const b = CAM[Math.min(i + 1, CAM.length - 1)];
  const t = b[0] === a[0] ? 1 : interpolate(f, [a[0], b[0]], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lerp = (k: number) => a[k] + (b[k] - a[k]) * t;
  const s = lerp(3);
  return `translate(${(540 - lerp(1) * s).toFixed(2)}px, ${(960 - lerp(2) * s).toFixed(2)}px) scale(${s.toFixed(4)})`;
};

const pop = (frame: number, at: number, fps: number) =>
  spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });

const Crosshair: React.FC<{ at: Pt; from: number; to: number }> = ({ at, from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const r = interpolate(s, [0, 1], [260, 70]);
  const out = interpolate(frame, [to - 8, to], [1, 0], clamp);
  return (
    <g transform={`translate(${at[0]} ${at[1]})`} opacity={out} stroke={C.gold} fill="none" strokeWidth={4}>
      <circle r={r} strokeOpacity={0.9} />
      <circle r={r * 0.35} strokeOpacity={0.6} />
      {[0, 90, 180, 270].map((deg) => (
        <line key={deg} x1={0} y1={-(r + 40)} x2={0} y2={-(r * 0.55)} transform={`rotate(${deg})`} strokeLinecap="round" />
      ))}
    </g>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useCamera();
  const glow = 0.5 + 0.1 * Math.sin(frame / 40);
  // survey sightlines (Peak XV), drawn one after the other
  const sightOn = win(frame, T.peak + 4, T.s1850 + 20);
  // 1852: a measuring bar rises beside the peak (no numbers: sources differ on the figures)
  const barP = interpolate(frame, [T.s1850 + 10, T.highest + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const barOn = win(frame, T.s1850 + 10, T.waugh + 10);
  const xvOn = win(frame, T.peakWord - 2, T.highest - 6, 10);
  const xvS = pop(frame, T.peakWord - 2, fps);
  const dim = interpolate(frame, [T.objections - 6, T.objections + 8, T.qomo - 8, T.qomo + 10], [1, 0.45, 0.45, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: camera, transformOrigin: "0 0", opacity: dim }}>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="evglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={C.sun} stopOpacity={0.85} />
            <stop offset="35%" stopColor={C.gold} stopOpacity={0.4} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="evfar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B2142" />
            <stop offset="100%" stopColor="#1A0C20" />
          </linearGradient>
          <linearGradient id="evnear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#170A1C" />
            <stop offset="100%" stopColor="#0C0510" />
          </linearGradient>
          <linearGradient id="evsnow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cream} stopOpacity={0.55} />
            <stop offset="100%" stopColor={C.cream} stopOpacity={0} />
          </linearGradient>
        </defs>
        <circle cx={PEAK[0]} cy={PEAK[1] + 40} r={760} fill="url(#evglow)" opacity={glow} />
        <path d={closed(BACK)} fill="#4A2840" opacity={0.55} />
        <path d={closed(CREST)} fill="url(#evfar)" />
        {/* snow caps on the highest points */}
        <path d={`M1040 860 L1110 812 L${PEAK[0]} ${PEAK[1]} L1240 792 L1290 776 L1335 826 L1300 880 L1250 850 L1200 900 L1150 860 L1090 905 Z`} fill="url(#evsnow)" />
        <path d={open(CREST)} fill="none" stroke={C.gold} strokeOpacity={0.75} strokeWidth={3.2} strokeLinejoin="round" />
        <path d={closed(NEAR)} fill="url(#evnear)" />
        <path d={open(NEAR)} fill="none" stroke={C.amber} strokeOpacity={0.25} strokeWidth={2} />

        {/* survey sightlines from stations on the plains (illustration) */}
        {sightOn > 0
          ? STATIONS.map((st, i) => {
              const p = interpolate(frame, [T.peak + 6 + i * 8, T.peak + 40 + i * 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
              return (
                <g key={i} opacity={sightOn}>
                  <path
                    d={`M${st[0]} ${st[1]} L${PEAK[0]} ${PEAK[1]}`}
                    pathLength={1}
                    strokeDasharray={`${(p * 0.97).toFixed(3)} 1`}
                    fill="none"
                    stroke={C.gold}
                    strokeOpacity={0.85}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                  <path d={`M${st[0]} ${st[1] - 34} L${st[0] + 30} ${st[1] + 18} L${st[0] - 30} ${st[1] + 18} Z`} fill="none" stroke={C.cream} strokeWidth={5} strokeLinejoin="round" />
                  <circle cx={st[0]} cy={st[1]} r={6} fill={C.gold} />
                </g>
              );
            })
          : null}
        <Crosshair at={PEAK} from={T.peak + 30} to={T.s1850 + 10} />
        {xvOn > 0 ? (
          <g transform={`translate(${PEAK[0]} ${PEAK[1] - 150}) scale(${xvS.toFixed(3)})`} opacity={xvOn}>
            <text textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={84} letterSpacing="3" fill={C.gold}>
              PEAK XV
            </text>
          </g>
        ) : null}

        {/* 1852: highest on Earth */}
        {barOn > 0 ? (
          <g opacity={barOn}>
            <line x1={PEAK[0] + 170} y1={1300} x2={PEAK[0] + 170} y2={1300 - (1300 - PEAK[1]) * barP} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
            {Array.from({ length: 14 }).map((_, i) => {
              const y = 1300 - i * 40;
              if (1300 - y > (1300 - PEAK[1]) * barP) return null;
              return <line key={i} x1={PEAK[0] + 150} y1={y} x2={PEAK[0] + 190} y2={y} stroke={C.gold} strokeOpacity={0.7} strokeWidth={4} />;
            })}
            <line
              x1={PEAK[0] - 120}
              y1={PEAK[1]}
              x2={PEAK[0] + 190}
              y2={PEAK[1]}
              stroke={C.sun}
              strokeWidth={4}
              strokeDasharray="12 10"
              opacity={interpolate(frame, [T.highest, T.highest + 8], [0, 1], clamp)}
            />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- headlines (top of the frame, screen space) ----------
const Head: React.FC<{ from: number; to: number; big: React.ReactNode; sub?: string; sub2?: string; sub2At?: number; bigSize?: number }> = ({
  from,
  to,
  big,
  sub,
  sub2,
  sub2At,
  bigSize = 190,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const out = interpolate(frame, [to - 6, to], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 210, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Slam delay={from} style={{ fontSize: bigSize, lineHeight: 0.9, color: C.gold, letterSpacing: "0.01em" }}>
        {big}
      </Slam>
      {sub ? (
        <Rise delay={from + 6} dist={24} style={{ marginTop: 18, fontSize: 54, lineHeight: 1.05, color: C.cream, width: 860 }}>
          {sub}
        </Rise>
      ) : null}
      {sub2 && sub2At !== undefined ? (
        <Rise delay={sub2At} dist={20} style={{ marginTop: 14, fontSize: 50, lineHeight: 1.05, color: C.sun, width: 860 }}>
          {sub2}
        </Rise>
      ) : null}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= T.peak) return null;
  const out = interpolate(frame, [T.peak - 6, T.peak], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 290, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Rise delay={2} dist={18} style={{ fontSize: 44, fontWeight: 600, letterSpacing: "0.2em", color: C.muted }}>
        The world&apos;s highest peak
      </Rise>
      <Slam delay={6} style={{ fontSize: 128, lineHeight: 0.92, color: C.gold }}>
        Why &ldquo;Everest&rdquo;?
      </Slam>
      <Rise delay={T.sub} dist={22} style={{ marginTop: 26, fontSize: 58, lineHeight: 1.05, color: C.cream, width: 860 }}>
        Named after a man who was
        <br />pleased by the honor, but
        <br />raised objections to it
      </Rise>
    </AbsoluteFill>
  );
};

// ---------- the name plate above the peak (screen space; the camera keeps the peak at x 540) ----------
const Plate: React.FC<{ y: number; from: number; to: number; text: string; note?: string; dashed?: boolean; size?: number; solid?: boolean }> = ({
  y,
  from,
  to,
  text,
  note,
  dashed = false,
  size = 92,
  solid = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const s = spring({ frame: frame - from, fps, config: { damping: 13, stiffness: 220, mass: 0.6 } });
  const o = win(frame, from, to, 8);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [1.5, 1]).toFixed(3)})`,
          backgroundColor: dashed ? "rgba(20,8,26,0.55)" : solid ? C.gold : "rgba(20,8,26,0.8)",
          color: dashed ? C.muted : solid ? C.plum : C.cream,
          border: dashed ? `5px dashed ${C.muted}` : solid ? "none" : `4px solid ${C.gold}`,
          borderRadius: 14,
          padding: "8px 34px 0",
          fontFamily: COND,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.05,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          boxShadow: "0 16px 44px rgba(8,2,12,0.55)",
        }}
      >
        {text}
      </div>
      {note ? (
        <div style={{ marginTop: 10, fontFamily: COND, fontWeight: 600, fontSize: 42, color: C.cream, textTransform: "uppercase", backgroundColor: "rgba(20,8,26,0.75)", padding: "4px 16px 0", borderRadius: 8 }}>
          {note}
        </div>
      ) : null}
    </div>
  );
};

// ---------- the timeline (screen space): 1843 → 1852, then back to 1721 ----------
const Tick: React.FC<{ x: number; at: number; year: string; line1: string; line2: string; hot?: boolean }> = ({ x, at, year, line1, line2, hot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = pop(frame, at, fps);
  return (
    <div style={{ position: "absolute", left: x - 160, width: 320, top: 742, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase", transform: `scale(${s.toFixed(3)})` }}>
      <div style={{ fontSize: 84, color: hot ? C.gold : C.cream, lineHeight: 1, textTransform: "none" }}>{year}</div>
      <div style={{ margin: "14px auto 0", width: 26, height: 26, borderRadius: 13, backgroundColor: hot ? C.gold : C.cream, boxShadow: `0 0 0 8px rgba(42,22,51,0.9)` }} />
      <div style={{ marginTop: 18, fontSize: 44, lineHeight: 1.02, color: C.cream }}>{line1}</div>
      <div style={{ fontSize: 44, lineHeight: 1.02, color: hot ? C.gold : C.muted }}>{line2}</div>
    </div>
  );
};

const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.map;
  const to = T.qomo + 8;
  if (frame < from || frame >= to) return null;
  const o = win(frame, from, to, 12);
  const lineP = interpolate(frame, [from + 2, from + 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const backP = interpolate(frame, [from + 10, from + 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const X1721 = 220;
  const X1856 = 580;
  const X1857 = 830;
  const Y = 853; // dot centre
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 80, top: 700, width: 920, height: 450, borderRadius: 26, backgroundColor: "rgba(20,8,26,0.72)", boxShadow: "0 30px 80px rgba(8,2,12,0.5)" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={X1856 - 80} y1={Y} x2={X1856 - 80 + (X1857 + 100 - (X1856 - 80)) * lineP} y2={Y} stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
        {backP > 0 ? (
          <g>
            <line x1={X1856 - 80} y1={Y} x2={X1856 - 80 - (X1856 - 80 - X1721) * backP} y2={Y} stroke={C.muted} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" />
            <path d={`M${(X1721 + X1856) / 2 - 12} ${Y + 22} L${(X1721 + X1856) / 2 + 2} ${Y - 22} M${(X1721 + X1856) / 2 + 10} ${Y + 22} L${(X1721 + X1856) / 2 + 24} ${Y - 22}`} stroke={C.muted} strokeWidth={5} opacity={backP} />
          </g>
        ) : null}
      </svg>
      <Tick x={X1856} at={from + 2} year="1856" line1="Waugh names" line2="it Everest" />
      <Tick x={X1857} at={from + 8} year="1857" line1="Everest:" line2="objections" />
      <Tick x={X1721} at={from + 22} year="1700s" line1="Map records its" line2="Tibetan name" hot />
      <div style={{ position: "absolute", left: 100, top: 1100, width: 880, textAlign: "center", fontFamily: BODY, fontWeight: 500, fontSize: 22, color: "rgba(255,241,226,0.6)", opacity: backP }}>
        Timeline not to scale
      </div>
    </AbsoluteFill>
  );
};

// ---------- Everest's own words at the RGS, May 11, 1857 (verbatim fragments from the Proceedings) ----------
const Quote: React.FC<{ at: number; top: number; children: React.ReactNode }> = ({ at, top, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 180, mass: 0.7 } });
  return (
    <div style={{ position: "absolute", left: 120, width: 840, top, display: "flex", alignItems: "flex-start", gap: 22, opacity: s, transform: `translateY(${((1 - s) * 18).toFixed(1)}px)` }}>
      <div style={{ flex: "0 0 auto", marginTop: 6, width: 56, height: 56, borderRadius: 28, backgroundColor: C.amber, color: C.plum, fontFamily: COND, fontWeight: 700, fontSize: 44, lineHeight: "60px", textAlign: "center" }}>✕</div>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 58, lineHeight: 1.04, color: C.cream, textTransform: "uppercase" }}>{children}</div>
    </div>
  );
};

const Objections: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.objections - 4;
  const to = T.map + 4;
  if (frame < from || frame >= to) return null;
  const o = win(frame, from, to, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 80, top: 700, width: 920, height: 450, borderRadius: 26, backgroundColor: "rgba(20,8,26,0.78)", boxShadow: "0 30px 80px rgba(8,2,12,0.5)" }} />
      <div style={{ position: "absolute", left: 120, top: 728, width: 840, fontFamily: COND, fontWeight: 600, fontSize: 34, letterSpacing: "0.08em", color: C.muted, textTransform: "uppercase" }}>
        Col. Everest, as reported in the Proceedings
        <br />
        (RGS meeting, May 11, 1857):
      </div>
      <Quote at={T.pron} top={820}>&ldquo;…not pronounceable by a native of India&rdquo;</Quote>
      <Quote at={T.written} top={965}>&ldquo;…could not be written in either Persian or Hindi&rdquo;</Quote>
      <div style={{ position: "absolute", left: 120, top: 1110, width: 840, fontFamily: BODY, fontWeight: 500, fontSize: 21, color: "rgba(255,241,226,0.62)" }}>
        Proceedings of the Royal Geographical Society of London, vol. I (1857), p. 350
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.end - 4) return null;
  const scrim = interpolate(frame, [T.end - 4, T.end + 8], [0, 0.95], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.plum, opacity: scrim }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
        <Rise delay={T.end} dist={30}>
          <LogoMark size={190} />
        </Rise>
        <Rise delay={T.end + 4} dist={24} style={{ marginTop: 34, fontSize: 70, color: C.cream, lineHeight: 1.02, width: 860 }}>
          More mountain stories
        </Rise>
        <Slam delay={T.end + 12} from={1.6} style={{ marginTop: 28 }}>
          <div style={{ backgroundColor: C.gold, color: C.plum, borderRadius: 999, padding: "18px 50px", fontSize: 84, letterSpacing: "0.03em", textTransform: "none" }}>
            trailbrief.app
          </div>
        </Slam>
        <Rise delay={T.end + 20} dist={10} style={{ marginTop: 46, fontFamily: BODY, fontWeight: 500, fontSize: 28, textTransform: "none", color: C.muted, lineHeight: 1.4, width: 820 }}>
          Trailbrief is an independent trip-planning service.
          <br />
          Not affiliated with Recreation.gov, NPS, USFS or BLM.
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const EverestNameStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.plum }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.sub} 55%, #6A3A3E 100%)` }} />
      <Topo opacity={0.7} />
      <World />
      <Topo opacity={0.4} />
      <Hook />
      <Head from={T.peak} to={T.s1850} big="Peak XV" sub="Its label in the survey's books" />
      <Head from={T.s1850} to={T.waugh} big={<>1850<span style={{ textTransform: "none" }}>s</span></>} sub="The survey's calculations:" sub2="the highest peak on Earth" sub2At={T.highest} />
      <Head from={T.waugh} to={T.george - 10} big="1856" sub="Surveyor General Andrew Waugh" sub2="Said he could find no local name" sub2At={T.noname} />
      <Head from={T.george - 10} to={T.s1857} big="George Everest" bigSize={128} sub="Waugh's predecessor as Surveyor General" />
      <Head from={T.s1857} to={T.map} big="1857" sub="Everest, at the Royal Geographical Society" sub2="“There were objections”" sub2At={T.objections} />
      <Head from={T.map} to={T.qomo - 2} big={<>1700<span style={{ textTransform: "none" }}>s</span></>} sub="An 18th-century map had already recorded its Tibetan name" />
      <Head from={T.qomo - 2} to={T.end} big="Its other names" bigSize={118} />
      {/* name plate above the peak */}
      <Plate y={790} from={T.waugh + 30} to={T.george - 6} text="Local name?" dashed size={84} />
      <Plate y={790} from={T.george - 10} to={T.objections + 2} text="Mount Everest" note="after George Everest" />
      <Plate y={600} from={T.qomo} to={T.end + 6} text="Qomolangma" note="Tibetan" size={86} />
      <Plate y={770} from={T.sagar - 4} to={T.end + 6} text="Sagarmatha" note="Nepali" size={86} solid={false} />
      <Objections />
      <Timeline />
      <EndCard />
      <Captions words={WORDS} hideFrom={T.end} y={1270} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
