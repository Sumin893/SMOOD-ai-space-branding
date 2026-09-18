"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

type MoodboardData = { brandName: string; category: string; target: string; mood: string };

const defaultData: MoodboardData = {
  brandName: "ONDESSERT",
  category: "디저트 카페",
  target: "20~30대 여성 / 데이트 / 친구 모임",
  mood: "따뜻한",
};

const colors = ["#F4B6B8", "#F7D9D9", "#B7DCE8", "#C9DDD1", "#F5EBDD"];
const keywords = ["따뜻한", "감성적인", "로맨틱", "포토제닉"];
const materials = ["밝은 우드", "파스텔 타일", "패브릭", "매트 메탈"];
const moodCards = [
  { label: "Interior", className: "from-[#e3bca7] via-[#f4e8dd] to-[#c9ddd1]" },
  { label: "Furniture", className: "from-[#c89074] via-[#f1d8cb] to-[#f5ebdd]" },
  { label: "Lighting", className: "from-[#f5d89f] via-[#fff4df] to-[#dab6a5]" },
  { label: "Material", className: "from-[#c8ad91] via-[#ead8c7] to-[#aac5b7]" },
];

export default function MoodboardPage() {
  const router = useRouter();
  const [data, setData] = useState<MoodboardData>(defaultData);

  useEffect(() => {
    const saved = sessionStorage.getItem("smoodMoodboard");
    if (!saved) return;
    try { setData({ ...defaultData, ...JSON.parse(saved) }); } catch { setData(defaultData); }
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-6xl px-8 pb-14 pt-6">
        <div className="mb-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#B97350]">Moodboard Result</p>
          <h1 className="mt-2 text-4xl font-extrabold text-[#3F332C]">당신의 브랜드 컨셉이 완성되었습니다.</h1>
          <p className="mt-3 text-[#806F64]">브랜드의 감도와 공간에 어울리는 시각 언어를 한곳에 모았어요.</p>
        </div>

        <div className="grid grid-cols-[0.9fr_1.1fr] gap-7">
          <div className="rounded-[30px] border border-[#E8DED4] bg-[#FFFDF9]/95 p-7 shadow-[0_18px_60px_rgba(91,69,54,0.08)]">
            <div className="grid gap-6">
              <InfoBlock title="브랜드 명칭" content={data.brandName} />
              <InfoBlock title="업종" content={data.category || defaultData.category} />
              <InfoBlock title="타겟" content={data.target || defaultData.target} />
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9B8B80]">Mood Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {[data.mood || "따뜻한", ...keywords.filter((item) => item !== data.mood)].slice(0, 4).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-[#F2E5DB] px-4 py-2 text-sm font-bold text-[#A36445]">{keyword}</span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9B8B80]">Color Palette</h2>
                <div className="flex gap-3">
                  {colors.map((color) => <div key={color} title={color} className="h-12 w-12 rounded-full border-4 border-white shadow-md" style={{ backgroundColor: color }} />)}
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9B8B80]">Materials</h2>
                <div className="grid grid-cols-2 gap-3">
                  {materials.map((material) => <div key={material} className="rounded-2xl border border-[#E8DED4] bg-[#FAF6F1] px-4 py-3 text-sm font-semibold text-[#6B5A50]">{material}</div>)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#E8DED4] bg-[#FFFDF9]/95 p-7 shadow-[0_18px_60px_rgba(91,69,54,0.08)]">
            <div className="grid grid-cols-2 gap-4">
              {moodCards.map((card) => (
                <div key={card.label} className="overflow-hidden rounded-[22px] border border-[#E8DED4] bg-white shadow-sm">
                  <div className={`h-44 bg-gradient-to-br ${card.className}`}>
                    <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0_20%,transparent_20%_42%,rgba(255,255,255,0.22)_42%_60%,transparent_60%)]" />
                  </div>
                  <div className="px-4 py-3 text-sm font-bold text-[#6B5A50]">{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[30px] border border-[#E8DED4] bg-[#FFFDF9]/95 p-7 shadow-[0_14px_50px_rgba(91,69,54,0.07)]">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#9B8B80]">Interior Concept</h2>
          <p className="text-lg leading-8 text-[#55473F]">부드러운 파스텔 컬러와 밝은 우드 소재를 활용한 감성적인 디저트 카페 공간입니다. 20~30대 고객이 편안하게 머물고 사진을 촬영할 수 있는 분위기를 중심으로 구성합니다.</p>
        </div>

        <button onClick={() => router.push("/space-design")} className="mt-8 w-full rounded-[24px] bg-[#B97350] px-8 py-5 text-lg font-extrabold text-white shadow-[0_14px_35px_rgba(185,115,80,0.22)] transition hover:bg-[#995D3F]">
          이 컨셉으로 공간 디자인 시작하기
        </button>
      </section>
    </main>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return <div><h2 className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#9B8B80]">{title}</h2><p className="rounded-2xl bg-[#FAF6F1] px-4 py-3 text-base font-bold text-[#3F332C]">{content}</p></div>;
}
