import { useState, useEffect, useRef } from "react";
import { Filter, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CarCard from "./CarCard";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import type { CarCardProps } from "./CarCard";
import { fetchCars } from "@/lib/airtable";

const categoryMap = {
  sedan: "Седан",
  convertible: "Кабриолет",
  wagon: "Универсал",
  crossover: "Кроссовер",
  suv: "Внедорожник",
  pickup: "Пикап",
  hatchback: "Хэтчбэк",
};

const Cars = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const carsPerPage = 9;
  const isMobile = useMediaQuery("(max-width: 767px)");
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const carsListRef = useRef<HTMLDivElement>(null);
  // По умолчанию сортировка по имени по возрастанию
  const [sortBy, setSortBy] = useState<"price" | "name" | null>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const categories = [
    { key: "all", label: t("cars.category.all"), value: null },
    { key: "sedan", label: t("cars.category.sedan"), value: "sedan" },
    {
      key: "convertible",
      label: t("cars.category.convertible"),
      value: "convertible",
    },
    { key: "wagon", label: t("cars.category.wagon"), value: "wagon" },
    {
      key: "crossover",
      label: t("cars.category.crossover"),
      value: "crossover",
    },
    { key: "suv", label: t("cars.category.suv"), value: "suv" },
    { key: "pickup", label: t("cars.category.pickup"), value: "pickup" },
    {
      key: "hatchback",
      label: t("cars.category.hatchback"),
      value: "hatchback",
    },
  ];

  const {
    data: cars = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Check if user has scrolled to the end and hide scroll hint
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile && filterContainerRef.current) {
        const container = filterContainerRef.current;
        const scrollLeft = container.scrollLeft;
        const clientWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;

        // Check if we're at the end of the scroll (with tolerance)
        const isAtEndOfScroll = scrollLeft + clientWidth >= scrollWidth - 15;

        setIsAtEnd(isAtEndOfScroll);

        // Show/hide hint based on scroll position
        if (isAtEndOfScroll) {
          setShowScrollHint(false);
        } else if (scrollLeft > 10) {
          // Show hint when scrolling back from the end
          setShowScrollHint(true);
        }
      }
    };

    const filterContainer = filterContainerRef.current;
    if (filterContainer) {
      filterContainer.addEventListener("scroll", handleScroll);

      // Check initial state after a small delay to ensure DOM is ready
      setTimeout(() => {
        handleScroll();
      }, 100);

      return () => filterContainer.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  // Reset scroll hint when categories change
  useEffect(() => {
    if (isMobile) {
      setShowScrollHint(true);
      setIsAtEnd(false);

      // Check scroll position after category change
      setTimeout(() => {
        if (filterContainerRef.current) {
          const container = filterContainerRef.current;
          const scrollLeft = container.scrollLeft;
          const clientWidth = container.clientWidth;
          const scrollWidth = container.scrollWidth;
          const isAtEndOfScroll = scrollLeft + clientWidth >= scrollWidth - 15;

          setIsAtEnd(isAtEndOfScroll);
          if (isAtEndOfScroll) {
            setShowScrollHint(false);
          }
        }
        // Скроллим к началу списка машин
        if (carsListRef.current) {
          carsListRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      // На десктопе тоже скроллим к началу
      if (carsListRef.current) {
        carsListRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [selectedCategory, isMobile]);

  const filteredCars =
    selectedCategory === "all"
      ? cars
      : cars.filter(
          (car: CarCardProps) => car.category === categoryMap[selectedCategory]
        );

  // Сортировка
  const sortedCars = [...filteredCars];
  if (sortBy === "price") {
    sortedCars.sort((a, b) =>
      sortDir === "asc"
        ? a.pricePerDay - b.pricePerDay
        : b.pricePerDay - a.pricePerDay
    );
  } else if (sortBy === "name") {
    sortedCars.sort((a, b) =>
      sortDir === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
  }

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const paginatedCars = isMobile
    ? filteredCars
    : filteredCars.slice(
        (currentPage - 1) * carsPerPage,
        currentPage * carsPerPage
      );

  // Loading skeleton
  if (isLoading) {
    return (
      <section id="cars" className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
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
      <section id="cars" className="py-20 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-16 w-16 text-destructive" />
              <h2 className="text-2xl font-bold text-destructive">
                {t("cars.errorTitle", "Ошибка загрузки")}
              </h2>
              <p className="text-muted-foreground max-w-md">
                {error instanceof Error
                  ? error.message
                  : t("cars.errorMessage", "Не удалось загрузить автомобили")}
              </p>
              <Button
                onClick={() => refetch()}
                className="mt-4"
                variant="outline"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("cars.retry", "Попробовать снова")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cars" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Sticky фильтр и сортировка */}
        <div className="sticky top-[95px] z-30   border-border/30 mb-4 mx-auto max-w-xl ">
          <div className={`flex justify-center ${isMobile ? "pt-2" : "pt-4"}`}>
            <div className="relative">
              <div
                ref={filterContainerRef}
                className="flex items-center bg-card/50 backdrop-blur border border-border/50 rounded-full p-2 max-w-[90vw] overflow-x-auto scrollbar-hide"
              >
                <Filter className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                <div className="flex items-center space-x-2 px-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.key}
                      variant={
                        selectedCategory === cat.key ? "default" : "ghost"
                      }
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(cat.key);
                        setCurrentPage(1);
                      }}
                      className={`${
                        selectedCategory === cat.key ? "glow-effect" : ""
                      } flex-shrink-0 whitespace-nowrap`}
                    >
                      {cat.label}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Scroll hint for mobile */}
              {isMobile && showScrollHint && (
                <div className="absolute -bottom-4 right-2">
                  <div className="w-8 h-8 bg-yellow-400/80 backdrop-blur border border-yellow-300/50 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-white/80"
                    >
                      <path
                        d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Мини-навигация сортировки */}
          <div className="mx-auto max-w-[50vw] md:max-w-[20vw] flex items-center bg-card/50 backdrop-blur border border-border/50 rounded-b-xl p-2 overflow-x-auto scrollbar-hide gap-2 justify-center py-2">
            <button
              className="flex items-center gap-1 text-sm font-medium px-2 py-1 rounded hover:bg-primary/10 transition"
              onClick={() => {
                if (sortBy === "price")
                  setSortDir(sortDir === "asc" ? "desc" : "asc");
                setSortBy("price");
                if (carsListRef.current) {
                  carsListRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              {t("cars.sort.price", "Цена")}
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
                if (carsListRef.current) {
                  carsListRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              {t("cars.sort.name", "Имя")}
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
        <div ref={carsListRef}></div>
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("cars.title")}{" "}
            <span className="gradient-text">{t("cars.titleAccent")}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("cars.subtitle")}
          </p>
        </div>
        {/* Filter */}
        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(isMobile
            ? sortedCars
            : sortedCars.slice(
                (currentPage - 1) * carsPerPage,
                currentPage * carsPerPage
              )
          ).map((car: CarCardProps, index: number) => (
            <div
              key={car.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CarCard
                {...car}
                pricePerDay={car.pricePerDay}
                price2to10={car.price2to10}
                price11to20={car.price11to20}
                price21to29={car.price21to29}
                price30plus={car.price30plus}
              />
            </div>
          ))}
        </div>
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t("cars.notFound", {
                category:
                  selectedCategory === "all"
                    ? t("cars.category.all")
                    : t(`cars.category.${selectedCategory}`),
              })}
            </p>
          </div>
        )}
        {/* Pagination (desktop only) */}
        {!isMobile && totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-all ${
                  currentPage === i + 1
                    ? "bg-primary text-white border-primary scale-110 shadow-lg"
                    : "bg-card/70 text-primary border-border hover:bg-primary/10"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-card/30 backdrop-blur border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{t("cars.ctaTitle")}</h3>
            <p className="text-muted-foreground mb-6">{t("cars.ctaDesc")}</p>
            <a href="tel:+37379013014">
              <Button size="lg" className="glow-effect">
                {t("cars.ctaButton")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cars;
