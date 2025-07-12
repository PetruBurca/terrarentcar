import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CarCard from "./CarCard";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import type { CarCardProps } from "./CarCard";
import { fetchCars } from "@/lib/airtable";

const categoryMap = {
  sedan: "Седан",
  suv: "Внедорожник",
  // Добавьте другие категории по мере необходимости
};

const Cars = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;
  const isMobile = useMediaQuery("(max-width: 767px)");

  const categories = [
    { key: "all", label: t("cars.category.all"), value: null },
    { key: "sedan", label: t("cars.category.sedan"), value: "sedan" },
    { key: "suv", label: t("cars.category.suv"), value: "suv" },
    // Добавьте другие категории по мере необходимости
  ];

  const {
    data: cars = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const filteredCars =
    selectedCategory === "all"
      ? cars
      : cars.filter(
          (car: CarCardProps) => car.category === categoryMap[selectedCategory]
        );

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const paginatedCars = isMobile
    ? filteredCars
    : filteredCars.slice(
        (currentPage - 1) * carsPerPage,
        currentPage * carsPerPage
      );

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки машин</div>;

  return (
    <section id="cars" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
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
        <div
          className={`flex justify-center mb-12 ${
            isMobile ? "sticky top-[100px] z-30 border-border/30" : ""
          }`}
        >
          <div className="flex items-center space-x-4 bg-card/50 backdrop-blur border border-border/50 rounded-full p-2">
            <Filter className="h-4 w-4 text-muted-foreground ml-2" />
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={selectedCategory === cat.key ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setCurrentPage(1);
                }}
                className={selectedCategory === cat.key ? "glow-effect" : ""}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCars.map((car: CarCardProps, index: number) => (
            <div
              key={car.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CarCard {...car} />
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
