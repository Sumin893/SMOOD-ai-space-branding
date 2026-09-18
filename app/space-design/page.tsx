"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import Header from "../components/Header";
import { generateInteriorRender, InteriorRenderResult } from "../../lib/generateInteriorRender";

type ViewState = "input" | "loading" | "result";
type MoodboardData = { brandName: string; category: string; target: string; mood: string };

const defaultBrand: MoodboardData = {
  brandName: "ONDESSERT",
  category: "디저트 카페",
  target: "20~30대 여성 / 데이트 / 친구 모임",
  mood: "따뜻한",
};

const loadingMessages = [
  "브랜드 컨셉을 분석하고 있어요",
  "공간 구성을 생성하고 있어요",
  "무드와 소재를 반영하고 있어요",
  "인테리어 렌더를 완성하고 있어요",
];

const elementGroups = [
  { name: "가구", items: ["Table", "Chair", "Counter", "Sofa"] },
  { name: "조명", items: ["Pendant", "Wall Light"] },
  { name: "마감재", items: ["Pastel Tile", "Light Wood"] },
  { name: "브랜드 요소", items: ["Signage", "Plant"] },
];

const colors = ["#F4B6B8", "#F7D9D9", "#B7DCE8", "#C9DDD1", "#F5EBDD"];
const materials = ["Light Wood", "Pastel Tile", "Fabric", "Matte Metal"];

export default function SpaceDesignPage() {
  const [view, setView] = useState<ViewState>("input");
  const [area, setArea] = useState(50);
  const [messageIndex, setMessageIndex] = useState(0);
  const [render, setRender] = useState<InteriorRenderResult | null>(null);
  const [brand, setBrand] = useState<MoodboardData>(defaultBrand);
  const [selectedElement, setSelectedElement] = useState("Counter");
  const [viewMode, setViewMode] = useState<"2D" | "3D">("3D");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("smoodMoodboard");
    if (!saved) return;
    try { setBrand({ ...defaultBrand, ...JSON.parse(saved) }); } catch { setBrand(defaultBrand); }
  }, []);

  useEffect(() => {
    if (view !== "loading") return;
    const interval = window.setInterval(() => {
      setMessageIndex((current) => Math.min(current + 1, loadingMessages.length - 1));
    }, 780);
    return () => window.clearInterval(interval);
  }, [view]);

  const generate = async () => {
    setView("loading");
    setMessageIndex(0);
    setNotice("");
    const result = await generateInteriorRender();
    setRender(result);
    setView("result");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (area > 0) void generate();
  };

  const spaceSize = area <= 30 ? "Compact" : area <= 70 ? "Standard" : "Large";

  if (view === "input") {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="mx-auto flex max-w-6xl items-center justify-center px-8 py-20">
          <div className="grid w-full grid-cols-[1.1fr_0.9fr] overflow-hidden rounded-[36px] border border-[#E8DED4] bg-[#FFFDF9] shadow-[0_28px_90px_rgba(91,69,54,0.12)]">
            <div className="flex min-h-[470px] flex-col justify-center bg-[#EAD7C7] p-14">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#9A5E40]">Space Composer</p>
              <h1 className="max-w-xl text-5xl font-extrabold leading-[1.18] text-[#3F332C]">당신의 브랜드 공간을 만들어볼게요</h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B5A50]">매장 면적을 입력하면 앞서 완성한 브랜드 컨셉을 바탕으로 공간 디자인을 구성합니다.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center p-14">
              <label htmlFor="area" className="text-sm font-bold text-[#6B5A50]">매장 면적 (㎡)</label>
              <div className="relative mt-3">
                <input id="area" type="number" min="1" value={area} onChange={(event) => setArea(Number(event.target.value))} className="w-full rounded-[22px] border border-[#E2D4C8] bg-white px-6 py-5 text-3xl font-bold text-[#3F332C] outline-none transition focus:border-[#B97350]" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#9B8B80]">㎡</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-[#806F64]">
                <span>{spaceSize} Space</span>
                <span>입력값은 결과 화면에 반영됩니다</span>
              </div>
              <button type="submit" className="mt-9 rounded-[22px] bg-[#B97350] px-7 py-5 text-base font-extrabold text-white shadow-[0_14px_32px_rgba(185,115,80,0.22)] transition hover:bg-[#995D3F]">AI 공간 디자인 생성하기</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (view === "loading") {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="mx-auto max-w-[1440px] px-8 pb-10 pt-4">
          <div className="mb-7 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B97350]">Generating Space</p>
            <h1 className="mt-2 text-2xl font-extrabold text-[#3F332C]">{loadingMessages[messageIndex]}</h1>
          </div>
          <div className="grid grid-cols-[230px_minmax(0,1fr)_270px] gap-5">
            <SkeletonPanel lines={7} />
            <div className="aspect-[16/10] animate-pulse rounded-[28px] bg-[#E5D8CD]">
              <div className="flex h-full items-center justify-center"><div className="h-14 w-14 rounded-full border-4 border-[#CCB39F] border-t-[#B97350]" /></div>
            </div>
            <SkeletonPanel lines={6} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-[1440px] px-8 pb-10 pt-3">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B97350]">AI Space Editor</p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#3F332C]">{brand.brandName} 공간 디자인</h1>
          </div>
          <div className="flex items-center gap-2">
            {["저장", "미리보기", "다시 생성", "게시하기"].map((action) => (
              <button key={action} onClick={() => action === "다시 생성" ? void generate() : setNotice(`${action} 기능은 데모 화면입니다.`)} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${action === "게시하기" ? "border-[#B97350] bg-[#B97350] text-white hover:bg-[#995D3F]" : "border-[#E1D5CB] bg-[#FFFDF9] text-[#6B5A50] hover:border-[#B97350]"}`}>{action}</button>
            ))}
          </div>
        </div>
        {notice && <div className="mb-4 rounded-xl border border-[#E8DED4] bg-[#FFF9F3] px-4 py-3 text-sm text-[#6B5A50]">{notice}</div>}

        <div className="grid grid-cols-[230px_minmax(0,1fr)_270px] gap-5">
          <aside className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-5 shadow-[0_12px_40px_rgba(91,69,54,0.06)]">
            <h2 className="text-lg font-extrabold text-[#3F332C]">공간 요소</h2>
            <div className="mt-5 space-y-5">
              {elementGroups.map((group) => (
                <div key={group.name}>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#9B8B80]">{group.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map((item) => <button key={item} onClick={() => setSelectedElement(item)} className={`min-h-14 rounded-xl border px-2 text-xs font-bold transition ${selectedElement === item ? "border-[#B97350] bg-[#F2E5DB] text-[#A36445]" : "border-[#ECE3DB] bg-white text-[#806F64] hover:border-[#D5B49D]"}`}>{item}</button>)}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="relative min-w-0 overflow-hidden rounded-[24px] bg-[#2E2926] shadow-[0_18px_50px_rgba(63,51,44,0.16)]">
            <Image src={render?.imageUrl || "/renders/dessert-cafe.png"} alt="따뜻한 파스텔 톤의 ONDESSERT 디저트 카페 인테리어 렌더" width={1536} height={1024} priority className="h-full min-h-[640px] w-full object-cover" />
            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold text-[#6B5A50] shadow-sm backdrop-blur">AI Generated Interior</div>
            <div className="absolute right-5 top-5 flex rounded-full bg-[#3F332C]/75 p-1 backdrop-blur">
              {(["2D", "3D"] as const).map((mode) => <button key={mode} onClick={() => setViewMode(mode)} className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${viewMode === mode ? "bg-[#FFFDF9] text-[#3F332C]" : "text-white"}`}>{mode}</button>)}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-20 text-white">
              <div className="text-xl font-extrabold">{area}㎡ {spaceSize} Dessert Cafe Interior</div>
              <div className="mt-1 text-sm text-white/80">Brand Concept Applied · {viewMode} View</div>
            </div>
          </div>

          <aside className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-5 shadow-[0_12px_40px_rgba(91,69,54,0.06)]">
            <h2 className="text-lg font-extrabold text-[#3F332C]">브랜드 컨셉 요약</h2>
            <div className="mt-5 space-y-5">
              <Summary label="브랜드 명칭" value={brand.brandName} />
              <Summary label="업종" value={brand.category || "Dessert Cafe"} />
              <Summary label="타겟" value={brand.target || defaultBrand.target} />
              <div><p className="text-xs font-bold text-[#9B8B80]">MOOD</p><div className="mt-2 flex flex-wrap gap-2">{[brand.mood, "Romantic", "Soft", "Photogenic"].map((mood) => <span key={mood} className="rounded-full bg-[#F2E5DB] px-3 py-1.5 text-xs font-bold text-[#A36445]">{mood}</span>)}</div></div>
              <div><p className="text-xs font-bold text-[#9B8B80]">COLOR PALETTE</p><div className="mt-3 flex gap-2">{colors.map((color) => <span key={color} title={color} className="h-9 w-9 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />)}</div></div>
              <div><p className="text-xs font-bold text-[#9B8B80]">MATERIAL</p><div className="mt-2 grid gap-2">{materials.map((material) => <span key={material} className="rounded-xl border border-[#ECE3DB] bg-[#FAF6F1] px-3 py-2 text-xs font-semibold text-[#6B5A50]">{material}</span>)}</div></div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SkeletonPanel({ lines }: { lines: number }) {
  return <div className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-5"><div className="h-6 w-2/3 animate-pulse rounded bg-[#E5D8CD]" /><div className="mt-6 space-y-4">{Array.from({ length: lines }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-[#EFE6DE]" />)}</div></div>;
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold text-[#9B8B80]">{label}</p><p className="mt-1 text-sm font-bold leading-6 text-[#3F332C]">{value}</p></div>;
}
