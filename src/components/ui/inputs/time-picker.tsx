import React, { useRef, useEffect, useState } from "react";

interface TimePickerProps {
  value: { hours: number; minutes: number; seconds: number };
  onChange: (val: { hours: number; minutes: number; seconds: number }) => void;
  minHours?: number;
  maxHours?: number;
  minMinutes?: number;
  maxMinutes?: number;
  minSeconds?: number;
  maxSeconds?: number;
  className?: string;
  open?: boolean;
  onRequestClose?: () => void;
}

const ITEM_HEIGHT = 44; // px
const VISIBLE_ITEMS = 5; // всегда нечетное

function pad(num: number) {
  return num.toString().padStart(2, "0");
}

function Wheel({
  values,
  value,
  onChange,
  ariaLabel,
}: {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);

  // Скроллим к выбранному значению
  useEffect(() => {
    if (ref.current) {
      const idx = values.indexOf(value);
      if (idx !== -1) {
        ref.current.scrollTo({
          top: idx * ITEM_HEIGHT,
          behavior: "smooth",
        });
      }
    }
  }, [value, values]);

  // Снап к ближайшему значению после скролла (debounced)
  const handleSnap = () => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const idx = Math.round(scrollTop / ITEM_HEIGHT);
    if (values[idx] !== undefined && values[idx] !== value) {
      onChange(values[idx]);
    } else {
      ref.current.scrollTo({ top: idx * ITEM_HEIGHT, behavior: "smooth" });
    }
  };

  // Debounce snap при скролле
  const handleScroll = () => {
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
    snapTimeout.current = setTimeout(() => {
      handleSnap();
    }, 120);
  };

  return (
    <div
      className="relative flex flex-col items-center w-20 sm:w-24 h-[220px] overflow-y-scroll no-scrollbar snap-y snap-mandatory bg-white rounded-xl shadow-md"
      ref={ref}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollSnapType: "y mandatory",
      }}
      tabIndex={0}
      aria-label={ariaLabel}
      onScroll={handleScroll}
      onTouchEnd={handleSnap}
      onMouseUp={handleSnap}
    >
      {values.map((v, i) => (
        <div
          key={v}
          className={`snap-center text-2xl sm:text-3xl font-bold text-center select-none cursor-pointer transition-colors duration-200 relative
            ${value === v ? "text-black" : "text-gray-400 opacity-60"}
            ${Math.abs(values.indexOf(value) - i) === 1 ? "opacity-80" : ""}
            ${Math.abs(values.indexOf(value) - i) > 1 ? "opacity-40" : ""}
          `}
          style={{
            minHeight: ITEM_HEIGHT,
            lineHeight: `${ITEM_HEIGHT}px`,
            scrollSnapAlign: "center",
          }}
          onClick={() => onChange(v)}
        >
          {pad(v)}
        </div>
      ))}
      {/* Градиенты для wheel-эффекта */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-20" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent z-20" />
      {/* Центральная рамка убрана */}
    </div>
  );
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  minHours = 0,
  maxHours = 23,
  minMinutes = 0,
  maxMinutes = 59,
  minSeconds = 0,
  maxSeconds = 59,
  className = "",
  open,
  onRequestClose,
}) => {
  const hours = Array.from(
    { length: maxHours - minHours + 1 },
    (_, i) => i + minHours
  );
  const minutes = Array.from(
    { length: maxMinutes - minMinutes + 1 },
    (_, i) => i + minMinutes
  );
  const seconds = Array.from(
    { length: maxSeconds - minSeconds + 1 },
    (_, i) => i + minSeconds
  );

  // Блокировка скролла body при открытом модальном окне
  React.useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  const picker = (
    <div
      className={`flex flex-col items-center justify-center gap-4 bg-white p-2 sm:p-4 rounded-2xl shadow-lg ${className}`}
    >
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
        <Wheel
          values={hours}
          value={value.hours}
          onChange={(h) => onChange({ ...value, hours: h })}
          ariaLabel="Часы"
        />
        <span className="text-2xl sm:text-3xl font-bold text-gray-700 select-none">
          :
        </span>
        <Wheel
          values={minutes}
          value={value.minutes}
          onChange={(m) => onChange({ ...value, minutes: m })}
          ariaLabel="Минуты"
        />
        <span className="text-2xl sm:text-3xl font-bold text-gray-700 select-none">
          :
        </span>
        <Wheel
          values={seconds}
          value={value.seconds}
          onChange={(s) => onChange({ ...value, seconds: s })}
          ariaLabel="Секунды"
        />
      </div>
      {onRequestClose && (
        <button
          className="mt-2 w-full py-3 rounded-xl bg-red-500 text-black font-bold text-lg shadow-md hover:bg-yellow-300 active:bg-yellow-500 transition"
          onClick={onRequestClose}
        >
          Готово
        </button>
      )}
    </div>
  );

  if (open) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* overlay под picker */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"
          onClick={onRequestClose}
        />
        <div className="relative z-10">{picker}</div>
      </div>
    );
  }
  return picker;
};
