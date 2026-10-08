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
    const { channel } = req.query;
    const streamName = CHANNEL_MAP[channel];

    if (!streamName) {
        res.status(404).send("Unknown channel");
        return;
    }

    const url = `${STREAM_BASE}/${streamName}/index.m3u8`;

    try {
        const upstream = await fetch(url, { cache: "no-store" });

        if (!upstream.ok) {
            res.status(upstream.status).send(`Upstream error: ${upstream.status}`);
            return;
        }

        const text = await upstream.text();
        const rewritten = rewritePlaylist(text, channel);

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send(rewritten);
    } catch (err) {
        console.error("Stream proxy error:", err);
        res.status(502).send("Stream server unreachable");
    }
}