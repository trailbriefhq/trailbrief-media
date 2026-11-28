import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, COND, Grain, LogoMark, Rise, Slam, Topo, Vignette, clamp } from "../brand";
import { Captions, PhotoScene, Pt, Word, fr, partial, pointAt } from "./story-kit";

// "Angels Landing: the chains, and why you need a permit" — narrated story (AI voice "Puck", Speko) + on-screen
// text + original music. Post: Sat Nov 28, 2026, 11 AM ET. Facts and sources:
// videos/2026-11/2026-11-28-angels-landing-chains.facts.md (trailbrief-media).
// Photos (public domain, library/CREDITS.md): NPS 2015 "Angels Landing past the Virgin River" (hook) and the 1934
// "Trail party on horseback, West Rim Trail, Angels Landing" (Zion NP Museum and Archives) on the West Rim Trail line.
// Between them a side-view illustration (not to scale, no elevations) carries the route: the Grotto, the West Rim
// Trail and Walter's Wiggles, Scout Lookout, the half mile of chains to the top. Safe zone: x 70–930, y 180–1420.

export const ANGELS_FRAMES = 1345; // 44.8 s

// Raw-voice word timings from Speko audio_transcribe (synthesis bc66b17d), shifted for the pauses trimmed before
// audio/voice.sh (long gaps cut to 0.30–0.45 s). The transcript matched the script word for word except two
// spellings of sounds: "Cruz" (= crews) and "Ruse" (= Ruesch). Display text uses the script's spelling.
export const WORDS: Word[] = [
  ["Legend", 100, 500], ["says", 500, 1100], ["only", 1100, 1400], ["an", 1400, 1600], ["angel", 1600, 2200], ["could", 2200, 2300],
  ["land", 2300, 2600], ["here.", 2600, 2900], ["Now?", 3400, 3800], ["You", 4031, 4131], ["need", 4131, 4331], ["a", 4331, 4431],
  ["permit.", 4431, 4831], ["The", 5275, 5275], ["name", 5275, 5575], ["goes", 5575, 5775], ["back", 5775, 6075], ["to", 6075, 6175],
  ["1916,", 6175, 7175], ["when", 7402, 7602], ["minister", 7602, 8002], ["Frederick", 8002, 8502], ["Vining", 8502, 9002], ["Fisher", 9002, 9602],
  ["visited", 9702, 10102], ["Zion", 10102, 10402], ["Canyon.", 10402, 10902], ["In", 11308, 11408], ["1926,", 11408, 12608], ["park", 12808, 13008],
  ["crews", 13008, 13308], ["built", 13308, 13608], ["a", 13608, 13708], ["trail", 13708, 14008], ["up", 14008, 14208], ["its", 14208, 14408],
  ["sandstone", 14408, 15108], ["spine,", 15108, 15608], ["chiseling", 16008, 16408], ["footholds", 16408, 17108], ["with", 17108, 17308], ["hand", 17308, 17608],
  ["tools.", 17608, 18108], ["Walter", 18340, 18840], ["Ruesch", 18840, 19240], ["supervised", 19240, 19740], ["the", 19740, 19740], ["work.", 19740, 20140],
  ["Yes,", 20439, 20839], ["the", 20839, 20939], ["Walter", 20939, 21339], ["of", 21339, 21539], ["Walter's", 21539, 21939], ["Wiggles.", 21939, 22439],
  ["Hikers", 22597, 22997], ["still", 22997, 23397], ["take", 23397, 23697], ["the", 23697, 23797], ["West", 23797, 24097], ["Rim", 24097, 24297],
  ["Trail", 24297, 24697], ["up", 24697, 24897], ["to", 24897, 24997], ["Scout", 24997, 25297], ["Lookout.", 25297, 25697], ["From", 26097, 26297],
  ["there,", 26297, 26597], ["the", 26597, 26797], ["last", 26797, 27097], ["half", 27097, 27297], ["mile", 27297, 27697], ["has", 27697, 27897],
  ["chains", 27897, 28397], ["for", 28397, 28597], ["handrails,", 28597, 29397], ["and", 29397, 29597], ["drop-offs", 29597, 30197], ["up", 30197, 30397],
  ["to", 30397, 30697], ["1,000", 30697, 31597], ["feet.", 31597, 31897], ["Before", 32270, 32570], ["permits,", 32570, 33170], ["lines", 33170, 33670],
  ["formed", 33670, 34070], ["to", 34070, 34170], ["go", 34170, 34370], ["up", 34370, 34670], ["and", 34670, 34870], ["down", 34870, 35170],
  ["the", 35170, 35270], ["chains.", 35270, 35670], ["So,", 36170, 36470], ["since", 36470, 36770], ["April", 36770, 37070], ["2022,", 37070, 38070],
  ["going", 38070, 38370], ["past", 38370, 38870], ["Scout", 38870, 39270], ["Lookout", 39270, 39670], ["takes", 39670, 39870], ["a", 39870, 39870],
  ["permit,", 39870, 40470], ["from", 40570, 40870], ["a", 40870, 40970], ["seasonal", 40970, 41370], ["lottery", 41370, 41870], ["or", 41870, 42170],
  ["a", 42170, 42270], ["day-before", 42270, 42770], ["lottery.", 42770, 43170], ["Lottery", 43570, 43970], ["dates?", 43970, 44570], ["Free", 44670, 44870],
  ["permit", 44870, 45370], ["calendar", 45370, 45870], ["at", 45870, 46070], ["trailbrief.app", 46070, 47070],
];

// Story beats (frames)
const T = {
  now: fr(3400), // "Now? You need a permit."
  s1916: fr(5275), // "The name goes back to 1916…"
  fisher: fr(7402), // "…when minister Frederick Vining Fisher…"
  s1926: fr(11308), // "In 1926, park crews built a trail…"
  crews: fr(12808),
  spine: fr(14408), // "…its sandstone spine"
  chisel: fr(16008), // "chiseling footholds with hand tools"
  walter: fr(18340), // "Walter Ruesch supervised the work."
  yes: fr(20439),
  wiggles: fr(21539), // "Walter's Wiggles"
  hikers: fr(22597), // "Hikers still take the West Rim Trail…"
  westRim: fr(23797),
  fromThere: fr(26097), // "From there, the last half mile…"
  chains: fr(27897),
  dropoffs: fr(29597),
  thousand: fr(30697),
  before: fr(32270), // "Before permits, lines formed…"
  lines: fr(33170),
  so: fr(36170), // "So, since April 2022…"
  april: fr(36770),
  past: fr(38070), // "…going past Scout Lookout takes a permit"
  seasonal: fr(40970),
  dayBefore: fr(42270),
  dates: fr(43570), // "Lottery dates?"
  end: fr(44670), // "Free permit calendar at trailbrief.app"
};
const FADE = 15;
const win = (frame: number, from: number, to: number, f = FADE) =>
  Math.min(interpolate(frame, [from, from + f], [0, 1], clamp), interpolate(frame, [to - f, to], [1, 0], clamp));
const pop = (frame: number, at: number, fps: number) =>
  spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });

// ---------- the world: a side view of the route (illustration, not to scale) ----------
const FLOOR = 1280;
const SADDLE: Pt = [640, 905]; // Scout Lookout
const SUMMIT: Pt = [1120, 650]; // top of Angels Landing
const GROTTO: Pt = [120, 1262];
// the canyon wall behind (West Rim side)
const WALL: Pt[] = [[-400, 1300], [-400, 430], [120, 410], [260, 420], [380, 452], [430, 520], [470, 640], [520, 760], [570, 850], SADDLE];
// the fin: ridge from Scout Lookout to the top, then the sheer face down to the river
const RIDGE: Pt[] = [SADDLE, [690, 890], [740, 872], [790, 846], [840, 818], [880, 790], [920, 760], [960, 730], [1000, 701], [1040, 673], [1080, 656], SUMMIT];
const FACE: Pt[] = [[1150, 652], [1172, 690], [1192, 780], [1206, 900], [1220, 1050], [1236, 1300]];
const FIN_POLY = [...RIDGE, ...FACE, [560, 1300] as Pt, [600, 1080] as Pt];
// the route along the ridge (slightly above the rock line)
const ROUTE: Pt[] = RIDGE.map(([x, y]) => [x, y - 9] as Pt);
// West Rim Trail: Grotto → Refrigerator Canyon → Walter's Wiggles → Scout Lookout
const WIGGLES: Pt[] = [
  [360, 1196], [470, 1170], [400, 1146], [476, 1122], [404, 1098], [480, 1074], [408, 1050], [484, 1026], [412, 1003], [488, 982],
];
const WEST_RIM: Pt[] = [GROTTO, [220, 1246], [300, 1222], ...WIGGLES, [540, 952], [600, 924], SADDLE];
const RIVER: Pt[] = [[-400, 1300], [100, 1296], [400, 1302], [700, 1294], [1000, 1300], [1300, 1296], [1700, 1300]];

const path = (pts: Pt[], close = false) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ") + (close ? " Z" : "");
const closedToFloor = (pts: Pt[]) => path(pts) + " L1800 2400 L-400 2400 Z";

// Camera keyframes: [frame, centerX, centerY, scale]; the center lands at screen (540, 930)
const CAM: [number, number, number, number][] = [
  [0, 900, 860, 0.84],
  [T.s1916 + 10, 900, 860, 0.84],
  [T.s1926 - 4, 930, 840, 0.9],
  [T.spine + 20, 900, 800, 1.0],
  [T.walter - 6, 880, 820, 0.98],
  [T.walter + 30, 400, 1040, 1.05],
  [T.hikers + 4, 400, 1045, 1.07],
  [T.fromThere - 12, 900, 800, 1.12],
  [T.before - 4, 900, 800, 1.16],
  [T.so - 4, 890, 805, 1.17],
  [T.so + 34, 700, 880, 0.9],
  [T.end, 700, 880, 0.88],
];
const useCamera = () => {
  const f = useCurrentFrame();
  const i = Math.max(0, CAM.findIndex((k, j) => j === CAM.length - 1 || (f >= k[0] && f < CAM[j + 1][0])));
  const a = CAM[i];
  const b = CAM[Math.min(i + 1, CAM.length - 1)];
  const t = b[0] === a[0] ? 1 : interpolate(f, [a[0], b[0]], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lerp = (k: number) => a[k] + (b[k] - a[k]) * t;
  const s = lerp(3);
  return `translate(${(540 - lerp(1) * s).toFixed(2)}px, ${(930 - lerp(2) * s).toFixed(2)}px) scale(${s.toFixed(4)})`;
};

// a label chip in world space
const Label: React.FC<{ x: number; y: number; text: string; o: number; size?: number; gold?: boolean; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  o,
  size = 44,
  gold = false,
  anchor = "middle",
}) => {
  if (o <= 0) return null;
  const w = text.length * size * 0.47 + 34;
  const left = anchor === "middle" ? x - w / 2 : anchor === "start" ? x : x - w;
  return (
    <g opacity={o}>
      <rect x={left} y={y - size * 0.92} width={w} height={size * 1.18} rx={10} fill={gold ? C.gold : "rgba(20,8,26,0.86)"} />
      <text x={left + w / 2} y={y} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={size} letterSpacing="1.5" fill={gold ? C.plum : C.cream}>
        {text}
      </text>
    </g>
  );
};

// the normal (pointing up/out of the rock) at a point along the route
const normalAt = (t: number): Pt => {
  const a = pointAt(ROUTE, Math.max(0, t - 0.01));
  const b = pointAt(ROUTE, Math.min(1, t + 0.01));
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  return [dy / l, -dx / l];
};
const CHAIN_SPANS: [number, number][] = [
  [0.12, 0.42],
  [0.52, 0.93],
];

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const camera = useCamera();
  const glow = 0.45 + 0.08 * Math.sin(frame / 40);

  // 1926: the trail up the spine, then the chiseled footholds
  const trailP = interpolate(frame, [T.crews, T.spine + 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const footholds = Array.from({ length: 15 }, (_, i) => 0.04 + i * 0.065);
  // Walter's Wiggles / West Rim Trail
  const westP = interpolate(frame, [T.walter + 6, T.wiggles + 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const wiggleGlow = win(frame, T.wiggles - 4, T.hikers + 30, 10);
  // the last half mile
  const halfOn = win(frame, T.fromThere + 4, T.before + 6, 10);
  const chainP = interpolate(frame, [T.chains - 2, T.chains + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dropOn = win(frame, T.dropoffs, T.before + 8, 10);
  const dropP = interpolate(frame, [T.dropoffs, T.thousand + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  // before permits: lines both ways on the chains
  const linesOn = win(frame, T.before + 2, T.so + 26, 14);
  // since 2022: the permit line at Scout Lookout
  const gateS = pop(frame, T.past - 2, fps);
  const gateOn = frame >= T.past - 2 ? interpolate(frame, [T.past - 2, T.past + 6], [0, 1], clamp) : 0;
  const dim = interpolate(frame, [T.seasonal - 10, T.seasonal + 6], [1, 0.45], clamp);
  const labelsLate = interpolate(frame, [T.fromThere, T.fromThere + 10], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ transform: camera, transformOrigin: "0 0", opacity: dim }}>
      <svg width={1600} height={1920} viewBox="0 0 1600 1920" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="alglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={C.sun} stopOpacity={0.8} />
            <stop offset="40%" stopColor={C.gold} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="alwall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B2142" />
            <stop offset="100%" stopColor="#1C0D22" />
          </linearGradient>
          <linearGradient id="alfin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6A3A3E" />
            <stop offset="55%" stopColor="#4A2840" />
            <stop offset="100%" stopColor="#22102A" />
          </linearGradient>
        </defs>
        <circle cx={SUMMIT[0] - 60} cy={SUMMIT[1] + 40} r={620} fill="url(#alglow)" opacity={glow} />
        {/* canyon wall (West Rim side) */}
        <path d={closedToFloor(WALL)} fill="url(#alwall)" />
        <path d={path(WALL.slice(1))} fill="none" stroke={C.amber} strokeOpacity={0.35} strokeWidth={3} />
        {/* the fin */}
        <path d={path(FIN_POLY, true)} fill="url(#alfin)" />
        <path d={path([...RIDGE, ...FACE])} fill="none" stroke={C.gold} strokeOpacity={0.8} strokeWidth={3.5} strokeLinejoin="round" />
        {/* sandstone bedding lines on the fin */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${700 + i * 40} ${960 + i * 60} Q ${950} ${880 + i * 70} ${1190 + i * 6} ${760 + i * 95}`} fill="none" stroke={C.amber} strokeOpacity={0.16} strokeWidth={3} />
        ))}
        {/* canyon floor + river */}
        <path d={closedToFloor(RIVER)} fill="#120818" />
        <path d={path(RIVER)} fill="none" stroke={C.muted} strokeOpacity={0.35} strokeWidth={4} />

        {/* West Rim Trail (drawn when Walter's Wiggles comes up) */}
        {westP > 0 ? (
          <g>
            {wiggleGlow > 0 ? <path d={path(WIGGLES)} fill="none" stroke={C.sun} strokeOpacity={0.35 * wiggleGlow} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" /> : null}
            <path d={partial(WEST_RIM, westP)} fill="none" stroke={C.cream} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="2 12" />
          </g>
        ) : null}

        {/* 1926: the trail up the spine */}
        {trailP > 0 ? <path d={partial(ROUTE, trailP)} fill="none" stroke={C.gold} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" /> : null}
        {/* chiseled footholds: small notches along the ridge */}
        {footholds.map((t, i) => {
          const at = T.chisel + 2 + i * 3;
          if (frame < at) return null;
          const s = pop(frame, at, fps);
          const p = pointAt(RIDGE, t);
          const n = normalAt(t);
          return (
            <line
              key={i}
              x1={p[0] - n[0] * 10 * s}
              y1={p[1] - n[1] * 10 * s}
              x2={p[0] + n[0] * 12 * s}
              y2={p[1] + n[1] * 12 * s}
              stroke={C.cream}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.9}
            />
          );
        })}

        {/* the last half mile: bracket above the route */}
        {halfOn > 0 ? (
          <g opacity={halfOn}>
            <path d={`M${SADDLE[0] - 10} ${SADDLE[1] - 70} L${SADDLE[0] - 10} ${SADDLE[1] - 110} L${SUMMIT[0] + 10} ${SUMMIT[1] - 110} L${SUMMIT[0] + 10} ${SUMMIT[1] - 70}`} fill="none" stroke={C.sun} strokeWidth={4} transform={`translate(0 0)`} />
          </g>
        ) : null}
        {/* chains = handrails (dashed links just above the route) */}
        {chainP > 0
          ? CHAIN_SPANS.map(([a, b], k) => {
              const pts: Pt[] = Array.from({ length: 24 }, (_, i) => {
                const t = a + ((b - a) * i) / 23;
                const p = pointAt(ROUTE, t);
                const n = normalAt(t);
                return [p[0] + n[0] * 18, p[1] + n[1] * 18] as Pt;
              });
              return (
                <g key={k}>
                  <path d={partial(pts, chainP)} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="12 7" strokeLinecap="round" />
                  {pts.filter((_, i) => i % 6 === 0 && i / 23 <= chainP).map((p, i) => (
                    <line key={i} x1={p[0]} y1={p[1]} x2={p[0]} y2={p[1] + 22} stroke={C.gold} strokeWidth={4} strokeLinecap="round" />
                  ))}
                </g>
              );
            })
          : null}
        {/* drop-offs: arrow down the sheer face */}
        {dropOn > 0 ? (
          <g opacity={dropOn}>
            <line x1={1262} y1={SUMMIT[1] + 10} x2={1262} y2={SUMMIT[1] + 10 + (FLOOR - SUMMIT[1] - 20) * dropP} stroke={C.sun} strokeWidth={6} strokeLinecap="round" />
            <path d={`M1240 ${SUMMIT[1] + 34} L1262 ${SUMMIT[1] + 8} L1284 ${SUMMIT[1] + 34}`} fill="none" stroke={C.sun} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            {dropP > 0.95 ? (
              <path d={`M1240 ${FLOOR - 34} L1262 ${FLOOR - 8} L1284 ${FLOOR - 34}`} fill="none" stroke={C.sun} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
          </g>
        ) : null}

        {/* before permits: hikers queued both ways along the chains */}
        {linesOn > 0
          ? Array.from({ length: 34 }, (_, i) => {
              const up = i % 2 === 0;
              const base = 0.04 + (i / 34) * 0.9;
              const drift = ((frame - T.before) / 30) * 0.004 * (up ? 1 : -1);
              const t = Math.min(0.97, Math.max(0.02, base + drift));
              const p = pointAt(ROUTE, t);
              const n = normalAt(t);
              const off = up ? 16 : -2;
              const appear = interpolate(frame, [T.before + 2 + i * 0.7, T.before + 8 + i * 0.7], [0, 1], clamp);
              return <circle key={i} cx={p[0] + n[0] * off} cy={p[1] + n[1] * off - 6} r={8} fill={up ? C.cream : C.sun} opacity={linesOn * appear} />;
            })
          : null}

        {/* since 2022: permit line at Scout Lookout */}
        {gateOn > 0 ? (
          <g opacity={gateOn} transform={`translate(${SADDLE[0] + 26} ${SADDLE[1] - 14}) scale(${gateS.toFixed(3)})`}>
            <line x1={-26} y1={-46} x2={26} y2={46} stroke={C.gold} strokeWidth={10} strokeLinecap="round" />
          </g>
        ) : null}

        {/* labels */}
        <Label x={SUMMIT[0] - 80} y={SUMMIT[1] - 150} text="ANGELS LANDING" o={Math.max(win(frame, T.s1916 + 4, T.chisel - 2, 10), labelsLate) * interpolate(frame, [T.seasonal - 10, T.seasonal - 2], [1, 0], clamp)} gold />
        <Label x={GROTTO[0] + 10} y={GROTTO[1] - 42} text="THE GROTTO" o={win(frame, T.walter + 8, T.fromThere + 4, 10)} size={40} />
        <Label x={215} y={1100} text="WALTER'S WIGGLES" o={win(frame, T.wiggles - 2, T.hikers + 40, 10)} size={46} gold />
        <Label x={250} y={1170} text="WEST RIM TRAIL" o={win(frame, T.walter + 20, T.hikers + 40, 10)} size={38} />
        <Label x={SADDLE[0] + 60} y={SADDLE[1] + 86} text="SCOUT LOOKOUT" o={labelsLate} size={42} />
        <Label x={960} y={895} text="CHAINS AS HANDRAILS" o={win(frame, T.chains + 6, T.before + 6, 10)} size={38} />
        <Label x={1236} y={1000} text="UP TO 1,000 FT" o={interpolate(frame, [T.thousand - 2, T.thousand + 8], [0, 1], clamp) * dropOn} size={42} anchor="end" />
        <Label x={SADDLE[0] + 210} y={SADDLE[1] + 10} text="PERMIT PAST HERE" o={gateOn} size={40} gold anchor="start" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- headlines (top of the frame, screen space) ----------
const Head: React.FC<{ from: number; to: number; big: React.ReactNode; sub?: string; subAt?: number; sub2?: string; sub2At?: number; bigSize?: number }> = ({
  from,
  to,
  big,
  sub,
  subAt,
  sub2,
  sub2At,
  bigSize = 180,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const out = interpolate(frame, [to - 6, to], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 210, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Slam delay={from} style={{ fontSize: bigSize, lineHeight: 0.9, color: C.gold, letterSpacing: "0.01em", width: 900 }}>
        {big}
      </Slam>
      {sub ? (
        <Rise delay={subAt ?? from + 6} dist={24} style={{ marginTop: 18, fontSize: 54, lineHeight: 1.05, color: C.cream, width: 840 }}>
          {sub}
        </Rise>
      ) : null}
      {sub2 && sub2At !== undefined ? (
        <Rise delay={sub2At} dist={20} style={{ marginTop: 14, fontSize: 52, lineHeight: 1.05, color: C.sun, width: 840 }}>
          {sub2}
        </Rise>
      ) : null}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= T.s1916) return null;
  const out = interpolate(frame, [T.s1916 - 6, T.s1916], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 250, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Rise delay={1} dist={18} style={{ fontSize: 46, fontWeight: 600, letterSpacing: "0.2em", color: C.muted }}>
        Legend says
      </Rise>
      <Slam delay={4} style={{ fontSize: 114, lineHeight: 0.92, color: C.gold, width: 860 }}>
        Only an angel
        <br />
        could land here
      </Slam>
      <Rise delay={T.now} dist={22} style={{ marginTop: 26, fontSize: 80, lineHeight: 1.02, color: C.cream, width: 860 }}>
        Now you need
        <br />a permit
      </Rise>
    </AbsoluteFill>
  );
};

// the attributed quote under the 1916 headline (screen space)
const Quote: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.fisher + 20;
  const to = T.s1926;
  if (frame < from || frame >= to) return null;
  const o = win(frame, from, to, 10);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 110, top: 1010, width: 780, padding: "18px 26px 14px", borderRadius: 20, backgroundColor: "rgba(20,8,26,0.84)", textAlign: "center" }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 60, lineHeight: 1.02, color: C.sun, textTransform: "uppercase" }}>&ldquo;Only an angel could land there&rdquo;</div>
        <div style={{ marginTop: 8, fontFamily: BODY, fontWeight: 500, fontSize: 26, color: C.muted }}>Attributed to Fisher (the NPS says he &ldquo;allegedly quipped&rdquo; it)</div>
      </div>
    </AbsoluteFill>
  );
};

// the two lotteries (screen space)
const Lotteries: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = T.seasonal - 6;
  const to = T.end + 4;
  if (frame < from || frame >= to) return null;
  const out = interpolate(frame, [to - 8, to], [1, 0], clamp);
  const Card: React.FC<{ x: number; at: number; top: string; bottom: string }> = ({ x, at, top, bottom }) => {
    if (frame < at) return null;
    const s = pop(frame, at, fps);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: 600,
          width: 380,
          height: 250,
          borderRadius: 24,
          backgroundColor: "rgba(20,8,26,0.9)",
          border: `4px solid ${C.gold}`,
          boxShadow: "0 24px 60px rgba(8,2,12,0.55)",
          transform: `scale(${s.toFixed(3)})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: COND,
          fontWeight: 700,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 66, lineHeight: 1, color: C.gold }}>{top}</div>
        <div style={{ fontSize: 58, lineHeight: 1.05, color: C.cream }}>{bottom}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Card x={100} at={T.seasonal - 6} top="Seasonal" bottom="lottery" />
      <Card x={520} at={T.dayBefore - 6} top="Day-before" bottom="lottery" />
      <div
        style={{
          position: "absolute",
          left: 100,
          width: 800,
          top: 880,
          textAlign: "center",
          fontFamily: BODY,
          fontWeight: 500,
          fontSize: 32,
          color: C.cream,
          opacity: interpolate(frame, [T.dayBefore + 8, T.dayBefore + 16], [0, 1], clamp),
        }}
      >
        <span style={{ backgroundColor: "rgba(20,8,26,0.88)", padding: "8px 22px", borderRadius: 12 }}>Both on Recreation.gov</span>
      </div>
    </AbsoluteFill>
  );
};

const NotToScale: React.FC = () => {
  const frame = useCurrentFrame();
  const o = Math.min(win(frame, T.s1916 + 6, T.hikers + 4, 10) + win(frame, T.fromThere + 6, T.seasonal - 6, 10), 1);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 1212, fontFamily: BODY, fontWeight: 500, fontSize: 22, color: "rgba(255,241,226,0.62)", opacity: o }}>
      Illustration, not to scale
    </div>
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
          Free permit calendar
        </Rise>
        <Slam delay={T.end + 10} from={1.6} style={{ marginTop: 28 }}>
          <div style={{ backgroundColor: C.gold, color: C.plum, borderRadius: 999, padding: "18px 50px", fontSize: 84, letterSpacing: "0.03em", textTransform: "none" }}>
            trailbrief.app
          </div>
        </Slam>
        <Rise delay={T.end + 16} dist={10} style={{ marginTop: 46, fontFamily: BODY, fontWeight: 500, fontSize: 28, textTransform: "none", color: C.muted, lineHeight: 1.4, width: 820 }}>
          Independent planning service. You apply yourself.
          <br />
          Not affiliated with Recreation.gov or the National Park Service.
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const AngelsLandingStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.plum }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.sub} 55%, #6A3A3E 100%)` }} />
      <Topo opacity={0.7} />
      <World />
      <Topo opacity={0.35} />
      <NotToScale />
      <Head from={T.s1916} to={T.s1926} big="1916" sub="Methodist minister Frederick Vining Fisher visits Zion Canyon" />
      <Quote />
      <Head from={T.s1926} to={T.walter} big="1926" sub="Park crews build a trail up the sandstone spine" subAt={T.crews} sub2="Footholds chiseled with hand tools" sub2At={T.chisel} />
      <Head from={T.walter} to={T.hikers - 2} big="Walter Ruesch" bigSize={128} sub="Supervised the work" sub2="The Walter of Walter's Wiggles" sub2At={T.wiggles - 4} />
      <Head from={T.fromThere + 6} to={T.before} big="Last ½ mile" bigSize={150} sub="Chains for handrails" subAt={T.chains} sub2="Drop-offs up to 1,000 feet" sub2At={T.thousand - 2} />
      <Head from={T.before} to={T.so} big="Before permits" bigSize={124} sub="Lines to go up and down the chains" subAt={T.lines} />
      <Head from={T.so} to={T.dates} big="April 2022" bigSize={160} sub="A permit to go past Scout Lookout" subAt={T.past} />
      <Head from={T.dates} to={T.end} big="Lottery dates?" bigSize={118} />
      <Lotteries />
      {/* photos: each one shows what the voice says at that moment */}
      <PhotoScene
        src="angels-landing-virgin-river-2015.jpg"
        from={-15}
        to={T.s1916 + 14}
        color
        focus="50% 40%"
        origin="45% 40%"
        zoom={[1.0, 1.08]}
        tag="Angels Landing"
        sub="Zion National Park"
        subAt={T.now}
        credit="Photo: NPS, 2015 · “Angels Landing past the Virgin River”"
      />
      <PhotoScene
        src="angels-landing-horseback-1934.jpg"
        from={T.hikers - 6}
        to={T.fromThere + 12}
        focus="40% 30%"
        origin="42% 38%"
        zoom={[1.14, 1.2]}
        tag="West Rim Trail"
        sub="Trail party, 1934"
        subAt={T.westRim}
        credit="Photo: 1934 · Courtesy Zion National Park, ZION 13668"
      />
      <Hook />
      <EndCard />
      <Captions words={WORDS} hideFrom={T.end} y={1270} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
