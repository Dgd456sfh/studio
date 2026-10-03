
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  WandSparkles,
  Scissors,
  Clapperboard,
  Layers3,
  Zap,
} from "lucide-react";

const tools = [
  {
    icon: Scissors,
    title: "Background Remover",
    description:
      "Remove image backgrounds and make your product stand out.",
    href: "/studio/background-remover",
  },
  {
    icon: ImageIcon,
    title: "Smart Crop",
    description:
      "Resize and crop product images for different platforms.",
    href: "/studio/smart-crop",
  },
  {
    icon: Sparkles,
    title: "AI Ad Generator",
    description:
      "Turn your creative prompts into product advertisement images.",
    href: "/studio/prompt-ad",
  },
  {
    icon: Clapperboard,
    title: "Video Ad Creator",
    description:
      "Create promotional videos using your product images.",
    href: "/studio/ad-creator",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f1e8] text-[#513c30]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#513c30] text-white">
            <Sparkles size={21} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            AI Product Studio
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="#features" className="transition hover:text-[#a96648]">
            Features
          </Link>
          <Link href="/studio" className="transition hover:text-[#a96648]">
            AI Tools
          </Link>
          <Link href="/products" className="transition hover:text-[#a96648]">
            My Products
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full bg-[#513c30] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#765541]"
        >
          Dashboard <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-2 lg:px-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9c5b3] bg-[#f1e5d8] px-4 py-2 text-sm font-medium text-[#875b42]">
            <Sparkles size={15} />
            Your all-in-one AI creative workspace
          </div>

          <h1 className="max-w-2xl text-5xl leading-[1.12] font-bold tracking-tight md:text-6xl">
            Make your products
            <span className="text-[#a96648]"> impossible to ignore.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#806b5d]">
            Create stunning product visuals, generate advertisements,
            edit images, and bring your ideas to life — all in one
            creative studio.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-full bg-[#513c30] px-7 py-4 font-semibold text-white shadow-lg shadow-[#513c30]/15 transition hover:-translate-y-0.5 hover:bg-[#765541]"
            >
              Explore AI Tools <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-[#cbb5a2] bg-white/60 px-7 py-4 font-semibold transition hover:bg-white"
            >
              View My Products
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#806b5d]">
            <span className="flex items-center gap-2">
              <Zap size={16} className="text-[#a96648]" />
              AI-powered creativity
            </span>
            <span className="flex items-center gap-2">
              <Layers3 size={16} className="text-[#a96648]" />
              All tools in one place
            </span>
          </div>
        </div>

        {/* Visual panel */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -top-8 -right-5 h-36 w-36 rounded-full bg-[#e6c7a9] opacity-60 blur-3xl" />
          <div className="absolute -bottom-8 -left-5 h-36 w-36 rounded-full bg-[#c78f6c] opacity-30 blur-3xl" />

          <div className="relative rounded-[2rem] border border-white/70 bg-[#fffaf4] p-5 shadow-2xl shadow-[#513c30]/10 md:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#513c30]">
                  Creative Workspace
                </p>
                <p className="mt-1 text-xs text-[#9a8372]">
                  Your ideas, made visual
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1e5d8] text-[#a96648]">
                <WandSparkles size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-[#ead8c6] p-4">
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#c59a76] shadow-inner">
                    <div className="h-20 w-14 rounded-xl bg-[#f8eee2] shadow-lg" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[#513c30]">Product Visuals</p>
                  <p className="mt-1 text-xs text-[#806b5d]">Make it stand out</p>
                </div>
              </div>

              <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-[#d8c9b8] p-4">
                <div className="flex h-full items-center justify-center">
                  <div className="relative flex h-32 w-24 items-center justify-center rounded-2xl bg-[#f5e9da] shadow-xl">
                    <Sparkles size={32} className="text-[#a96648]" />
                    <div className="absolute -right-3 -bottom-2 rounded-lg bg-white p-2 shadow-md">
                      <WandSparkles size={17} className="text-[#a96648]" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-[#513c30]">AI Creation</p>
                  <p className="mt-1 text-xs text-[#806b5d]">From prompt to ad</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f5ece2] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#a96648]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Ready to create?</p>
                  <p className="text-xs text-[#806b5d]">
                    Start with your next big idea
                  </p>
                </div>
              </div>
              <Link
                href="/studio"
                aria-label="Open AI tools"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#513c30] text-white transition hover:bg-[#765541]"
              >
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#fffaf4] px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold tracking-[0.2em] text-[#a96648] uppercase">
              Explore the studio
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to create
            </h2>
            <p className="mt-4 leading-7 text-[#806b5d]">
              Powerful creative tools to help you prepare, enhance,
              and promote your products.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group rounded-2xl border border-[#eadbcd] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c99c7d] hover:shadow-xl hover:shadow-[#513c30]/5"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5ece2] text-[#a96648] transition group-hover:bg-[#513c30] group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold">{tool.title}</h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#806b5d]">
                    {tool.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a96648]">
                    Open tool
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#513c30] p-8 text-white md:flex-row md:items-center md:p-12">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold tracking-widest text-[#e6b997] uppercase">
              Bring your vision to life
            </p>
            <h2 className="text-3xl leading-tight font-bold md:text-4xl">
              Your next great product ad starts here.
            </h2>
            <p className="mt-4 leading-7 text-[#e7d7ca]">
              Open your creative workspace and start building
              something memorable.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f8f1e8] px-7 py-4 font-semibold text-[#513c30] transition hover:bg-white"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5d6c8] px-6 py-7 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-[#806b5d] sm:flex-row">
          <Link href="/" className="font-bold text-[#513c30]">
            AI Product Studio
          </Link>
          <p>Creative tools for your product journey.</p>
          <Link href="/dashboard" className="transition hover:text-[#a96648]">
            Go to Dashboard
          </Link>
        </div>
      </footer>
    </main>
  );
}