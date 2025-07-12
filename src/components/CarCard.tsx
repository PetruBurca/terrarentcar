import { useState } from "react";
import { Car, Users, Fuel, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarReservationModal from "./CarReservationModal";
import { useTranslation } from "react-i18next";
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
  category: string;
  features: string[];
}

const PLACEHOLDER_IMG = logo;

// Маппинг значений Airtable к ключам для перевода
const transmissionReverseMap: Record<string, string> = {
  Автомат: "automatic",
  Механика: "manual",
  Робот: "robot",
  Вариатор: "variator",
};
const fuelReverseMap: Record<string, string> = {
  Бензин: "petrol",
  Дизель: "diesel",
  Электро: "electric",
  Гибрид: "hybrid",
};
const featureReverseMap: Record<string, string> = {
  "GPS навигация": "gps",
  Bluetooth: "bluetooth",
  Кондиционер: "ac",
  "Камера заднего вида": "rearCamera",
  "Круиз-контроль": "cruise",
  "Подогрев сидений": "seatHeating",
  "Подогрев руля": "steeringWheelHeating",
  Парктроник: "parktronic",
  Парктроники: "parktronic",
  Практроники: "parktronic",
  Parktronic: "parktronic",
  "Климат-контроль": "climateControl",
};

const CarCard = ({
  id,
  name,
  images,
  price,
  rating,
  passengers,
  transmission,
  fuel,
  category,
  features,
}: CarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const { t } = useTranslation();
  const safeFeatures = Array.isArray(features) ? features : [];
  const imageUrl =
    images && images.length > 0 && images[0] ? images[0] : PLACEHOLDER_IMG;

  return (
    <>
      <Card className="group overflow-hidden car-hover bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 h-[480px] min-w-[320px] flex flex-col justify-between">
        <div className="relative overflow-hidden h-48 w-full flex items-center justify-center bg-background">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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
                {t(
                  `cars.transmission.${transmissionReverseMap[transmission]}`
                ) || transmission}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Fuel className="h-4 w-4" />
              <span className="text-sm">
                {t(`cars.fuel.${fuelReverseMap[fuel]}`) || fuel}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {(showAllFeatures ? safeFeatures : safeFeatures.slice(0, 3)).map(
                (feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {featureReverseMap[feature]
                      ? t(`cars.features.${featureReverseMap[feature]}`)
                      : feature}
                  </Badge>
                )
              )}
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
              <span className="text-2xl font-bold text-primary">${price}</span>
              <span className="text-muted-foreground">{t("cars.perDay")}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full glow-effect"
            onClick={() => setIsModalOpen(true)}
          >
            <Car className="mr-2 h-4 w-4" />
            {t("cars.book")}
          </Button>
        </CardFooter>
      </Card>

      <CarReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={{ id, name, images, price, category }}
      />
    </>
  );
};

export default CarCard;
