import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BODY, C, COND, Grain, LogoMark, Rise, Slam, Topo, Vignette, clamp } from "../brand";

// "2 permit lotteries close by Tuesday" — text + original music (no voice, no AI label).
// Post: Thu Nov 26, 2026, 11 AM ET. Facts and sources: videos/2026-11/2026-11-26-two-lotteries-closing.facts.md
// (trailbrief-media). Every date was read on the official page (BLM, NPS, Recreation.gov) on Nov 26, 2026.
// Photos (public domain, trailbrief-media/library): The Wave (Bob Wick / BLM, 2012) and the
// South Kaibab Trail at sunset (USGS / Thomas M. Gushue, 2011). Between photos a step-by-step
// timeline carries each lottery. Safe zone for text: x 70–930, y 180–1420.

export const TWO_LOTTERIES_FRAMES = 1225; // 40.8 s

// Beats (frames, 30 fps)
const T = {
  hookTitle: 8,
  hookTitle2: 26,
  wave: 120, // Wave section starts (photo crossfades in from 105)
  waveDiag: 270, // photo gone, timeline starts
  waveChips: 370,
  gc: 560, // Grand Canyon section (photo crossfades in from 545)
  gcDiag: 710,
  gcChips: 810,
  gcFlood: 860,
  recap: 1010,
  end: 1115,
};
const FADE = 15;

const fadeWin = (frame: number, from: number, to: number, f = FADE) =>
  Math.min(interpolate(frame, [from, from + f], [0, 1], clamp), interpolate(frame, [to - f, to], [1, 0], clamp));

// ---------- photo pieces ----------
const GoldTag: React.FC<{ text: string; sub?: string; at: number; size?: number }> = ({ text, sub, at, size = 60 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 10], [0, 1], clamp);
  const s = interpolate(frame, [at + 8, at + 16], [0, 1], clamp);
  return (
    <div style={{ opacity: t, transform: `translateY(${((1 - t) * 14).toFixed(1)}px)` }}>
      <div style={{ display: "inline-block", backgroundColor: C.gold, color: C.plum, fontFamily: COND, fontWeight: 700, fontSize: size, textTransform: "uppercase", padding: "6px 24px 0", borderRadius: 10 }}>
        {text}
      </div>
      {sub ? (
        <div style={{ opacity: s }}>
          <div style={{ marginTop: 8, display: "inline-block", backgroundColor: "rgba(20,8,26,0.85)", padding: "6px 18px 2px", borderRadius: 8, fontFamily: COND, fontWeight: 600, fontSize: 42, color: C.cream, textTransform: "uppercase" }}>
            {sub}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Credit: React.FC<{ text: string; top: number; opacity?: number }> = ({ text, top, opacity = 1 }) => (
  <div style={{ position: "absolute", left: 70, top, maxWidth: 820, opacity, fontFamily: BODY, fontWeight: 500, fontSize: 23, color: "rgba(255,241,226,0.85)", textShadow: "0 2px 8px rgba(10,4,14,0.9)" }}>
    {text}
  </div>
);

const WAVE_CREDIT = "Photo: The Wave, 2012 · Bob Wick / BLM (public domain)";
const GC_CREDIT = "Photo: South Kaibab Trail at sunset, 2011 · USGS / Thomas M. Gushue (public domain)";

// Hook: The Wave on top, the Grand Canyon below, both pushing in slowly
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= T.wave) return null;
  const o = interpolate(frame, [T.wave - FADE, T.wave], [1, 0], clamp);
  const z = interpolate(frame, [0, T.wave], [1.0, 1.07], clamp);
  const line = { fontSize: 150, lineHeight: 0.9, color: C.gold, textShadow: "0 6px 30px rgba(10,4,14,0.75)" };
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: C.plum }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 980, overflow: "hidden" }}>
        <Img src={staticFile("library/the-wave-pool-blm-2012.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", filter: "saturate(1.05) contrast(1.04)", transform: `scale(${z.toFixed(4)})`, transformOrigin: "50% 60%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 980, width: 1080, height: 940, overflow: "hidden" }}>
        <Img src={staticFile("library/grand-canyon-south-kaibab-sunset.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 50%", filter: "brightness(1.45) saturate(1.1) contrast(1.05)", transform: `scale(${(z * 1.45).toFixed(4)})`, transformOrigin: "62% 62%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 972, width: 1080, height: 16, backgroundColor: C.plum }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,8,26,0.92) 0%, rgba(20,8,26,0.55) 28%, rgba(20,8,26,0) 42%, rgba(20,8,26,0) 80%, rgba(20,8,26,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: 70, top: 790 }}>
        <GoldTag text="The Wave" at={20} size={56} />
      </div>
      <Credit text={WAVE_CREDIT} top={900} opacity={interpolate(frame, [20, 30], [0, 1], clamp)} />
      <div style={{ position: "absolute", left: 70, top: 1030 }}>
        <GoldTag text="Grand Canyon" at={30} size={56} />
      </div>
      <Credit text={GC_CREDIT} top={1370} opacity={interpolate(frame, [30, 40], [0, 1], clamp)} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 190, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
        <Rise delay={2} dist={18} style={{ fontSize: 44, fontWeight: 600, letterSpacing: "0.2em", color: C.cream, textShadow: "0 4px 20px rgba(10,4,14,0.9)" }}>
          Permit deadlines
        </Rise>
        <Slam delay={T.hookTitle} style={line}>
          2 lotteries
        </Slam>
        <Slam delay={T.hookTitle + 8} style={line}>
          close by
        </Slam>
        <Slam delay={T.hookTitle2} from={2.3} style={{ ...line, color: C.sun }}>
          Tuesday
        </Slam>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// The Wave photo (1000 px wide): an archive-style print over a blurred copy
const WavePhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.wave - FADE;
  const to = T.waveDiag;
  if (frame < from || frame >= to) return null;
  const o = fadeWin(frame, from, to);
  const z = interpolate(frame, [from, to], [1.0, 1.07], clamp);
  const file = staticFile("library/the-wave-pool-blm-2012.jpg");
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ backgroundColor: C.plum }}>
        <Img src={file} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.45)", transform: "scale(1.2)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 700, width: 840, padding: "14px 14px 0", backgroundColor: C.cream, boxShadow: "0 30px 80px rgba(8,2,12,0.6)", transform: "rotate(-1.5deg)" }}>
        <div style={{ overflow: "hidden" }}>
          <Img src={file} style={{ width: "100%", display: "block", transform: `scale(${z.toFixed(4)})`, transformOrigin: "45% 55%" }} />
        </div>
        <div style={{ padding: "8px 4px 10px", fontFamily: BODY, fontWeight: 500, fontSize: 20, lineHeight: 1.3, color: C.sub }}>{WAVE_CREDIT}</div>
        <div style={{ position: "absolute", left: -18, top: -50, transform: "rotate(-2deg)" }}>
          <GoldTag text="Coyote Buttes North" sub="Arizona · managed by BLM" at={T.wave + 6} size={58} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Grand Canyon photo (2400 px): full screen, gently brightened (the original is dusk-dark)
const CanyonPhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.gc - FADE;
  const to = T.gcDiag;
  if (frame < from || frame >= to) return null;
  const o = fadeWin(frame, from, to);
  const z = interpolate(frame, [from, to], [1.04, 1.12], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.plum }}>
        <Img src={staticFile("library/grand-canyon-south-kaibab-sunset.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 50%", filter: "brightness(1.45) saturate(1.1) contrast(1.05)", transform: `scale(${z.toFixed(4)})`, transformOrigin: "60% 55%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,8,26,0.88) 0%, rgba(20,8,26,0.25) 30%, rgba(20,8,26,0) 50%, rgba(20,8,26,0.35) 72%, rgba(20,8,26,0.85) 100%)" }} />
      <div style={{ position: "absolute", left: 70, top: 1040 }}>
        <GoldTag text="Grand Canyon" sub="Backcountry camping permits" at={T.gc + 6} size={64} />
      </div>
      <Credit text={GC_CREDIT} top={1250} />
    </AbsoluteFill>
  );
};

// ---------- headlines (top of the frame) ----------
const Head: React.FC<{ from: number; to: number; big: string; sub: string; bigSize?: number }> = ({ from, to, big, sub, bigSize = 150 }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const out = interpolate(frame, [to - 10, to], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", paddingTop: 190, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
      <Slam delay={from} from={1.5} style={{ fontSize: bigSize, lineHeight: 0.9, color: C.gold, textShadow: "0 6px 30px rgba(10,4,14,0.7)" }}>
        {big}
      </Slam>
      <Rise delay={from + 6} dist={24} style={{ marginTop: 14, fontSize: 54, lineHeight: 1.05, color: C.cream, width: 860, textShadow: "0 4px 20px rgba(10,4,14,0.8)" }}>
        {sub}
      </Rise>
    </AbsoluteFill>
  );
};

// ---------- the diagram: a vertical timeline that draws itself ----------
type Step = { date: string; text: string; gold?: boolean; icon?: "pen" | "dice" | "boot" };
const STEP_GAP = 150;
const Timeline: React.FC<{ from: number; to: number; steps: Step[]; top?: number }> = ({ from, to, steps, top = 470 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const o = fadeWin(frame, from, to, 10);
  const x = 128;
  const lineEnd = top + STEP_GAP * (steps.length - 1);
  const draw = interpolate(frame, [from + 6, from + 6 + 30 * (steps.length - 1)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <line x1={x} y1={top} x2={x} y2={lineEnd} stroke={C.muted} strokeOpacity={0.25} strokeWidth={8} strokeLinecap="round" />
        <line x1={x} y1={top} x2={x} y2={top + (lineEnd - top) * draw} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
        {steps.map((s, i) => {
          const at = from + 6 + 30 * i;
          const p = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
          return (
            <g key={i} transform={`translate(${x} ${top + STEP_GAP * i}) scale(${p.toFixed(3)})`}>
              <circle r={30} fill={i === steps.length - 1 ? C.gold : C.plum} stroke={C.gold} strokeWidth={6} />
              <text y={11} textAnchor="middle" fontFamily={COND} fontWeight={700} fontSize={34} fill={i === steps.length - 1 ? C.plum : C.gold}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {steps.map((s, i) => {
        const at = from + 10 + 30 * i;
        return (
          <Rise key={i} delay={at} dist={20} style={{ position: "absolute", left: 190, top: top + STEP_GAP * i - 46, width: 740 }}>
            <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 64, lineHeight: 1, textTransform: "uppercase", color: s.gold ? C.gold : C.cream }}>{s.date}</div>
            <div style={{ marginTop: 6, fontFamily: BODY, fontWeight: 700, fontSize: 36, lineHeight: 1.2, color: C.muted }}>{s.text}</div>
          </Rise>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- fact chips under the timeline ----------
const Chip: React.FC<{ at: number; to: number; top: number; children: React.ReactNode; tone?: "gold" | "plain" | "warn" }> = ({ at, to, top, children, tone = "plain" }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame >= to) return null;
  const o = interpolate(frame, [to - 10, to], [1, 0], clamp);
  const bg = tone === "gold" ? C.gold : tone === "warn" ? "rgba(233,162,59,0.16)" : "rgba(255,241,226,0.08)";
  const fg = tone === "gold" ? C.plum : C.cream;
  const border = tone === "warn" ? `3px solid ${C.amber}` : tone === "plain" ? "2px solid rgba(255,241,226,0.18)" : "none";
  return (
    <div style={{ position: "absolute", left: 70, top, width: 860, opacity: o }}>
      <Rise delay={at} dist={22}>
        <div style={{ backgroundColor: bg, color: fg, border, borderRadius: 18, padding: tone === "warn" ? "16px 26px 14px" : "14px 26px 10px", fontFamily: tone === "warn" ? BODY : COND, fontWeight: 700, fontSize: tone === "gold" ? 60 : tone === "warn" ? 31 : 48, lineHeight: tone === "warn" ? 1.3 : 1.05, textTransform: tone === "warn" ? "none" : "uppercase" }}>
          {children}
        </div>
      </Rise>
    </div>
  );
};

// ---------- recap ----------
const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.recap - 10 || frame >= T.end + 6) return null;
  const o = Math.min(interpolate(frame, [T.recap - 10, T.recap], [0, 1], clamp), interpolate(frame, [T.end - 4, T.end + 6], [1, 0], clamp));
  const Row: React.FC<{ at: number; name: string; when: string }> = ({ at, name, when }) => (
    <Rise delay={at} dist={22} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 34 }}>
      <svg width={74} height={74} viewBox="0 0 74 74">
        <rect x={4} y={4} width={66} height={66} rx={14} fill="none" stroke={C.gold} strokeWidth={6} />
        <path d="M20 38 L32 50 L55 24" fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={60} strokeDashoffset={interpolate(frame, [at + 8, at + 18], [60, 0], clamp)} />
      </svg>
      <div>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 72, lineHeight: 1, color: C.cream, textTransform: "uppercase" }}>{name}</div>
        <div style={{ marginTop: 4, fontFamily: COND, fontWeight: 600, fontSize: 50, lineHeight: 1.05, color: C.gold, textTransform: "uppercase" }}>{when}</div>
      </div>
    </Rise>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 70, top: 300, width: 860 }}>
        <Slam delay={T.recap} from={1.4} style={{ fontFamily: COND, fontWeight: 700, fontSize: 110, lineHeight: 0.95, color: C.gold, textTransform: "uppercase" }}>
          Apply on Recreation.gov
        </Slam>
        <div style={{ marginTop: 30 }}>
          <Row at={T.recap + 10} name="The Wave" when="Last day: Mon, Nov 30" />
          <Row at={T.recap + 22} name="Grand Canyon" when="By Tue, Dec 1, 5 PM MST" />
        </div>
        <Rise delay={T.recap + 40} dist={14} style={{ marginTop: 56, fontFamily: BODY, fontWeight: 700, fontSize: 34, lineHeight: 1.3, color: C.muted }}>
          Missed them? The next windows open in December.
        </Rise>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.end - 4) return null;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 260, textAlign: "center", fontFamily: COND, fontWeight: 700, textTransform: "uppercase" }}>
        <Rise delay={T.end} dist={30}>
          <LogoMark size={190} />
        </Rise>
        <Rise delay={T.end + 4} dist={24} style={{ marginTop: 34, fontSize: 70, color: C.cream, lineHeight: 1.02, width: 860 }}>
          Free permit calendar
          <br />+ reminders:
        </Rise>
        <Slam delay={T.end + 12} from={1.6} style={{ marginTop: 28 }}>
          <div style={{ backgroundColor: C.gold, color: C.plum, borderRadius: 999, padding: "18px 50px", fontSize: 84, letterSpacing: "0.03em", textTransform: "none" }}>
            trailbrief.app
          </div>
        </Slam>
        <Rise delay={T.end + 20} dist={10} style={{ marginTop: 46, fontFamily: BODY, fontWeight: 500, fontSize: 28, textTransform: "none", color: C.muted, lineHeight: 1.4, width: 820 }}>
          Independent planning service. You apply yourself.
          <br />
          Not affiliated with Recreation.gov, BLM or NPS.
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Small source line on the diagram scenes
const SourceNote: React.FC<{ from: number; to: number; text: string }> = ({ from, to, text }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 1385, opacity: fadeWin(frame, from, to, 10) * 0.8, fontFamily: BODY, fontWeight: 500, fontSize: 23, color: C.cream }}>
      {text}
    </div>
  );
};

export const TwoLotteries: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.plum }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.plum} 0%, ${C.sub} 60%, #6A3A3E 100%)` }} />
      <Topo opacity={0.55} />

      {/* Lottery 1: The Wave */}
      <WavePhoto />
      <Head from={T.wave} to={T.gc} big="The Wave" sub="Permits for March 2027 hikes" />
      <Timeline
        from={T.waveDiag - 6}
        to={T.gc}
        steps={[
          { date: "Nov 1–30", text: "Advance lottery on Recreation.gov", gold: true },
          { date: "Dec 1", text: "Lottery runs · results by email" },
          { date: "March 2027", text: "Your hike, if you're picked" },
        ]}
      />
      <Chip at={T.waveChips} to={T.gc} top={900} tone="gold">Last day: Mon, Nov 30</Chip>
      <Chip at={T.waveChips + 20} to={T.gc} top={1010}>$6 to apply · $7/person if you win</Chip>
      <Chip at={T.waveChips + 40} to={T.gc} top={1100}>Up to 3 dates · groups up to 6</Chip>
      <Chip at={T.waveChips + 60} to={T.gc} top={1190}>Up to 48 people a day via this lottery</Chip>
      <SourceNote from={T.waveDiag} to={T.gc} text="Source: BLM + Recreation.gov, checked Nov 26, 2026" />

      {/* Lottery 2: Grand Canyon backcountry */}
      <CanyonPhoto />
      <Head from={T.gc} to={T.recap - 10} big="Grand Canyon" sub="Backcountry trips starting April 2027" bigSize={140} />
      <Timeline
        from={T.gcDiag - 6}
        to={T.recap - 10}
        steps={[
          { date: "Nov 16 – Dec 1", text: "Early access lottery on Recreation.gov", gold: true },
          { date: "Dec 2", text: "Winners get a time slot to book" },
          { date: "April 2027", text: "Trips that start in April" },
        ]}
      />
      <Chip at={T.gcChips} to={T.recap - 10} top={900} tone="gold">Closes Tue, Dec 1 · 5 PM MST</Chip>
      <Chip at={T.gcChips + 24} to={T.recap - 10} top={1020}>$10 to apply · day hikes need no permit</Chip>
      <Chip at={T.gcFlood} to={T.recap - 10} top={1125} tone="warn">
        <span style={{ color: C.gold }}>Flood closures (Aug 29 flash flood):</span> Bright Angel and Cottonwood campgrounds are closed and not in the lotteries. Phantom Ranch, the North Kaibab Trail and both river bridges are closed too. <span style={{ color: C.gold }}>Check nps.gov/grca</span>
      </Chip>
      <SourceNote from={T.gcDiag} to={T.recap - 10} text="Source: NPS + Recreation.gov, checked Nov 26, 2026" />

      <Hook />
      <Recap />
      <EndCard />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
