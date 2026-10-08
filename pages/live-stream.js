import Head from "next/head";
import LivePlayer from "@/components/LivePlayer";

export default function LiveStreamPage() {
  const streamSrc = "/api/stream/hall";

  return (
    <>
      <Head>
        <title>Live Stream — Hall Camera</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-neutral-950 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Live Stream</h1>
              <p className="text-sm text-neutral-400">
                Hall Camera — CP Plus DVR
              </p>
            </div>
            <span className="text-xs text-neutral-500">
              {new Date().toLocaleString()}
            </span>
          </header>

          <LivePlayer src={streamSrc} />

          <footer className="mt-4 text-xs text-neutral-500 text-center">
            Private stream — authorized access only
          </footer>
        </div>
      </main>
    </>
  );
}