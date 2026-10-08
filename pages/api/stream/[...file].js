const STREAM_BASE = process.env.STREAM_BASE_URL || "http://localhost:8888";

const CHANNEL_MAP = {
    hall: "hall",
    "hall-sub": "hall-sub",
    kitchen: "kitchen",
    "kitchen-sub": "kitchen-sub",
    sitout: "sitout",
    "sitout-sub": "sitout-sub",
    room1: "room1",
    "room1-sub": "room1-sub",
    room2: "room2",
    room3: "room3",
};

function rewritePlaylist(text, channel) {
    return text
        .split("\n")
        .map((line) => {
            const t = line.trim();
            if (!t || t.startsWith("#")) return line;
            if (t.startsWith("http")) return line;
            return `/api/stream/${channel}/${t}`;
        })
        .join("\n");
}

export default async function handler(req, res) {
    const { file } = req.query;

    if (!Array.isArray(file) || file.length < 2) {
        res.status(400).send("Bad stream path");
        return;
    }

    const channel = file[0];
    const rest = file.slice(1).join("/");
    const streamName = CHANNEL_MAP[channel];

    if (!streamName) {
        res.status(404).send("Unknown channel");
        return;
    }

    const url = `${STREAM_BASE}/${streamName}/${rest}`;

    try {
        const upstream = await fetch(url, { cache: "no-store" });

        if (!upstream.ok) {
            res.status(upstream.status).send(`Upstream error: ${upstream.status}`);
            return;
        }

        const contentType =
            upstream.headers.get("content-type") || "application/octet-stream";

        // Sub-playlist → rewrite
        if (contentType.includes("mpegurl") || rest.endsWith(".m3u8")) {
            const text = await upstream.text();
            res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
            res.setHeader("Cache-Control", "no-cache");
            res.status(200).send(rewritePlaylist(text, channel));
            return;
        }

        // Binary segment (.ts) → stream through
        const arrayBuffer = await upstream.arrayBuffer();
        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "no-cache");
        res.status(200).send(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error("Segment proxy error:", err);
        res.status(502).send("Stream server unreachable");
    }
}