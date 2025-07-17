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

const getLocale = (lng: string) =>
  lng === "ru" ? ru : lng === "ro" ? ro : enUS;

const times = Array.from({ length: 24 * 4 }, (_, i) => {
  const h = Math.floor(i / 4)
    .toString()
    .padStart(2, "0");
  const m = ((i % 4) * 15).toString().padStart(2, "0");
  return `${h}:${m}`;
});

function TimeWheel({ value, onChange, onClose }) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center bg-black/60">
      <div className="bg-white rounded-t-2xl md:rounded-2xl p-4 w-full max-w-xs mx-auto flex flex-col items-center">
        <div className="w-full flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-700 hover:text-black">
            <X />
          </button>
        </div>
        <div className="overflow-y-auto max-h-60 w-full">
          {times.map((t) => (
            <button
              key={t}
              className={`w-full py-2 text-lg font-bold rounded-lg mb-1 ${
                t === value
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-gray-900 hover:bg-yellow-100"
              }`}
              onClick={() => {
                onChange(t);
                onClose();
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
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
    <div className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-lg p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          className="flex-1 border border-yellow-400 rounded-lg px-3 py-2 text-left font-semibold text-black bg-white hover:bg-yellow-50 transition"
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
          className="flex-1 border border-yellow-400 rounded-lg px-3 py-2 text-left font-semibold text-black bg-white hover:bg-yellow-50 transition"
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
        className="w-full bg-black text-yellow-400 border-2 border-yellow-400 font-bold text-lg py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-900 transition"
        onClick={handleSearch}
        disabled={!range.from || !range.to}
      >
        <Search className="w-5 h-5 mr-2" />
        {t("reservation.search", "Найти")}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className={`flex flex-col h-full p-0 ${
            isMobile
              ? "w-full min-h-[100dvh] max-w-full rounded-none top-0 left-0 z-[1001]"
              : "fixed right-0 top-0 h-full w-[420px] max-w-full rounded-l-2xl z-[1001]"
          } bg-[#232325]`}
          style={
            isMobile
              ? {}
              : { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
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
                    selected={activeField === "from" ? range.from : range.to}
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
            <TimeWheel
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
function MonthCalendar({ month, selected, onSelect, locale }) {
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
  return (
    <div className="mb-2">
      <div className="text-lg font-bold text-yellow-400 mb-1 text-center">
        {format(month, "LLLL yyyy", { locale })}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-yellow-400 text-center text-sm">
        {[...Array(7)].map((_, i) => (
          <span key={i}>
            {format(new Date(2023, 0, i + 2), "EE", { locale }).slice(0, 2)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(startDay === 0 ? 6 : startDay - 1)
          .fill(null)
          .map((_, i) => (
            <span key={i}></span>
          ))}
        {days.map((date) => {
          const isSelected =
            selected &&
            format(date, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");
          return (
            <button
              key={date.toISOString()}
              className={`h-10 w-10 flex items-center justify-center rounded-full font-bold transition-colors duration-150
                ${
                  isSelected
                    ? "bg-yellow-400 text-black border-2 border-yellow-400"
                    : isToday(date)
                    ? "border-2 border-white text-white"
                    : "text-white hover:bg-yellow-400 hover:text-black"
                }`}
              onClick={() => onSelect(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default RentSearchCalendar;
