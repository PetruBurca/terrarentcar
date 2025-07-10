import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CarCard from "./CarCard";
import bmwImage from "@/assets/bmw-x5.jpg";
import mercedesImage from "@/assets/mercedes-c-class.jpg";
import audiImage from "@/assets/audi-a4.jpg";

const Cars = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const cars = [
    {
      id: "1",
      name: "BMW X5",
      image: bmwImage,
      price: 120,
      rating: 4.9,
      passengers: 5,
      transmission: "Автомат",
      fuel: "Бензин",
      category: "SUV",
      features: ["GPS навигация", "Bluetooth", "Кондиционер", "Подогрев сидений", "Панорамная крыша"]
    },
    {
      id: "2",
      name: "Mercedes-Benz C-Class",
      image: mercedesImage,
      price: 100,
      rating: 4.8,
      passengers: 5,
      transmission: "Автомат",
      fuel: "Бензин",
      category: "Седан",
      features: ["GPS навигация", "Bluetooth", "Кондиционер", "Кожаные сиденья", "Круиз-контроль"]
    },
    {
      id: "3",
      name: "Audi A4",
      image: audiImage,
      price: 95,
      rating: 4.7,
      passengers: 5,
      transmission: "Автомат",
      fuel: "Бензин",
      category: "Седан",
      features: ["GPS навигация", "Bluetooth", "Кондиционер", "LED фары", "Парктроник"]
    },
    {
      id: "4",
      name: "BMW X5 Premium",
      image: bmwImage,
      price: 150,
      rating: 5.0,
      passengers: 7,
      transmission: "Автомат",
      fuel: "Дизель",
      category: "SUV",
      features: ["GPS навигация", "Bluetooth", "Кондиционер", "Массаж сидений", "Harman Kardon", "360° камера"]
    },
    {
      id: "5",
      name: "Mercedes-Benz E-Class",
      image: mercedesImage,
      price: 130,
      rating: 4.9,
      passengers: 5,
      transmission: "Автомат",
      fuel: "Гибрид",
      category: "Седан",
      features: ["GPS навигация", "Bluetooth", "Климат-контроль", "Adaptive cruise", "Premium звук"]
    },
    {
      id: "6",
      name: "Audi Q5",
      image: audiImage,
      price: 110,
      rating: 4.8,
      passengers: 5,
      transmission: "Автомат",
      fuel: "Бензин",
      category: "SUV",
      features: ["GPS навигация", "Bluetooth", "Кондиционер", "Quattro", "Virtual cockpit"]
    }
  ];

  const categories = ["Все", "Седан", "SUV"];

  const filteredCars = selectedCategory === "Все" 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

  return (
    <section id="cars" className="py-20 relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Наш <span className="gradient-text">автопарк</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Выберите идеальный автомобиль для ваших потребностей из нашей коллекции 
            премиальных автомобилей
          </p>
        </div>

        {/* Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-card/50 backdrop-blur border border-border/50 rounded-full p-2">
            <Filter className="h-4 w-4 text-muted-foreground ml-2" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "glow-effect" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, index) => (
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
              Автомобили в категории "{selectedCategory}" не найдены
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-card/30 backdrop-blur border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Не нашли подходящий автомобиль?
            </h3>
            <p className="text-muted-foreground mb-6">
              Свяжитесь с нами, и мы поможем найти идеальный автомобиль 
              для ваших потребностей
            </p>
            <Button size="lg" className="glow-effect">
              Связаться с нами
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cars;