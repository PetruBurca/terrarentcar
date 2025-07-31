import { useEffect, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import { useTranslation } from "react-i18next";

interface GoogleMapJSProps {
  className?: string;
  height?: string;
}

const GoogleMapJS = ({
  className = "",
  height = "300px",
}: GoogleMapJSProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current) return;

      // Проверяем, загружен ли Google Maps API
      if (typeof window.google === "undefined" || !window.google.maps) {
        // Загружаем Google Maps API
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          initMap();
        };

        script.onerror = () => {
          setMapError(true);
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 47.03942002676709, lng: 28.891003583096374 },
          zoom: 15,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7c93a3" }, { lightness: -10 }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }, { lightness: 16 }],
            },
            {
              featureType: "all",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#fefefe" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#c9b2a6" }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.stroke",
              stylers: [{ color: "#87cdde" }],
            },
            {
              featureType: "landscape.natural",
              elementType: "geometry",
              stylers: [{ color: "#f0f0f0" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#dfd2ae" }],
            },
            {
              featureType: "poi",
              elementType: "geometry.stroke",
              stylers: [{ color: "#aed2df" }],
            },
            {
              featureType: "poi.park",
              elementType: "geometry.fill",
              stylers: [{ color: "#b8c9a8" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#ffe15f" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#efd151" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#e5e5e5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9d6e6" }],
            },
          ],
        });

        // Добавляем маркер
        new window.google.maps.Marker({
          position: { lat: 47.03942002676709, lng: 28.891003583096374 },
          map: map,
          title: "TerraRentCar - Авто Прокат Terra",
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#dc2626"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
                <circle cx="16" cy="16" r="4" fill="#dc2626"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    loadMap();
  }, []);

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
    <div
      ref={mapRef}
      className={`rounded-lg ${className}`}
      style={{ height }}
    />
  );
};

// Добавляем типы для Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        Size: new (width: number, height: number) => any;
      };
    };
  }
}

export default GoogleMapJS;
