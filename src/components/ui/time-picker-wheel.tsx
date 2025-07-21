import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
      <div className="relative w-full max-w-xs mx-auto flex flex-col items-center bg-[#232325] rounded-2xl p-4 shadow-xl z-10">
        {/* Заголовок убран, теперь он должен быть снаружи компонента */}
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
            {/* Удаляю подпись 'часы' */}
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
            {/* Удаляю подпись 'минуты' */}
          </div>
        </div>
      </div>
    </>
  );
}

export default TimePicker;
