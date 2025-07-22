import { useState, memo } from "react";
import {
  Car,
  Users,
  Fuel,
  Settings,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarReservationModal from "./CarReservationModal";
import { useTranslation } from "react-i18next";
import { translateCarSpec } from "@/lib/carTranslations";
import logo from "@/assets/logo.png";

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
          className="group overflow-hidden car-hover bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 h-[480px] min-w-[320px] flex flex-col justify-between cursor-pointer"
          onClick={(e) => {
            // Не открывать модалку, если клик был по кнопке бронирования
            if ((e.target as HTMLElement).closest("button")) return;
            setIsModalOpen(true);
          }}
        >
          <div className="relative overflow-hidden h-48 w-full flex items-center justify-center bg-background">
            {(!imageLoaded || imageError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <img
              src={imageError ? PLACEHOLDER_IMG : imageUrl}
              alt={name}
              className={`w-full h-48 object-cover transition-all duration-500 ${
                imageLoaded ? "group-hover:scale-110" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              width={400}
              height={192}
            />
            <div className="absolute top-4 left-4">
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground"
              >
                {category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-background/80 backdrop-blur px-2 py-1 rounded-full">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-sm">{passengers}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Settings className="h-4 w-4" />
                <span className="text-sm">
                  {translateCarSpec("transmission", transmission, t)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Fuel className="h-4 w-4" />
                <span className="text-sm">
                  {translateCarSpec("fuel", fuel, t)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {(showAllFeatures
                  ? safeFeatures
                  : safeFeatures.slice(0, 3)
                ).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {translateCarSpec("feature", feature, t)}
                  </Badge>
                ))}
                {safeFeatures.length > 3 && !showAllFeatures && (
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setShowAllFeatures(true)}
                  >
                    +{safeFeatures.length - 3}
                  </Badge>
                )}
                {showAllFeatures && safeFeatures.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => setShowAllFeatures(false)}
                  >
                    {t("cars.hide")}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-primary">
                  ${price}
                </span>
                <span className="text-muted-foreground">
                  {t("cars.perDay")}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <Button
              className="w-full glow-effect"
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
      </>
    );
  }
);

CarCard.displayName = "CarCard";

export default CarCard;
