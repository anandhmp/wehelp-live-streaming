import { useEffect, useRef, useState } from "react";

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
                setError("Stream failed to load (native).");
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
                setError("HLS not supported in this browser.");
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
                        setError("Fatal stream error.");
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
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
            <video
                ref={videoRef}
                controls
                muted
                playsInline
                poster={poster}
                className="w-full h-full object-contain"
            />

            {loading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full" />
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-center p-4">
                    <p className="text-red-400 font-semibold mb-2">⚠ Stream Error</p>
                    <p className="text-sm opacity-80">{error}</p>
                    <button
                        onClick={() => location.reload()}
                        className="mt-4 px-4 py-2 bg-white text-black rounded"
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
                LIVE
            </div>
        </div>
    );
}