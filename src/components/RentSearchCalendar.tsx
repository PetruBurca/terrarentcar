import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format, isToday } from "date-fns";
import { ru, ro, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { X, Search } from "lucide-react";
import React from "react";

const getLocale = (lng: string) =>
  lng === "ru" ? ru : lng === "ro" ? ro : enUS;

const times = Array.from({ length: 24 * 4 }, (_, i) => {
  const h = Math.floor(i / 4)
    .toString()
    .padStart(2, "0");
  const m = ((i % 4) * 15).toString().padStart(2, "0");
  return `${h}:${m}`;
});

function TimePicker({ value, onChange, onClose }) {
  const { t } = useTranslation();
  const [hour, setHour] = useState(Number(value.split(":")[0]));
  const [minute, setMinute] = useState(Number(value.split(":")[1]));

  const hours = Array.from({ length: 24 }, (_, h) => h);
  const minutes = Array.from({ length: 60 }, (_, m) => m);

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const [buffer, setBuffer] = useState(40 * 2); // default 80px
  const didInitScrollHour = useRef(false);
  const didInitScrollMinute = useRef(false);

  useEffect(() => {
    // Вычисляем buffer динамически
    if (hourRef.current) {
      const rowHeight = 40;
      const containerHeight = hourRef.current.offsetHeight;
      setBuffer(containerHeight / 2 - rowHeight / 2);
    }
  }, []);

  // Скроллим к выбранному значению только при открытии
  useEffect(() => {
    if (!didInitScrollHour.current && hourRef.current) {
      scrollToIndex(hourRef, hour);
      didInitScrollHour.current = true;
    }
    if (!didInitScrollMinute.current && minuteRef.current) {
      scrollToIndex(minuteRef, minute);
      didInitScrollMinute.current = true;
    }
  }, []);

  const scrollToIndex = (ref, idx) => {
    if (ref.current) {
      const rowHeight = 40;
      ref.current.scrollTo({
        top: idx * rowHeight,
        behavior: "smooth",
      });
    }
  };

  const handleHourClick = (h, idx) => {
    setHour(h);
    scrollToIndex(hourRef, idx);
  };
  const handleMinuteClick = (m, idx) => {
    setMinute(m);
    scrollToIndex(minuteRef, idx);
  };

  const handleOk = () => {
    onChange(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );
    onClose();
  };

  return (
    <>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #facc15 #232325;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: #232325;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #facc15;
          border-radius: 8px;
          border: 2px solid #232325;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ffe066;
        }
      `}</style>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60">
        <div className="bg-[#232325] rounded-2xl p-4 w-full max-w-xs mx-auto flex flex-col items-center relative shadow-xl">
          <div className="w-full flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-yellow-400 hover:text-yellow-200 text-2xl"
            >
              <X />
            </button>
          </div>
          <div className="flex gap-4 relative h-48 w-full justify-center">
            {/* Акцентная область */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-10 bg-gray-500/40 rounded-lg pointer-events-none z-10" />
            {/* Часы */}
            <div
              ref={hourRef}
              className="flex-1 h-full overflow-y-auto snap-y snap-mandatory custom-scrollbar"
              style={{ minWidth: 60 }}
            >
              <div style={{ height: buffer }} />
              {hours.map((h, idx) => (
                <div
                  key={h}
                  className={`h-10 flex items-center justify-center text-lg snap-center cursor-pointer transition-all duration-300 text-white ${
                    hour === h ? "font-bold bg-gray-700/80 rounded" : ""
                  }`}
                  onClick={() => handleHourClick(h, idx)}
                >
                  {h.toString().padStart(2, "0")}
                </div>
              ))}
              <div style={{ height: buffer }} />
              <div className="text-center text-xs text-yellow-200 mt-2">
                {t("reservation.hours", "часы")}
              </div>
            </div>
            {/* Минуты */}
            <div
              ref={minuteRef}
              className="flex-1 h-full overflow-y-auto snap-y snap-mandatory custom-scrollbar"
              style={{ minWidth: 60 }}
            >
              <div style={{ height: buffer }} />
              {minutes.map((m, idx) => (
                <div
                  key={m}
                  className={`h-10 flex items-center justify-center text-lg snap-center cursor-pointer transition-all duration-300 text-white ${
                    minute === m ? "font-bold bg-gray-700/80 rounded" : ""
                  }`}
                  onClick={() => handleMinuteClick(m, idx)}
                >
                  {m.toString().padStart(2, "0")}
                </div>
              ))}
              <div style={{ height: buffer }} />
              <div className="text-center text-xs text-yellow-200 mt-2">
                {t("reservation.minutes", "минуты")}
              </div>
            </div>
          </div>
          <Button
            onClick={handleOk}
            className="w-full bg-yellow-400 text-black font-bold mt-4"
          >
            {t("reservation.ok", "OK")}
          </Button>
        </div>
      </div>
    </>
  );
}

export const RentSearchCalendar = ({ onSearch }) => {
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<null | "from" | "to">(
    null
  );
  const [range, setRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("10:00");

  // Вертикальный календарь: ближайшие 12 месяцев (локальное время)
  const now = new Date();
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(now.getFullYear(), now.getMonth() + i, 1)
  );
  if (typeof window !== "undefined") {
    console.log(
      "now",
      now,
      "months",
      months.map((m) => m.toISOString())
    );
  }
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
      if (typeof window !== "undefined") {
        console.log("today", today, "todayMonthIdx", todayMonthIdx);
      }
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
      setRange((r) => ({ ...r, from: date }));
      setActiveField("to");
    } else if (activeField === "to") {
      setRange((r) => ({ ...r, to: date }));
      // setModalOpen(false); // Больше не закрываем окно автоматически
    }
  };

  const handleSearch = () => {
    setModalOpen(false);
    onSearch?.({
      from: range.from,
      to: range.to,
      fromTime,
      toTime,
    });
  };

  const locale = getLocale(i18n.language);
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 767 : true;

  return (
    <div className="w-full md:max-w-md md:mx-auto bg-[#232325] rounded-2xl shadow-2xl p-3 flex flex-col gap-4 border border-yellow-400 mt-13 mb-11 sm:mt-0 transition hover:shadow-yellow-400/30 hover:scale-[1.01] duration-200">
      <div className="flex gap-2">
        <button
          className="flex-1 border border-yellow-400 rounded-lg px-4 py-3 text-left font-semibold text-yellow-400 bg-[#18181b] hover:bg-yellow-900/20 transition text-lg"
          onClick={() => handleFieldClick("from")}
        >
          <span className="block text-xs text-gray-500 mb-1">
            {t("reservation.pickupDate", "Дата выдачи")}
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
            {t("reservation.returnDate", "Дата возврата")}
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
        {t("reservation.search", "Найти")}
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
            {t("reservation.title", "Выбор дат и времени")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t(
              "reservation.dialogDescription",
              "Выберите даты и время подачи/возврата для поиска автомобилей"
            )}
          </DialogDescription>
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
                    {t("reservation.pickupDate", "Дата выдачи")}
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
                    {t("reservation.returnDate", "Дата возврата")}
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
              <div className="flex gap-2">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xs text-white/70 mb-1">
                    {t("reservation.pickupTime", "Время выдачи")}
                  </span>
                  <button
                    className="w-full py-2 rounded-lg border border-yellow-400 bg-black text-yellow-400 font-bold text-lg text-center hover:bg-yellow-400 hover:text-black transition"
                    onClick={() => setShowTimePicker("from")}
                  >
                    {fromTime}
                  </button>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-xs text-white/70 mb-1">
                    {t("reservation.returnTime", "Время возврата")}
                  </span>
                  <button
                    className="w-full py-2 rounded-lg border border-yellow-400 bg-black text-yellow-400 font-bold text-lg text-center hover:bg-yellow-400 hover:text-black transition"
                    onClick={() => setShowTimePicker("to")}
                  >
                    {toTime}
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
              <span className="pl-1">{t("reservation.search", "Найти")}</span>
            </Button>
          </div>
          {/* Wheel time picker popover */}
          {showTimePicker && (
            <TimePicker
              value={showTimePicker === "from" ? fromTime : toTime}
              onChange={(val) =>
                showTimePicker === "from" ? setFromTime(val) : setToTime(val)
              }
              onClose={() => setShowTimePicker(null)}
            />
          )}
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
                return (
                  <button
                    key={date.toISOString()}
                    className={[
                      "h-10 w-10 flex items-center justify-center font-bold transition-colors duration-150 relative",
                      today
                        ? "border-2 border-white text-white bg-transparent z-10 rounded-full"
                        : start || end
                        ? "bg-yellow-400 text-black z-10 rounded-xl border-2 border-yellow-400"
                        : inRange
                        ? "text-black z-10"
                        : "text-white hover:bg-yellow-400 hover:text-black z-10 rounded-full",
                    ].join(" ")}
                    style={{ gridColumn: i + 1 }}
                    onClick={() => onSelect(date)}
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
