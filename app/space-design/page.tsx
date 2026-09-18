"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import Header from "../components/Header";
import FloorPlan, { allocationByType, furnitureByType, type SpaceType } from "./FloorPlan";
import { generateInteriorRender, type InteriorRenderResult } from "../../lib/generateInteriorRender";

type ViewState = "input" | "loading" | "result";
type ResultTab = "floor-plan" | "construction-preview";
type MoodboardData = { brandName: string; category: string; target: string; mood: string };

const defaultBrand: MoodboardData = {
  brandName: "ONDESSERT",
  category: "디저트 카페",
  target: "20~30대 여성 / 데이트 / 친구 모임",
  mood: "따뜻한",
};

const loadingMessages = [
  "브랜드 컨셉을 분석하고 있어요",
  "매장 면적을 분석하고 있어요",
  "F&B 공간을 구획하고 있어요",
  "주방과 카운터를 배치하고 있어요",
  "좌석과 고객 동선을 구성하고 있어요",
  "공간 배치도를 완성하고 있어요",
];

const elementGroups = [
  { name: "공간", items: ["주방", "카운터", "좌석", "대기", "포토존"] },
  { name: "가구", items: ["2인 테이블", "4인 테이블", "의자", "소파", "바 좌석"] },
  { name: "설비", items: ["쇼케이스", "싱크", "냉장고", "작업대"] },
];

const colors = ["#F4B6B8", "#F7D9D9", "#B7DCE8", "#C9DDD1", "#F5EBDD"];
const materials = ["Light Wood", "Pastel Tile", "Fabric", "Matte Metal"];

export default function SpaceDesignPage() {
  const [view, setView] = useState<ViewState>("input");
  const [activeTab, setActiveTab] = useState<ResultTab>("floor-plan");
  const [area, setArea] = useState(50);
  const [messageIndex, setMessageIndex] = useState(0);
  const [render, setRender] = useState<InteriorRenderResult | null>(null);
  const [brand, setBrand] = useState<MoodboardData>(defaultBrand);
  const [selectedElement, setSelectedElement] = useState("카운터");
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
    }, 520);
    return () => window.clearInterval(interval);
  }, [view]);

  const generate = async () => {
    setView("loading");
    setActiveTab("floor-plan");
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

  const spaceType: SpaceType = area <= 30 ? "Compact" : area <= 70 ? "Standard" : "Large";
  const allocation = allocationByType[spaceType];
  const furniture = furnitureByType[spaceType];

  if (view === "input") {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="mx-auto flex max-w-6xl items-center justify-center px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid w-full grid-cols-1 overflow-hidden rounded-[36px] border border-[#E8DED4] bg-[#FFFDF9] shadow-[0_28px_90px_rgba(91,69,54,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex min-h-[390px] flex-col justify-center bg-[#EAD7C7] p-10 lg:min-h-[470px] lg:p-14">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#9A5E40]">Space Composer</p>
              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.18] text-[#3F332C] lg:text-5xl">당신의 브랜드 공간을 만들어볼게요</h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B5A50]">매장 면적을 입력하면 앞서 완성한 브랜드 컨셉을 바탕으로 F&amp;B 공간 배치도를 구성합니다.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center p-10 lg:p-14">
              <label htmlFor="area" className="text-sm font-bold text-[#6B5A50]">매장 면적 (㎡)</label>
              <div className="relative mt-3">
                <input id="area" type="number" min="1" value={area} onChange={(event) => setArea(Number(event.target.value))} className="w-full rounded-[22px] border border-[#E2D4C8] bg-white px-6 py-5 text-3xl font-bold text-[#3F332C] outline-none transition focus:border-[#B97350]" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#9B8B80]">㎡</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-[#806F64]">
                <span>{spaceType} Space</span>
                <span>면적별 배치 프리셋 적용</span>
              </div>
              <button type="submit" className="mt-9 rounded-[22px] bg-[#B97350] px-7 py-5 text-base font-extrabold text-white shadow-[0_14px_32px_rgba(185,115,80,0.22)] transition hover:bg-[#995D3F]">AI 공간 배치 생성하기</button>
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
        <section className="mx-auto max-w-[1440px] px-6 pb-10 pt-4 lg:px-8">
          <div className="mb-7 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B97350]">Generating Layout</p>
            <h1 className="mt-2 text-2xl font-extrabold text-[#3F332C]">{loadingMessages[messageIndex]}</h1>
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[230px_minmax(0,1fr)_270px]">
            <SkeletonPanel lines={7} />
            <div className="aspect-[3/2] animate-pulse rounded-[28px] bg-[#E5D8CD]">
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
      <section className="mx-auto max-w-[1440px] px-6 pb-10 pt-3 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B97350]">AI Space Editor</p>
            <h1 className="mt-1 text-2xl font-extrabold text-[#3F332C]">{brand.brandName} 공간 디자인</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["저장", "미리보기", "다시 생성", "게시하기"].map((action) => (
              <button key={action} onClick={() => action === "다시 생성" ? void generate() : setNotice(`${action} 기능은 데모 화면입니다.`)} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${action === "게시하기" ? "border-[#B97350] bg-[#B97350] text-white hover:bg-[#995D3F]" : "border-[#E1D5CB] bg-[#FFFDF9] text-[#6B5A50] hover:border-[#B97350]"}`}>{action}</button>
            ))}
          </div>
        </div>
        {notice && <div className="mb-4 rounded-xl border border-[#E8DED4] bg-[#FFF9F3] px-4 py-3 text-sm text-[#6B5A50]">{notice}</div>}

        <div className="mb-5 flex justify-center">
          <div className="inline-flex rounded-full border border-[#E1D5CB] bg-[#FFFDF9] p-1.5 shadow-[0_8px_24px_rgba(91,69,54,0.07)]">
            <TabButton active={activeTab === "floor-plan"} onClick={() => setActiveTab("floor-plan")}>공간 배치도</TabButton>
            <TabButton active={activeTab === "construction-preview"} onClick={() => setActiveTab("construction-preview")}>시공 시 예시 이미지</TabButton>
          </div>
        </div>

        {activeTab === "construction-preview" && (
          <p className="mb-5 text-center text-sm text-[#806F64]">브랜드 컨셉과 공간 배치가 실제 시공에 반영되었을 때의 분위기를 보여주는 예시 이미지입니다.</p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[230px_minmax(0,1fr)_285px]">
          <ElementPanel selectedElement={selectedElement} onSelect={setSelectedElement} />

          <div className="min-w-0">
            {activeTab === "floor-plan" ? (
              <>
                <FloorPlan area={area} spaceType={spaceType} brandName={brand.brandName} />
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-[22px] border border-[#E8DED4] bg-[#FFFDF9] p-5 shadow-[0_10px_30px_rgba(91,69,54,0.05)] sm:grid-cols-3 lg:grid-cols-6">
                  <ResultMetric value={`${area}㎡`} label={`${spaceType} Layout`} />
                  <ResultMetric value={`약 ${furniture.seats}석`} label="예상 좌석" />
                  <ResultMetric value={`${furniture.two}개`} label="2인 테이블" />
                  <ResultMetric value={`${furniture.four}개`} label="4인 테이블" />
                  <ResultMetric value={`${furniture.bar}석`} label="바 좌석" />
                  <ResultMetric value={`${Math.round(area * allocation.Kitchen / 100)}㎡`} label="주방" />
                  <p className="col-span-2 border-t border-[#EEE5DC] pt-4 text-xs font-semibold text-[#806F64] sm:col-span-3 lg:col-span-6">고객 동선 · Entrance → Order → Pickup → Seating → Exit</p>
                </div>
              </>
            ) : (
              <div className="relative min-h-[650px] overflow-hidden rounded-[24px] bg-[#2E2926] shadow-[0_18px_50px_rgba(63,51,44,0.16)]">
                <Image src={render?.imageUrl || "/renders/dessert-cafe.png"} alt="따뜻한 파스텔 톤의 ONDESSERT 디저트 카페 인테리어 렌더" width={1536} height={1024} priority className="h-full min-h-[650px] w-full object-cover" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold text-[#6B5A50] shadow-sm backdrop-blur">AI Generated Interior</div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-20 text-white">
                  <div className="text-xl font-extrabold">{area}㎡ {spaceType} Dessert Cafe Interior</div>
                  <div className="mt-1 text-sm text-white/80">Brand Concept &amp; Floor Plan Applied</div>
                </div>
              </div>
            )}
          </div>

          <BrandPanel brand={brand} area={area} spaceType={spaceType} allocation={allocation} />
        </div>
      </section>
    </main>
  );
}

function ElementPanel({ selectedElement, onSelect }: { selectedElement: string; onSelect: (item: string) => void }) {
  return (
    <aside className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-5 shadow-[0_12px_40px_rgba(91,69,54,0.06)]">
      <h2 className="text-lg font-extrabold text-[#3F332C]">공간 구성 요소</h2>
      <div className="mt-5 space-y-5">
        {elementGroups.map((group) => (
          <div key={group.name}>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#9B8B80]">{group.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item) => <button key={item} onClick={() => onSelect(item)} className={`min-h-12 rounded-xl border px-2 text-xs font-bold transition ${selectedElement === item ? "border-[#B97350] bg-[#F2E5DB] text-[#A36445]" : "border-[#ECE3DB] bg-white text-[#806F64] hover:border-[#D5B49D]"}`}>{item}</button>)}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function BrandPanel({ brand, area, spaceType, allocation }: { brand: MoodboardData; area: number; spaceType: SpaceType; allocation: Record<string, number> }) {
  return (
    <aside className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-5 shadow-[0_12px_40px_rgba(91,69,54,0.06)]">
      <h2 className="text-lg font-extrabold text-[#3F332C]">브랜드 컨셉 요약</h2>
      <div className="mt-5 space-y-5">
        <Summary label="브랜드" value={brand.brandName} />
        <Summary label="업종" value={brand.category || "Dessert Cafe"} />
        <div className="grid grid-cols-2 gap-3"><Summary label="면적" value={`${area}㎡`} /><Summary label="공간 타입" value={spaceType} /></div>
        <Summary label="타겟" value={brand.target || defaultBrand.target} />
        <div><p className="text-xs font-bold text-[#9B8B80]">MOOD</p><div className="mt-2 flex flex-wrap gap-2">{[brand.mood, "Romantic", "Soft", "Photogenic"].map((mood) => <span key={mood} className="rounded-full bg-[#F2E5DB] px-3 py-1.5 text-xs font-bold text-[#A36445]">{mood}</span>)}</div></div>
        <div><p className="text-xs font-bold text-[#9B8B80]">COLOR PALETTE</p><div className="mt-3 flex gap-2">{colors.map((color) => <span key={color} title={color} className="h-8 w-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />)}</div></div>
        <div><p className="text-xs font-bold text-[#9B8B80]">MATERIAL</p><div className="mt-2 flex flex-wrap gap-2">{materials.map((material) => <span key={material} className="rounded-lg border border-[#ECE3DB] bg-[#FAF6F1] px-2.5 py-1.5 text-[11px] font-semibold text-[#6B5A50]">{material}</span>)}</div></div>
        <div className="border-t border-[#E8DED4] pt-5"><p className="text-xs font-bold text-[#9B8B80]">SPACE ALLOCATION</p><div className="mt-3 space-y-2">{Object.entries(allocation).filter(([name]) => name !== "Circulation").map(([name, percent]) => <div key={name} className="flex items-center justify-between text-xs"><span className="font-semibold text-[#6B5A50]">{name}</span><span className="font-extrabold text-[#A36445]">{percent}%</span></div>)}</div></div>
      </div>
    </aside>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-full px-6 py-3 text-sm font-extrabold transition ${active ? "bg-[#B97350] text-white shadow-sm" : "text-[#806F64] hover:text-[#B97350]"}`}>{children}</button>;
}

function ResultMetric({ value, label }: { value: string; label: string }) {
  return <div><p className="text-lg font-extrabold text-[#3F332C]">{value}</p><p className="mt-1 text-xs font-semibold text-[#9B8B80]">{label}</p></div>;
}

function SkeletonPanel({ lines }: { lines: number }) {
  return <div className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-5"><div className="h-6 w-2/3 animate-pulse rounded bg-[#E5D8CD]" /><div className="mt-6 space-y-4">{Array.from({ length: lines }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-[#EFE6DE]" />)}</div></div>;
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold text-[#9B8B80]">{label}</p><p className="mt-1 text-sm font-bold leading-6 text-[#3F332C]">{value}</p></div>;
}
