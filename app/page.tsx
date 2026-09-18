"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";

type Message = { role: "ai" | "user"; text: string };

const questions = [
  "안녕하세요! 창업을 준비중이시군요. 먼저 어떤 업종을 생각하고 계신지 알려주세요.",
  "상호명은 정해두셨나요?",
  "주 타겟 고객은 누구인가요?",
  "어떤 분위기의 공간을 원하시나요?",
  "좋아요. 브랜드 컨셉 분석이 완료되었어요.",
];

const moodOptions = ["따뜻한", "미니멀", "감성적인", "자연적인", "트렌디한"];

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", text: questions[0] }]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState({ category: "", brandName: "", target: "", mood: "" });

  const isMoodStep = step === 3;
  const isDone = step >= 4;
  const placeholder = useMemo(() => {
    if (step === 0) return "예: 디저트 카페를 열려고 해요.";
    if (step === 1) return "예: 온디저트(ONDESSERT)로 정했어요.";
    if (step === 2) return "예: 20~30대 여성, 데이트와 친구 모임 고객";
    return "답변을 입력해 주세요.";
  }, [step]);

  const advance = (value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue || isDone) return;
    const nextStep = step + 1;
    setAnswers((previous) => ({
      ...previous,
      ...(step === 0 && { category: cleanValue }),
      ...(step === 1 && { brandName: cleanValue }),
      ...(step === 2 && { target: cleanValue }),
      ...(step === 3 && { mood: cleanValue }),
    }));
    setMessages((previous) => [
      ...previous,
      { role: "user", text: cleanValue },
      { role: "ai", text: questions[nextStep] },
    ]);
    setStep(nextStep);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    advance(input);
  };

  const openMoodboard = () => {
    sessionStorage.setItem("smoodMoodboard", JSON.stringify({
      brandName: answers.brandName || "ONDESSERT",
      category: answers.category || "디저트 카페",
      target: answers.target || "20~30대 여성 / 데이트 / 친구 모임",
      mood: answers.mood || "따뜻한",
    }));
    router.push("/moodboard");
  };

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto flex max-w-5xl flex-col items-center px-8 pb-14 pt-8">
        <div className="mb-9 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#B97350]">Brand Discovery</p>
          <h1 className="text-4xl font-extrabold text-[#3F332C]">브랜드 컨셉 진단 챗봇</h1>
          <p className="mt-3 text-lg text-[#806F64]">당신의 브랜드 컨셉과 공간 무드를 함께 찾아드릴게요.</p>
        </div>

        <div className="w-full max-w-3xl rounded-[30px] border border-[#E8DED4] bg-[#FFFDF9]/95 p-6 shadow-[0_24px_70px_rgba(91,69,54,0.10)]">
          <div className="mb-5 flex items-center justify-between border-b border-[#EEE5DC] pb-4">
            <div>
              <div className="text-sm font-bold text-[#B97350]">SMOOD AI</div>
              <div className="mt-1 text-xs text-[#9B8B80]">Brand concept conversation</div>
            </div>
            <div className="rounded-full bg-[#F4E9E0] px-4 py-2 text-sm font-semibold text-[#A36445]">Step {Math.min(step + 1, 5)} / 5</div>
          </div>

          <div className="flex h-[430px] flex-col gap-4 overflow-y-auto rounded-[24px] bg-[#F8F3ED] p-5">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[76%] rounded-3xl px-5 py-3 text-sm leading-6 shadow-sm ${message.role === "user" ? "rounded-br-md bg-[#B97350] text-white" : "rounded-bl-md border border-[#EDE3DA] bg-[#FFFDF9] text-[#55473F]"}`}>
                  {message.text}
                </div>
              </div>
            ))}

            {isMoodStep && (
              <div className="flex flex-wrap gap-2 pl-2">
                {moodOptions.map((option) => (
                  <button key={option} onClick={() => advance(option)} className="rounded-full border border-[#E2D4C8] bg-[#FFFDF9] px-4 py-2 text-sm font-semibold text-[#6B5A50] transition hover:border-[#B97350] hover:text-[#B97350]">
                    {option}
                  </button>
                ))}
              </div>
            )}

            {isDone && (
              <div className="flex justify-center pt-2">
                <button onClick={openMoodboard} className="rounded-full bg-[#B97350] px-8 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(185,115,80,0.22)] transition hover:bg-[#995D3F]">
                  브랜드 무드보드 확인하기
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} disabled={isMoodStep || isDone} placeholder={isMoodStep ? "원하는 무드 버튼을 선택해 주세요." : placeholder} className="min-w-0 flex-1 rounded-full border border-[#E2D4C8] bg-white px-5 py-4 text-sm text-[#3F332C] outline-none transition placeholder:text-[#B4A69D] focus:border-[#B97350] disabled:bg-[#F2ECE6]" />
            <button type="submit" disabled={isMoodStep || isDone} className="rounded-full bg-[#3F332C] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#59483E] disabled:bg-[#CFC3BA]">전송</button>
          </form>
        </div>
      </section>
    </main>
  );
}
