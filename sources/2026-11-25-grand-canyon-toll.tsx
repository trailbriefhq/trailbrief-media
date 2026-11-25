import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, COND, Grain, LogoMark, Rise, Slam, Topo, Vignette, clamp, useShake } from "../brand";
import { Captions, PhotoScene, Pt, Word, fr, partial, pointAt } from "./story-kit";

// "This Grand Canyon trail exists because of a $1 toll" — narrated story (AI voice "Puck").
// Facts and sources: videos/2026-11/2026-11-25-grand-canyon-toll.facts.md (this repo).
// Real photos (public domain, trailbrief-media/library) carry the hook, the Bright Angel line and
// "today"; a stylized top-down map (north up: South Rim at the bottom, the Colorado River across the
// middle) explains 1903–1928. It is an illustration, not to scale, and shows no distances.

export const GC_TOLL_FRAMES = 1290; // 43.0 s

// Raw-voice word timings from Speko audio_transcribe (synthesis 3092a328, take 2, Nov 25 2026;
// matches the pauses ffmpeg silencedetect finds in the raw voice).
export const WORDS: Word[] = [
  ["This", 0, 200], ["Grand", 200, 500], ["Canyon", 500, 900], ["trail", 900, 1300], ["exists", 1300, 1900],
  ["because", 1900, 2200], ["of", 2200, 2300], ["a", 2300, 2400], ["$1", 2400, 3300], ["toll.", 3300, 3700],
  ["The", 4200, 4300], ["older", 4300, 4600], ["Bright", 4600, 4800], ["Angel", 4800, 5100], ["Trail", 5100, 5600],
  ["loosely", 5600, 6000], ["follows", 6000, 6500], ["a", 6500, 6500], ["Havasupai", 6500, 7200], ["route", 7200, 7500],
  ["into", 7500, 7800], ["the", 7800, 7900], ["canyon.", 7900, 8500], ["In", 9100, 9200], ["1903,", 9200, 10200],
  ["a", 10200, 10300], ["miner", 10300, 10700], ["named", 10700, 11000], ["Ralph", 11000, 11300], ["Cameron", 11300, 11900],
  ["put", 11900, 12100], ["a", 12100, 12200], ["gate", 12200, 12500], ["at", 12500, 12600], ["the", 12600, 12700],
  ["top", 12700, 13300], ["and", 13300, 13500], ["started", 13500, 13800], ["charging", 13800, 14100], ["riders", 14100, 14600],
  ["a", 14600, 14700], ["$1", 14700, 15400], ["toll.", 15400, 15800], ["In", 16500, 16600], ["1919,", 16600, 17500],
  ["the", 17500, 17600], ["canyon", 17600, 18000], ["became", 18000, 18500], ["a", 18500, 18600], ["national", 18600, 19100],
  ["park.", 19100, 19600], ["The", 20100, 20200], ["U.S.", 20200, 20400], ["Supreme", 20400, 20700], ["Court", 20700, 21000],
  ["ruled", 21000, 21300], ["against", 21300, 21600], ["Cameron.", 21600, 22100], ["He", 22800, 22900], ["ignored", 22900, 23400],
  ["it", 23400, 23800], ["and", 24000, 24300], ["got", 24300, 24400], ["elected", 24400, 24900], ["to", 24900, 25000],
  ["the", 25000, 25100], ["U.S.", 25100, 25400], ["Senate.", 25400, 25800], ["So", 26300, 26400], ["the", 26400, 26500],
  ["Park", 26500, 26800], ["Service", 26800, 27100], ["built", 27100, 27400], ["its", 27400, 27600], ["own", 27700, 28000],
  ["trail", 28000, 28300], ["down,", 28300, 28700], ["the", 28800, 28900], ["South", 28900, 29200], ["Kaibab,", 29200, 29900],
  ["dedicated", 30100, 30800], ["in", 30800, 31000], ["1925.", 31000, 32100], ["The", 32800, 32800], ["Bright", 32800, 33100],
  ["Angel", 33100, 33300], ["toll", 33300, 33600], ["lasted", 33600, 34000], ["until", 34000, 34200], ["the", 34200, 34300],
  ["Park", 34300, 34600], ["Service", 34600, 34900], ["took", 34900, 35100], ["over", 35100, 35300], ["that", 35300, 35500],
  ["trail", 35500, 35900], ["in", 35900, 36000], ["1928.", 36000, 36800], ["Today,", 37500, 38000], ["day", 38100, 38300],
  ["hikes", 38300, 38600], ["need", 38600, 39000], ["no", 39000, 39200], ["backcountry", 39200, 39700], ["permit.", 39700, 40200],
  ["Camping", 40500, 40800], ["below", 40800, 41000], ["the", 41000, 41100], ["rim", 41100, 41400], ["does.", 41400, 41900],
  ["Plan", 42300, 42500], ["your", 42500, 42600], ["canyon", 42600, 43000], ["trip", 43000, 43300], ["at", 43300, 43500],
  ["trailbrief.app", 43500, 44800],
];

// Story beats (frames)
const T = {
  older: fr(4200),
  havasupai: fr(6500),
  s1903: fr(9100),
  cameron: fr(11000),
  gate: fr(12200),
  toll: fr(14700),
  s1919: fr(16500),
  park: fr(18600),
  court: fr(20100),
  ruled: fr(21000),
  senate: fr(22800),
  s1925: fr(26300),
  built: fr(27100),
  kaibab: fr(28900),
  dedicated: fr(30100),
  s1928: fr(32800),
  tookOver: fr(34900),
  today: fr(37500),
  camping: fr(40500),
  end: fr(42300),
};

// ---------- the world: a stylized top-down Grand Canyon, north up ----------
// South Rim along the bottom (Grand Canyon Village / Bright Angel Trailhead west, Yaki Point /
// South Kaibab Trailhead east), the Colorado River across the middle, the North Rim at the top.
const W = 2160;
const BA_TH: Pt = [430, 1262];
const SK_TH: Pt = [1640, 1206];
const GARDENS: Pt = [640, 925];
const BA_RIVER: Pt = [965, 688];
const SK_RIVER: Pt = [1528, 690];
const BA_ROUTE: Pt[] = [BA_TH, [462, 1196], [420, 1150], [478, 1096], [530, 1040], [590, 982], GARDENS, [720, 850], [800, 790], [880, 735], BA_RIVER];
const SK_ROUTE: Pt[] = [SK_TH, [1612, 1128], [1636, 1062], [1600, 990], [1616, 920], [1584, 850], [1560, 790], [1522, 760], [1552, 728], SK_RIVER];

const SOUTH_RIM: Pt[] = [
  [-200, 1290], [120, 1272], [300, 1288], BA_TH, [560, 1250], [700, 1282], [860, 1240], [1000, 1270], [1160, 1232],
  [1320, 1262], [1470, 1236], [1560, 1214], [1600, 1160], [1650, 1150], [1700, 1172], [1730, 1236], [1880, 1262],
  [2040, 1240], [2360, 1268],
];
const NORTH_RIM: Pt[] = [
  [-200, 330], [140, 350], [360, 300], [600, 342], [820, 312], [1040, 360], [1240, 318], [1460, 352], [1680, 300],
  [1900, 346], [2120, 318], [2360, 340],
];
const RIVER: Pt[] = [
  [-200, 640], [180, 676], [480, 646], [760, 700], BA_RIVER, [1150, 656], [1340, 704], SK_RIVER, [1740, 648],
  [1980, 694], [2360, 660],
];
// Buttes and side ridges inside the canyon (texture only)
const BUTTES: Pt[][] = [
  [[260, 560], [330, 520], [400, 540], [380, 600], [290, 610]],
  [[1150, 520], [1240, 480], [1320, 505], [1300, 570], [1190, 575]],
  [[1820, 520], [1910, 470], [2000, 500], [1980, 570], [1860, 575]],
  [[300, 900], [380, 860], [450, 900], [420, 980], [320, 975]],
  [[1080, 940], [1180, 880], [1280, 930], [1250, 1030], [1110, 1020]],
  [[1860, 900], [1960, 850], [2060, 905], [2030, 990], [1890, 985]],
  [[760, 1020], [840, 990], [900, 1030], [870, 1090], [790, 1085]],
];
const path = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
const below = (pts: Pt[]) => path(pts) + " L2360 3600 L-200 3600 Z";
const above = (pts: Pt[]) => path(pts) + " L2360 -600 L-200 -600 Z";

// Camera keyframes: [frame, centerX, centerY, scale]
const CAM: [number, number, number, number][] = [
  [0, 690, 1030, 0.82],
  [T.s1903, 690, 1030, 0.82],
  [T.s1919 - 4, 690, 1030, 0.86],
  [T.s1919 + 34, 1080, 960, 0.5],
  [T.court - 4, 1080, 960, 0.52],
  [T.court + 30, 690, 1030, 0.86],
  [T.s1925 - 4, 690, 1030, 0.9],
  [T.s1925 + 40, 1560, 1000, 0.88],
  [T.s1928 - 4, 1560, 1000, 0.92],
  [T.s1928 + 36, 1080, 990, 0.58],
  [GC_TOLL_FRAMES, 1080, 990, 0.6],
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

const Label: React.FC<{ x: number; y: number; at: number; to?: number; color?: string; size?: number; children: React.ReactNode; sub?: string; anchor?: "middle" | "start" | "end" }> = ({
  x,
  y,
  at,
  to = Infinity,
  color = C.cream,
  size = 44,
  children,
  sub,
  anchor = "middle",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(frame, at, fps);
  if (frame < at || frame >= to) return null;
  const fadeIn = interpolate(frame - at, [0, 4], [0, 1], clamp);
  const fade = Number.isFinite(to) ? Math.min(fadeIn, interpolate(frame, [to - 8, to], [1, 0], clamp)) : fadeIn;
  return (
    <g transform={`translate(${x} ${y}) scale(${s.toFixed(3)})`} opacity={fade}>
      <text textAnchor={anchor} fontFamily={COND} fontWeight={700} fontSize={size} letterSpacing="2" fill={color} stroke="rgba(20,8,26,0.85)" strokeWidth={size * 0.14} paintOrder="stroke">
        {children}
      </text>
      {sub ? (
        <text y={size * 0.95} textAnchor={anchor} fontFamily={BODY} fontWeight={700} fontSize={size * 0.55} fill={C.muted} stroke="rgba(20,8,26,0.85)" strokeWidth={size * 0.1} paintOrder="stroke">
          {sub}
        </text>
      ) : null}
    </g>
  );
};

// Cameron's toll gate at the Bright Angel trailhead: posts + a bar that swings open in 1928
const Gate: React.FC<{ at: Pt }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < T.gate) return null;
  const s = pop(frame, T.gate, fps);
  const open = interpolate(frame, [T.tookOver, T.tookOver + 18], [0, -78], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <g transform={`translate(${at[0]} ${at[1] + 6}) scale(${s.toFixed(3)})`}>
      <rect x={-74} y={-70} width={16} height={84} rx={4} fill={C.cream} />
      <rect x={58} y={-70} width={16} height={84} rx={4} fill={C.cream} />
      <g transform={`translate(-58 -46) rotate(${open.toFixed(2)})`}>
        <rect x={0} y={-9} width={120} height={18} rx={5} fill={C.amber} stroke={C.plum} strokeWidth={3} />
        {[22, 54, 86].map((x) => (
          <rect key={x} x={x} y={-9} width={14} height={18} fill={C.cream} />
        ))}
      </g>
    </g>
  );
};

// The $1 tag that hangs by the gate; crossed out when the toll ends
const TollTag: React.FC<{ at: Pt }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < T.toll) return null;
  const s = pop(frame, T.toll, fps);
  const swing = Math.sin((frame - T.toll) / 7) * 4 * Math.exp(-(frame - T.toll) / 40);
  const strike = interpolate(frame, [T.tookOver + 4, T.tookOver + 14], [0, 1], clamp);
  const dim = interpolate(frame, [T.tookOver + 4, T.tookOver + 14], [1, 0.55], clamp);
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${swing.toFixed(2)}) scale(${s.toFixed(3)})`}>
      <g opacity={dim}>
        <circle r={62} fill={C.gold} stroke={C.plum} strokeWidth={6} />
        <text y={24} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={72} fill={C.plum}>
          $1
        </text>
      </g>
      {strike > 0 ? <line x1={-70} y1={52} x2={-70 + 140 * strike} y2={-52} stroke={C.amber} strokeWidth={12} strokeLinecap="round" /> : null}
    </g>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useCamera();
  const baP = interpolate(frame, [T.s1903 - 20, T.s1903 + 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const skP = interpolate(frame, [T.built, T.dedicated], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ba = partial(BA_ROUTE, baP);
  const sk = partial(SK_ROUTE, skP);
  const hiker = pointAt(SK_ROUTE, skP);
  if (frame > T.end + 14) return null;
  const parkGlow = interpolate(frame, [T.park - 6, T.park + 10, T.court, T.court + 14], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: camera, transformOrigin: "0 0" }}>
      <svg width={W} height={1920} viewBox={`0 0 ${W} 1920`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="gc-canyon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A2E3A" />
            <stop offset="45%" stopColor="#3A1C30" />
            <stop offset="100%" stopColor="#5E3038" />
          </linearGradient>
          <linearGradient id="gc-plateau" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4A2840" />
            <stop offset="100%" stopColor="#2A1633" />
          </linearGradient>
        </defs>
        {/* canyon floor between the rims */}
        <rect x={-200} y={-600} width={2560} height={4200} fill="url(#gc-canyon)" />
        {BUTTES.map((b, i) => (
          <path key={i} d={path(b) + " Z"} fill="#6E3A3E" opacity={0.55} stroke={C.amber} strokeOpacity={0.25} strokeWidth={3} />
        ))}
        {/* the Colorado River */}
        <path d={path(RIVER)} fill="none" stroke="#7FB8C2" strokeOpacity={0.75} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        {/* rims */}
        <path d={above(NORTH_RIM)} fill="url(#gc-plateau)" />
        <path d={path(NORTH_RIM)} fill="none" stroke={C.gold} strokeOpacity={0.55} strokeWidth={4} />
        <path d={below(SOUTH_RIM)} fill="url(#gc-plateau)" />
        <path d={path(SOUTH_RIM)} fill="none" stroke={C.gold} strokeOpacity={0.75 + 0.25 * parkGlow} strokeWidth={4 + 6 * parkGlow} strokeLinejoin="round" />
        {(frame >= T.s1919 && frame < T.court + 10) || frame >= T.s1928 + 20 ? (
          <text x={1080} y={1345} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={66} letterSpacing="8" fill={C.muted} opacity={0.75}>
            SOUTH RIM
          </text>
        ) : null}
        <text x={frame < T.s1925 ? 1000 : 1260} y={frame < T.s1925 ? 655 : 640} textAnchor="middle" fontFamily={COND} fontWeight={600} fontSize={48} letterSpacing="6" fill="#BFE0E5" opacity={0.85} transform={`rotate(-6 ${frame < T.s1925 ? 1000 : 1260} ${frame < T.s1925 ? 655 : 640})`}>
          COLORADO RIVER
        </text>

        {/* Bright Angel Trail (Havasupai route, then Cameron's toll road) */}
        {ba ? <path d={ba} fill="none" stroke={C.cream} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" /> : null}
        <circle cx={GARDENS[0]} cy={GARDENS[1]} r={baP > 0.6 ? 12 : 0} fill={C.cream} />
        <Label x={GARDENS[0] + 30} y={GARDENS[1] + 10} at={T.s1903 + 30} to={T.s1919} size={34} anchor="start">
          HAVASUPAI GARDENS
        </Label>
        <Label x={BA_TH[0] + 110} y={BA_TH[1] + 44} at={T.s1903 + 10} to={T.s1919} size={50} anchor="start">
          BRIGHT ANGEL TRAIL
        </Label>
        <Gate at={BA_TH} />
        <TollTag at={[BA_TH[0] + 150, BA_TH[1] - 120]} />
        <Label x={BA_TH[0] + 260} y={BA_TH[1] - 170} at={T.cameron} to={T.s1919} size={46} anchor="start" sub="miner">
          RALPH CAMERON
        </Label>

        {/* 1919: the canyon becomes a national park */}
        <Label x={1080} y={1000} at={T.park} to={T.court + 6} color={C.gold} size={104} sub="1919">
          NATIONAL PARK
        </Label>

        {/* 1920s: Cameron the senator keeps his gate */}
        <Label x={BA_TH[0] + 270} y={BA_TH[1] - 160} at={T.senate + 6} to={T.s1925 + 20} size={50} anchor="start" color={C.gold} sub="fighting the Park Service">
          SEN. CAMERON
        </Label>

        {/* 1924–25: the Park Service's own trail, the South Kaibab */}
        {sk ? <path d={sk} fill="none" stroke={C.gold} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /> : null}
        {skP > 0 && skP < 1 ? <circle cx={hiker[0]} cy={hiker[1]} r={14} fill={C.sun} stroke={C.plum} strokeWidth={4} /> : null}
        <Label x={1555} y={1110} at={T.built + 4} to={T.s1928 + 12} size={54} color={C.gold} anchor="end" sub="near Yaki Point">
          SOUTH KAIBAB TRAIL
        </Label>
        <Label x={1530} y={900} at={T.dedicated} to={T.s1928 + 12} size={54} anchor="end" sub="Park Service trail">
          DEDICATED 1925
        </Label>

        {/* 1928: the Park Service takes over Bright Angel */}
        <Label x={460} y={990} at={T.s1928 + 24} to={Infinity} size={80} anchor="start" sub="Park Service from 1928">
          BRIGHT ANGEL
        </Label>
        <Label x={1590} y={1130} at={T.s1928 + 24} to={Infinity} size={80} anchor="end" color={C.gold} sub="Park Service, 1925">
          SOUTH KAIBAB
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
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 200, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Slam delay={from} style={{ fontSize: bigSize, lineHeight: 0.9, color: C.gold, letterSpacing: "0.01em", textShadow: "0 6px 30px rgba(10,4,14,0.6)" }}>
        {big}
      </Slam>
      {sub ? (
        <Rise delay={from + 6} dist={24} style={{ marginTop: 18, fontSize: 54, lineHeight: 1.05, color: C.cream, width: 860, textShadow: "0 4px 20px rgba(10,4,14,0.7)" }}>
          {sub}
        </Rise>
      ) : null}
      {sub2 && sub2At !== undefined ? (
        <Rise delay={sub2At} dist={20} style={{ marginTop: 14, fontSize: 46, lineHeight: 1.05, color: C.muted, width: 860, textShadow: "0 4px 20px rgba(10,4,14,0.7)" }}>
          {sub2}
        </Rise>
      ) : null}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= T.older) return null;
  const out = interpolate(frame, [T.older - 6, T.older], [1, 0], clamp);
  const line = { fontSize: 132, lineHeight: 0.92, color: C.gold, textShadow: "0 6px 30px rgba(10,4,14,0.65)" };
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 200, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Rise delay={2} dist={18} style={{ fontSize: 44, fontWeight: 600, letterSpacing: "0.2em", color: C.cream, textShadow: "0 4px 20px rgba(10,4,14,0.8)" }}>
        Grand Canyon
      </Rise>
      <Slam delay={6} style={line}>
        This trail exists
      </Slam>
      <Slam delay={fr(1900)} style={line}>
        because of
      </Slam>
      <Slam delay={fr(2400)} from={2.4} style={{ ...line, color: C.sun }}>
        a $1 toll
      </Slam>
    </AbsoluteFill>
  );
};

const Stamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shake = useShake([T.ruled], 22);
  if (frame < T.ruled || frame >= T.senate + 4) return null;
  const s = spring({ frame: frame - T.ruled, fps, config: { damping: 12, stiffness: 260, mass: 0.7 } });
  const out = interpolate(frame, [T.senate - 4, T.senate + 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: shake, alignItems: "center", justifyContent: "center", paddingTop: 80, opacity: out }}>
      <div
        style={{
          transform: `rotate(-8deg) scale(${interpolate(s, [0, 1], [2.4, 1]).toFixed(3)})`,
          border: `10px solid ${C.amber}`,
          borderRadius: 18,
          padding: "10px 34px 4px",
          color: C.amber,
          fontFamily: COND,
          fontWeight: 700,
          fontSize: 124,
          lineHeight: 1,
          textTransform: "uppercase",
          backgroundColor: "rgba(20,8,26,0.6)",
        }}
      >
        Claim invalid
      </div>
    </AbsoluteFill>
  );
};

const MapNote: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.s1903 || frame >= T.today) return null;
  const o = Math.min(interpolate(frame, [T.s1903, T.s1903 + 15], [0, 1], clamp), interpolate(frame, [T.today - 10, T.today], [1, 0], clamp));
  return (
    <div style={{ position: "absolute", left: 70, top: 1212, opacity: o * 0.8, fontFamily: BODY, fontWeight: 500, fontSize: 24, color: C.cream }}>
      Illustration, not to scale · north up
    </div>
  );
};

const ClosureNote: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.today + 20 || frame >= T.end) return null;
  const o = Math.min(interpolate(frame, [T.today + 20, T.today + 32], [0, 1], clamp), interpolate(frame, [T.end - 8, T.end], [1, 0], clamp));
  return (
    <AbsoluteFill style={{ alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", top: 1120, backgroundColor: "rgba(20,8,26,0.85)", borderRadius: 14, padding: "10px 24px 8px", fontFamily: BODY, fontWeight: 700, fontSize: 32, color: C.cream }}>
        Flood closures in the inner canyon now: <span style={{ color: C.gold }}>check nps.gov/grca</span>
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
          Permit dates + reminders,
          <br />
          free:
        </Rise>
        <Slam delay={T.end + 12} from={1.6} style={{ marginTop: 28 }}>
          <div style={{ backgroundColor: C.gold, color: C.plum, borderRadius: 999, padding: "18px 50px", fontSize: 84, letterSpacing: "0.03em", textTransform: "none" }}>
            trailbrief.app
          </div>
        </Slam>
        <Rise delay={T.end + 20} dist={10} style={{ marginTop: 46, fontFamily: BODY, fontWeight: 500, fontSize: 28, textTransform: "none", color: C.muted, lineHeight: 1.4, width: 820 }}>
          Independent planning service. You apply yourself.
          <br />
          Not affiliated with Recreation.gov or NPS.
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GrandCanyonToll: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.plum }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.sub} 55%, #6A3A3E 100%)` }} />
      <Topo opacity={0.5} />
      <World />
      <PhotoScene src="grand-canyon-south-kaibab-sunset.jpg" from={0} to={T.older + 15} color focus="50% 50%" origin="50% 60%" zoom={[1.0, 1.08]}
        tag="South Kaibab Trail"
        credit="Photo: Grand Canyon South Kaibab Trail at sunset, 2011 · USGS / Thomas M. Gushue (public domain)" />
      <PhotoScene src="grand-canyon-bright-angel-2020.jpg" from={T.older} to={T.s1903 + 15} color focus="42% 50%" origin="40% 55%" zoom={[1.02, 1.1]}
        tag="Bright Angel Trail" sub="Loosely follows a Havasupai route" subAt={T.havasupai}
        credit="Photo: Bright Angel Trailhead, 2020 · NPS / Michael Quinn (public domain)" />
      <PhotoScene src="grand-canyon-bright-angel-2020.jpg" from={T.today} to={T.end + 12} color focus="55% 50%" origin="60% 50%" zoom={[1.1, 1.16]}
        credit="Photo: Bright Angel Trailhead, 2020 · NPS / Michael Quinn (public domain)" />
      <Hook />
      <Head from={T.s1903} to={T.s1919} big="1903" sub="A miner gates the Bright Angel Trail" sub2="and charges riders $1" sub2At={T.toll} />
      <Head from={T.s1919} to={T.court} big="1919" sub="Grand Canyon becomes a national park" />
      <Head from={T.court} to={T.s1925} big="1920" sub="U.S. Supreme Court rules against him" sub2="He ignores it, wins a U.S. Senate seat" sub2At={T.senate} />
      <Head from={T.s1925} to={T.s1928} big="1925" sub="Park Service dedicates its own trail" sub2="the South Kaibab" sub2At={T.kaibab} />
      <Head from={T.s1928} to={T.today} big="1928" sub="Park Service takes over Bright Angel" sub2="The $1 toll ends" sub2At={T.tookOver} />
      <Head from={T.today} to={T.end} big="Today" sub="Day hikes: no backcountry permit" sub2="Camping below the rim: permit required" sub2At={T.camping} />
      <Stamp />
      <MapNote />
      <ClosureNote />
      <EndCard />
      <Captions words={WORDS} hideFrom={T.end} y={1270} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
