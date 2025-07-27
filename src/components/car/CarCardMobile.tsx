import { useState, memo, Suspense, useMemo } from "react";
import { Users, Fuel, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { Card, CardContent } from "@/components/ui/layout/card";
import { Badge } from "@/components/ui/feedback/badge";
import { CarReservationModal } from "../modals";
import { useTranslation } from "react-i18next";
import { translateCarSpec } from "@/lib/carTranslations";
import { OptimizedImageMobile } from "@/components/ui/utils/image-optimizer-mobile";
import logo from "@/assets/logo.png";

export interface CarCardMobileProps {
  id: string;
  name: string;
  images: string[];
  price: number;
  rating: number;
  passengers: number;
  transmission: string;
  fuel: string;
  year: string;
  engine: string;
  drive: string;
  description_ru?: string;
  description_ro?: string;
  description_en?: string;
  category: string;
  features: string[];
  description: string;
  pricePerDay: number;
  price2to10: number;
  price11to20: number;
  price21to29: number;
  price30plus: number;
}

const CarCardMobile = memo(
  ({
    id,
    name,
    images,
    price,
    rating,
    passengers,
    transmission,
    fuel,
    year,
    engine,
    drive,
    description_ru,
    description_ro,
    description_en,
    category,
    features,
    description,
    pricePerDay,
    price2to10,
    price11to20,
    price21to29,
    price30plus,
  }: CarCardMobileProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();
    const safeFeatures = useMemo(() => 
      Array.isArray(features) ? features.slice(0, 2) : [], 
      [features]
    ); // Мемоизируем фичи

    return (
      <>
        <Card
          className="group overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            setIsModalOpen(true);
          }}
        >
          {/* Изображение автомобиля */}
          <div className="relative h-40 overflow-hidden rounded-t-lg">
            {images && images.length > 0 && images[0] ? (
              <OptimizedImageMobile
                src={images[0]}
                alt={name}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-background flex items-center justify-center">
                <img
                  src={logo}
                  alt="Terra Rent Car"
                  className="w-16 h-16 opacity-50"
                />
              </div>
            )}

            {/* Категория */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="text-xs">
                {translateCarSpec("category", category, t)}
              </Badge>
            </div>

            {/* Рейтинг */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {rating}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>

            {/* Основные характеристики */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="text-xs">{passengers}</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Settings className="h-3 w-3" />
                <span className="text-xs">
                  {translateCarSpec("transmission", transmission, t)}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Fuel className="h-3 w-3" />
                <span className="text-xs">
                  {translateCarSpec("fuel", fuel, t)}
                </span>
              </div>
            </div>

            {/* Фичи (только 2) */}
            {safeFeatures.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {safeFeatures.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {translateCarSpec("feature", feature, t)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Цена и кнопка */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-primary">${price}</span>
                <span className="text-muted-foreground text-xs">
                  {" "}
                  / {t("cars.perDay")}
                </span>
              </div>
              <Button
                size="sm"
                className="glow-effect"
                onClick={() => setIsModalOpen(true)}
              >
                {t("cars.book")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Suspense fallback={<div>Loading modal...</div>}>
          {isModalOpen && (
            <CarReservationModal
              carId={id}
              carName={name}
              carImage={images[0]}
              pricePerDay={pricePerDay}
              price2to10={price2to10}
              price11to20={price11to20}
              price21to29={price21to29}
              price30plus={price30plus}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Suspense>
      </>
    );
  }
);

export { CarCardMobile };
