import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

interface CarouselWithCenterProps {
  items: Array<{ label: string; value: string | number }>;
  title: string;
  colorCenter: string;
  colorSide: string;
  valueSuffix?: string;
}

export const CarouselWithCenter: React.FC<CarouselWithCenterProps> = ({
  items,
  title,
  colorCenter,
  colorSide,
  valueSuffix = "",
}) => {
  // Адаптивное количество видимых элементов
  const [visibleCount, setVisibleCount] = useState(5);
  useEffect(() => {
    const updateCount = () => {
      setVisibleCount(window.innerWidth <= 640 ? 3 : 5);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const [offset, setOffset] = useState(0); // Смещение в пикселях
  const [dragOffset, setDragOffset] = useState(0); // Временное смещение при перетаскивании
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [dragStartTime, setDragStartTime] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<
    "horizontal" | "vertical" | null
  >(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const itemWidth = 120; // Ширина одного элемента
  const totalWidth = items.length * itemWidth;
  const swipeThreshold = 10; // Минимальное расстояние для срабатывания свайпа
  const directionThreshold = 5; // Порог для определения направления

  // Нормализация offset для истинной бесконечной прокрутки
  const normalizeOffset = useCallback((off: number) => {
    // Не нормализуем offset, позволяем ему быть любым числом
    return off;
  }, []);

  // Получение активного индекса на основе offset
  const getActiveIndex = useCallback(() => {
    const rawIndex = Math.round(offset / itemWidth);
    return ((rawIndex % items.length) + items.length) % items.length;
  }, [offset, itemWidth, items.length]);

  // Touch handlers с полной блокировкой вертикального скролла
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setDragCurrent({ x: touch.clientX, y: touch.clientY });
    setDragOffset(0); // Сброс временного смещения
    setDragStartTime(Date.now());
    setSwipeDirection(null);
    setIsAnimating(false);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      // Определяем направление свайпа только один раз
      if (
        swipeDirection === null &&
        (Math.abs(deltaX) > directionThreshold ||
          Math.abs(deltaY) > directionThreshold)
      ) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setSwipeDirection("horizontal");
        } else {
          setSwipeDirection("vertical");
        }
      }

      // Если определили горизонтальный свайп - блокируем вертикальный скролл
      if (swipeDirection === "horizontal") {
        e.preventDefault();
        e.stopPropagation();
        setDragCurrent({ x: touch.clientX, y: touch.clientY });

        // Плавное перемещение через dragOffset (НЕ изменяем основной offset)
        setDragOffset(-deltaX);
      }

      // Если вертикальный свайп - НЕ блокируем, позволяем странице скроллиться
    },
    [
      isDragging,
      dragStart,
      swipeDirection,
      directionThreshold,
      itemWidth,
      offset,
    ]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragOffset(0); // Сброс временного смещения

      // Определяем какая ячейка должна быть по центру после перемещения
      if (swipeDirection === "horizontal") {
        // Эффективная позиция с учетом перемещения
        const effectiveOffset = offset + dragOffset;
        const targetIndex = Math.round(effectiveOffset / itemWidth);
        const targetOffset = targetIndex * itemWidth;

        setIsAnimating(true);
        setOffset(targetOffset);
        setTimeout(() => setIsAnimating(false), 250);
      } else {
        // Если не горизонтальный свайп - возвращаем к текущей позиции
        const currentIndex = Math.round(offset / itemWidth);
        const targetOffset = currentIndex * itemWidth;

        setIsAnimating(true);
        setOffset(targetOffset);
        setTimeout(() => setIsAnimating(false), 250);
      }

      setSwipeDirection(null);
    },
    [
      isDragging,
      swipeDirection,
      dragCurrent,
      dragStart,
      swipeThreshold,
      normalizeOffset,
      offset,
      itemWidth,
      items.length,
    ]
  );

  // Mouse handlers (аналогично touch, но без учета вертикального скролла)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragCurrent({ x: e.clientX, y: e.clientY });
    setDragOffset(0); // Сброс временного смещения
    setDragStartTime(Date.now());
    setSwipeDirection("horizontal"); // Для мыши всегда горизонтально
    setIsAnimating(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || swipeDirection !== "horizontal") return;

      const deltaX = e.clientX - dragStart.x;
      setDragCurrent({ x: e.clientX, y: e.clientY });

      // Плавное перемещение через dragOffset (НЕ изменяем основной offset)
      setDragOffset(-deltaX);
    },
    [isDragging, swipeDirection, dragStart, itemWidth, offset]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset(0); // Сброс временного смещения

    if (swipeDirection === "horizontal") {
      // Определяем какая ячейка должна быть по центру
      const effectiveOffset = offset + dragOffset;
      const targetIndex = Math.round(effectiveOffset / itemWidth);
      const targetOffset = targetIndex * itemWidth;

      setIsAnimating(true);
      setOffset(targetOffset);
      setTimeout(() => setIsAnimating(false), 250);
    }

    setSwipeDirection(null);
  }, [
    isDragging,
    swipeDirection,
    dragCurrent,
    dragStart,
    swipeThreshold,
    normalizeOffset,
    offset,
    itemWidth,
    items.length,
  ]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleMouseUp();
    }
  }, [isDragging, handleMouseUp]);

  // Кнопки навигации с плавной анимацией
  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset((prev) => prev - itemWidth); // Двигаем влево (к предыдущему)
    setTimeout(() => setIsAnimating(false), 250);
  }, [itemWidth, isAnimating]);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOffset((prev) => prev + itemWidth); // Двигаем вправо (к следующему)
    setTimeout(() => setIsAnimating(false), 250);
  }, [itemWidth, isAnimating]);

  // Оптимизированный рендер элементов с истинной бесконечностью
  const renderItems = useMemo(() => {
    const elements = [];

    // Вычисляем центральный индекс на основе текущего offset (без учета dragOffset)
    const centerIndex = Math.round(offset / itemWidth);
    // Эффективный offset с учетом перетаскивания
    const effectiveOffset = offset + dragOffset;

    // Рендерим элементы вокруг центрального с достаточным буфером
    const renderRange = visibleCount + 4; // Увеличиваем буфер

    for (let i = -renderRange; i <= renderRange; i++) {
      const virtualIndex = centerIndex + i;
      const itemIndex =
        ((virtualIndex % items.length) + items.length) % items.length;
      const item = items[itemIndex];
      const itemPosition = virtualIndex * itemWidth - effectiveOffset;

      // Пропускаем элементы, которые слишком далеко
      if (Math.abs(itemPosition) > itemWidth * (renderRange + 1)) continue;

      // Оптимизированные вычисления близости
      const distanceFromCenter = Math.abs(itemPosition) / (itemWidth * 1.2);
      const proximity = Math.max(0, Math.min(1, 1 - distanceFromCenter));

      // Более простые интерполяции
      const scale = 0.85 + proximity * 0.3;
      const opacity = 0.5 + proximity * 0.5;
      const fontSize = 15 + proximity * 6;

      // Упрощенная логика цвета
      const isCenter = proximity > 0.6;
      const isAdjacent = proximity > 0.3 && !isCenter; // Соседние элементы

      const bgOpacity = isCenter ? proximity * 0.9 : isAdjacent ? 0.8 : 0.7;
      const bgColor = isCenter
        ? `rgba(185, 0, 3, ${bgOpacity})`
        : `rgba(63, 63, 70, ${bgOpacity})`;

      const textColor = isCenter ? "#fff" : isAdjacent ? "#838383" : "#fff";

      elements.push(
        <div
          key={`${itemIndex}-${virtualIndex}`}
          className={`absolute flex flex-col items-center justify-center rounded-lg px-2 py-2 cursor-pointer select-none will-change-transform ${
            isCenter
              ? "hover:scale-105 active:scale-95"
              : isAdjacent
              ? "hover:scale-110 active:scale-100 hover:shadow-[#B90003]/30 hover:ring-1 hover:ring-[#B90003]/50"
              : "hover:scale-105 active:scale-95"
          } ${
            isDragging
              ? "" // Полностью убираем transitions во время drag для максимальной плавности
              : isAnimating
              ? "transition-all duration-250 ease-out"
              : "transition-all duration-150 ease-out hover:shadow-lg"
          }`}
          title={
            isAdjacent
              ? `Выбрать ${item.label}: ${item.value}${valueSuffix}`
              : ""
          }
          style={{
            left: `calc(50% + ${itemPosition}px)`,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "center center",
            opacity,
            backgroundColor: bgColor,
            color: textColor,
            width: `${itemWidth - 10}px`,
            height: "80px",
            zIndex: Math.round(proximity * 10) + 10,
            boxShadow: isCenter ? "0 4px 12px rgba(185, 0, 3, 0.25)" : "none",
            border: "none",
            position: "absolute",
            top: "50%",
            marginTop: "-40px", // Половина высоты элемента для центрирования
            pointerEvents: "auto",
            backfaceVisibility: "hidden",
            perspective: "1000px",
            cursor: isCenter ? "default" : isAdjacent ? "pointer" : "pointer",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isAnimating) return;

            setIsAnimating(true);

            // Определяем центральный элемент
            const currentCenterIndex = Math.round(offset / itemWidth);

            // Если кликнули не на центральный элемент - перемещаем его в центр
            if (virtualIndex !== currentCenterIndex) {
              const targetOffset = virtualIndex * itemWidth;
              setOffset(targetOffset);
            }

            setTimeout(() => setIsAnimating(false), 250);
          }}
        >
          <div className="text-xs mb-1 opacity-70">{item.label}</div>
          <div
            className="font-bold text-center"
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: isCenter ? 700 : 500,
            }}
          >
            {item.value}
            {valueSuffix ? ` ${valueSuffix}` : ""}
          </div>
        </div>
      );
    }

    return elements;
  }, [
    offset,
    dragOffset,
    itemWidth,
    items,
    visibleCount,
    isDragging,
    isAnimating,
    valueSuffix,
  ]);

  return (
    <div className="w-full max-w-full md:max-w-lg mx-auto relative">
      <h3 className="text-xl font-bold text-center mb-4 text-white">{title}</h3>

      {/* Кнопки навигации */}
      <button
        onClick={prev}
        disabled={isAnimating}
        className="absolute left-0 z-20 p-2 bg-black/40 rounded-full text-[#B90003] hover:bg-[#A00002] hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-[#B90003]/30"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          marginTop: "12px", // Компенсируем высоту заголовка (48px / 4)
        }}
      >
        &#8592;
      </button>
      <button
        onClick={next}
        disabled={isAnimating}
        className="absolute right-0 z-20 p-2 bg-black/40 rounded-full text-[#B90003] hover:bg-[#A00002] hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-[#B90003]/30"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          marginTop: "12px", // Компенсируем высоту заголовка (48px / 4)
        }}
      >
        &#8594;
      </button>

      {/* Невидимая лупа - только для понимания центра */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-16 pointer-events-none z-5"
        style={{
          background:
            "radial-gradient(ellipse, rgba(250, 204, 21, 0.02) 40%, transparent 70%)",
        }}
      />

      {/* Контейнер элементов */}
      <div
        ref={containerRef}
        className="relative h-24 overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={
          {
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "pan-x",
            WebkitTouchCallout: "none",
            overscrollBehavior: "contain",
            overscrollBehaviorX: "none",
            overscrollBehaviorY: "auto",
            pointerEvents: "auto",
          } as React.CSSProperties
        }
      >
        {renderItems}
      </div>

      {/* Точки навигации */}
      <div className="flex justify-center gap-1 mt-3">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);

              // Находим ближайший виртуальный индекс для выбранного элемента
              const currentIndex = Math.round(offset / itemWidth);
              const currentLogicalIndex =
                ((currentIndex % items.length) + items.length) % items.length;

              // Вычисляем минимальное расстояние для перехода
              let targetVirtualIndex = currentIndex;

              // Проверяем переход через начало/конец массива
              const distanceForward =
                (idx - currentLogicalIndex + items.length) % items.length;
              const distanceBackward =
                (currentLogicalIndex - idx + items.length) % items.length;

              if (distanceForward <= distanceBackward) {
                targetVirtualIndex = currentIndex + distanceForward;
              } else {
                targetVirtualIndex = currentIndex - distanceBackward;
              }

              setOffset(targetVirtualIndex * itemWidth);

              setTimeout(() => setIsAnimating(false), 250);
            }}
            disabled={isAnimating}
            className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 active:scale-110 disabled:cursor-default ${
              getActiveIndex() === idx
                ? "bg-[#B90003] scale-125 shadow-md shadow-[#B90003]/50 ring-2 ring-[#B90003]/30"
                : "bg-gray-600 scale-100 opacity-70 hover:opacity-100 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
