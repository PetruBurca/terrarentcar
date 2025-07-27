import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Filter, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { Badge } from "@/components/ui/feedback/badge";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { CarCardMobile } from "../car/CarCardMobile";
import type { CarCardProps } from "../car/CarCard";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchCars, fetchOrders } from "@/lib/airtable";

const categoryMap = {
  sedan: "Седан",
  convertible: "Кабриолет",
  wagon: "Универсал",
  crossover: "Кроссовер",
  suv: "Внедорожник",
  pickup: "Пикап",
  hatchback: "Хэтчбэк",
};

function isDateOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && aEnd >= bStart;
}

const CarsMobile = ({ searchDates }) => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCars, setVisibleCars] = useState<CarCardProps[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const carsPerPage = 4; // Еще меньше машин для мобильных
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<"price" | "name" | null>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const prevVisibleCarsRef = useRef<string>("");

  // Мемоизированные категории
  const categories = useMemo(
    () => [
      { key: "all", label: t("cars.category.all"), value: null },
      { key: "sedan", label: t("cars.category.sedan"), value: "sedan" },
      {
        key: "crossover",
        label: t("cars.category.crossover"),
        value: "crossover",
      },
      { key: "suv", label: t("cars.category.suv"), value: "suv" },
    ],
    [t]
  );

  const {
    data: cars = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cars", i18n.language],
    queryFn: fetchCars,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders", i18n.language],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5,
  });

  // Мемоизированная фильтрация
  const availableCars = useMemo(() => {
    if (!searchDates?.from || !searchDates?.to) return cars;

    return cars.filter((car) => {
      const carOrders = orders.filter((order) => {
        const hasCarId = order.carIds && order.carIds.includes(car.id);
        const isConfirmed =
          order.status === "подтверждена" || order.status === "подтвержден";
        const hasDates = order.startDate && order.endDate;
        return hasCarId && isConfirmed && hasDates;
      });

      if (carOrders.length === 0) return true;

      const from = new Date(searchDates.from);
      const to = new Date(searchDates.to);

      return !carOrders.some((order) => {
        let orderStart, orderEnd;
        if (order.startDate.includes(".")) {
          orderStart = new Date(order.startDate.replace(/\./g, "/"));
        } else {
          orderStart = new Date(order.startDate);
        }
        if (order.endDate.includes(".")) {
          orderEnd = new Date(order.endDate.replace(/\./g, "/"));
        } else {
          orderEnd = new Date(order.endDate);
        }
        return isDateOverlap(from, to, orderStart, orderEnd);
      });
    });
  }, [cars, orders, searchDates?.from, searchDates?.to]);

  // Мемоизированная фильтрация по категории
  const filteredCars = useMemo(() => {
    return selectedCategory === "all"
      ? availableCars
      : availableCars.filter(
          (car) => car.category === categoryMap[selectedCategory]
        );
  }, [availableCars, selectedCategory]);

  // Мемоизированная сортировка
  const sortedCars = useMemo(() => {
    const sorted = [...filteredCars];
    if (sortBy === "price") {
      sorted.sort((a, b) =>
        sortDir === "asc"
          ? a.pricePerDay - b.pricePerDay
          : b.pricePerDay - a.pricePerDay
      );
    } else if (sortBy === "name") {
      sorted.sort((a, b) =>
        sortDir === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }
    return sorted;
  }, [filteredCars, sortBy, sortDir]);

  const totalPages = Math.ceil(sortedCars.length / carsPerPage);

  // Ленивая загрузка с Intersection Observer
  useEffect(() => {
    if (sortedCars.length > 0) {
      const startIndex = (currentPage - 1) * carsPerPage;
      const endIndex = startIndex + carsPerPage;
      const newVisibleCars = sortedCars.slice(startIndex, endIndex);
      const newVisibleCarsKey = JSON.stringify(
        newVisibleCars.map((car) => car.id)
      );

      // Проверяем, изменились ли видимые машины
      if (newVisibleCarsKey !== prevVisibleCarsRef.current) {
        prevVisibleCarsRef.current = newVisibleCarsKey;
        setVisibleCars(newVisibleCars);
      }
    }
  }, [sortedCars.length, currentPage, carsPerPage]);

  // Loading skeleton
  if (isLoading || isLoadingOrders) {
    return (
      <section id="cars" className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section id="cars" className="py-12 relative">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-destructive mb-2">
            {t("cars.errorTitle", "Ошибка загрузки")}
          </h2>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : t("cars.errorMessage", "Не удалось загрузить автомобили")}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("cars.retry", "Попробовать снова")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="cars" className="py-12 relative">
      <div className="container mx-auto px-4">
        {/* Sticky фильтр и сортировка для мобильных */}
        <div className="sticky top-[95px] z-30 mb-4">
          <div className="flex justify-center pt-2">
            <div className="relative">
              <div
                ref={filterContainerRef}
                className="flex items-center bg-card/50 backdrop-blur border border-border/50 rounded-full p-2 max-w-[90vw] overflow-x-auto scrollbar-hide"
              >
                <Filter className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                <div className="flex items-center space-x-2 px-2">
                  {categories.map((cat) => (
                    <Button
                      key={`${cat.key}-${i18n.language}`}
                      variant={
                        selectedCategory === cat.key ? "default" : "ghost"
                      }
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(cat.key);
                        setCurrentPage(1);
                      }}
                      className="whitespace-nowrap"
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Мини-навигация сортировки */}
          <div className="mx-auto max-w-[50vw] flex items-center bg-card/50 backdrop-blur border border-border/50 rounded-b-xl p-2 overflow-x-auto scrollbar-hide gap-2 justify-center py-2">
            <button
              className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition"
              onClick={() => {
                if (sortBy === "price")
                  setSortDir(sortDir === "asc" ? "desc" : "asc");
                setSortBy("price");
              }}
            >
              {t("cars.sort.price")}
              <span
                className={`transition-transform ${
                  sortBy === "price" && sortDir === "desc" ? "rotate-180" : ""
                } text-yellow-400`}
              >
                ▼
              </span>
            </button>
            <button
              className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition"
              onClick={() => {
                if (sortBy === "name")
                  setSortDir(sortDir === "asc" ? "desc" : "asc");
                setSortBy("name");
              }}
            >
              {t("cars.sort.name")}
              <span
                className={`transition-transform ${
                  sortBy === "name" && sortDir === "desc" ? "rotate-180" : ""
                } text-yellow-400`}
              >
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">
            {t("cars.title")}{" "}
            <span className="gradient-text">{t("cars.titleAccent")}</span>
          </h2>
          <p className="text-muted-foreground text-sm">{t("cars.subtitle")}</p>
        </div>

        {/* Список машин */}
        <div className="space-y-4">
          {visibleCars.map((car: CarCardProps, index: number) => (
            <div key={`${car.id}-${i18n.language}`} className="animate-fade-in">
              <CarCardMobile
                {...car}
                pricePerDay={car.pricePerDay}
                price2to10={car.price2to10}
                price11to20={car.price11to20}
                price21to29={car.price21to29}
                price30plus={car.price30plus}
                year={car.year}
                engine={car.engine}
                drive={car.drive}
                description_ru={car.description_ru}
                description_ro={car.description_ro}
                description_en={car.description_en}
              />
            </div>
          ))}
        </div>

        {/* Пустое состояние */}
        {filteredCars.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {t("cars.notFound", {
                category:
                  selectedCategory === "all"
                    ? t("cars.category.all")
                    : t(`cars.category.${selectedCategory}`),
              })}
            </p>
          </div>
        )}

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* Кнопка "Предыдущая" */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                currentPage === 1
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-card/70 text-primary border-border hover:bg-primary/10 hover:scale-105"
              }`}
            >
              ←
            </button>
            {(() => {
              const pages = [];
              const maxVisiblePages = 5; // Меньше страниц для мобильных

              // Функция для добавления кнопки страницы
              const addPageButton = (pageNum: number) => {
                pages.push(
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all ${
                      currentPage === pageNum
                        ? "bg-primary text-white border-primary scale-110 shadow-lg"
                        : "bg-card/70 text-primary border-border hover:bg-primary/10 hover:scale-105"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              };

              // Функция для добавления многоточия
              const addEllipsis = (key: string) => {
                pages.push(
                  <span
                    key={key}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground"
                  >
                    ...
                  </span>
                );
              };

              if (totalPages <= maxVisiblePages) {
                // Если страниц мало, показываем все
                for (let i = 1; i <= totalPages; i++) {
                  addPageButton(i);
                }
              } else {
                // Если страниц много, используем логику с многоточием

                // Всегда показываем первую страницу
                addPageButton(1);

                if (currentPage <= 3) {
                  // Если текущая страница в начале
                  for (let i = 2; i <= 4; i++) {
                    addPageButton(i);
                  }
                  addEllipsis("ellipsis-end");
                  addPageButton(totalPages);
                } else if (currentPage >= totalPages - 2) {
                  // Если текущая страница в конце
                  addEllipsis("ellipsis-start");
                  for (let i = totalPages - 3; i <= totalPages - 1; i++) {
                    addPageButton(i);
                  }
                  addPageButton(totalPages);
                } else {
                  // Если текущая страница в середине
                  addEllipsis("ellipsis-start");
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    addPageButton(i);
                  }
                  addEllipsis("ellipsis-end");
                  addPageButton(totalPages);
                }
              }

              return pages;
            })()}
            {/* Кнопка "Следующая" */}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                currentPage === totalPages
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-card/70 text-primary border-border hover:bg-primary/10 hover:scale-105"
              }`}
            >
              →
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-card/30 backdrop-blur border border-border/50 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-3">{t("cars.ctaTitle")}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t("cars.ctaDesc")}
            </p>
            <a href="tel:+37379013014">
              <Button size="sm" className="glow-effect">
                {t("cars.ctaButton")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarsMobile;
