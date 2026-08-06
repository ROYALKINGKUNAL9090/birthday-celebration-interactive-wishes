// Web Audio API Synthesizer for Birthday Music & Interactive SFX

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingSequence = false;
  private isMuted = false;
  private volume = 0.3;
  private tempo = 120; // BPM
  private instrument: 'synth-bell' | 'marimba' | 'piano' | '8bit' = 'synth-bell';
  private currentTimeout: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setInstrument(inst: 'synth-bell' | 'marimba' | 'piano' | '8bit') {
    this.instrument = inst;
  }

  public setTempo(bpm: number) {
    this.tempo = bpm;
  }

  // Play a single note frequency
  private playNote(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = this.instrument === '8bit' ? 'square' : this.instrument === 'marimba' ? 'triangle' : type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(this.volume, startTime + 0.03);
    
    if (this.instrument === 'synth-bell') {
      // Bell decay
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    } else {
      gain.gain.linearRampToValueAtTime(0, startTime + duration);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Happy Birthday Note Frequencies (Key of C Major / G4 base)
  // G4 G4 A4 G4 C5 B4 | G4 G4 A4 G4 D5 C5 | G4 G4 G5 E5 C5 B4 A4 | F5 F5 E5 C5 D5 C5
  private readonly notes = [
    { note: 392.00, dur: 0.75 }, { note: 392.00, dur: 0.25 }, { note: 440.00, dur: 1.0 }, { note: 392.00, dur: 1.0 }, { note: 523.25, dur: 1.0 }, { note: 493.88, dur: 2.0 },
    { note: 392.00, dur: 0.75 }, { note: 392.00, dur: 0.25 }, { note: 440.00, dur: 1.0 }, { note: 392.00, dur: 1.0 }, { note: 587.33, dur: 1.0 }, { note: 523.25, dur: 2.0 },
    { note: 392.00, dur: 0.75 }, { note: 392.00, dur: 0.25 }, { note: 783.99, dur: 1.0 }, { note: 659.25, dur: 1.0 }, { note: 523.25, dur: 1.0 }, { note: 493.88, dur: 1.0 }, { note: 440.00, dur: 2.0 },
    { note: 698.46, dur: 0.75 }, { note: 698.46, dur: 0.25 }, { note: 659.25, dur: 1.0 }, { note: 523.25, dur: 1.0 }, { note: 587.33, dur: 1.0 }, { note: 523.25, dur: 2.5 },
  ];

  public startMusic() {
    this.initContext();
    if (this.isPlayingSequence) return;
    this.isPlayingSequence = true;

    const playSequence = () => {
      if (!this.isPlayingSequence || !this.ctx) return;
      const now = this.ctx.currentTime;
      const beatDuration = 60 / this.tempo;
      let currentTime = now + 0.1;

      for (const item of this.notes) {
        const noteDur = item.dur * beatDuration;
        this.playNote(item.note, currentTime, noteDur, 'sine');
        currentTime += noteDur + 0.05;
      }

      const totalTimeMs = (currentTime - now) * 1000;
      this.currentTimeout = window.setTimeout(() => {
        if (this.isPlayingSequence) {
          playSequence();
        }
      }, totalTimeMs);
    };

    playSequence();
  }

  public stopMusic() {
    this.isPlayingSequence = false;
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isPlayingSequence;
  }

  // --- SOUND EFFECTS ---

  // Balloon Pop sound
  public playPopSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
  }

  // Candle Blow wind & soft chime sound
  public playCandleBlowSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Wind noise
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(this.volume * 0.6, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Chime ascending arpeggio
    const chimes = [523.25, 659.25, 783.99, 1046.50];
    chimes.forEach((freq, idx) => {
      this.playNote(freq, now + 0.3 + idx * 0.08, 0.4, 'triangle');
    });
  }

  // Unbox Gift Sparkle
  public playUnboxSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    arpeggio.forEach((freq, index) => {
      this.playNote(freq, now + index * 0.06, 0.3, 'sine');
    });
  }

  // Fireworks / Cheer sound
  public playCheerSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Major chord triumphant burst
    const chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach((freq) => {
      this.playNote(freq, now, 0.8, 'triangle');
    });
    chord.map(f => f * 1.25).forEach((freq) => {
      this.playNote(freq, now + 0.2, 1.0, 'sine');
    });
  }

  // Soft Tap UI feedback
  public playTapSound() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    this.playNote(880, now, 0.08, 'sine');
  }
}

export const audioEngine = new BirthdayAudioEngine();