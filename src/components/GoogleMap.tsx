import { useState, useEffect } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { useTranslation } from "react-i18next";

interface GoogleMapProps {
  className?: string;
  height?: string;
}

const GoogleMap = ({ className = "", height = "300px" }: GoogleMapProps) => {
  const { t } = useTranslation();
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем доступность Google Maps через небольшой таймаут
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapError = () => {
    setMapError(true);
    setIsLoading(false);
  };

  const handleMapLoad = () => {
    setIsLoading(false);
    setMapError(false);
  };

  const openInNewTab = () => {
    window.open(
      "https://www.google.com/maps?q=TerraRentCar+Chi%C5%9Fin%C4%83u+Bulevardul+Mircea+cel+B%C4%83tr%C3%AEn+4",
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div
        className={`bg-muted/20 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            {t("map.loading", "Загружаем карту...")}
          </p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div
        className={`bg-muted/20 rounded-lg p-6 flex flex-col items-center justify-center ${className}`}
        style={{ height }}
      >
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {t("map.errorTitle", "Карта недоступна")}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {t(
            "map.errorDesc",
            "Не удалось загрузить карту. Вы можете открыть наше местоположение в Google Maps."
          )}
        </p>
        <Button onClick={openInNewTab} variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          {t("map.openInMaps", "Открыть в Google Maps")}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d840.515912373403!2d28.891003583096374!3d47.03942002676709!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d1dbb350b0b%3A0xd4b3f55f787edf09!2zVGVycmFSZW50Q2FyIC0g0JDQstGC0L4g0J_RgNC-0LrQsNGC!5e0!3m2!1sru!2sus!4v1752309334562!5m2!1sru!2sus"
        width="100%"
        height={height}
        style={{ border: 0, borderRadius: "8px" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map"
        onError={handleMapError}
        onLoad={handleMapLoad}
      />
    </div>
  );
};

export default GoogleMap;
