import Header from "../components/Header";

export default function SpaceDesignPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto flex max-w-5xl items-center justify-center px-8 py-24">
        <div className="w-full rounded-[32px] border border-blue-100 bg-white/90 p-16 text-center shadow-xl shadow-blue-100/70">
          <p className="text-sm font-bold text-[#2684FF]">Next Step</p>
          <h1 className="mt-3 text-5xl font-extrabold text-slate-900">3D 공간 디자인</h1>
          <p className="mt-5 text-xl font-semibold text-slate-500">다음 단계에서 구현 예정입니다.</p>
        </div>
      </section>
    </main>
  );
}
