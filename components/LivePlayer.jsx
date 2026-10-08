import { useEffect, useRef, useState } from "react";
import { AlertTriangle, RefreshCw, Radio } from "lucide-react";

export default function LivePlayer({ src, poster, autoPlay = true }) {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setError(null);
        setLoading(true);

        // Safari / iOS native HLS
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            const onLoaded = () => setLoading(false);
            const onError = () => {
                setError("Stream is currently offline or connecting to DVR.");
                setLoading(false);
            };
            video.addEventListener("loadedmetadata", onLoaded);
            video.addEventListener("error", onError);
            return () => {
                video.removeEventListener("loadedmetadata", onLoaded);
                video.removeEventListener("error", onError);
            };
        }

        // hls.js for Chrome / Edge / Firefox
        let hls;
        let destroyed = false;

        import("hls.js").then(({ default: Hls }) => {
            if (destroyed) return;

            if (!Hls.isSupported()) {
                setError("HLS playback is not supported in this browser.");
                setLoading(false);
                return;
            }

            hls = new Hls({
                lowLatencyMode: true,
                liveSyncDurationCount: 2,
                liveMaxLatencyDurationCount: 6,
                backBufferLength: 5,
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setLoading(false);
                if (autoPlay) video.play().catch(() => { });
            });

            hls.on(Hls.Events.ERROR, (_e, data) => {
                if (!data.fatal) return;

                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        setError("Stream connection lost. Verifying DVR stream status...");
                        hls.destroy();
                }
            });
        });

        return () => {
            destroyed = true;
            if (hls) hls.destroy();
        };
    }, [src, autoPlay]);

    return (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "#000", borderRadius: "12px", overflow: "hidden" }}>
            <video
                ref={videoRef}
                controls
                muted
                playsInline
                poster={poster}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            {loading && !error && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading feed...</span>
                    </div>
                </div>
            )}

            {error && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(10, 14, 23, 0.92)", color: "#fff", padding: "20px", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", fontWeight: "600", fontSize: "1.1rem", marginBottom: "8px" }}>
                        <AlertTriangle size={22} color="#f87171" />
                        <span>Stream Connecting / Offline</span>
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "#94a3b8", maxWidth: "420px", marginBottom: "16px" }}>{error}</p>
                    <button
                        onClick={() => location.reload()}
                        className="btn btn-sm btn-outline-light"
                        style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "6px" }}
                    >
                        <RefreshCw size={14} />
                        Retry Feed
                    </button>
                </div>
            )}

            <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#dc2626", color: "#ffffff", fontSize: "0.75rem", fontWeight: "700", padding: "4px 8px", borderRadius: "6px", letterSpacing: "0.05em" }}>
                <Radio size={12} />
                LIVE
            </div>
        </div>
    );
}