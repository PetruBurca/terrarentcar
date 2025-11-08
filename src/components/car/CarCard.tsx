import { useState, Suspense, useEffect, useRef } from "react";
import {
  Car as CarIcon,
  Users,
  Fuel,
  Settings,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/utils/button";
import { Card, CardContent, CardFooter } from "@/components/ui/layout/card";
import { Badge } from "@/components/ui/feedback/badge";
import { CarReservationModal } from "../modals";
import { useTranslation } from "react-i18next";
import { translateCarSpec } from "@/lib/carTranslations";
import { Car } from "@/types/reservation";
import logo from "@/assets/logo.webp";
import { createCarPath, isPathForCar } from "@/lib/carLinks";

export interface CarCardProps {
  id: string;
  name: string;
  carNumber: string; // НОМЕР машины (не отображается на сайте, нужен для админ панели)
  images: string[];
  price: number;
  rating: number;
  seats: number;
  transmission: string;
  fuelType: string;
  year: string;
  engine: string;
  drive: string;
  doors: number;
  description_ru?: string;
  description_ro?: string;
  description_en?: string;
  category: string;
  features: string[];
  description: string;
  price2to10: number;
  price11to20: number;
  price21to29: number;
  price30plus: number;
  blockFromDate?: string | null; // Дата блокировки от администратора
  blockToDate?: string | null; // Дата блокировки до администратора
  status?: "Подтверждена" | "Отклонена" | "В процессе"; // Статус автомобиля
}

const PLACEHOLDER_IMG = logo;

// Убираем старые маппинги, используем новую систему переводов

const CarCard = ({
  id,
  name,
  carNumber,
  images,
  price,
  rating,
  seats,
  transmission,
  fuelType,
  year,
  engine,
  drive,
  doors,
  description_ru,
  description_ro,
  description_en,
  category,
  features,
  description,
  price2to10,
  price11to20,
  price21to29,
  price30plus,
  blockFromDate,
  blockToDate,
  status,
}: CarCardProps) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const originPathRef = useRef<string | null>(null);
  const safeFeatures = Array.isArray(features) ? features : [];
  const imageUrl =
    images && images.length > 0 && images[0] && images[0].startsWith("http")
      ? images[0]
      : PLACEHOLDER_IMG;
  const carPath = createCarPath(id, name);
  const isModalOpen = isPathForCar(location.pathname, id, name);

  // Лог для проверки загрузки компонента
  // useEffect(() => {
  //     hasImages: images && images.length > 0,
  //     imageUrl,
  //     isPlaceholder: imageUrl === PLACEHOLDER_IMG,
  //   });
  // }, [name, images, imageUrl]);

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

  // Простая оптимизация Firebase URL
  const getOptimizedImageUrl = (url: string) => {
    if (!url || url.includes("placeholder") || !url.startsWith("http")) {
      return url;
    }

    // Для Firebase Storage добавляем только базовые параметры оптимизации
    if (url.includes("firebasestorage.googleapis.com")) {
      const params = new URLSearchParams();
      params.set("w", "400"); // Фиксированная ширина для карточек
      params.set("h", "auto");
      params.set("q", "90"); // Высокое качество
      params.set("f", "webp");
      params.set("alt", "media");

      return `${url}?${params.toString()}`;
    }

    return url;
  };

  return (
    <>
      <Card
        className="group overflow-hidden car-hover bg-card/50 backdrop-blur hover:shadow-2xl transition-all duration-300 h-[480px] w-full flex flex-col justify-between cursor-pointer border-0"
        data-car-id={id}
        onClick={(e) => {
          // Не открывать модалку, если клик был по кнопке бронирования
          if ((e.target as HTMLElement).closest("button")) return;
          if (!isPathForCar(location.pathname, id, name)) {
            originPathRef.current = `${location.pathname}${location.search}`;
            navigate(carPath);
          }
        }}
      >
        <div className="relative overflow-hidden h-[330px] w-full flex items-center justify-center bg-black">
          {(!imageLoaded || imageError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <img
            src={imageError ? PLACEHOLDER_IMG : getOptimizedImageUrl(imageUrl)}
            alt={name}
            className={`transition-all duration-500 ${
              imageLoaded ? "group-hover:scale-110" : "opacity-0"
            } ${
              imageError || imageUrl === PLACEHOLDER_IMG
                ? "w-auto h-auto max-w-[300px] max-h-[250px] object-contain p-4"
                : "w-full h-full object-cover"
            }`}
            style={{
              objectPosition: "center",
            }}
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
              <span className="text-xs">{seats}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Settings className="h-3 w-3" />
              <span className="text-xs">{transmission}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Fuel className="h-3 w-3" />
              <span className="text-xs">
                {translateCarSpec("fuel", fuelType, t)}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {(showAllFeatures ? safeFeatures : safeFeatures.slice(0, 3)).map(
                (feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs px-1 py-0.5"
                  >
                    {translateCarSpec("feature", feature, t)}
                  </Badge>
                )
              )}
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
              if (!isPathForCar(location.pathname, id, name)) {
                originPathRef.current = `${location.pathname}${location.search}`;
                navigate(carPath);
              }
            }}
          >
            <CarIcon className="mr-2 h-4 w-4" />
            {t("cars.book")}
          </Button>
        </CardFooter>
      </Card>

      <Suspense fallback={<div>Загрузка...</div>}>
        <CarReservationModal
          isOpen={isModalOpen}
          onClose={() => {
            const originPath = originPathRef.current;
            originPathRef.current = null;
            if (originPath && originPath !== carPath) {
              navigate(originPath, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }}
          car={
            {
              id,
              name,
              carNumber,
              images,
              price,
              rating,
              seats,
              transmission,
              fuelType,
              year,
              engine,
              drive,
              doors,
              description,
              description_ru,
              description_ro,
              description_en,
              category,
              features,
              price2to10,
              price11to20,
              price21to29,
              price30plus,
              blockFromDate,
              blockToDate,
              status,
            } as Car
          }
        />
      </Suspense>
    </>
  );
};

CarCard.displayName = "CarCard";

export default CarCard;
