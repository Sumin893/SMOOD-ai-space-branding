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
    <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-8 py-6">
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-extrabold tracking-[0.16em] text-[#2684FF]">SMOOD</div>
        <div className="text-sm font-semibold text-[#806f64]">AI Space Branding</div>
      </div>

      <nav className="flex items-center gap-1 rounded-full border border-[#E8DED4] bg-[#FFFDF9]/90 p-1.5 shadow-[0_8px_28px_rgba(91,69,54,0.06)]">
        {steps.map((step) => {
          const active = pathname === step.path;
          return (
            <div
              key={step.path}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-[#B97350] text-white" : "text-[#806F64]"}`}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active ? "bg-white/90 text-[#B97350]" : "bg-[#F3EAE2] text-[#806F64]"}`}>
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
