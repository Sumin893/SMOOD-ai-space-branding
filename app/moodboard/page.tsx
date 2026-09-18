"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

type MoodboardData = {
  brandName: string;
  category: string;
  target: string;
  mood: string;
};

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
  { label: "Interior", className: "from-[#f8dada] via-[#f6ece6] to-[#d8edf5]" },
  { label: "Furniture", className: "from-[#f3c4bb] via-[#f8e3d8] to-[#d2e6d8]" },
  { label: "Lighting", className: "from-[#fff2c6] via-[#fbd7de] to-[#c8e8ef]" },
  { label: "Material", className: "from-[#ead8c7] via-[#f5e8e8] to-[#bfd8cf]" },
];

export default function MoodboardPage() {
  const router = useRouter();
  const [data, setData] = useState<MoodboardData>(defaultData);

  useEffect(() => {
    const saved = sessionStorage.getItem("smoodMoodboard");
    if (saved) {
      setData({ ...defaultData, ...JSON.parse(saved) });
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto max-w-6xl px-8 pb-14 pt-6">
        <div className="mb-8">
          <p className="text-sm font-bold text-[#2684FF]">Moodboard Result</p>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">당신의 브랜드 컨셉이 완성되었습니다.</h1>
        </div>

        <div className="grid grid-cols-[0.9fr_1.1fr] gap-7">
          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-7 shadow-xl shadow-blue-100/60">
            <div className="grid gap-5">
              <InfoBlock title="브랜드 명칭" content={data.brandName} />
              <InfoBlock title="업종" content={data.category || defaultData.category} />
              <InfoBlock title="타겟" content={data.target || defaultData.target} />

              <div>
                <h2 className="mb-3 text-sm font-bold text-slate-400">무드 키워드</h2>
                <div className="flex flex-wrap gap-2">
                  {[data.mood || "따뜻한", ...keywords.filter((item) => item !== data.mood)].slice(0, 4).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[#2684FF]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-bold text-slate-400">컬러 팔레트</h2>
                <div className="flex gap-3">
                  {colors.map((color) => (
                    <div
                      key={color}
                      title={color}
                      className="h-12 w-12 rounded-full border-4 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-bold text-slate-400">주요 소재</h2>
                <div className="grid grid-cols-2 gap-3">
                  {materials.map((material) => (
                    <div key={material} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                      {material}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-white/90 p-7 shadow-xl shadow-blue-100/60">
            <div className="grid grid-cols-2 gap-4">
              {moodCards.map((card) => (
                <div key={card.label} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div className={`h-44 bg-gradient-to-br ${card.className}`}>
                    <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.52)_0_20%,transparent_20%_40%,rgba(255,255,255,0.26)_40%_58%,transparent_58%)]" />
                  </div>
                  <div className="px-4 py-3 text-sm font-bold text-slate-600">{card.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[28px] border border-blue-100 bg-white/90 p-7 shadow-lg shadow-blue-100/50">
          <h2 className="mb-3 text-sm font-bold text-slate-400">인테리어 컨셉 설명</h2>
          <p className="text-lg leading-8 text-slate-700">
            부드러운 파스텔 컬러와 밝은 우드 소재를 활용한 감성적인 디저트 카페 공간입니다. 20~30대 고객이 편안하게 머물고
            사진을 촬영할 수 있는 분위기를 중심으로 구성합니다.
          </p>
        </div>

        <button
          onClick={() => router.push("/space-design")}
          className="mt-8 w-full rounded-3xl bg-[#2684FF] px-8 py-5 text-lg font-extrabold text-white shadow-xl shadow-blue-200 transition hover:bg-[#176fe0]"
        >
          이 컨셉으로 공간 디자인 시작하기
        </button>
      </section>
    </main>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-bold text-slate-400">{title}</h2>
      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-base font-bold text-slate-800">{content}</p>
    </div>
  );
}
