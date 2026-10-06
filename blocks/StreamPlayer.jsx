import { useEffect, useRef, useState } from 'react';
import styles from './StreamPlayer.module.scss';
import Icon from '../components/Icon';

const LIVE_SINCE_LABEL = 'Live since 09:42 AM';

export default function StreamPlayer() {
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [now, setNow] = useState('--:--:--');
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      setNow(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const showControls = () => {
    setIdle(false);
    clearTimeout(idleTimer.current);
    if (playing) idleTimer.current = setTimeout(() => setIdle(true), 3200);
  };
  useEffect(() => () => clearTimeout(idleTimer.current), []);

  const toggle = () => {
    setStarted(true);
    setPlaying((p) => !p);
  };
  const play = () => {
    setStarted(true);
    setPlaying(true);
  };

  const isPaused = !playing && started;

  return (
    <div className={`${styles.playerWrap} reveal d4`}>
      <div className={styles.frame}>
        <div
          ref={playerRef}
          className={`${styles.player} ${playing ? styles.isPlaying : ''} ${
            isPaused ? styles.isPaused : ''
          } ${idle ? styles.idle : ''}`}
          onMouseMove={showControls}
          onTouchStart={showControls}
          onClick={showControls}
          aria-label="Live video: Dining Area"
        >
          <div className={styles.stage}>
            <div id="stream-mount" className={styles.streamMount} />

            <div className={styles.placeholder} aria-hidden="true">
              <PlaceholderScene />
              <div className={`${styles.layer} ${styles.tint}`} />
              <div className={`${styles.layer} ${styles.glow}`} />
              <div className={`${styles.layer} ${styles.grain}`} />
              <div className={`${styles.layer} ${styles.scanlines}`} />
              <div className={`${styles.layer} ${styles.scanbar}`} />
              <div className={`${styles.layer} ${styles.vignette}`} />
            </div>

            <div className={`${styles.hud} ${styles.hudTop}`}>
              <span className={styles.liveBadge}>
                <span className={`${styles.dot} ${isPaused ? styles.off : ''}`} />
                <span>{isPaused ? 'PAUSED' : 'LIVE'}</span>
              </span>
              <span className={styles.camLabel}>DINING AREA</span>
              <span className={`${styles.ts} ${styles.tsMobile}`}>{now}</span>
            </div>

            <button
              type="button"
              className={styles.centerPlay}
              onClick={play}
              aria-label="Start live stream"
            >
              <span className={styles.inner}>
                <span className={styles.playCircle}>
                  <Icon name="play" size={32} />
                </span>
                <span className={styles.t1}>LIVE STREAM</span>
                <span className={styles.t2}>Dining Area</span>
              </span>
            </button>

            {isPaused && <div className={styles.pausedChip}>PAUSED</div>}

            <div className={styles.bottom}>
              <div className={styles.infoRow}>
                <div>
                  <div className={styles.infoTitle}>Dining Area</div>
                  <div className={styles.since}>{LIVE_SINCE_LABEL}</div>
                </div>
                <div className={styles.ts}>{now}</div>
              </div>

              <div className={styles.ctrlBar} role="toolbar" aria-label="Video controls">
                <button
                  type="button"
                  className={`${styles.ctrl} ${styles.ctrlMain}`}
                  onClick={toggle}
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <Icon name="pause" size={20} /> : <Icon name="play" size={20} />}
                </button>

                <div className={styles.vol}>
                  <button
                    type="button"
                    className={styles.ctrl}
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? <Icon name="mute" size={21} /> : <Icon name="volume" size={21} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      setMuted(v === 0);
                    }}
                    aria-label="Volume"
                  />
                </div>

                <div className={styles.statusText}>
                  <span className={`${styles.dot} ${!playing ? styles.off : ''}`} />
                  <span>
                    {playing ? 'Live' : started ? 'Paused' : 'Ready to play'}
                  </span>
                </div>

                <div className={styles.spacer} />

                <button type="button" className={styles.ctrl} aria-label="Fullscreen">
                  <Icon name="fullscreen" size={21} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderScene() {
  return (
    <svg
      className={styles.scene}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2733" />
          <stop offset=".6" stopColor="#16212c" />
          <stop offset="1" stopColor="#101923" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2620" />
          <stop offset=".5" stopColor="#1c1915" />
          <stop offset="1" stopColor="#0d0c0a" />
        </linearGradient>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6f7" stopOpacity=".85" />
          <stop offset="1" stopColor="#7fa9c8" stopOpacity=".45" />
        </linearGradient>
        <radialGradient id="lamp" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe2a0" stopOpacity=".75" />
          <stop offset=".5" stopColor="#ffd27a" stopOpacity=".18" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dff0ff" stopOpacity=".22" />
          <stop offset="1" stopColor="#dff0ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9e2d0" />
          <stop offset="1" stopColor="#b7ae98" />
        </linearGradient>
        <filter id="blur8" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="blur18" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" />
        </filter>

        <g id="table">
          <ellipse cx="0" cy="74" rx="150" ry="22" fill="#000" opacity=".45" filter="url(#blur8)" />
          <rect x="-92" y="-62" width="52" height="58" rx="12" fill="#2b241c" />
          <rect x="40" y="-62" width="52" height="58" rx="12" fill="#2b241c" />
          <path d="M-112 6 L-100 62 Q0 82 100 62 L112 6 Z" fill="url(#cloth)" opacity=".92" />
          <path d="M-112 6 L-100 62 Q0 82 100 62 L112 6" fill="none" stroke="#fff" strokeOpacity=".12" />
          <ellipse cx="0" cy="4" rx="116" ry="30" fill="#f1ecdd" />
          <ellipse cx="0" cy="4" rx="116" ry="30" fill="none" stroke="#fff" strokeOpacity=".5" />
          <ellipse cx="-62" cy="8" rx="20" ry="6" fill="#fff" opacity=".95" />
          <ellipse cx="62" cy="8" rx="20" ry="6" fill="#fff" opacity=".95" />
          <ellipse cx="-20" cy="-8" rx="14" ry="4" fill="#fff" opacity=".9" />
          <ellipse cx="22" cy="-8" rx="14" ry="4" fill="#fff" opacity=".9" />
          <rect x="-5" y="-26" width="10" height="26" rx="4" fill="#7a9bb5" opacity=".85" />
          <circle cx="0" cy="-32" r="9" fill="#c98b9a" opacity=".9" />
          <circle cx="-8" cy="-27" r="6" fill="#e5c76b" opacity=".9" />
          <circle cx="8" cy="-27" r="6" fill="#b9d2a3" opacity=".85" />
          <rect x="-166" y="-10" width="44" height="70" rx="12" fill="#332a20" />
          <rect x="122" y="-10" width="44" height="70" rx="12" fill="#332a20" />
        </g>
      </defs>

      <rect width="1600" height="440" fill="url(#wall)" />
      <rect y="300" width="1600" height="140" fill="#131c26" />
      <g stroke="#223142" strokeWidth="2" fill="none" opacity=".9">
        <rect x="40" y="318" width="330" height="96" rx="4" />
        <rect x="410" y="318" width="330" height="96" rx="4" />
        <rect x="780" y="318" width="330" height="96" rx="4" />
        <rect x="1150" y="318" width="330" height="96" rx="4" />
      </g>
      <rect y="296" width="1600" height="6" fill="#2a3a4c" />

      <g>
        <g transform="translate(210 70)">
          <path d="M0 240 V90 a100 90 0 0 1 200 0 V240 Z" fill="url(#win)" stroke="#33465a" strokeWidth="8" />
          <line x1="100" y1="0" x2="100" y2="240" stroke="#33465a" strokeWidth="4" />
          <line x1="0" y1="130" x2="200" y2="130" stroke="#33465a" strokeWidth="4" />
        </g>
        <g transform="translate(700 70)">
          <path d="M0 240 V90 a100 90 0 0 1 200 0 V240 Z" fill="url(#win)" stroke="#33465a" strokeWidth="8" />
          <line x1="100" y1="0" x2="100" y2="240" stroke="#33465a" strokeWidth="4" />
          <line x1="0" y1="130" x2="200" y2="130" stroke="#33465a" strokeWidth="4" />
        </g>
        <g transform="translate(1190 70)">
          <path d="M0 240 V90 a100 90 0 0 1 200 0 V240 Z" fill="url(#win)" stroke="#33465a" strokeWidth="8" />
          <line x1="100" y1="0" x2="100" y2="240" stroke="#33465a" strokeWidth="4" />
          <line x1="0" y1="130" x2="200" y2="130" stroke="#33465a" strokeWidth="4" />
        </g>
        <g filter="url(#blur18)" opacity=".55">
          <ellipse cx="310" cy="190" rx="130" ry="130" fill="#cfe6f7" opacity=".35" />
          <ellipse cx="800" cy="190" rx="130" ry="130" fill="#cfe6f7" opacity=".35" />
          <ellipse cx="1290" cy="190" rx="130" ry="130" fill="#cfe6f7" opacity=".35" />
        </g>
        <g fill="#243447" opacity=".95">
          <path d="M150 60 h50 v270 h-50 Z" /><path d="M420 60 h50 v270 h-50 Z" />
          <path d="M640 60 h50 v270 h-50 Z" /><path d="M910 60 h50 v270 h-50 Z" />
          <path d="M1130 60 h50 v270 h-50 Z" /><path d="M1400 60 h50 v270 h-50 Z" />
        </g>
      </g>

      <rect y="440" width="1600" height="460" fill="url(#floor)" />
      <g stroke="#3a342a" strokeWidth="1.4" opacity=".55">
        <line x1="800" y1="440" x2="-900" y2="900" />
        <line x1="800" y1="440" x2="-300" y2="900" />
        <line x1="800" y1="440" x2="250" y2="900" />
        <line x1="800" y1="440" x2="640" y2="900" />
        <line x1="800" y1="440" x2="960" y2="900" />
        <line x1="800" y1="440" x2="1350" y2="900" />
        <line x1="800" y1="440" x2="1900" y2="900" />
        <line x1="800" y1="440" x2="2500" y2="900" />
        <line x1="0" y1="470" x2="1600" y2="470" />
        <line x1="0" y1="520" x2="1600" y2="520" />
        <line x1="0" y1="590" x2="1600" y2="590" />
        <line x1="0" y1="690" x2="1600" y2="690" />
        <line x1="0" y1="820" x2="1600" y2="820" />
      </g>
      <g filter="url(#blur8)">
        <polygon points="270,440 420,440 560,900 150,900" fill="url(#beam)" opacity=".8" />
        <polygon points="760,440 910,440 1010,900 600,900" fill="url(#beam)" opacity=".8" />
        <polygon points="1250,440 1400,440 1500,900 1080,900" fill="url(#beam)" opacity=".8" />
      </g>

      <g>
        <ellipse cx="400" cy="300" rx="190" ry="110" fill="url(#lamp)" />
        <ellipse cx="800" cy="270" rx="210" ry="120" fill="url(#lamp)" />
        <ellipse cx="1200" cy="300" rx="190" ry="110" fill="url(#lamp)" />
        <g stroke="#3b4b5d" strokeWidth="2">
          <line x1="400" y1="0" x2="400" y2="262" />
          <line x1="800" y1="0" x2="800" y2="236" />
          <line x1="1200" y1="0" x2="1200" y2="262" />
        </g>
        <path d="M370 262 h60 l-10 22 h-40 Z" fill="#c9a24a" />
        <path d="M768 236 h64 l-10 24 h-44 Z" fill="#c9a24a" />
        <path d="M1170 262 h60 l-10 22 h-40 Z" fill="#c9a24a" />
        <ellipse cx="400" cy="286" rx="16" ry="4" fill="#ffe7ab" />
        <ellipse cx="800" cy="262" rx="16" ry="4" fill="#ffe7ab" />
        <ellipse cx="1200" cy="286" rx="16" ry="4" fill="#ffe7ab" />
      </g>

      <use href="#table" transform="translate(360 470) scale(.5)" opacity=".92" />
      <use href="#table" transform="translate(800 470) scale(.5)" opacity=".92" />
      <use href="#table" transform="translate(1240 470) scale(.5)" opacity=".92" />
      <use href="#table" transform="translate(210 600) scale(.78)" />
      <use href="#table" transform="translate(800 600) scale(.78)" />
      <use href="#table" transform="translate(1390 600) scale(.78)" />
      <use href="#table" transform="translate(470 790) scale(1.05)" />
      <use href="#table" transform="translate(1130 790) scale(1.05)" />
    </svg>
  );
}