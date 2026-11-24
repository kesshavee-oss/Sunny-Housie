let audioCtx: AudioContext | null = null;
let musicIntervalId: number | null = null;
let musicNoteIndex = 0;

function getAudioContext(allowCreate = true): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx && allowCreate) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Resumes/initializes Web Audio after a user tap so browsers allow playback.
 */
export function unlockAudio(): void {
  getAudioContext(true);
}

/**
 * Plays a soft chime when a new number is called by the host.
 */
export function playCallChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Plays a gentle click when marking or unmarking a ticket number.
 */
export function playTapPop(isMarking: boolean): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isMarking ? 540 : 380, now);
    osc.frequency.exponentialRampToValueAtTime(isMarking ? 720 : 280, now + 0.045);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.085, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Plays a short cheerful fanfare when a winning pattern is claimed.
 */
export function playCheerSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + idx * 0.065;
      osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.44);
    });
  } catch {
    // Ignore audio errors
  }
}

// Gentle C-major pentatonic melody (frequencies in Hz, 0 = soft rest)
const BACKGROUND_MELODY = [
  523.25, 659.25, 783.99, 659.25,
  880.0, 783.99, 659.25, 0,
  587.33, 659.25, 783.99, 587.33,
  523.25, 659.25, 523.25, 0,
];

function playMusicNote(freq: number): void {
  if (freq <= 0) return;
  try {
    const ctx = getAudioContext(false);
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Very quiet volume so music never covers voice callouts
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.022, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.48);
  } catch {
    // Ignore
  }
}

/**
 * Starts a quiet, cheerful looping background tune on the Host page.
 */
export function startBackgroundMusic(): void {
  if (typeof window === 'undefined' || musicIntervalId !== null) return;
  const ctx = getAudioContext(true);
  if (!ctx) return;

  playMusicNote(BACKGROUND_MELODY[musicNoteIndex % BACKGROUND_MELODY.length]);
  musicNoteIndex = (musicNoteIndex + 1) % BACKGROUND_MELODY.length;

  musicIntervalId = window.setInterval(() => {
    playMusicNote(BACKGROUND_MELODY[musicNoteIndex % BACKGROUND_MELODY.length]);
    musicNoteIndex = (musicNoteIndex + 1) % BACKGROUND_MELODY.length;
  }, 480);
}

/**
 * Stops the background music loop cleanly.
 */
export function stopBackgroundMusic(): void {
  if (musicIntervalId !== null) {
    window.clearInterval(musicIntervalId);
    musicIntervalId = null;
  }
}
