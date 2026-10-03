
"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  Image as ImageIcon,
  Download,
  Sparkles,
  LoaderCircle,
  RefreshCw,
  Crop,
  ArrowUpRight,
  ImagePlus,
  CheckCircle2,
  WandSparkles,
  Maximize2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const cropSizes = [
  { label: "Square", detail: "Product listings", width: 1080, height: 1080 },
  { label: "Portrait", detail: "Social media posts", width: 1080, height: 1350 },
  { label: "Landscape", detail: "Website banners", width: 1200, height: 628 },
  { label: "Story", detail: "Stories & reels", width: 1080, height: 1920 },
];

export default function SmartCropPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [selectedSize, setSelectedSize] = useState(cropSizes[0]);
  const [croppedUrl, setCroppedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setImage(file);
    setCroppedUrl("");
    setError("");
  }

  async function cropImage() {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setCroppedUrl("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("width", String(selectedSize.width));
      formData.append("height", String(selectedSize.height));

      const response = await fetch("/api/smart-crop", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image cropping failed.");
      }

      setCroppedUrl(data.croppedUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setImage(null);
    setCroppedUrl("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-[#f8f1e8] text-[#513c30]">
      <Sidebar />

      <main className="min-h-screen md:ml-64">
        <div className="mx-auto max-w-[1600px] px-6 py-7 sm:px-10 lg:px-14">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#e7d8c7] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a96648] text-[#fff8ef] shadow-sm">
                <Sparkles size={21} />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#684a39]">
                atelier.studio
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#a18772] sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#a4a276] shadow-[0_0_0_4px_#eae4d4]" />
                Your creative space
              </div>
              <a
                href="/products"
                className="flex items-center gap-2 rounded-xl border border-[#eadccc] bg-[#fffaf4]/70 px-3 py-2.5 text-xs text-[#936b53] transition hover:bg-white"
              >
                <ImageIcon size={15} />
                <span className="hidden sm:inline">My Collection</span>
                <ArrowUpRight size={14} />
              </a>
            </div>
          </header>

          {/* Hero */}
          <section className="relative flex flex-col justify-between gap-8 overflow-hidden border-b border-[#e7d8c7] py-10 md:flex-row md:items-center md:py-12">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ac7154]">
                <span className="h-px w-8 bg-[#b87b5b]" />
                The creative workshop
              </div>

              <h1 className="font-serif text-5xl leading-[1.05] tracking-[-0.045em] text-[#4b352a] sm:text-6xl lg:text-[68px]">
                Every frame,
                <br />
                <span className="italic text-[#bc795b]">in harmony.</span>
              </h1>

              <p className="mt-5 max-w-lg font-serif text-base leading-7 text-[#927b68]">
                Give every product photo its perfect proportions. Shape your
                images for stores, social posts, banners and stories.
              </p>

              <div className="mt-7 flex flex-wrap gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eddbca] bg-[#fff8f0] text-[#ae7152]">
                    <ImageIcon size={18} />
                  </div>
                  <div>
                    <p className="font-serif text-xl leading-none text-[#684a39]">
                      {image ? "01" : "00"}
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a58b75]">
                      Image selected
                    </p>
                  </div>
                </div>

                <div className="h-10 w-px bg-[#e6d6c5]" />

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eddbca] bg-[#fff8f0] text-[#ae7152]">
                    <Crop size={18} />
                  </div>
                  <div>
                    <p className="font-serif text-xl leading-none text-[#684a39]">
                      {selectedSize.label}
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a58b75]">
                      Selected format
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative illustration */}
            <div className="relative hidden h-56 w-64 shrink-0 items-center justify-center md:flex lg:mr-8">
              <div className="absolute inset-0 rounded-t-[130px] rounded-b-[28px] border border-[#e9cdb4] bg-[#f5e2cf]" />
              <div className="absolute inset-3 rounded-t-[120px] rounded-b-[22px] border border-[#ecd4bd] bg-[radial-gradient(ellipse_at_50%_35%,#fff2db_0%,#f3d9bf_70%,#e9c5a8_100%)]" />
              <div className="absolute right-9 top-7 h-20 w-20 rounded-full bg-[#f1c58d]/80" />
              <div className="absolute bottom-7 left-8 h-5 w-48 rounded-sm bg-[#bd896a]" />
              <div className="absolute bottom-12 left-[74px] h-20 w-14 rounded-[45%] bg-gradient-to-b from-[#c9a98d] to-[#a77d60]" />
              <div className="absolute bottom-[102px] left-[91px] h-12 w-2 rotate-[-15deg] rounded-full bg-[#77816b]" />
              <div className="absolute bottom-[133px] left-[77px] h-8 w-5 -rotate-45 rounded-tl-full rounded-br-full bg-[#7e8c72]" />
              <div className="absolute bottom-[137px] left-[96px] h-8 w-5 rotate-45 rounded-tr-full rounded-bl-full bg-[#6d8067]" />
              <Sparkles className="absolute right-12 top-12 text-[#fff6e4]" size={19} />
              <Sparkles className="absolute left-12 top-16 text-[#fff6e4]" size={14} />
              <p className="absolute bottom-3 right-5 font-serif text-xs italic text-[#fff7eb]">
                A world of your own
              </p>
            </div>
          </section>

          {/* Workspace */}
          <section className="pt-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-[#b47759]">
                  Let&apos;s make something
                </p>
                <h2 className="font-serif text-3xl tracking-tight text-[#513b30] sm:text-4xl">
                  Find the perfect frame<span className="text-[#bd795b]">.</span>
                </h2>
                <p className="mt-2 font-serif text-sm text-[#9a806d]">
                  A thoughtful crop makes every product shine.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#ecdccc] bg-[#fff9f2] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#ad7355]">
                <Sparkles size={13} />
                Your workshop
              </div>
            </div>

            <div className="grid items-start gap-5 xl:grid-cols-[1fr_1fr]">
              {/* Left: Upload and options */}
              <div className="rounded-[20px] border border-[#ecdfd0] bg-[#fffaf4] p-5 shadow-[0_8px_30px_rgba(111,75,48,0.035)] sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#edd8c6] bg-[#f9eee3] text-[#ae7657]">
                    <span className="font-serif text-sm">01</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#634838]">
                      Your original image
                    </h3>
                    <p className="mt-0.5 font-serif text-xs text-[#a18773]">
                      Start with a product photo.
                    </p>
                  </div>
                </div>

                <label className="group flex min-h-[230px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#dfc5ae] bg-[#f9f0e6] text-center transition hover:border-[#b87959] hover:bg-[#f6e9dc]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      handleImageChange(event.target.files?.[0])
                    }
                    className="hidden"
                  />
                  {preview ? (
                    <div className="flex min-h-[230px] w-full flex-col items-center justify-center p-3">
                      <img
                        src={preview}
                        alt="Uploaded product"
                        className="max-h-[230px] max-w-full rounded-xl object-contain"
                      />
                      <span className="mt-3 text-xs text-[#9b765b]">
                        Click to choose a different image
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center px-4 py-8">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ecd5c0] bg-[#fff9f2] text-[#b57959] transition group-hover:scale-105">
                        <ImagePlus size={25} />
                      </div>
                      <p className="font-serif text-lg text-[#72523e]">
                        Add your image
                      </p>
                      <p className="mt-1 text-xs text-[#a68a73]">
                        PNG, JPG, or WEBP · Maximum 10 MB
                      </p>
                      <span className="mt-4 rounded-lg bg-[#8f5e43] px-4 py-2 text-xs font-medium text-white transition group-hover:bg-[#774b35]">
                        Browse files
                      </span>
                    </div>
                  )}
                </label>

                {image && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#eee0d2] bg-[#fcf5ed] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <ImageIcon size={16} className="shrink-0 text-[#ad7555]" />
                      <span className="truncate text-xs text-[#76563f]">
                        {image.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="shrink-0 text-xs font-semibold text-[#a4775d] hover:text-[#754b36]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="mb-4 mt-7 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#edd8c6] bg-[#f9eee3] text-[#ae7657]">
                    <span className="font-serif text-sm">02</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#634838]">
                      Choose your canvas
                    </h3>
                    <p className="mt-0.5 font-serif text-xs text-[#a18773]">
                      Select a format for your image.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {cropSizes.map((size) => {
                    const selected = selectedSize.label === size.label;

                    return (
                      <button
                        key={size.label}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setCroppedUrl("");
                          setError("");
                        }}
                        className={`group flex flex-col items-start rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-[#b87959] bg-[#f8eee4] shadow-[0_3px_12px_rgba(111,75,48,0.06)]"
                            : "border-[#eee0d2] bg-[#fffdf9] hover:border-[#d9bda5] hover:bg-[#fcf5ed]"
                        }`}
                      >
                        <div className="mb-3 flex h-12 w-full items-center justify-center">
                          <div
                            className={`border-2 transition ${
                              selected
                                ? "border-[#b87959] bg-[#f0d9c4]"
                                : "border-[#c9b39f] bg-[#f5e8d9] group-hover:border-[#b87959]"
                            } ${
                              size.label === "Square"
                                ? "h-10 w-10 rounded-md"
                                : size.label === "Portrait"
                                  ? "h-12 w-8 rounded-md"
                                  : size.label === "Landscape"
                                    ? "h-7 w-12 rounded-md"
                                    : "h-12 w-6 rounded-md"
                            }`}
                          />
                        </div>
                        <span className="font-serif text-base text-[#634838]">
                          {size.label}
                        </span>
                        <span className="mt-1 text-[11px] text-[#a4775d]">
                          {size.width} × {size.height}
                        </span>
                        <span className="mt-1 text-[10px] leading-4 text-[#a58b75]">
                          {size.detail}
                        </span>
                        {selected && (
                          <span className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#a76c4e]">
                            <CheckCircle2 size={12} />
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={cropImage}
                  disabled={!image || loading}
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#8f5e43] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#774b35] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={17} />
                      Preparing your crop...
                    </>
                  ) : (
                    <>
                      <WandSparkles size={17} />
                      Crop Image
                    </>
                  )}
                </button>

                {error && (
                  <p className="mt-3 rounded-xl border border-[#efc9be] bg-[#fff1ed] p-3 text-xs leading-5 text-[#a43e31]">
                    {error}
                  </p>
                )}

                <p className="mt-3 text-center text-[11px] leading-5 text-[#a58b75]">
                  Automatic subject positioning uses Cloudinary image transformations.
                </p>
              </div>

              {/* Right: Result */}
              <div className="space-y-5">
                <div className="rounded-[20px] border border-[#ecdfd0] bg-[#fffaf4] p-5 shadow-[0_8px_30px_rgba(111,75,48,0.035)] sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#edd8c6] bg-[#f9eee3] text-[#ae7657]">
                      <span className="font-serif text-sm">03</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#634838]">
                        The little preview
                      </h3>
                      <p className="mt-0.5 font-serif text-xs text-[#a18773]">
                        See how your new frame looks.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-2xl border border-[#e9d9c8] bg-[#f8f0e6]">
                    {croppedUrl ? (
                      <img
                        src={croppedUrl}
                        alt="Cropped product"
                        className="max-h-[400px] max-w-full object-contain"
                      />
                    ) : loading ? (
                      <div className="flex flex-col items-center px-5 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e9d3bd] bg-[#fff8ef] text-[#b47758]">
                          <LoaderCircle className="animate-spin" size={28} />
                        </div>
                        <p className="font-serif text-lg text-[#80634d]">
                          A little magic in progress
                        </p>
                        <p className="mt-1 text-xs text-[#a58a73]">
                          Preparing your perfect frame.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center px-5 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e9d3bd] bg-[#fff8ef] text-[#b47758]">
                          <Crop size={27} />
                        </div>
                        <p className="font-serif text-lg text-[#80634d]">
                          Your cropped image will appear here
                        </p>
                        <p className="mt-1 max-w-xs text-xs leading-5 text-[#a58a73]">
                          Upload an image, choose a format and create your crop.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee1d3] pt-4">
                    <div className="flex items-center gap-2 text-xs text-[#9b8069]">
                      <Maximize2 size={14} />
                      Selected format
                    </div>
                    <span className="text-xs font-semibold text-[#79553f]">
                      {selectedSize.label} · {selectedSize.width} × {selectedSize.height}
                    </span>
                  </div>

                  {croppedUrl ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#8f5e43] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#774b35]"
                        href={croppedUrl}
                        download={`product-${selectedSize.label.toLowerCase()}.png`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Download size={17} />
                        Download Image
                        <ArrowUpRight size={14} />
                      </a>
                      <button
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e9d8c6] bg-[#fffaf4] px-4 py-3 text-xs font-semibold text-[#92684e] transition hover:bg-[#f7eadc]"
                        onClick={reset}
                        type="button"
                      >
                        <RefreshCw size={15} />
                        Try another
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl border border-[#eadbcb] bg-[#fcf7f1] px-4 py-3 text-xs text-[#ad927a]">
                      Your finished image will be ready to download here.
                    </div>
                  )}
                </div>

                <div className="rounded-[20px] border border-[#e8d5c2] bg-[#f2e4d5] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] text-[#a76d4f]">
                      <Sparkles size={19} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl text-[#604532]">
                        A frame for every moment
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#96765d]">
                        Choose a format that suits your platform. Automatic
                        positioning helps keep the subject in view, though
                        some photos may need a different crop.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e7d8c7] py-5 text-[10px] tracking-wide text-[#a38a75]">
            <span>atelier.studio · Your creative space</span>
            <span>
              Made for little ideas with big stories{" "}
              <Sparkles className="ml-1 inline" size={12} />
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}