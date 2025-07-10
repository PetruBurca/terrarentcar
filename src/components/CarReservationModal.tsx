import { useState } from "react";
import { Calendar, MapPin, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Car {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

interface CarReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

const CarReservationModal = ({ isOpen, onClose, car }: CarReservationModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Заявка отправлена!",
      description: `Ваша заявка на аренду ${car.name} успешно отправлена. Мы свяжемся с вами в ближайшее время.`,
    });
    
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pickupDate: "",
      returnDate: "",
      pickupLocation: "",
      message: ""
    });
    
    onClose();
  };

  const calculateDays = () => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = Math.abs(returnDate.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 1;
  };

  const totalPrice = calculateDays() * car.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Бронирование автомобиля
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Info */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                <p className="text-muted-foreground mb-4">{car.category}</p>
                
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Цена за день:</span>
                    <span className="font-bold">${car.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Количество дней:</span>
                    <span className="font-bold">{calculateDays()}</span>
                  </div>
                  <hr className="my-2 border-border" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-primary">${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate" className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Дата получения *</span>
                  </Label>
                  <Input
                    id="pickupDate"
                    name="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="returnDate" className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Дата возврата *</span>
                  </Label>
                  <Input
                    id="returnDate"
                    name="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="pickupLocation" className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Место получения</span>
                </Label>
                <Input
                  id="pickupLocation"
                  name="pickupLocation"
                  placeholder="Аэропорт, отель, адрес..."
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="message">Дополнительные пожелания</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Укажите любые дополнительные требования..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="flex-1 glow-effect">
                  Отправить заявку
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Отмена
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarReservationModal;