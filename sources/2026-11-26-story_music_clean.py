"""CLEAN VARIANT (Nov 26, 2026): no shaker hiss and no noise swell on hits; Bryce heard them as
scratching when the music played alone. Otherwise identical to story_music.py.
Original background bed for Trailbrief story videos (narrated, AI voice).

Calmer than the intro track: 84 BPM, D minor, i-VI-III-VII (Dm Bb F C),
pad + plucked arpeggio, a soft pulse from bar 3, optional low "hits" on
story beats, and a final Dm chord that rings out under the end card.
Everything is synthesized here (numpy/scipy) and seeded, so each track is
original and rebuilds identically. Nothing to get copyright-claimed.

Usage:
  python3 audio/story_music.py out.wav --seconds 42.5 [--seed 11] [--hits 22.96,30.1]
"""
import argparse
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, lfilter, sosfilt

ap = argparse.ArgumentParser()
ap.add_argument("out")
ap.add_argument("--seconds", type=float, required=True)
ap.add_argument("--seed", type=int, default=11)
ap.add_argument("--hits", default="", help="comma-separated times (s) for soft low hits")
args = ap.parse_args()

SR = 48000
BPM = 84
BEAT = 60 / BPM
BAR = 4 * BEAT
TOTAL = args.seconds
N = int(TOTAL * SR)
rng = np.random.default_rng(args.seed)

L = np.zeros(N)
R = np.zeros(N)
L_wet = np.zeros(N)
R_wet = np.zeros(N)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, t, gain=1.0, pan=0.0, wet=0.0):
    i = int(round(t * SR))
    if i >= N or i < 0:
        return
    n = min(len(sig), N - i)
    s = sig[:n] * gain
    lg = np.cos((pan + 1) * np.pi / 4)
    rg = np.sin((pan + 1) * np.pi / 4)
    L[i : i + n] += s * lg
    R[i : i + n] += s * rg
    if wet:
        L_wet[i : i + n] += s * lg * wet
        R_wet[i : i + n] += s * rg * wet


def lowpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype="low", fs=SR, output="sos"), x)


def highpass(x, fc, order=2):
    return sosfilt(butter(order, fc, btype="high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def env(n, a, r):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.minimum(1, t / max(a, 1e-4))
    return e * np.clip((dur - t) / max(r, 1e-4), 0, 1)


def pad_note(f, dur, bright):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    roll = 2.3 - 0.9 * bright
    for det in (-0.1, 0.0, 0.09):
        fd = f * 2 ** (det / 12)
        ph = rng.uniform(0, 2 * np.pi)
        for k in range(1, int(min(36, 6000 / fd)) + 1):
            out += np.sin(2 * np.pi * k * fd * t + ph * k) / k**roll
    out = lowpass(out / 3, 1800 + 2500 * bright)
    return out * env(n, 0.8, 0.9)


def pluck(f, dur=1.4, bright=0.5):
    n = int(dur * SR)
    p = max(2, int(round(SR / f)))
    x = np.zeros(n)
    x[:p] = lowpass(rng.uniform(-1, 1, p), 2000 + 5000 * bright, 1)
    a = np.zeros(p + 2)
    a[0] = 1.0
    a[p] = -0.498
    a[p + 1] = -0.498
    y = lfilter([1.0], a, x) * np.exp(-np.arange(n) / SR * 1.8)
    return y * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))


def bass_note(f, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    return y * env(n, 0.02, 0.3)


def soft_kick(level=1.0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    freq = 42 + 60 * np.exp(-t / 0.04)
    y = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.2)
    return lowpass(y, 300) * level


def shaker():
    n = int(0.08 * SR)
    t = np.arange(n) / SR
    e = np.minimum(t / 0.01, 1) * np.exp(-np.maximum(t - 0.01, 0) / 0.025)
    return bandpass(rng.uniform(-1, 1, n), 5000, 11000) * e


def swell(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return highpass(rng.uniform(-1, 1, n), 4000) * np.exp(-t / 0.9) * np.minimum(1, t / 0.02)


CHORDS = [
    {"pad": [50, 57, 62, 65], "bass": 38, "arp": [62, 65, 69, 74]},  # Dm
    {"pad": [46, 53, 58, 62], "bass": 34, "arp": [62, 65, 70, 74]},  # Bb
    {"pad": [45, 53, 57, 60], "bass": 41, "arp": [60, 65, 69, 72]},  # F
    {"pad": [48, 55, 60, 64], "bass": 36, "arp": [60, 64, 67, 72]},  # C
]
ARP = [0, 2, 1, 3, 2, 1, 3, 2]

final_t = max(0.0, TOTAL - 2.8)  # final chord rings under the end card
bars = int(np.ceil(final_t / BAR))
for b in range(bars):
    t0 = b * BAR
    if t0 >= final_t:
        break
    ch = CHORDS[b % 4]
    early = b < 2
    for i, m in enumerate(ch["pad"]):
        add(pad_note(midi(m), min(BAR + 0.9, final_t - t0 + 0.9), 0.2 if early else 0.4), t0, 0.07, pan=-0.5 + i / 3, wet=0.6)
    step = BEAT if early else BEAT / 2
    count = 4 if early else 8
    for k in range(count):
        tk = t0 + k * step
        if tk >= final_t:
            break
        m = ch["arp"][ARP[k % 8]]
        add(pluck(midi(m), 1.5, 0.4 if early else 0.55), tk, 0.22 * (1.0 if k % 2 == 0 else 0.8), pan=0.3 if k % 2 else -0.3, wet=0.4)
    if not early:
        for beat in (0, 2):
            if t0 + beat * BEAT < final_t:
                add(soft_kick(), t0 + beat * BEAT, 0.28)
        add(bass_note(midi(ch["bass"]), min(BAR, final_t - t0)), t0, 0.12)

for h in [float(x) for x in args.hits.split(",") if x.strip()]:
    add(soft_kick(1.4), h, 0.5)

# final Dm chord
add(bass_note(midi(38), TOTAL - final_t), final_t, 0.12)
for i, m in enumerate(CHORDS[0]["pad"]):
    add(pad_note(midi(m), TOTAL - final_t, 0.45), final_t, 0.06, pan=-0.5 + i / 3, wet=0.6)
for i, m in enumerate([62, 65, 69, 74, 77]):
    add(pluck(midi(m), 2.2, 0.6), final_t + i * 0.035, 0.15, pan=-0.4 + i * 0.2, wet=0.5)

# reverb + master
ir_len = int(2.4 * SR)
ti = np.arange(ir_len) / SR
irL = lowpass(rng.uniform(-1, 1, ir_len), 5500) * np.exp(-ti / 0.6)
irR = lowpass(rng.uniform(-1, 1, ir_len), 5500) * np.exp(-ti / 0.6)
irL[: int(0.025 * SR)] = 0
irR[: int(0.025 * SR)] = 0
irL /= np.sqrt(np.sum(irL**2))
irR /= np.sqrt(np.sum(irR**2))
L += fftconvolve(L_wet, irL)[:N] * 0.7
R += fftconvolve(R_wet, irR)[:N] * 0.7

mix = np.stack([L, R], axis=1)
mix = highpass(mix.T, 30, 2).T
fade = np.ones(N)
fs = int(1.2 * SR)
fade[-fs:] = np.linspace(1, 0, fs) ** 1.5
fi = int(0.3 * SR)
fade[:fi] = np.linspace(0, 1, fi)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / 0.75
mix = np.tanh(1.2 * mix) / np.tanh(1.2) * 0.7

pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(args.out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", args.out, f"{TOTAL:.2f}s", "peak", float(np.max(np.abs(mix))))
