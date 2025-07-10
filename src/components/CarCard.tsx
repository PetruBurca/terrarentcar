import { useState } from "react";
import { Car, Users, Fuel, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarReservationModal from "./CarReservationModal";

interface CarCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  passengers: number;
  transmission: string;
  fuel: string;
  category: string;
  features: string[];
}

const CarCard = ({ id, name, image, price, rating, passengers, transmission, fuel, category, features }: CarCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="group overflow-hidden car-hover bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
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
              <span className="text-sm">{transmission}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Fuel className="h-4 w-4" />
              <span className="text-sm">{fuel}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{features.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-primary">${price}</span>
              <span className="text-muted-foreground">/день</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button 
            className="w-full glow-effect" 
            onClick={() => setIsModalOpen(true)}
          >
            <Car className="mr-2 h-4 w-4" />
            Забронировать
          </Button>
        </CardFooter>
      </Card>

      <CarReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        car={{ id, name, image, price, category }}
      />
    </>
  );
};

export default CarCard;