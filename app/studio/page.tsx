
"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import {
  Sparkles,
  Image as ImageIcon,
  Scissors,
  Film,
  WandSparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const tools = [
  {
    title: "Background Remover",
    description:
      "Remove image backgrounds and create clean product visuals.",
    detail: "Remove backgrounds",
    href: "/studio/background-remover",
    icon: Scissors,
    number: "01",
  },
  {
    title: "Smart Crop",
    description:
      "Resize and crop product photos for different platforms and layouts.",
    detail: "Crop product images",
    href: "/studio/smart-crop",
    icon: ImageIcon,
    number: "02",
  },
  {
    title: "Create a Video Ad",
    description:
      "Turn product images, taglines and music into a downloadable MP4 ad.",
    detail: "Create video ads",
    href: "/studio/ad-creator",
    icon: Film,
    number: "03",
  },
  {
    title: "AI Image Generator",
    description:
      "Describe your creative idea in a prompt and generate an ad visual.",
    detail: "Generate with prompts",
    href: "/studio/prompt-ad",
    icon: WandSparkles,
    number: "04",
  },
];

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#392d25]">
      <Sidebar />

      <div className="min-h-screen md:ml-64">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-9 lg:px-12">
          {/* Header */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-extrabold tracking-[2px] text-[#a56a4c]">
                CREATIVE WORKSPACE
              </p>
              <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
                Image Studio
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8b7d71]">
                Everything you need to create, edit and transform your
                product visuals in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-[#f2e8dc] px-4 py-2.5 text-xs font-semibold text-[#956044]">
              <Sparkles size={15} />
              AI Product Studio
            </div>
          </header>

          {/* Hero */}
          <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#4c342a] via-[#76503b] to-[#94674c] px-6 py-9 text-[#fff9f1] shadow-lg md:px-10 md:py-12">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[1.5px] text-[#e9c6a5]">
                <WandSparkles size={14} />
                YOUR CREATIVE TOOLKIT
              </div>

              <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-5xl">
                Bring your product
                <br />
                <span className="italic text-[#e8bb96]">
                  vision to life.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-[#e6d6c9]">
                Remove backgrounds, prepare product images, create video
                advertisements or generate new ad visuals using AI prompts.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {[
                  "Image editing",
                  "AI ad creation",
                  "Video export",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="flex items-center gap-2 text-xs text-[#f1dfcf]"
                  >
                    <CheckCircle2 size={15} className="text-[#e9bb94]" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative artwork */}
            <div className="pointer-events-none absolute -right-12 -top-16 hidden h-80 w-80 items-center justify-center rounded-full border border-white/10 md:flex">
              <div className="flex h-60 w-60 items-center justify-center rounded-full border border-white/15">
                <div className="flex h-40 w-32 rotate-6 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9eee0] to-[#e5c5a7] text-[#6a4937] shadow-2xl">
                  <Sparkles size={35} strokeWidth={1.3} />
                  <span className="mt-3 text-xs">Product</span>
                  <strong className="font-serif text-lg font-medium">
                    Perfection
                  </strong>
                  <div className="mt-3 h-px w-10 bg-[#b48a6d]" />
                  <span className="mt-2 text-[7px] tracking-[2px]">
                    CREATIVE STUDIO
                  </span>
                </div>
              </div>
            </div>

            <span className="pointer-events-none absolute right-16 top-10 hidden text-3xl text-[#f3d0ad] md:block">
              ✦
            </span>
            <span className="pointer-events-none absolute bottom-10 right-28 hidden text-2xl text-[#f3d0ad] md:block">
              ✧
            </span>
          </section>

          {/* Tools heading */}
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 text-[10px] font-extrabold tracking-[2px] text-[#a56a4c]">
                  YOUR WORKSPACE
                </p>
                <h2 className="font-serif text-2xl font-medium">
                  Creative tools
                </h2>
                <p className="mt-1 text-xs text-[#9b8d81]">
                  Select a tool to get started.
                </p>
              </div>

              <span className="rounded-full border border-[#e9d9ca] bg-white px-3 py-1.5 text-xs text-[#86644e]">
                {tools.length} tools available
              </span>
            </div>

            {/* Tool cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {tools.map((tool) => {
                const Icon = tool.icon;

                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group rounded-2xl border border-[#eee5db] bg-[#fffdfa] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#d8b99f] hover:shadow-lg md:p-6"
                  >
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f6ede3] text-[#a36c4e] transition group-hover:bg-[#a86e4e] group-hover:text-white">
                        <Icon size={22} strokeWidth={1.8} />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-[#b5a395]">
                          {tool.number}
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee1d7] text-[#a36c4e] transition group-hover:border-[#a86e4e] group-hover:bg-[#a86e4e] group-hover:text-white">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#46362b]">
                      {tool.title}
                    </h3>

                    <p className="mt-2 min-h-12 text-xs leading-6 text-[#9b8d81]">
                      {tool.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-bold text-[#a36c4e]">
                      {tool.detail}
                      <ArrowUpRight
                        size={14}
                        className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[#eadfd4] py-5 text-[10px] tracking-wide text-[#a19387]">
            <span className="font-bold tracking-[1.5px]">
              PRODUCT STUDIO
            </span>
            <span>Made for creative entrepreneurs ✦</span>
          </footer>
        </div>
      </div>
    </main>
  );
}