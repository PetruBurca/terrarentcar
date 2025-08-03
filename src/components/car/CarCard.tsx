import { useState, memo, Suspense, useEffect } from "react";
import {
  Car,
  Users,
  Fuel,
  Settings,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { Card, CardContent, CardFooter } from "@/components/ui/layout/card";
import { Badge } from "@/components/ui/feedback/badge";
import { CarReservationModal } from "../modals";
import { useTranslation } from "react-i18next";
import { translateCarSpec } from "@/lib/carTranslations";
import logo from "@/assets/logo.webp";

export interface CarCardProps {
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

const PLACEHOLDER_IMG = logo;

// Убираем старые маппинги, используем новую систему переводов

const CarCard = memo(
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
  }: CarCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation();
    const safeFeatures = Array.isArray(features) ? features : [];
    const imageUrl =
      images && images.length > 0 && images[0] ? images[0] : PLACEHOLDER_IMG;

    // Лог для проверки загрузки компонента

    // Принудительно обновляем стили через useEffect
    useEffect(() => {
      const cardElement = document.querySelector(`[data-car-id="${id}"]`);
      if (cardElement) {
        // Принудительно очищаем все красные стили
        (cardElement as HTMLElement).style.removeProperty("border");
        (cardElement as HTMLElement).style.removeProperty("box-shadow");
        (cardElement as HTMLElement).style.removeProperty("background-color");
      }
    }, [id, name]);

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    return (
      <>
        <Card
          className="group overflow-hidden car-hover bg-card/50 backdrop-blur hover:shadow-2xl transition-all duration-300 h-[540px] min-w-[320px] flex flex-col justify-between cursor-pointer"
          data-car-id={id}
          onClick={(e) => {
            // Не открывать модалку, если клик был по кнопке бронирования
            if ((e.target as HTMLElement).closest("button")) return;
            setIsModalOpen(true);
          }}
        >
          <div className="relative overflow-hidden h-80 w-full flex items-center justify-center bg-background">
            {(!imageLoaded || imageError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <img
              src={imageError ? PLACEHOLDER_IMG : imageUrl}
              alt={name}
              className={`w-full h-80 object-cover transition-all duration-500 ${
                imageLoaded ? "group-hover:scale-110" : "opacity-0"
              }`}
              style={{ objectPosition: "center 60%" }}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              width={400}
              height={320}
            />
            <div className="absolute top-4 left-4">
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                {translateCarSpec("category", category, t)}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-background/80 backdrop-blur px-2 py-1 rounded-full">
              <Star className="h-3 w-3 fill-[#B90003] text-[#B90003]" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-3">
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

            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {(showAllFeatures
                  ? safeFeatures
                  : safeFeatures.slice(0, 3)
                ).map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-1 py-0.5"
                  >
                    {translateCarSpec("feature", feature, t)}
                  </Badge>
                ))}
                {safeFeatures.length > 3 && !showAllFeatures && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0.5 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllFeatures(true);
                    }}
                  >
                    +{safeFeatures.length - 3}
                  </Badge>
                )}
                {showAllFeatures && safeFeatures.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0.5 cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllFeatures(false);
                    }}
                  >
                    {t("cars.hide")}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xl font-bold">
                  <span className="text-white">€</span>
                  <span className="text-white">{price}</span>
                </span>
                <span className="text-muted-foreground text-sm">
                  {t("cars.perDay")}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              className="w-full glow-effect bg-[#a00003d2] hover:bg-[#8b00008e]"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <Car className="mr-2 h-4 w-4" />
              {t("cars.book")}
            </Button>
          </CardFooter>
        </Card>

        <Suspense fallback={<div>Загрузка...</div>}>
          <CarReservationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            car={{
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
              pricePerDay,
              price2to10,
              price11to20,
              price21to29,
              price30plus,
            }}
          />
        </Suspense>
      </>
    );
  }
);

CarCard.displayName = "CarCard";

export default CarCard;
