"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";

type Message = {
  role: "ai" | "user";
  text: string;
};

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
  const [answers, setAnswers] = useState({
    category: "",
    brandName: "",
    target: "",
    mood: "",
  });

  const isMoodStep = step === 3;
  const isDone = step >= 4;
  const placeholder = useMemo(() => {
    if (step === 0) return "예: 디저트 카페를 열려고 해요.";
    if (step === 1) return "예: 온디저트(ONDESSERT)로 정했어요.";
    if (step === 2) return "예: 20~30대 여성이고 데이트나 친구 모임 고객이 많았으면 좋겠어요.";
    return "답변을 입력해 주세요.";
  }, [step]);

  const saveAnswer = (currentStep: number, value: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      if (currentStep === 0) next.category = value;
      if (currentStep === 1) next.brandName = value;
      if (currentStep === 2) next.target = value;
      if (currentStep === 3) next.mood = value;
      return next;
    });
  };

  const advance = (value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue || isDone) return;

    const nextStep = step + 1;
    saveAnswer(step, cleanValue);
    setMessages((prev) => [
      ...prev,
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
    const moodboardData = {
      brandName: answers.brandName || "온디저트(ONDESSERT)",
      category: answers.category || "디저트 카페",
      target: answers.target || "20~30대 여성 / 데이트 / 친구 모임",
      mood: answers.mood || "따뜻한",
    };
    sessionStorage.setItem("smoodMoodboard", JSON.stringify(moodboardData));
    router.push("/moodboard");
  };

  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto flex max-w-5xl flex-col items-center px-8 pb-12 pt-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">브랜드 컨셉 진단 챗봇</h1>
          <p className="mt-3 text-lg text-slate-500">당신의 브랜드 컨셉과 공간 무드를 함께 찾아드릴게요.</p>
        </div>

        <div className="w-full max-w-3xl rounded-[28px] border border-blue-100 bg-white/90 p-6 shadow-xl shadow-blue-100/70">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="text-sm font-bold text-[#2684FF]">SMOOD AI</div>
              <div className="text-xs text-slate-400">Mock conversation prototype</div>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-[#2684FF]">
              Step {Math.min(step + 1, 5)} / 5
            </div>
          </div>

          <div className="flex h-[430px] flex-col gap-4 overflow-y-auto rounded-3xl bg-slate-50 p-5">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[76%] rounded-3xl px-5 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#2684FF] text-white"
                      : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isMoodStep && (
              <div className="flex flex-wrap gap-2 pl-2">
                {moodOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => advance(option)}
                    className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:border-[#2684FF] hover:text-[#2684FF]"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {isDone && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={openMoodboard}
                  className="rounded-full bg-[#2684FF] px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#176fe0]"
                >
                  브랜드 무드보드 확인하기
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isMoodStep || isDone}
              placeholder={isMoodStep ? "원하는 무드 버튼을 선택해 주세요." : placeholder}
              className="min-w-0 flex-1 rounded-full border border-blue-100 bg-white px-5 py-4 text-sm outline-none transition placeholder:text-slate-300 focus:border-[#2684FF] disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={isMoodStep || isDone}
              className="rounded-full bg-slate-900 px-7 py-4 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              전송
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
