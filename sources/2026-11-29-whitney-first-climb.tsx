import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, COND, Grain, LogoMark, Rise, Slam, Topo, Vignette, clamp, useShake } from "../brand";
import { Captions, PhotoScene, Pt, Word, fr, partial, pointAt } from "./story-kit";

// "Mt. Whitney's first recorded climb" — narrated story (AI voice "Puck").
// Facts and sources: videos/2026-11/2026-11-29-whitney-first-climb.facts.md in trailbrief-media.
// Real photos (public domain, trailbrief-media/library) carry the hook, 1864, Aug/Sept 1873 and
// "today" beats; the stylized crest (seen from the east: south on the left, north on the right)
// explains King's wrong mountain in 1871-73. No elevations are shown.

export const WHITNEY_FRAMES = 1275; // 42.5 s

// Raw-voice word timings from Speko audio_transcribe (take 83961513, Nov 23 2026)
export const WORDS: Word[] = [
  ["The", 300, 400], ["first", 400, 700], ["recorded", 700, 1200], ["climb", 1200, 1600], ["of", 1600, 1700],
  ["the", 1700, 1800], ["highest", 1800, 2400], ["peak", 2400, 2600], ["in", 2600, 2700], ["the", 2700, 2800],
  ["Lower", 2800, 3000], ["48", 3000, 3700], ["wasn't", 3800, 4200], ["by", 4200, 4400], ["a", 4400, 4600],
  ["famous", 4600, 5000], ["explorer.", 5000, 5600],
  ["In", 6300, 6400], ["1864,", 6400, 7600], ["a", 7600, 7700], ["survey", 7700, 8100], ["team", 8100, 8400],
  ["named", 8400, 8600], ["it", 8600, 8800], ["Mount", 8800, 9100], ["Whitney,", 9100, 9600], ["after", 9700, 10000],
  ["Josiah", 10000, 10400], ["Whitney,", 10400, 10900], ["California's", 11000, 11700], ["state", 11700, 12000],
  ["geologist.", 12000, 12700],
  ["One", 13400, 13500], ["of", 13500, 13600], ["that", 13600, 13800], ["team,", 13800, 14200], ["Clarence", 14300, 14700],
  ["King,", 14700, 15100], ["climbed", 15100, 15500], ["it", 15500, 15600], ["in", 15600, 15800], ["1871.", 15800, 16800],
  ["Or", 17500, 17900], ["so", 17900, 18300], ["King", 18300, 18600], ["thought.", 18600, 19000],
  ["In", 19700, 19800], ["1873,", 19800, 20900], ["two", 21000, 21200], ["men", 21200, 21400], ["rode", 21400, 21600],
  ["up", 21600, 21700], ["his", 21700, 21900], ["peak", 21900, 22300], ["and", 22300, 22400], ["spotted", 22400, 22900],
  ["a", 22900, 23000], ["higher", 23000, 23400], ["one", 23400, 23700], ["to", 23700, 23900], ["the", 23900, 24000],
  ["north.", 24000, 24400],
  ["King", 24800, 25100], ["had", 25100, 25300], ["climbed", 25300, 25900], ["the", 25900, 26100], ["wrong", 26100, 26500],
  ["mountain.", 26500, 27000],
  ["Weeks", 27500, 27800], ["later,", 27800, 28100], ["three", 28100, 28500], ["local", 28500, 28800], ["men", 28800, 29100],
  ["beat", 29100, 29400], ["him", 29400, 29600], ["to", 29600, 29800], ["the", 29800, 29900], ["real", 29900, 30300],
  ["summit.", 30300, 30800],
  ["They", 30900, 31000], ["wanted", 31000, 31300], ["to", 31300, 31400], ["call", 31400, 31600], ["it", 31600, 31700],
  ["Fisherman's", 31700, 32300], ["Peak.", 32300, 32700],
  ["King", 33300, 33400], ["got", 33400, 33600], ["there", 33600, 33900], ["about", 33900, 34200], ["a", 34200, 34300],
  ["month", 34300, 34600], ["after", 34600, 34900], ["them.", 34900, 35200], ["And", 35300, 35600], ["the", 35600, 35700],
  ["name", 35700, 35900], ["Whitney", 35900, 36300], ["stuck.", 36300, 36700],
  ["Today,", 37500, 37800], ["you", 37800, 37900], ["need", 37900, 38100], ["a", 38100, 38200], ["permit", 38200, 38700],
  ["just", 38700, 38900], ["to", 38900, 39000], ["stand", 39000, 39500], ["where", 39500, 39600], ["they", 39600, 39800],
  ["stood.", 39800, 40300],
  ["The", 40600, 40700], ["lottery", 40700, 41000], ["dates", 41000, 41300], ["are", 41300, 41500], ["free", 41500, 42000],
  ["at", 42000, 42200], ["trailbrief.app", 42200, 43200],
];

// Story beats (frames)
const T = {
  s1864: fr(6300),
  named: fr(8800),
  s1871: fr(13400),
  climb71: fr(14300),
  thought: fr(17500),
  s1873: fr(19700),
  spotted: fr(22400),
  wrong: fr(26100),
  aug: fr(27500),
  beat: fr(29100),
  fisher: fr(31700),
  sept: fr(33300),
  stuck: fr(35700),
  today: fr(37500),
  end: fr(40600),
};

// ---------- the world: a stylized Sierra crest seen from the east ----------
const W = 2160;
const LANGLEY: Pt = [620, 930];
const WHITNEY: Pt = [1470, 815];
const CREST: Pt[] = [
  [-200, 1240], [0, 1230], [120, 1150], [220, 1190], [330, 1080], [420, 1120], [520, 1040], [580, 980], LANGLEY,
  [680, 990], [760, 1020], [840, 1000], [900, 960], [980, 1010], [1060, 970], [1140, 1000], [1220, 930], [1260, 962],
  [1300, 902], [1340, 945], [1380, 880], [1410, 900], [1440, 822], WHITNEY, [1505, 820], [1560, 880], [1640, 958],
  [1720, 920], [1800, 1000], [1900, 978], [2000, 1060], [2160, 1100], [2360, 1120],
];
const NEAR: Pt[] = [
  [-200, 1330], [100, 1280], [260, 1310], [420, 1250], [620, 1300], [820, 1240], [1000, 1290], [1180, 1230],
  [1380, 1280], [1560, 1220], [1760, 1290], [1960, 1240], [2360, 1300],
];
const BACK: Pt[] = [
  [-200, 1060], [80, 1000], [260, 1040], [450, 960], [700, 900], [900, 930], [1100, 880], [1300, 860], [1600, 870],
  [1820, 930], [2050, 900], [2360, 980],
];
const closed = (pts: Pt[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ") + " L2360 2400 L-200 2400 Z";
const open = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");

const KING_ROUTE: Pt[] = [[455, 1215], [500, 1130], [535, 1070], [572, 1012], [600, 968], LANGLEY];
const LOCALS_ROUTE: Pt[] = [[1335, 1215], [1372, 1110], [1398, 1030], [1425, 955], [1448, 878], WHITNEY];

// Camera keyframes: [frame, centerX, centerY, scale]
const CAM: [number, number, number, number][] = [
  [0, 1080, 990, 0.6],
  [T.s1864 - 10, 1080, 990, 0.68],
  [T.s1864 + 22, 1470, 905, 1.0],
  [T.s1871 - 6, 1470, 905, 1.06],
  [T.s1871 + 24, 640, 980, 1.12],
  [T.s1873 - 6, 640, 980, 1.2],
  [T.s1873 + 26, 1045, 935, 0.78],
  [T.aug - 6, 1045, 935, 0.83],
  [T.aug + 24, 1470, 900, 1.14],
  [T.today - 6, 1470, 900, 1.22],
  [T.today + 30, 1300, 800, 0.85],
  [WHITNEY_FRAMES, 1300, 790, 0.82],
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

const Label: React.FC<{ x: number; y: number; at: number; to?: number; color?: string; size?: number; children: React.ReactNode; sub?: string }> = ({
  x,
  y,
  at,
  to = Infinity,
  color = C.cream,
  size = 44,
  children,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, at, fps);
  if (frame < at || frame >= to) return null;
  const fadeIn = interpolate(frame - at, [0, 4], [0, 1], clamp);
  const fade = Number.isFinite(to) ? Math.min(fadeIn, interpolate(frame, [to - 6, to], [1, 0], clamp)) : fadeIn;
  return (
    <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)})`} opacity={fade}>
      <text textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={size} letterSpacing="2" fill={color}>
        {children}
      </text>
      {sub ? (
        <text y={size * 0.95} textAnchor="middle" fontFamily={BODY} fontWeight={500} fontSize={size * 0.55} fill={C.muted}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};

const Flag: React.FC<{ at: Pt; from: number; to?: number; color: string }> = ({ at, from, to = Infinity, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const s = pop(frame, from, fps);
  const wave = Math.sin((frame - from) / 5) * 3;
  return (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${s.toFixed(3)})`}>
      <line x1={0} y1={0} x2={0} y2={-70} stroke={C.cream} strokeWidth={4} />
      <path d={`M0 -70 L44 ${-60 + wave} L0 -48 Z`} fill={color} />
    </g>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useCamera();
  const kingP = interpolate(frame, [T.climb71 + 4, T.thought - 6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const arrowP = interpolate(frame, [T.spotted, T.spotted + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const localsP = interpolate(frame, [T.beat - 8, T.fisher - 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const kingRoute = partial(KING_ROUTE, kingP);
  const localsRoute = partial(LOCALS_ROUTE, localsP);
  const glow = 0.55 + 0.1 * Math.sin(frame / 40);
  const strike = interpolate(frame, [T.stuck, T.stuck + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: camera, transformOrigin: "0 0" }}>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id="sunglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={C.sun} stopOpacity={0.9} />
            <stop offset="35%" stopColor={C.gold} stopOpacity={0.45} />
            <stop offset="100%" stopColor={C.amber} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B2142" />
            <stop offset="100%" stopColor="#1A0C20" />
          </linearGradient>
          <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#170A1C" />
            <stop offset="100%" stopColor="#0C0510" />
          </linearGradient>
        </defs>
        <circle cx={1480} cy={790} r={720} fill="url(#sunglow)" opacity={glow} />
        <path d={closed(BACK)} fill="#4A2840" opacity={0.55} />
        <path d={closed(CREST)} fill="url(#far)" />
        <path d={open(CREST)} fill="none" stroke={C.gold} strokeOpacity={0.75} strokeWidth={3.2} strokeLinejoin="round" />
        <path d={closed(NEAR)} fill="url(#near)" />
        <path d={open(NEAR)} fill="none" stroke={C.amber} strokeOpacity={0.25} strokeWidth={2} />

        {/* 1864: the peak gets its name */}
        <Label x={WHITNEY[0]} y={WHITNEY[1] - 70} at={T.named} to={T.s1873} color={C.gold} size={52}>
          MT. WHITNEY
        </Label>

        {/* 1871: King's route to the wrong peak */}
        {kingRoute && frame < T.today ? (
          <path d={kingRoute} fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="16 12" strokeLinecap="round" />
        ) : null}
        <Flag at={LANGLEY} from={T.thought - 8} to={T.today} color={C.cream} />
        <Label x={LANGLEY[0]} y={LANGLEY[1] - 100} at={T.thought - 8} to={T.aug} size={50}>
          KING · 1871
        </Label>
        <Label x={LANGLEY[0] + 20} y={LANGLEY[1] + 290} at={T.spotted - 30} to={T.aug} size={58} sub="today: Mount Langley">
          KING&apos;S PEAK
        </Label>

        {/* 1873: the higher peak to the north */}
        {arrowP > 0 && frame < T.aug ? (
          <path
            d={`M${LANGLEY[0] + 40} ${LANGLEY[1] - 40} Q 1050 600 ${WHITNEY[0] - 60} ${WHITNEY[1] - 30}`}
            pathLength={1}
            strokeDasharray={`${arrowP} 1`}
            fill="none"
            stroke={C.gold}
            strokeWidth={7}
            strokeLinecap="round"
          />
        ) : null}
        <Label x={1050} y={640} at={T.spotted + 20} to={T.aug} color={C.gold} size={54}>
          HIGHER →
        </Label>

        {/* Aug 18, 1873: three local men reach the real summit */}
        {localsRoute && frame < T.today ? <path d={localsRoute} fill="none" stroke={C.gold} strokeWidth={7} strokeLinecap="round" /> : null}
        {[0, 0.05, 0.1].map((lag, i) =>
          localsP > lag && frame < T.today ? (
            <circle key={i} cx={pointAt(LOCALS_ROUTE, localsP - lag)[0]} cy={pointAt(LOCALS_ROUTE, localsP - lag)[1]} r={11} fill={C.sun} stroke={C.plum} strokeWidth={3} />
          ) : null,
        )}
        <Flag at={WHITNEY} from={T.fisher - 6} to={T.today} color={C.gold} />
        {frame >= T.fisher && frame < T.today ? (
          <g>
            <Label x={WHITNEY[0]} y={WHITNEY[1] - 110} at={T.fisher} size={50}>
              FISHERMAN&apos;S PEAK?
            </Label>
            {strike > 0 ? (
              <line
                x1={WHITNEY[0] - 220}
                y1={WHITNEY[1] - 127}
                x2={WHITNEY[0] - 220 + 440 * strike}
                y2={WHITNEY[1] - 127}
                stroke={C.amber}
                strokeWidth={7}
                strokeLinecap="round"
              />
            ) : null}
          </g>
        ) : null}
        <Label x={WHITNEY[0]} y={WHITNEY[1] - 200} at={T.stuck + 8} to={T.today} color={C.gold} size={64}>
          MT. WHITNEY
        </Label>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- headlines (top of the frame, screen space) ----------
const Head: React.FC<{ from: number; to: number; big: string; sub?: string; sub2?: string; sub2At?: number; bigSize?: number }> = ({
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
        <Rise delay={sub2At} dist={20} style={{ marginTop: 14, fontSize: 46, lineHeight: 1.05, color: C.muted, width: 860 }}>
          {sub2}
        </Rise>
      ) : null}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= T.s1864) return null;
  const out = interpolate(frame, [T.s1864 - 6, T.s1864], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 200, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Rise delay={2} dist={18} style={{ fontSize: 44, fontWeight: 600, letterSpacing: "0.2em", color: C.muted }}>
        Highest peak in the Lower 48
      </Rise>
      <Slam delay={8} style={{ fontSize: 150, lineHeight: 0.92, color: C.gold }}>
        First recorded
      </Slam>
      <Slam delay={14} style={{ fontSize: 150, lineHeight: 0.92, color: C.gold }}>
        climb?
      </Slam>
      <Rise delay={fr(3800)} dist={22} style={{ marginTop: 24, fontSize: 64, color: C.cream }}>
        Not a famous explorer.
      </Rise>
    </AbsoluteFill>
  );
};

const Stamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shake = useShake([T.wrong], 22);
  if (frame < T.wrong || frame >= T.aug) return null;
  const s = spring({ frame: frame - T.wrong, fps, config: { damping: 12, stiffness: 260, mass: 0.7 } });
  const out = interpolate(frame, [T.aug - 6, T.aug], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: shake, alignItems: "center", justifyContent: "center", paddingBottom: 380, opacity: out }}>
      <div
        style={{
          transform: `rotate(-8deg) scale(${interpolate(s, [0, 1], [2.4, 1]).toFixed(3)})`,
          border: `10px solid ${C.amber}`,
          borderRadius: 18,
          padding: "10px 34px 4px",
          color: C.amber,
          fontFamily: COND,
          fontWeight: 700,
          fontSize: 120,
          lineHeight: 1,
          textTransform: "uppercase",
          backgroundColor: "rgba(20,8,26,0.55)",
        }}
      >
        Wrong mountain
      </div>
    </AbsoluteFill>
  );
};

const FisherTag: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < T.fisher || frame >= T.today) return null;
  const s = spring({ frame: frame - T.fisher, fps, config: { damping: 13, stiffness: 220, mass: 0.6 } });
  const strike = interpolate(frame, [T.stuck, T.stuck + 10], [0, 1], clamp);
  const named = spring({ frame: frame - T.stuck - 8, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      {frame >= T.stuck + 8 ? (
        <div style={{ position: "absolute", top: 880, fontSize: 120, color: C.gold, transform: `scale(${named.toFixed(3)})`, textShadow: "0 6px 30px rgba(8,2,12,0.8)" }}>
          Mt. Whitney
        </div>
      ) : null}
      <div style={{ position: "absolute", top: 1030, transform: `rotate(-3deg) scale(${s.toFixed(3)})` }}>
        <div style={{ position: "relative", backgroundColor: C.gold, color: C.plum, padding: "8px 30px 2px", fontSize: 72, borderRadius: 10 }}>
          Fisherman&apos;s Peak?
          {strike > 0 ? (
            <div style={{ position: "absolute", left: 14, top: "48%", height: 9, width: `${(strike * 92).toFixed(1)}%`, backgroundColor: C.plum, borderRadius: 5 }} />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.today) return null;
  const scrim = interpolate(frame, [T.today, T.today + 14, T.end - 6, T.end], [0, 0.45, 0.45, 0.92], clamp);
  const showEnd = frame >= T.end;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: C.plum, opacity: scrim }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
        {!showEnd ? (
          <>
            <Slam delay={T.today} style={{ fontSize: 120, color: C.cream, lineHeight: 0.95 }}>
              Today:
            </Slam>
            <Slam delay={T.today + 10} style={{ fontSize: 150, color: C.gold, lineHeight: 0.95 }}>
              Permit required
            </Slam>
            <Rise delay={T.today + 18} dist={20} style={{ marginTop: 22, fontSize: 52, color: C.muted, letterSpacing: "0.08em" }}>
              Mt. Whitney · year-round
            </Rise>
          </>
        ) : (
          <>
            <Rise delay={T.end} dist={30}>
              <LogoMark size={190} />
            </Rise>
            <Rise delay={T.end + 4} dist={24} style={{ marginTop: 34, fontSize: 70, color: C.cream, lineHeight: 1.02, width: 860 }}>
              Permit lottery dates,
              <br />
              free:
            </Rise>
            <Slam delay={T.end + 12} from={1.6} style={{ marginTop: 28 }}>
              <div style={{ backgroundColor: C.gold, color: C.plum, borderRadius: 999, padding: "18px 50px", fontSize: 84, letterSpacing: "0.03em", textTransform: "none" }}>
                trailbrief.app
              </div>
            </Slam>
            <Rise
              delay={T.end + 20}
              dist={10}
              style={{ marginTop: 46, fontFamily: BODY, fontWeight: 500, fontSize: 28, textTransform: "none", color: C.muted, lineHeight: 1.4, width: 820 }}
            >
              Independent planning service. You apply yourself.
              <br />
              Not affiliated with Recreation.gov, USFS or NPS.
            </Rise>
          </>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const WhitneyStory: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.plum }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.sub} 55%, #6A3A3E 100%)` }} />
      <Topo opacity={0.7} />
      <World />
      <Topo opacity={0.45} />
      <PhotoScene src="whitney-from-mt-muir-1930.jpg" from={0} to={T.s1864} focus="27% 50%" zoom={[1.1, 1.0]}
        credit="Photo: Mt. Whitney from near Mt. Muir, 1930 · NPS archive (public domain)" />
      <PhotoScene src="whitney-dixon.jpg" from={T.s1864} to={T.s1871} focus="50% 50%" zoom={[1.08, 1.16]}
        credit="Photo: Mt. Whitney · NPS archive, Joseph Dixon (public domain)" />
      <PhotoScene src="whitney-from-south.jpg" from={T.aug} to={T.sept} framed zoom={[1.0, 1.08]}
        credit="Photo: Mt. Whitney from the south · NPS archive, Bill Jones (public domain)" />
      <PhotoScene src="whitney-summit-shelter-1929.jpg" from={T.sept} to={T.today} focus="64% 50%" zoom={[1.06, 1.14]}
        credit="Photo: Whitney's summit hut (built 1909), 1929 · NPS archive, John Diehl (public domain)" />
      <PhotoScene src="whitney-owens-valley-1963.jpg" from={T.today} to={WHITNEY_FRAMES} focus="66% 40%" zoom={[1.05, 1.12]}
        credit="Photo: Mt. Whitney from Whitney Portal Road, 1963 · NPS archive, Richard McLaren (public domain)" />
      <Hook />
      <Head from={T.s1864} to={T.s1871} big="1864" sub="A state survey team names it" sub2="for Josiah Whitney, California's state geologist" sub2At={fr(10000)} />
      <Head from={T.s1871} to={T.s1873} big="1871" sub="Clarence King climbs it" sub2="…or so he thought" sub2At={T.thought} />
      <Head from={T.s1873} to={T.aug} big="July 1873" bigSize={170} sub="Two men ride up King's peak" sub2="…and spot a higher one to the north" sub2At={T.spotted} />
      <Head from={T.aug} to={T.sept} big="Aug 18, 1873" bigSize={160} sub="Three local men beat King to the real summit" />
      <Head from={T.sept} to={T.today} big="Sept 1873" bigSize={170} sub="King finally makes the real summit" />
      <Stamp />
      <FisherTag />
      <EndCard />
      <Captions words={WORDS} hideFrom={T.end} y={1270} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
