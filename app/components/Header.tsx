"use client";

import { usePathname } from "next/navigation";

const steps = [
  { number: 1, label: "브랜드 컨셉", path: "/" },
  { number: 2, label: "무드보드", path: "/moodboard" },
  { number: 3, label: "공간 디자인", path: "/space-design" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6">
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-extrabold tracking-[0.16em] text-[#2684FF]">SMOOD</div>
        <div className="text-sm font-semibold text-slate-500">AI Space Branding</div>
      </div>

      <nav className="flex items-center gap-3 rounded-full border border-blue-100 bg-white/80 p-2 shadow-sm">
        {steps.map((step) => {
          const active = pathname === step.path;

          return (
            <div
              key={step.path}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active ? "bg-[#2684FF] text-white shadow-sm" : "text-slate-500"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  active ? "bg-white text-[#2684FF]" : "bg-blue-50 text-slate-500"
                }`}
              >
                {step.number}
              </span>
              {step.label}
            </div>
          );
        })}
      </nav>
    </header>
  );
}
