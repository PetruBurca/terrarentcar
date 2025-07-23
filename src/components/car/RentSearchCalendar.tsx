import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/utils/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/overlays/dialog";
import { format, isToday } from "date-fns";
import { ru, ro, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { X, Search } from "lucide-react";
import React from "react";

const getLocale = (lng: string) =>
  lng === "ru" ? ru : lng === "ro" ? ro : enUS;

export const RentSearchCalendar = ({ onSearch }) => {
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);

  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  // Вертикальный календарь: ближайшие 12 месяцев (локальное время)
  const now = new Date();
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(now.getFullYear(), now.getMonth() + i, 1)
  );
  const calendarAreaRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalOpen && calendarAreaRef.current && monthRefs.current.length) {
      const today = new Date();
      const todayMonthIdx = months.findIndex(
        (m) =>
          m.getFullYear() === today.getFullYear() &&
          m.getMonth() === today.getMonth()
      );
      if (todayMonthIdx !== -1 && monthRefs.current[todayMonthIdx]) {
        monthRefs.current[todayMonthIdx]?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
        setTimeout(() => {
          if (calendarAreaRef.current && headerRef.current) {
            const headerHeight = headerRef.current.offsetHeight || 0;
            calendarAreaRef.current.scrollTop -= headerHeight;
          }
        }, 60);
      } else if (monthRefs.current[0]) {
        monthRefs.current[0]?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
        setTimeout(() => {
          if (calendarAreaRef.current && headerRef.current) {
            const headerHeight = headerRef.current.offsetHeight || 0;
            calendarAreaRef.current.scrollTop -= headerHeight;
          }
        }, 60);
      }
    }
    // eslint-disable-next-line
  }, [modalOpen]);

  const handleFieldClick = (field: "from" | "to") => {
    setActiveField(field);
    setModalOpen(true);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    if (activeField === "from") {
      // Выбираем дату "от"
      setRange((r) => ({ ...r, from: date }));
      setActiveField("to");
    } else if (activeField === "to") {
      // Проверяем, кликнули ли повторно по уже выбранной дате "from"
      const isSameDateAsFrom =
        range.from &&
        format(date, "yyyy-MM-dd") === format(range.from, "yyyy-MM-dd");

      if (isSameDateAsFrom) {
        // Если кликнули по той же дате - это однодневная аренда
        setRange((r) => ({ ...r, to: date }));
        console.log("🎯 Однодневная аренда:", format(date, "dd.MM.yyyy"));
      } else if (date < range.from!) {
        // Если выбрали дату раньше чем "from", меняем местами
        setRange({ from: date, to: range.from });
        console.log("🔄 Поменяли местами даты");
      } else {
        // Обычный выбор даты "до"
        setRange((r) => ({ ...r, to: date }));
      }
    }
  };

  const handleSearch = () => {
    setModalOpen(false);
    onSearch?.({
      from: range.from,
      to: range.to,
    });
  };

  const locale = getLocale(i18n.language);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 767 : true;

  return (
    <div className="w-full md:max-w-md md:mx-auto bg-[#232325] rounded-2xl shadow-2xl p-3 flex flex-col gap-4 border border-yellow-400 mt-13 mb-11 sm:mt-0 transition hover:shadow-yellow-400/30 hover:scale-[1.01] duration-200">
      <div className="text-xl md:text-2xl font-bold text-yellow-400 mb-3 text-center">
        {t("reservation.selectDates")}
      </div>
      <div className="flex gap-2">
        <button
          className="flex-1 border border-yellow-400 rounded-lg px-4 py-3 text-left font-semibold text-yellow-400 bg-[#18181b] hover:bg-yellow-900/20 transition text-lg"
          onClick={() => handleFieldClick("from")}
        >
          <span className="block text-xs text-gray-500 mb-1">
            {t("reservation.pickupDate")}
          </span>
          <span className="block text-base">
            {range.from ? format(range.from, "dd.MM.yyyy") : "--.--.----"}
          </span>
        </button>
        <button
          className="flex-1 border border-yellow-400 rounded-lg px-4 py-3 text-left font-semibold text-yellow-400 bg-[#18181b] hover:bg-yellow-900/20 transition text-lg"
          onClick={() => handleFieldClick("to")}
        >
          <span className="block text-xs text-gray-500 mb-1">
            {t("reservation.returnDate")}
          </span>
          <span className="block text-base">
            {range.to ? format(range.to, "dd.MM.yyyy") : "--.--.----"}
          </span>
        </button>
      </div>
      <Button
        className="w-full bg-yellow-400 text-black border-2 border-yellow-400 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-yellow-500 hover:scale-105 active:bg-yellow-600 transition"
        onClick={handleSearch}
        disabled={!range.from || !range.to}
      >
        <Search className="w-5 h-5 mr-2" />
        {t("reservation.search")}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className={
            isMobile
              ? "w-full min-h-[100dvh] max-w-full rounded-none top-0 left-0 z-[1001] bg-[#232325] flex flex-col h-full p-0"
              : "fixed right-0 top-0 h-full w-[420px] max-w-full rounded-l-2xl z-[1001] border-l-4 border-yellow-400 shadow-2xl bg-[#232325] flex flex-col h-full p-0 transform-none"
          }
          style={
            isMobile
              ? {}
              : {
                  left: "auto",
                  right: 0,
                  top: 0,
                  bottom: 0,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }
          }
        >
          <DialogTitle className="sr-only">
            {t("reservation.selectDates")}
          </DialogTitle>
          {/* Header + поля */}
          <div>
            <div
              ref={headerRef}
              className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-[#232325] z-10"
            >
              <div />
              <button
                onClick={() => setModalOpen(false)}
                className="text-white hover:text-yellow-400 text-2xl"
              >
                <X />
              </button>
            </div>
            <div className="flex flex-col gap-2 w-full px-4 pt-2 pb-2">
              <div className="flex gap-2">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xs text-white/70 mb-1">
                    {t("reservation.pickupDate")}
                  </span>
                  <button
                    className={`w-full py-2 rounded-lg border ${
                      activeField === "from"
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-yellow-400 bg-black text-yellow-400"
                    } font-bold text-base shadow-none hover:bg-yellow-400 hover:text-black transition text-center`}
                    onClick={() => setActiveField("from")}
                  >
                    {range.from
                      ? format(range.from, "dd.MM.yyyy")
                      : "--.--.----"}
                  </button>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xs text-white/70 mb-1">
                    {t("reservation.returnDate")}
                  </span>
                  <button
                    className={`w-full py-2 rounded-lg border ${
                      activeField === "to"
                        ? "border-yellow-400 bg-yellow-400 text-black"
                        : "border-yellow-400 bg-black text-yellow-400"
                    } font-bold text-base shadow-none hover:bg-yellow-400 hover:text-black transition text-center`}
                    onClick={() => setActiveField("to")}
                  >
                    {range.to ? format(range.to, "dd.MM.yyyy") : "--.--.----"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Календарь — только этот блок скроллится */}
          <div className="border-t border-gray-700 w-full" />
          <div
            ref={calendarAreaRef}
            className="flex-1 w-full px-2 overflow-y-auto"
          >
            <div className="flex flex-col gap-6 w-full mt-4">
              {months.map((month, idx) => (
                <div key={idx} ref={(el) => (monthRefs.current[idx] = el)}>
                  <MonthCalendar
                    month={month}
                    range={range}
                    onSelect={handleCalendarSelect}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Кнопка поиска — всегда внизу */}
          <div
            className="w-full px-4 pt-2 bg-[#232325]"
            style={{
              paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            }}
          >
            <Button
              className="w-full py-3 rounded-xl bg-black text-yellow-400 border-2 border-yellow-400 font-bold text-lg flex justify-center items-center gap-1 shadow-md hover:bg-yellow-900 active:bg-yellow-700 transition"
              onClick={handleSearch}
              disabled={!range.from || !range.to}
              style={{ minHeight: 56 }}
            >
              <Search className="w-5 h-5 mr-1" />
              <span className="pl-1">{t("reservation.search")}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Календарь одного месяца с выделением today и кастомными стилями
function MonthCalendar({ month, range, onSelect, locale }) {
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();
  const startDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
  );
  // Разбиваем месяц на недели (каждая неделя — массив дат)
  const weeks = [];
  let week = [];
  // Добавляем пустые ячейки в начало, если месяц не с понедельника
  const emptyDays = startDay === 0 ? 6 : startDay - 1;
  for (let i = 0; i < emptyDays; i++) week.push(null);
  days.forEach((date) => {
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  // Вспомогательные функции
  const isSameDay = (a, b) =>
    a && b && format(a, "yyyy-MM-dd") === format(b, "yyyy-MM-dd");
  const isInRange = (date) =>
    range.from && range.to && date > range.from && date < range.to;
  const isRangeStart = (date) => isSameDay(date, range.from);
  const isRangeEnd = (date) => isSameDay(date, range.to);
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  return (
    <div className="mb-2">
      <div className="text-lg font-bold text-yellow-400 mb-1 text-center">
        {format(month, "LLLL yyyy", { locale })}
      </div>
      <div className="grid grid-cols-7 gap-5 mb-1 text-yellow-400 text-center text-sm">
        {[...Array(7)].map((_, i) => (
          <span key={i}>
            {format(new Date(2023, 0, i + 2), "EE", { locale }).slice(0, 2)}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {weeks.map((week, wIdx) => {
          // Найти диапазон в этой неделе
          let startIdx = -1,
            endIdx = -1;
          week.forEach((date, i) => {
            if (
              date &&
              (isInRange(date) || isRangeStart(date) || isRangeEnd(date))
            ) {
              if (startIdx === -1) startIdx = i;
              endIdx = i;
            }
          });
          const hasRange = startIdx !== -1 && endIdx !== -1;
          return (
            <div key={wIdx} className="relative grid grid-cols-7 gap-5">
              {hasRange && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    gridColumnStart: startIdx + 1,
                    gridColumnEnd: endIdx + 2,
                    top: "10%",
                    bottom: "10%",
                    borderTop: "2px solid #facc15", // жёлтый
                    borderBottom: "2px solid #facc15",
                    borderRadius: "8px",
                    backgroundColor: "#facc15c4",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
              )}
              {week.map((date, i) => {
                if (!date) return <div key={i} className="w-10 h-10" />;
                const today = isToday(date);
                const start = isRangeStart(date);
                const end = isRangeEnd(date);
                const inRange = isInRange(date);
                const pastDate = isPastDate(date);
                return (
                  <button
                    key={date.toISOString()}
                    className={[
                      "h-10 w-10 flex items-center justify-center font-bold transition-colors duration-150 relative",
                      pastDate
                        ? "text-gray-500 line-through cursor-not-allowed opacity-50"
                        : start || end
                        ? "bg-yellow-400 text-black z-10 rounded-xl border-2 border-yellow-400"
                        : inRange
                        ? "text-black z-10"
                        : today
                        ? "border-2 border-white text-white bg-transparent z-10 rounded-full"
                        : "text-white hover:bg-yellow-400 hover:text-black z-10 rounded-full",
                    ].join(" ")}
                    style={{ gridColumn: i + 1 }}
                    onClick={() => !pastDate && onSelect(date)}
                    disabled={pastDate}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RentSearchCalendar;
