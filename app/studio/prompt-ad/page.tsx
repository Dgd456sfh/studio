
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Sparkles,
  ImagePlus,
  Download,
  LoaderCircle,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

export default function PromptAdPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const examples = [
    "Create a luxury skincare product advertisement with a beige background, soft studio lighting, flowers and an elegant premium look.",
    "Create a modern sneaker advertisement with a dynamic dark background, dramatic lighting and a sporty style.",
    "Create a refreshing beverage advertisement with splashing water, fresh fruit, bright colors and summer vibes.",
  ];

  const generateAd = async () => {
    if (!prompt.trim()) {
      setError("Please describe the advertisement you want to create.");
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl("");
    setPublicId("");

    try {
      const response = await fetch("/api/generate-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate your ad.");
      }

      setImageUrl(data.imageUrl);
      setPublicId(data.publicId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyImageUrl = async () => {
    if (!imageUrl) return;

    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the image URL.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f1e8] text-[#513c30]">
      <Sidebar />

      <main className="min-h-screen px-4 py-8 md:ml-64 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#a96648]">
              <Sparkles size={17} />
              <span>AI Product Studio</span>
              <span className="text-[#b9a89b]">/</span>
              <span>Prompt Ad Creator</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Create Image with AI
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806b5e] md:text-base">
              Describe your idea and generate a product Image visual.
              Your generated image will be saved to Cloudinary.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_1fr]">
            {/* Prompt panel */}
            <section className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#f5e8dd] p-3 text-[#a96648]">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h2 className="font-semibold">Describe your Image</h2>
                  <p className="mt-1 text-xs text-[#9b8577]">
                    Write a clear prompt for your visual
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-medium">
                Your prompt
              </label>

              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                maxLength={1000}
                rows={7}
                placeholder="Example: Create a premium perfume Image with a dark background, golden lighting, elegant flowers and a luxury editorial style..."
                className="w-full resize-y rounded-xl border border-[#e5d5c8] bg-[#fcf8f4] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#b2a094] focus:border-[#a96648]"
              />

              <div className="mt-1 flex justify-end text-xs text-[#a18c7e]">
                {prompt.length}/1000
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold">
                  Try an example
                </p>

                <div className="space-y-2">
                  {examples.map((example, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full rounded-xl border border-[#eee1d7] bg-[#fcf8f4] p-3 text-left text-xs leading-5 text-[#806b5e] transition hover:border-[#c99a7c] hover:bg-[#faf1e9]"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mt-5 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span className="break-words">{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={generateAd}
                disabled={loading || !prompt.trim()}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#513c30] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#674b3b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Generating your ad...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Image
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs leading-5 text-[#9b8577]">
                Generation requires a configured Cloudinary API key and may be
                subject to usage limits.
              </p>
            </section>

            {/* Result panel */}
            <section className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">Generated Image Of Product</h2>
                  <p className="mt-1 text-xs text-[#9b8577]">
                    Your result will appear here
                  </p>
                </div>

                <div className="rounded-xl bg-[#f5e8dd] p-3 text-[#a96648]">
                  <ImagePlus size={21} />
                </div>
              </div>

              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#dfc8b8] bg-[#fcf8f4]">
                {loading ? (
                  <div className="flex flex-col items-center px-5 text-center">
                    <LoaderCircle
                      size={36}
                      className="animate-spin text-[#a96648]"
                    />
                    <p className="mt-4 text-sm font-semibold">
                      Creating your Image
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[#9b8577]">
                      This may take a little while. Please keep this page open.
                    </p>
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="AI-generated product advertisement"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center px-6 text-center">
                    <div className="rounded-full bg-[#f1dfd1] p-4 text-[#a96648]">
                      <ImagePlus size={30} />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-[#513c30]">
                      Your AI-generated image will appear here
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[#9b8577]">
                      Enter a prompt and click Generate Ad to get started.
                    </p>
                  </div>
                )}
              </div>

              {imageUrl && !loading && (
                <div className="mt-5 space-y-3">
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#513c30] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#674b3b]"
                  >
                    <Download size={17} />
                    Open / Download Image
                  </a>

                  <button
                    type="button"
                    onClick={copyImageUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9c3b3] px-4 py-3 text-sm font-semibold text-[#513c30] transition hover:bg-[#fcf8f4]"
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                    {copied ? "URL Copied" : "Copy Cloudinary URL"}
                  </button>

                  <div className="rounded-xl bg-[#fcf8f4] p-3">
                    <p className="text-xs font-semibold text-[#806b5e]">
                      Saved to Cloudinary
                    </p>
                    <p className="mt-1 break-all text-xs text-[#9b8577]">
                      {publicId}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}