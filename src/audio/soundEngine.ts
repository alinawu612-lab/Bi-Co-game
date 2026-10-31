/**
 * Multi-Track Lofi Girl Hip-Hop ("Beats to Relax / Study To") & Cozy Sound Engine
 * Changes to a brand-new Lofi Hip-Hop beat after each mission is completed!
 */

export interface LofiTrackConfig {
  id: number;
  name: string;
  base16thMs: number; // Controls BPM
  swingRatio: number;
  filterCutoff: number;
  chords: Array<{ bass: number; notes: number[] }>;
  leadMelody: Record<number, number>;
  kickSteps: number[];
  snareSteps: number[];
}

export const LOFI_TRACKS: LofiTrackConfig[] = [
  {
    id: 0,
    name: 'Beat 1 · Midnight Study Desk',
    base16thMs: 195, // ~77 BPM
    swingRatio: 1.22,
    filterCutoff: 820,
    chords: [
      { bass: 73.42, notes: [293.66, 349.23, 440.0, 523.25, 659.25] }, // Dm9
      { bass: 98.0, notes: [246.94, 349.23, 392.0, 440.0, 659.25] }, // G13
      { bass: 65.41, notes: [261.63, 329.63, 392.0, 493.88, 587.33] }, // Cmaj9
      { bass: 110.0, notes: [277.18, 349.23, 440.0, 523.25, 659.25] }, // A7alt
    ],
    leadMelody: {
      0: 659.25, 3: 587.33, 6: 523.25, 10: 440.0,
      16: 659.25, 19: 783.99, 22: 659.25, 26: 587.33,
      32: 523.25, 35: 493.88, 38: 440.0, 42: 392.0,
      48: 440.0, 51: 523.25, 54: 587.33, 58: 523.25,
    },
    kickSteps: [0, 7, 10],
    snareSteps: [4, 12],
  },
  {
    id: 1,
    name: 'Beat 2 · Sprouting Meadow Tape',
    base16thMs: 182, // ~82 BPM
    swingRatio: 1.26,
    filterCutoff: 960,
    chords: [
      { bass: 87.31, notes: [261.63, 329.63, 392.0, 440.0, 523.25] }, // Fmaj9
      { bass: 82.41, notes: [246.94, 293.66, 392.0, 493.88, 587.33] }, // Em7(add11)
      { bass: 73.42, notes: [261.63, 293.66, 349.23, 440.0, 523.25] }, // Dm9
      { bass: 65.41, notes: [261.63, 329.63, 392.0, 493.88, 587.33] }, // Cmaj9
    ],
    leadMelody: {
      0: 523.25, 2: 659.25, 6: 783.99, 12: 659.25,
      16: 587.33, 18: 659.25, 22: 493.88, 28: 523.25,
      32: 440.0, 36: 523.25, 40: 587.33, 44: 659.25,
      48: 783.99, 52: 659.25, 56: 523.25, 60: 493.88,
    },
    kickSteps: [0, 3, 8, 11],
    snareSteps: [4, 12],
  },
  {
    id: 2,
    name: 'Beat 3 · Golden Harvest Bounce',
    base16thMs: 174, // ~86 BPM
    swingRatio: 1.28,
    filterCutoff: 900,
    chords: [
      { bass: 77.78, notes: [311.13, 392.0, 466.16, 587.33, 698.46] }, // Ebmaj9
      { bass: 73.42, notes: [293.66, 349.23, 440.0, 523.25, 659.25] }, // Dm7
      { bass: 65.41, notes: [261.63, 311.13, 392.0, 466.16, 587.33] }, // Cm9
      { bass: 87.31, notes: [261.63, 349.23, 440.0, 523.25, 698.46] }, // F13
    ],
    leadMelody: {
      0: 698.46, 4: 587.33, 7: 466.16, 11: 587.33,
      16: 659.25, 20: 523.25, 24: 440.0, 28: 523.25,
      32: 587.33, 35: 466.16, 39: 392.0, 43: 466.16,
      48: 523.25, 52: 587.33, 56: 698.46, 60: 783.99,
    },
    kickSteps: [0, 6, 9, 14],
    snareSteps: [4, 12],
  },
  {
    id: 3,
    name: 'Beat 4 · Haverford Squirrel Stroll',
    base16thMs: 204, // ~73 BPM
    swingRatio: 1.24,
    filterCutoff: 780,
    chords: [
      { bass: 110.0, notes: [261.63, 329.63, 392.0, 493.88, 587.33] }, // Am9
      { bass: 73.42, notes: [293.66, 349.23, 440.0, 523.25, 659.25] }, // Dm9
      { bass: 98.0, notes: [246.94, 349.23, 392.0, 493.88, 659.25] }, // G13
      { bass: 65.41, notes: [261.63, 329.63, 392.0, 493.88, 659.25] }, // Cmaj9
    ],
    leadMelody: {
      0: 493.88, 3: 523.25, 7: 659.25, 11: 587.33,
      16: 523.25, 19: 587.33, 23: 659.25, 27: 440.0,
      32: 493.88, 36: 587.33, 40: 659.25, 44: 783.99,
      48: 659.25, 51: 587.33, 55: 523.25, 59: 493.88,
    },
    kickSteps: [0, 7, 8, 11],
    snareSteps: [4, 12],
  },
  {
    id: 4,
    name: 'Beat 5 · Bryn Mawr Owl Sanctuary',
    base16thMs: 188, // ~79 BPM
    swingRatio: 1.25,
    filterCutoff: 920,
    chords: [
      { bass: 58.27, notes: [233.08, 293.66, 349.23, 440.0, 523.25] }, // Bbmaj9
      { bass: 110.0, notes: [261.63, 329.63, 392.0, 493.88, 587.33] }, // Am7
      { bass: 98.0, notes: [233.08, 293.66, 349.23, 440.0, 587.33] }, // Gm9
      { bass: 65.41, notes: [261.63, 329.63, 392.0, 493.88, 659.25] }, // Cmaj9
    ],
    leadMelody: {
      0: 587.33, 2: 659.25, 5: 698.46, 9: 587.33,
      16: 523.25, 19: 587.33, 23: 659.25, 27: 523.25,
      32: 440.0, 35: 523.25, 39: 587.33, 43: 659.25,
      48: 698.46, 52: 659.25, 56: 587.33, 60: 523.25,
    },
    kickSteps: [0, 2, 7, 10],
    snareSteps: [4, 12],
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private musicPlaying: boolean = false;
  private lofiTimerId: number | null = null;
  private vinylNode: AudioNode | null = null;
  private step16: number = 0;
  private currentTrackIndex: number = 0;

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    if (mute) {
      this.stopLofiMusic();
    } else {
      this.startLofiMusic();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getCurrentTrack(): LofiTrackConfig {
    return LOFI_TRACKS[this.currentTrackIndex] || LOFI_TRACKS[0];
  }

  /** Switches to a new Lofi Girl Hip-Hop track (e.g. after completing a mission!) */
  public setTrack(trackIndex: number) {
    const nextIdx = ((trackIndex % LOFI_TRACKS.length) + LOFI_TRACKS.length) % LOFI_TRACKS.length;
    if (nextIdx === this.currentTrackIndex && this.musicPlaying) return;
    this.currentTrackIndex = nextIdx;
    this.step16 = 0;
    if (!this.muted) {
      if (this.lofiTimerId !== null) {
        clearTimeout(this.lofiTimerId);
        this.lofiTimerId = null;
      }
      this.musicPlaying = false;
      this.startLofiMusic();
    }
  }

  public nextTrack(): LofiTrackConfig {
    this.setTrack(this.currentTrackIndex + 1);
    return this.getCurrentTrack();
  }

  public startLofiMusic() {
    if (this.muted || this.musicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.musicPlaying = true;
    this.startVinylCrackle(ctx);

    const scheduleNextStep = () => {
      if (this.muted || !this.musicPlaying) return;
      const audioCtx = this.getContext();
      if (!audioCtx) return;

      const track = LOFI_TRACKS[this.currentTrackIndex] || LOFI_TRACKS[0];
      const s64 = this.step16 % 64;
      const barStep = this.step16 % 16;
      const chordIdx = Math.floor(s64 / 16);
      const currentChord = track.chords[chordIdx];

      // 1. Warm Rhodes Jazz Chord
      if (barStep === 0) {
        this.playWarmRhodes(audioCtx, currentChord.notes, 3.0, 0.022, track.filterCutoff);
      } else if (barStep === 10) {
        this.playWarmRhodes(audioCtx, currentChord.notes, 1.1, 0.012, track.filterCutoff);
      }

      // 2. Deep Sub-Bass Groove
      if (barStep === 0) {
        this.playSubBass(audioCtx, currentChord.bass, 0.72);
      } else if (barStep === 7) {
        this.playSubBass(audioCtx, currentChord.bass * 1.5, 0.32);
      } else if (barStep === 10) {
        this.playSubBass(audioCtx, currentChord.bass, 0.52);
      }

      // 3. Boom-Bap Lofi Kick Drum
      if (track.kickSteps.includes(barStep)) {
        this.playBoomBapKick(audioCtx, barStep === 0 ? 0.14 : 0.09);
      }

      // 4. Dusty Lofi Snare on Beats 2 & 4
      if (track.snareSteps.includes(barStep)) {
        this.playDustySnare(audioCtx);
      }

      // 5. Swung Closed Hi-Hat
      if (barStep % 2 === 0 || barStep === 15) {
        const accent = barStep % 4 === 2 ? 0.022 : 0.011;
        this.playLofiHat(audioCtx, accent);
      }

      // 6. Track-specific Lofi Lead Melody
      if (track.leadMelody[s64] !== undefined) {
        this.playLofiLeadNote(audioCtx, track.leadMelody[s64], track.filterCutoff + 450);
      }

      this.step16++;

      const delayMs =
        this.step16 % 2 === 1
          ? track.base16thMs * track.swingRatio
          : track.base16thMs * (2 - track.swingRatio);
      this.lofiTimerId = window.setTimeout(scheduleNextStep, delayMs);
    };

    scheduleNextStep();
  }

  public stopLofiMusic() {
    this.musicPlaying = false;
    if (this.lofiTimerId !== null) {
      clearTimeout(this.lofiTimerId);
      this.lofiTimerId = null;
    }
    if (this.vinylNode) {
      try {
        (this.vinylNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.vinylNode = null;
    }
  }

  private startVinylCrackle(ctx: AudioContext) {
    if (this.vinylNode) return;
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const pop = Math.random() < 0.0018 ? (Math.random() * 2 - 1) * 0.45 : 0;
      const hiss = (Math.random() * 2 - 1) * 0.015;
      data[i] = pop + hiss;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200;
    filter.Q.value = 0.9;

    const gain = ctx.createGain();
    gain.gain.value = 0.032;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    this.vinylNode = source;
  }

  private playWarmRhodes(
    ctx: AudioContext,
    freqs: number[],
    duration: number,
    peakGain: number,
    cutoff: number
  ) {
    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, now);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 2.6;
    lfoGain.gain.value = 1.6;
    lfo.connect(lfoGain);
    lfo.start(now);
    lfo.stop(now + duration);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);
      lfoGain.connect(osc.frequency);

      const strum = idx * 0.022;
      gain.gain.setValueAtTime(0.0001, now + strum);
      gain.gain.linearRampToValueAtTime(peakGain, now + strum + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0006, now + duration);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now + strum);
      osc.stop(now + duration + 0.04);
    });

    filter.connect(ctx.destination);
  }

  private playSubBass(ctx: AudioContext, freq: number, duration: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  private playBoomBapKick(ctx: AudioContext, volume: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(118, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.13);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  private playDustySnare(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.08);
    oscGain.gain.setValueAtTime(0.055, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);

    const bufferSize = Math.floor(ctx.sampleRate * 0.13);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.038));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2600;

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.05, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.13);
  }

  private playLofiHat(ctx: AudioContext, volume: number) {
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.045);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5200;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.045);
  }

  private playLofiLeadNote(ctx: AudioContext, freq: number, cutoff: number) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 0.992, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.05);

    filter.type = 'lowpass';
    filter.frequency.value = cutoff;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.032, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0006, now + 0.65);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.68);
  }

  public playSelect() {
    const ctx = this.getContext();
    if (!ctx) return;
    if (!this.musicPlaying) {
      this.startLofiMusic();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.setValueAtTime(680, now + 0.028);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  public playHintChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [587.33, 880.0].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.08, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.26);
    });
  }

  public playChemicalFizz(isSuccess: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bubbleNotes = [360, 440, 520, 610];
    bubbleNotes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.045);
      osc.frequency.exponentialRampToValueAtTime(f * 1.35, now + i * 0.045 + 0.06);

      gain.gain.setValueAtTime(0.07, now + i * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.075);
    });

    if (isSuccess) {
      this.playSuccessChord(0.18);
    }
  }

  public playWoodBuild(isSuccess: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [220, 330, 440].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      osc.frequency.exponentialRampToValueAtTime(f * 0.7, now + i * 0.06 + 0.05);

      gain.gain.setValueAtTime(0.09, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.065);
    });

    if (isSuccess) {
      this.playSuccessChord(0.2);
    }
  }

  public playCannonFire() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playCornSprout() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [392.0, 440.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * 0.92, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + 0.09);

      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  public playMissThud() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.14);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playSuccessChord(delayOffset: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delayOffset;
    const chord = [523.25, 659.25, 783.99, 987.77, 1174.66];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.055);

      gain.gain.setValueAtTime(0.08, now + i * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.055 + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.055);
      osc.stop(now + i * 0.055 + 0.66);
    });
  }
}

export const soundEngine = new SoundEngine();
