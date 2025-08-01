import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { useTranslation } from "react-i18next";

function TimePicker({ value, onChange, onClose }) {
  const { t } = useTranslation();
  const [hour, setHour] = useState(Number(value.split(":")[0]));
  const [minute, setMinute] = useState(Number(value.split(":")[1]));

  const hours = Array.from({ length: 24 }, (_, h) => h);
  const minutes = Array.from({ length: 60 }, (_, m) => m);

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const [buffer, setBuffer] = useState(40 * 3); // Увеличиваем буфер для бесконечности
  const didInitScrollHour = useRef(false);
  const didInitScrollMinute = useRef(false);
  const [hourScrollTop, setHourScrollTop] = useState(0);
  const [minuteScrollTop, setMinuteScrollTop] = useState(0);

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
      const initialScroll = hour * 40;
      hourRef.current.scrollTop = initialScroll;
      setHourScrollTop(initialScroll);
      didInitScrollHour.current = true;
    }
    if (!didInitScrollMinute.current && minuteRef.current) {
      const initialScroll = minute * 40;
      minuteRef.current.scrollTop = initialScroll;
      setMinuteScrollTop(initialScroll);
      didInitScrollMinute.current = true;
    }
  }, []);

  const handleHourScroll = () => {
    if (hourRef.current) {
      const scrollTop = hourRef.current.scrollTop;
      setHourScrollTop(scrollTop);

      // Вычисляем текущий час на основе позиции скролла
      const currentHour = Math.round(scrollTop / 40) % 24;
      if (currentHour !== hour) {
        setHour(currentHour);
        const newTime = `${currentHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        onChange(newTime);
      }
    }
  };

  const handleMinuteScroll = () => {
    if (minuteRef.current) {
      const scrollTop = minuteRef.current.scrollTop;
      setMinuteScrollTop(scrollTop);

      // Вычисляем текущую минуту на основе позиции скролла
      const currentMinute = Math.round(scrollTop / 40) % 60;
      if (currentMinute !== minute) {
        setMinute(currentMinute);
        const newTime = `${hour.toString().padStart(2, "0")}:${currentMinute
          .toString()
          .padStart(2, "0")}`;
        onChange(newTime);
      }
    }
  };

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

  // Функция для создания бесконечного массива чисел
  const createInfiniteArray = (array) => {
    return [...array, ...array, ...array]; // Три копии для бесконечности
  };

  const infiniteHours = createInfiniteArray(hours);
  const infiniteMinutes = createInfiniteArray(minutes);

  // Функция для получения стиля элемента на основе расстояния от центра
  const getItemStyle = (scrollTop, index) => {
    const centerIndex = Math.round(scrollTop / 40);
    const distance = Math.abs(index - centerIndex);

    if (distance === 0) {
      return {
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "1.1em",
        transform: "scale(1.05)",
        opacity: 1,
      };
    } else if (distance === 1) {
      return {
        color: "#d1d5db",
        fontWeight: 500,
        fontSize: "1em",
        transform: "scale(1)",
        opacity: 0.8,
      };
    } else if (distance === 2) {
      return {
        color: "#9ca3af",
        fontWeight: 400,
        fontSize: "0.95em",
        transform: "scale(0.95)",
        opacity: 0.4,
      };
    } else {
      return {
        color: "#6b7280",
        fontWeight: 300,
        fontSize: "0.9em",
        transform: "scale(0.9)",
        opacity: 0.2,
      };
    }
  };

  return (
    <>
      <style>{`
        .time-picker-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overflow-x: hidden;
        }
        .time-picker-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .time-picker-item {
          transition: all 0.3s ease-out;
          position: relative;
          cursor: pointer;
        }
        .time-picker-item:hover {
          color: #ffffff !important;
          opacity: 1 !important;
        }
        .center-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 40px;
          background: rgba(185, 0, 3, 0.15);
          border: 1px solid rgba(185, 0, 3, 0.3);
          border-radius: 8px;
          pointer-events: none;
          z-index: 5;
        }
      `}</style>
      <div className="relative w-full max-w-xs mx-auto flex flex-col items-center bg-[#232325] rounded-2xl p-4 shadow-xl z-10">
        <div className="flex gap-4 relative h-48 w-full justify-center overflow-hidden">
          {/* Центральная линия выделения */}
          <div className="center-line" />

          {/* Часы */}
          <div
            ref={hourRef}
            className="flex-1 h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory time-picker-scrollbar relative"
            style={{ minWidth: 60, maxWidth: 60 }}
            onScroll={handleHourScroll}
          >
            <div style={{ height: buffer }} />
            {infiniteHours.map((h, idx) => {
              const style = getItemStyle(hourScrollTop, idx);

              return (
                <div
                  key={`hour-${idx}`}
                  className="h-10 flex items-center justify-center text-lg snap-center time-picker-item"
                  style={style}
                  onClick={() => handleHourClick(h, idx)}
                >
                  {h.toString().padStart(2, "0")}
                </div>
              );
            })}
            <div style={{ height: buffer }} />
          </div>

          {/* Минуты */}
          <div
            ref={minuteRef}
            className="flex-1 h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory time-picker-scrollbar relative"
            style={{ minWidth: 60, maxWidth: 60 }}
            onScroll={handleMinuteScroll}
          >
            <div style={{ height: buffer }} />
            {infiniteMinutes.map((m, idx) => {
              const style = getItemStyle(minuteScrollTop, idx);

              return (
                <div
                  key={`minute-${idx}`}
                  className="h-10 flex items-center justify-center text-lg snap-center time-picker-item"
                  style={style}
                  onClick={() => handleMinuteClick(m, idx)}
                >
                  {m.toString().padStart(2, "0")}
                </div>
              );
            })}
            <div style={{ height: buffer }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TimePicker;
