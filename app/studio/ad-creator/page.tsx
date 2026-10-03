
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Upload,
  ImagePlus,
  Music2,
  Trash2,
  Download,
  Film,
  LoaderCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdCreatorPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [adText, setAdText] = useState("Made to be yours.");
  const [duration, setDuration] = useState(3);
  const [currentImage, setCurrentImage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [exportError, setExportError] = useState("");

  // Create preview URLs for uploaded images
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Create preview URL for audio
  useEffect(() => {
    if (!audio) {
      setAudioUrl("");
      return;
    }

    const url = URL.createObjectURL(audio);
    setAudioUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [audio]);

  // Release generated video URL when replaced or unmounted
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length > 0) {
      setImages((previous) => [...previous, ...validFiles]);
      setExportError("");
    }

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((previous) => previous.filter((_, i) => i !== index));
    setCurrentImage(0);
  };

  const handleAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAudio(file);
      setExportError("");
    }

    event.target.value = "";
  };

  const exportVideo = async () => {
    if (images.length === 0 || isExporting) return;

    setIsExporting(true);
    setExportProgress(0);
    setExportError("");

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({ progress }) => {
        if (Number.isFinite(progress)) {
          setExportProgress((previous) =>
            Math.max(previous, Math.min(95, Math.round(progress * 100)))
          );
        }
      });

      // Load FFmpeg from the public folder
      await ffmpeg.load({
        coreURL: await toBlobURL(
          "/ffmpeg/ffmpeg-core.js",
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          "/ffmpeg/ffmpeg-core.wasm",
          "application/wasm"
        ),
      });

      const clipFiles: string[] = [];

      // Process every image and place the ad text on it
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const inputName = `image_${i}.png`;
        const clipName = `clip_${i}.mp4`;

        const bitmap = await createImageBitmap(file);

        const canvas = document.createElement("canvas");
        canvas.width = 1280;
        canvas.height = 720;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          bitmap.close();
          throw new Error("Could not create canvas.");
        }

        // Background
        ctx.fillStyle = "#1c1c1c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fit image while keeping its aspect ratio
        const scale = Math.min(
          canvas.width / bitmap.width,
          canvas.height / bitmap.height
        );

        const width = bitmap.width * scale;
        const height = bitmap.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(bitmap, x, y, width, height);
        bitmap.close();

        // Bottom gradient behind the tagline
        const gradient = ctx.createLinearGradient(0, 450, 0, 720);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.75)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 450, 1280, 270);

        // Add ad text to the actual exported image
        if (adText.trim()) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 52px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 5;

          ctx.fillText(adText.trim(), 640, 660, 1120);
          ctx.shadowBlur = 0;
        }

        // Convert image with text into PNG
        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Could not prepare image for video."));
            }
          }, "image/png");
        });

        await ffmpeg.writeFile(inputName, await fetchFile(pngBlob));

        // Create video clip
        await ffmpeg.exec([
          "-loop", "1",
          "-framerate", "25",
          "-i", inputName,
          "-t", String(duration),
          "-vf", "scale=1280:720,setsar=1",
          "-c:v", "libx264",
          "-preset", "ultrafast",
          "-pix_fmt", "yuv420p",
          "-r", "25",
          "-an",
          clipName,
        ]);

        clipFiles.push(clipName);
        setExportProgress(Math.round(((i + 1) / images.length) * 70));
      }

      // Create FFmpeg concat list
      const concatContent = clipFiles
        .map((name) => `file '${name}'`)
        .join("\n");

      await ffmpeg.writeFile(
        "clips.txt",
        new TextEncoder().encode(concatContent)
      );

      // Join all clips into a single slideshow
      await ffmpeg.exec([
        "-f", "concat",
        "-safe", "0",
        "-i", "clips.txt",
        "-c", "copy",
        "slideshow.mp4",
      ]);

      // Add background music if provided
      if (audio) {
        const audioExtension =
          audio.name.split(".").pop()?.toLowerCase() || "mp3";
        const audioName = `background.${audioExtension}`;

        await ffmpeg.writeFile(audioName, await fetchFile(audio));

        await ffmpeg.exec([
          "-i", "slideshow.mp4",
          "-i", audioName,
          "-map", "0:v:0",
          "-map", "1:a:0",
          "-c:v", "copy",
          "-c:a", "aac",
          "-b:a", "192k",
          "-shortest",
          "output.mp4",
        ]);
      } else {
        await ffmpeg.exec([
          "-i", "slideshow.mp4",
          "-c", "copy",
          "output.mp4",
        ]);
      }

      // Read final video
      const output = await ffmpeg.readFile("output.mp4");

      if (typeof output === "string") {
        throw new Error("Could not read the exported video.");
      }

      const blob = new Blob([output as BlobPart], {
        type: "video/mp4",
      });

      setVideoUrl(URL.createObjectURL(blob));
      setExportProgress(100);
    } catch (error) {
      console.error("Video export error:", error);

      setExportError(
        error instanceof Error
          ? error.message
          : "Video export failed. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImage((previous) => (previous + 1) % images.length);
    }
  };

  const previousImage = () => {
    if (images.length > 0) {
      setCurrentImage(
        (previous) => (previous - 1 + images.length) % images.length
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f1e8] text-[#513c30]">
      <Sidebar />

      <main className="min-h-screen px-4 py-8 md:ml-64 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#a96648]">
              <Film size={17} />
              <span>AI Product Studio</span>
              <span className="text-[#b9a89b]">/</span>
              <span>Video Ad Creator</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Create a Video Ad
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#806b5e] md:text-base">
              Turn your product images into a slideshow video with your
              tagline and optional background music.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_0.9fr]">
            {/* Editor */}
            <section className="space-y-6">
              {/* Image uploader */}
              <div className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Product images</h2>
                  <span className="text-xs text-[#9b8577]">
                    {images.length} uploaded
                  </span>
                </div>

                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dfc8b8] bg-[#fcf8f4] px-4 py-6 text-center transition hover:border-[#a96648] hover:bg-[#faf1e9]">
                  <div className="mb-3 rounded-full bg-[#f1dfd1] p-3 text-[#a96648]">
                    <Upload size={23} />
                  </div>

                  <span className="text-sm font-semibold">
                    Upload product images
                  </span>

                  <span className="mt-1 text-xs text-[#9b8577]">
                    Select JPG, PNG or WebP images
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative overflow-hidden rounded-xl border border-[#eaded4] bg-[#fcf8f4]"
                      >
                        {imageUrls[index] && (
                          <img
                            src={imageUrls[index]}
                            alt={file.name}
                            className="aspect-square w-full object-cover"
                          />
                        )}

                        <div className="flex items-center justify-between gap-2 p-2">
                          <span className="truncate text-xs text-[#806b5e]">
                            {file.name}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            aria-label={`Remove ${file.name}`}
                            className="shrink-0 rounded-md p-1 text-[#a96648] hover:bg-[#f1dfd1]"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {index === currentImage && (
                          <span className="absolute left-2 top-2 rounded-full bg-[#513c30] px-2 py-1 text-[10px] font-medium text-white">
                            Preview
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ad settings */}
              <div className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-6">
                <h2 className="mb-4 font-semibold">Ad settings</h2>

                <label className="mb-2 block text-sm font-medium">
                  Ad text
                </label>

                <input
                  type="text"
                  value={adText}
                  onChange={(event) => setAdText(event.target.value)}
                  maxLength={80}
                  placeholder="Enter your product tagline"
                  className="w-full rounded-xl border border-[#e5d5c8] bg-[#fcf8f4] px-4 py-3 text-sm outline-none transition focus:border-[#a96648]"
                />

                <p className="mt-1 text-right text-xs text-[#a18c7e]">
                  {adText.length}/80
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Duration per image
                    </label>

                    <span className="text-sm font-semibold text-[#a96648]">
                      {duration} seconds
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={duration}
                    onChange={(event) =>
                      setDuration(Number(event.target.value))
                    }
                    className="w-full accent-[#a96648]"
                  />

                  <div className="mt-1 flex justify-between text-xs text-[#a18c7e]">
                    <span>1 sec</span>
                    <span>8 sec</span>
                  </div>

                  <p className="mt-2 text-xs text-[#9b8577]">
                    Estimated video length: {images.length * duration} seconds
                  </p>
                </div>
              </div>

              {/* Audio upload */}
              <div className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Background music</h2>
                  <Music2 size={19} className="text-[#a96648]" />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#dfc8b8] bg-[#fcf8f4] p-4 transition hover:border-[#a96648]">
                  <div className="rounded-lg bg-[#f1dfd1] p-3 text-[#a96648]">
                    <Music2 size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {audio ? audio.name : "Upload an audio file"}
                    </p>
                    <p className="mt-1 text-xs text-[#9b8577]">
                      Optional · MP3, WAV or FFmpeg-supported formats
                    </p>
                  </div>

                  <Upload size={17} className="text-[#a96648]" />

                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudio}
                    className="hidden"
                  />
                </label>

                {audio && (
                  <div className="mt-3 flex items-center gap-3">
                    {audioUrl && (
                      <audio
                        controls
                        src={audioUrl}
                        className="h-10 min-w-0 flex-1"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => setAudio(null)}
                      className="rounded-lg p-2 text-[#a96648] hover:bg-[#f8f1e8]"
                      aria-label="Remove audio"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Preview and export */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Video preview</h2>

                  <span className="rounded-full bg-[#f5e8dd] px-3 py-1 text-xs text-[#a96648]">
                    16:9 landscape
                  </span>
                </div>

                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#2c211b]">
                  {imageUrls[currentImage] ? (
                    <>
                      <img
                        src={imageUrls[currentImage]}
                        alt="Selected product preview"
                        className="absolute inset-0 h-full w-full object-contain"
                      />

                      {adText.trim() && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-5 pt-12 text-center">
                          <p className="text-lg font-semibold text-white drop-shadow md:text-2xl">
                            {adText}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center text-[#d7c5b8]">
                      <ImagePlus size={38} strokeWidth={1.3} />
                      <p className="mt-3 text-sm">
                        Upload images to preview your ad
                      </p>
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={previousImage}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white hover:bg-black/70"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white hover:bg-black/70"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="mt-4 flex items-center justify-between text-xs text-[#9b8577]">
                    <span>
                      Image {currentImage + 1} of {images.length}
                    </span>
                    <span>{duration}s per image</span>
                  </div>
                )}

                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {imageUrls.map((url, index) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setCurrentImage(index)}
                        className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                          currentImage === index
                            ? "border-[#a96648]"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-12 w-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export */}
              <div className="rounded-2xl border border-[#e8d9cc] bg-white p-5 shadow-sm md:p-6">
                <h2 className="mb-2 font-semibold">Export video</h2>

                <p className="mb-4 text-sm leading-6 text-[#806b5e]">
                  Export your images as an MP4 slideshow with your tagline
                  and optional background music. Processing happens in your
                  browser and may take a while for large images.
                </p>

                {exportError && (
                  <div className="mb-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span className="break-words">{exportError}</span>
                  </div>
                )}

                {isExporting && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-[#806b5e]">
                      <span>Rendering video...</span>
                      <span>{exportProgress}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#f1dfd1]">
                      <div
                        className="h-full rounded-full bg-[#a96648] transition-all"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={exportVideo}
                  disabled={images.length === 0 || isExporting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#513c30] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#674b3b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Creating video...
                    </>
                  ) : (
                    <>
                      <Film size={18} />
                      Export MP4
                    </>
                  )}
                </button>

                {videoUrl && (
                  <div className="mt-5 border-t border-[#eee1d7] pt-5">
                    <p className="mb-3 text-sm font-semibold">
                      Your video is ready
                    </p>

                    <video
                      src={videoUrl}
                      controls
                      className="w-full rounded-xl bg-black"
                    />

                    <a
                      href={videoUrl}
                      download="product-ad.mp4"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9c3b3] px-4 py-3 text-sm font-semibold text-[#513c30] transition hover:bg-[#fcf8f4]"
                    >
                      <Download size={17} />
                      Download MP4
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#e8d9cc] bg-[#f3e8dd] p-4 text-xs leading-5 text-[#806b5e]">
                <strong className="text-[#513c30]">Note:</strong> The tagline
                is rendered onto each image before video export. This version
                creates a basic slideshow; animated transitions and
                AI-generated video are not included yet.
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}