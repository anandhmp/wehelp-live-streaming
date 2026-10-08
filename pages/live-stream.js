import Head from "next/head";
import { useState } from "react";
import LivePlayer from "@/components/LivePlayer";

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

  const streamSrc = streamQuality === "main" 
    ? `/api/stream/${selectedChannel.id}` 
    : `/api/stream/${selectedChannel.id}-sub`;

  const rtspUrl = `rtsp://admin:14789@192.168.1.240:554/cam/realmonitor?channel=${selectedChannel.channelNum}&subtype=${streamQuality === "main" ? 0 : 1}`;

  const copyRtsp = () => {
    navigator.clipboard.writeText(rtspUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{selectedChannel.name} — CP Plus Live Stream</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-dark text-white p-4 p-md-5">
        <div className="container" style={{ maxWidth: "1100px" }}>
          {/* Header */}
          <header className="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom border-secondary">
            <div>
              <h1 className="h3 mb-1 fw-bold text-light">CP Plus DVR Live Stream</h1>
              <p className="text-secondary mb-0 small">
                Model: CP-UVR-0401E1V-I &bull; IP: 192.168.1.240 &bull; Cloud ID: BO8K2M4PAH5YOBV2
              </p>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
              <span className="badge bg-success py-2 px-3">DVR Online</span>
              <span className="badge bg-secondary py-2 px-3">{new Date().toLocaleTimeString()}</span>
            </div>
          </header>

          {/* Channel Selector Pills */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className={`btn btn-sm ${
                  selectedChannel.id === ch.id ? "btn-primary fw-bold" : "btn-outline-secondary text-light"
                }`}
              >
                📹 {ch.name}
              </button>
            ))}
          </div>

          {/* Video Player Card */}
          <div className="card bg-black border-secondary mb-4 shadow">
            <div className="card-header bg-dark border-secondary d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-semibold text-light">{selectedChannel.name}</span>
                <span className="text-secondary small ms-2">({selectedChannel.location})</span>
              </div>
              <div className="d-flex gap-2 align-items-center">
                <div className="btn-group btn-group-sm">
                  <button
                    onClick={() => setStreamQuality("main")}
                    className={`btn btn-sm ${streamQuality === "main" ? "btn-light" : "btn-outline-secondary"}`}
                  >
                    HD (Main)
                  </button>
                  <button
                    onClick={() => setStreamQuality("sub")}
                    className={`btn btn-sm ${streamQuality === "sub" ? "btn-light" : "btn-outline-secondary"}`}
                  >
                    SD (Sub)
                  </button>
                </div>
                <a
                  href={`/api/snapshot/${selectedChannel.channelNum}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-info"
                >
                  📸 Snapshot
                </a>
              </div>
            </div>

            <div className="card-body p-0">
              <LivePlayer key={`${selectedChannel.id}-${streamQuality}`} src={streamSrc} />
            </div>

            <div className="card-footer bg-dark border-secondary d-flex flex-wrap justify-content-between align-items-center small text-secondary">
              <div className="d-flex align-items-center gap-2">
                <span className="text-light">RTSP:</span>
                <code className="text-info bg-black px-2 py-1 rounded small">{rtspUrl}</code>
              </div>
              <button onClick={copyRtsp} className="btn btn-sm btn-outline-light mt-2 mt-md-0">
                {copiedUrl ? "✓ Copied" : "Copy RTSP"}
              </button>
            </div>
          </div>

          {/* Device & Integration Information Cards */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card bg-dark border-secondary h-100">
                <div className="card-header border-secondary fw-semibold text-light">
                  📡 DVR Connection Specs
                </div>
                <div className="card-body small">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><strong>Device IP:</strong> 192.168.1.240 (Port 80/443)</li>
                    <li className="mb-2"><strong>RTSP Port:</strong> 554 (TCP/UDP)</li>
                    <li className="mb-2"><strong>Credentials:</strong> admin / 14789</li>
                    <li className="mb-2"><strong>Channels:</strong> 4 Analog/IP BNC Channels</li>
                    <li className="mb-0"><strong>InstaOn Cloud ID:</strong> BO8K2M4PAH5YOBV2</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card bg-dark border-secondary h-100">
                <div className="card-header border-secondary fw-semibold text-light">
                  🛠️ Third-Party & ONVIF Integration
                </div>
                <div className="card-body small">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2"><strong>ONVIF Port:</strong> 80 (HTTP)</li>
                    <li className="mb-2"><strong>ONVIF Endpoint:</strong> <code>http://192.168.1.240:80/onvif/device_service</code></li>
                    <li className="mb-2"><strong>HLS Bridge Server:</strong> <code>http://localhost:8888/{selectedChannel.id}/index.m3u8</code></li>
                    <li className="mb-0"><strong>Diagnostic Script:</strong> <code>python3 scripts/test_cctv.py</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-5 text-center text-secondary small">
            CP Plus CP-UVR-0401E1V-I Live Monitoring System &bull; Private authorized access only
          </footer>
        </div>
      </main>
    </>
  );
}