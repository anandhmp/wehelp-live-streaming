import Head from "next/head";
import { useState, useEffect } from "react";
import LivePlayer from "@/components/LivePlayer";
import {
  Video,
  Camera,
  Copy,
  Check,
  Radio,
  Clock,
  ShieldCheck,
  Server,
  Globe,
  ExternalLink,
  HeartHandshake,
  Sliders,
  Network,
  Cpu,
} from "lucide-react";

const CHANNELS = [
  { id: "hall", channelNum: 1, name: "Channel 1 — Hall", location: "Living Room / Hall" },
  { id: "kitchen", channelNum: 2, name: "Channel 2 — Kitchen", location: "Kitchen" },
  { id: "sitout", channelNum: 3, name: "Channel 3 — Sitout", location: "Sitout / Entrance" },
  { id: "room1", channelNum: 4, name: "Channel 4 — Room 1", location: "Bedroom / Room 1" },
];

export default function LiveStreamPage() {
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [streamQuality, setStreamQuality] = useState("main"); // "main" or "sub"
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const streamSrc =
    streamQuality === "main"
      ? `/api/stream/${selectedChannel.id}`
      : `/api/stream/${selectedChannel.id}-sub`;

  const rtspUrl = `rtsp://admin:14789@192.168.1.240:554/cam/realmonitor?channel=${selectedChannel.channelNum}&subtype=${streamQuality === "main" ? 0 : 1
    }`;

  const copyRtsp = () => {
    navigator.clipboard.writeText(rtspUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{`${selectedChannel.name} — WE Help Charitable Trust Live Surveillance`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Top Organization Navigation Bar */}
      <nav className="charity-navbar px-3 py-2 px-md-4">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center" style={{ maxWidth: "1200px" }}>
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50">
              <HeartHandshake size={22} className="text-info" />
            </div>
            <div>
              <div className="fw-bold text-white fs-6 lh-1">WE Help Charitable Trust</div>
              <a
                href="https://www.wehelpcharity.com"
                target="_blank"
                rel="noreferrer"
                className="text-info text-decoration-none small d-inline-flex align-items-center gap-1 mt-1"
                style={{ fontSize: "0.8rem", opacity: 0.9 }}
              >
                <Globe size={12} />
                <span>www.wehelpcharity.com</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
            {/* <span className="badge d-inline-flex align-items-center gap-1 bg-success bg-opacity-20 text-success border border-success border-opacity-50 py-2 px-3">
              <Radio size={14} className="text-success" />
              <span>DVR Online</span>
            </span> */}
            {currentTime && (
              <span
                className="badge d-inline-flex align-items-center gap-1 bg-dark text-light border border-secondary py-2 px-3"
                suppressHydrationWarning
              >
                <Clock size={13} className="text-secondary" />
                <span>{currentTime}</span>
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-3 p-md-4 p-lg-5" style={{ minHeight: "calc(100vh - 65px)", backgroundColor: "var(--bg-main)" }}>
        <div className="container" style={{ maxWidth: "1150px" }}>

          {/* Page Sub-Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom border-secondary border-opacity-25">
            <div>
              <h1 className="h4 fw-bold text-white mb-1 d-flex align-items-center gap-2">
                <Video size={22} className="text-primary" />
                <span>CCTV Live Streaming Portal</span>
              </h1>
              <p className="text-secondary mb-0 small">
                Device: CP Plus CP-UVR-0401E1V-I &bull; Network IP: 192.168.1.240 &bull; Cloud ID: BO8K2M4PAH5YOBV2
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50 px-2 py-1 small d-inline-flex align-items-center gap-1">
                <ShieldCheck size={13} className="text-info" />
                <span>Secure Stream</span>
              </span>
            </div>
          </div>

          {/* Camera Selection Pills */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className={`channel-btn ${selectedChannel.id === ch.id ? "active" : ""}`}
              >
                <Video size={16} />
                <span>{ch.name}</span>
              </button>
            ))}
          </div>

          {/* Video Player Card */}
          <div className="card mb-4 shadow-lg border-secondary">
            {/* Player Card Header */}
            <div className="card-header py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <Video size={18} className="text-primary" />
                <span className="fw-bold text-white">{selectedChannel.name}</span>
                <span className="text-secondary small">({selectedChannel.location})</span>
              </div>

              <div className="d-flex gap-2 align-items-center">
                {/* HD / SD Switcher */}
                <div className="btn-group btn-group-sm bg-black p-1 rounded border border-secondary border-opacity-50">
                  <button
                    onClick={() => setStreamQuality("main")}
                    className={`btn btn-sm ${streamQuality === "main" ? "btn-primary fw-bold" : "btn-dark text-secondary"
                      }`}
                    style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                  >
                    HD (Main)
                  </button>
                  <button
                    onClick={() => setStreamQuality("sub")}
                    className={`btn btn-sm ${streamQuality === "sub" ? "btn-primary fw-bold" : "btn-dark text-secondary"
                      }`}
                    style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                  >
                    SD (Sub)
                  </button>
                </div>

                {/* Snapshot Button */}
                <a
                  href={`/api/snapshot/${selectedChannel.channelNum}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "0.8rem", padding: "5px 12px" }}
                >
                  <Camera size={14} />
                  <span>Snapshot</span>
                </a>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="card-body p-0 bg-black">
              <LivePlayer key={`${selectedChannel.id}-${streamQuality}`} src={streamSrc} />
            </div>

            {/* Player Card Footer (RTSP URL & Copy) */}
            <div className="card-footer py-2 px-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: "260px" }}>
                <span className="text-secondary fw-semibold small" style={{ whiteSpace: "nowrap" }}>
                  RTSP Stream:
                </span>
                <code className="text-info bg-black px-2 py-1 rounded small flex-grow-1">{rtspUrl}</code>
              </div>
              <button
                onClick={copyRtsp}
                className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                style={{ fontSize: "0.8rem" }}
              >
                {copiedUrl ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copiedUrl ? "Copied" : "Copy RTSP"}</span>
              </button>
            </div>
          </div>

          {/* Technical Specs Cards */}
          <div className="row g-3">
            {/* DVR Connection Specs Card */}
            <div className="col-lg-6">
              <div className="card h-100 shadow-sm border-secondary">
                <div className="card-header py-3 d-flex align-items-center gap-2">
                  <Server size={18} className="text-primary" />
                  <span className="fw-bold text-white">DVR Connection Specs</span>
                </div>
                <div className="card-body p-3">
                  <ul className="spec-list">
                    <li>
                      <span className="spec-label">
                        <Server size={14} className="text-secondary" />
                        <span>Device Model</span>
                      </span>
                      <span className="spec-val">CP-UVR-0401E1V-I (4 Channels)</span>
                    </li>
                    <li>
                      <span className="spec-label">
                        <Network size={14} className="text-secondary" />
                        <span>Local IP Address</span>
                      </span>
                      <span className="spec-val text-info">192.168.1.240</span>
                    </li>
                    <li>
                      <span className="spec-label">
                        <Radio size={14} className="text-secondary" />
                        <span>RTSP Port</span>
                      </span>
                      <span className="spec-val">554 (TCP/UDP)</span>
                    </li>
                    <li>
                      <span className="spec-label">
                        <ShieldCheck size={14} className="text-secondary" />
                        <span>Default Credentials</span>
                      </span>
                      <span className="spec-val">admin / 14789</span>
                    </li>
                    <li>
                      <span className="spec-label">
                        <Globe size={14} className="text-secondary" />
                        <span>InstaOn Cloud ID</span>
                      </span>
                      <span className="spec-val text-warning">BO8K2M4PAH5YOBV2</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Integration & Endpoints Card */}
            <div className="col-lg-6">
              <div className="card h-100 shadow-sm border-secondary">
                <div className="card-header py-3 d-flex align-items-center gap-2">
                  <Cpu size={18} className="text-info" />
                  <span className="fw-bold text-white">Integration &amp; Endpoints</span>
                </div>
                <div className="card-body p-3">
                  <ul className="spec-list">
                    <li>
                      <span className="spec-label">
                        <Network size={14} className="text-secondary" />
                        <span>ONVIF Device Service</span>
                      </span>
                      <code className="spec-val">http://192.168.1.240:80/onvif/device_service</code>
                    </li>
                    <li>
                      <span className="spec-label">
                        <Radio size={14} className="text-secondary" />
                        <span>HLS Bridge Server</span>
                      </span>
                      <code className="spec-val">{`http://localhost:8888/${selectedChannel.id}/index.m3u8`}</code>
                    </li>
                    <li>
                      <span className="spec-label">
                        <Camera size={14} className="text-secondary" />
                        <span>Web Snapshot API</span>
                      </span>
                      <code className="spec-val">{`/api/snapshot/${selectedChannel.channelNum}`}</code>
                    </li>
                    <li>
                      <span className="spec-label">
                        <Cpu size={14} className="text-secondary" />
                        <span>Diagnostic CLI Tool</span>
                      </span>
                      <code className="spec-val">python3 scripts/test_cctv.py</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-5 pt-3 border-top border-secondary border-opacity-25 text-center text-secondary small">
            <div>
              <strong>WE Help Charitable Trust</strong> &bull; Official Surveillance &bull;{" "}
              <a
                href="https://www.wehelpcharity.com"
                target="_blank"
                rel="noreferrer"
                className="text-info text-decoration-none"
              >
                www.wehelpcharity.com
              </a>
            </div>
            <div className="mt-1" style={{ opacity: 0.65 }}>
              CP Plus DVR CP-UVR-0401E1V-I Live Monitoring System &bull; Private Authorized Access Only
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}