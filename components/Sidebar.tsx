
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Sparkles,
  Image,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Products", href: "/products", icon: Package },
  { name: "Image Tools", href: "/studio", icon: Image },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#e7d8c5] bg-[#f8f1e7] p-6 text-[#493629]">
      <Link href="/dashboard" className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-[#895b42] p-2 text-white">
          <Sparkles size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold">Product Studio</h1>
          <p className="text-xs text-[#9a806b]">Your creative space</p>
        </div>
      </Link>

      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#a48b75]">
        Workspace
      </p>

      <nav className="flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-[#895b42] font-semibold text-white shadow-md"
                  : "text-[#705640] hover:bg-[#eee1d1]"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-[#e7d8c5] bg-[#f1e5d6] p-4">
        <Sparkles size={20} className="mb-2 text-[#895b42]" />
        <p className="text-sm font-semibold">Create something special</p>
        <p className="mt-1 text-xs text-[#8e7661]">
          Bring your product ideas to life.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#895b42] px-3 py-2 text-xs font-medium text-white hover:bg-[#704630]"
        >
          <PlusCircle size={15} />
          Add Product
        </Link>
      </div>
    </aside>
  );
}