import { execFile } from "child_process";

const CHANNEL_NUM_MAP = {
    hall: 1,
    kitchen: 2,
    sitout: 3,
    room1: 4,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
};

export default async function handler(req, res) {
    const { channel } = req.query;
    const channelNum = CHANNEL_NUM_MAP[channel];

    if (!channelNum) {
        return res.status(404).json({ error: "Invalid channel (choose 1-4, hall, kitchen, sitout, room1)" });
    }

    const dvrIp = process.env.DVR_IP || "192.168.1.240";
    const user = process.env.DVR_USER || "admin";
    const pass = process.env.DVR_PASS || "14789";
    const url = `https://${dvrIp}/cgi-bin/snapshot.cgi?channel=${channelNum}`;

    return new Promise((resolve) => {
        execFile(
            "curl",
            ["-k", "-s", "--digest", "-u", `${user}:${pass}`, url],
            { encoding: "buffer", maxBuffer: 10 * 1024 * 1024 },
            (err, stdout) => {
                if (err || !stdout || stdout.length < 500) {
                    res.status(502).json({
                        error: "Failed to capture snapshot from DVR",
                        details: stdout ? stdout.toString() : err?.message,
                    });
                    return resolve();
                }

                res.setHeader("Content-Type", "image/jpeg");
                res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                res.status(200).send(stdout);
                return resolve();
            }
        );
    });
}
