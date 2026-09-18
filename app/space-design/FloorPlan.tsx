export type SpaceType = "Compact" | "Standard" | "Large";

type FloorPlanProps = {
  area: number;
  spaceType: SpaceType;
  brandName: string;
};

export const allocationByType: Record<SpaceType, Record<string, number>> = {
  Compact: { Kitchen: 30, Counter: 12, Seating: 42, Waiting: 7, "Photo Zone": 3, Circulation: 6 },
  Standard: { Kitchen: 25, Counter: 10, Seating: 45, Waiting: 8, "Photo Zone": 6, Circulation: 6 },
  Large: { Kitchen: 22, Counter: 10, Seating: 48, Waiting: 9, "Photo Zone": 7, Circulation: 4 },
};

export const furnitureByType = {
  Compact: { two: 3, four: 0, bar: 3, seats: 12 },
  Standard: { two: 4, four: 2, bar: 4, seats: 24 },
  Large: { two: 6, four: 4, bar: 6, seats: 42 },
} satisfies Record<SpaceType, { two: number; four: number; bar: number; seats: number }>;

const palette = {
  wall: "#59483E",
  kitchen: "#E8DCCF",
  counter: "#E5B59D",
  seating: "#FFF6E8",
  waiting: "#EAD7BE",
  photo: "#F4D4D3",
  circulation: "#F7F2EC",
  furniture: "#A96F50",
  sage: "#AFC8B7",
  blue: "#91BFD0",
};

export default function FloorPlan({ area, spaceType, brandName }: FloorPlanProps) {
  const allocation = allocationByType[spaceType];
  const furniture = furnitureByType[spaceType];
  const widthMeters = area > 100 ? Math.round(area / 10) : 10;
  const heightMeters = Math.max(3, Math.round((area / widthMeters) * 10) / 10);
  const isCompact = spaceType === "Compact";
  const isLarge = spaceType === "Large";
  const seatingTables = Array.from({ length: furniture.two }, (_, index) => ({
    x: 410 + (index % 3) * 122,
    y: 150 + Math.floor(index / 3) * 138,
  }));
  const fourTables = Array.from({ length: furniture.four }, (_, index) => ({
    x: isLarge ? 414 + index * 132 : 455 + index * 205,
    y: 374,
  }));

  return (
    <div className="rounded-[24px] border border-[#E8DED4] bg-[#FFFDF9] p-4 shadow-[0_16px_48px_rgba(91,69,54,0.08)]">
      <div className="mb-3 flex items-center justify-between px-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B97350]">F&amp;B Space Layout</p>
          <h2 className="mt-1 text-lg font-extrabold text-[#3F332C]">{brandName} · {widthMeters}m × {heightMeters}m</h2>
        </div>
        <span className="rounded-full bg-[#F2E5DB] px-3 py-1.5 text-xs font-bold text-[#A36445]">{spaceType} preset</span>
      </div>

      <svg viewBox="0 0 900 600" role="img" aria-label={`${area}제곱미터 ${spaceType} 카페 공간 배치도`} className="aspect-[3/2] w-full rounded-[18px] bg-[#F4EEE7]">
        <defs>
          <pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#DFD5CC" strokeWidth="0.7" />
          </pattern>
          <marker id="customer-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={palette.furniture} />
          </marker>
          <marker id="staff-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={palette.blue} />
          </marker>
        </defs>

        <rect x="28" y="32" width="844" height="520" rx="5" fill="url(#floor-grid)" stroke={palette.wall} strokeWidth="7" />

        <Zone x={32} y={36} width={280} height={214} fill={palette.kitchen} title="주방" area={area * allocation.Kitchen / 100} />
        <Zone x={32} y={250} width={280} height={138} fill={palette.counter} title="카운터" area={area * allocation.Counter / 100} />
        <Zone x={312} y={36} width={556} height={386} fill={palette.seating} title="좌석 공간" area={area * allocation.Seating / 100} />
        <Zone x={32} y={388} width={280} height={160} fill={palette.waiting} title="대기 공간" area={area * allocation.Waiting / 100} />
        <Zone x={isCompact ? 708 : 676} y={422} width={isCompact ? 160 : 192} height={126} fill={palette.photo} title="포토존" area={area * allocation["Photo Zone"] / 100} />
        <rect x="312" y="422" width={isCompact ? 396 : 364} height="126" fill={palette.circulation} stroke="#D8CEC5" strokeWidth="1.5" />
        <text x="330" y="446" fill="#8E7B6F" fontSize="12" fontWeight="700">CIRCULATION {allocation.Circulation}%</text>

        <rect x="55" y="82" width="122" height="35" rx="5" fill="#C5A98D" /><text x="116" y="104" textAnchor="middle" fill="#FFFDF9" fontSize="11" fontWeight="700">작업대</text>
        <rect x="190" y="82" width="90" height="35" rx="5" fill="#AEC7CD" /><text x="235" y="104" textAnchor="middle" fill="#3F5A60" fontSize="11" fontWeight="700">싱크</text>
        <rect x="55" y="142" width="62" height="68" rx="5" fill="#B9B0A8" /><text x="86" y="179" textAnchor="middle" fill="#4F4843" fontSize="10" fontWeight="700">냉장고</text>
        <rect x="134" y="142" width="146" height="68" rx="5" fill="#D5B898" /><text x="207" y="179" textAnchor="middle" fill="#624C3D" fontSize="11" fontWeight="700">조리 공간</text>

        <rect x="54" y="286" width="220" height="46" rx="8" fill={palette.furniture} />
        <text x="164" y="313" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">주문 카운터</text>
        <rect x="54" y="343" width="125" height="28" rx="5" fill="#F1D5C8" stroke="#B97D60" />
        <text x="116" y="361" textAnchor="middle" fill="#725343" fontSize="9" fontWeight="700">디저트 쇼케이스</text>
        <rect x="190" y="343" width="84" height="28" rx="5" fill="#F7EADF" stroke="#B97D60" />
        <text x="232" y="361" textAnchor="middle" fill="#725343" fontSize="9" fontWeight="700">PICKUP</text>
        {Array.from({ length: furniture.bar }, (_, index) => <circle key={index} cx={58 + index * 39} cy="382" r="9" fill="#AFC8B7" stroke="#6E917B" />)}

        <rect x="54" y="454" width="164" height="35" rx="16" fill="#C69E7E" />
        <text x="136" y="476" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">WAITING BENCH</text>
        {[0, 1, 2].map((index) => <circle key={index} cx={88 + index * 48} cy="516" r="10" fill={palette.sage} />)}

        {!isCompact && <rect x="331" y="80" width="40" height="250" rx="18" fill="#D9BBA6" />}
        {seatingTables.map((table, index) => <TwoSeatTable key={index} x={table.x} y={table.y} />)}
        {fourTables.map((table, index) => <FourSeatTable key={index} x={table.x} y={table.y} />)}
        {isLarge && <rect x="772" y="105" width="55" height="230" rx="20" fill="#D7B29E" />}

        <path d={isCompact ? "M 350 535 L 350 360 L 235 360 L 350 360 L 455 300" : "M 350 535 L 350 360 L 235 360 L 350 360 L 510 330 L 690 330"} fill="none" stroke={palette.furniture} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#customer-arrow)" />
        <path d="M 155 190 L 155 270 L 228 350" fill="none" stroke={palette.blue} strokeWidth="4" strokeDasharray="9 7" strokeLinecap="round" markerEnd="url(#staff-arrow)" />

        <path d="M 731 526 Q 766 452 804 526" fill="none" stroke="#B77874" strokeWidth="9" strokeLinecap="round" />
        <circle cx="768" cy="508" r="13" fill={palette.sage} />
        <text x="768" y="540" textAnchor="middle" fill="#8B5754" fontSize="9" fontWeight="700">PHOTO SPOT</text>

        <path d="M 330 552 L 330 531 A 21 21 0 0 1 351 552" fill="#FAF7F2" stroke={palette.wall} strokeWidth="3" />
        <text x="340" y="580" textAnchor="middle" fill="#6B5A50" fontSize="11" fontWeight="700">ENTRANCE / EXIT</text>

        <g transform="translate(542 570)">
          <line x1="0" y1="0" x2="38" y2="0" stroke={palette.furniture} strokeWidth="5" markerEnd="url(#customer-arrow)" />
          <text x="52" y="4" fill="#6B5A50" fontSize="11" fontWeight="700">고객 동선</text>
          <line x1="135" y1="0" x2="173" y2="0" stroke={palette.blue} strokeWidth="4" strokeDasharray="8 6" markerEnd="url(#staff-arrow)" />
          <text x="187" y="4" fill="#6B5A50" fontSize="11" fontWeight="700">직원 동선</text>
        </g>
      </svg>
    </div>
  );
}

function Zone({ x, y, width, height, fill, title, area }: { x: number; y: number; width: number; height: number; fill: string; title: string; area: number }) {
  return <g><rect x={x} y={y} width={width} height={height} fill={fill} stroke="#D0C1B5" strokeWidth="1.5" /><text x={x + 16} y={y + 24} fill="#59483E" fontSize="13" fontWeight="800">{title} {Math.max(1, Math.round(area))}㎡</text></g>;
}

function TwoSeatTable({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x} cy={y} r="27" fill="#F1D6C9" stroke="#A96F50" strokeWidth="2" /><circle cx={x - 42} cy={y} r="12" fill="#B6CDBD" /><circle cx={x + 42} cy={y} r="12" fill="#B6CDBD" /><text x={x} y={y + 4} textAnchor="middle" fill="#765643" fontSize="9" fontWeight="700">2P</text></g>;
}

function FourSeatTable({ x, y }: { x: number; y: number }) {
  return <g><rect x={x - 34} y={y - 23} width="68" height="46" rx="8" fill="#E8C7AE" stroke="#A96F50" strokeWidth="2" />{[[0, -36], [0, 36], [-48, 0], [48, 0]].map(([dx, dy], index) => <circle key={index} cx={x + dx} cy={y + dy} r="10" fill="#AFC8B7" />)}<text x={x} y={y + 4} textAnchor="middle" fill="#765643" fontSize="9" fontWeight="700">4P</text></g>;
}
