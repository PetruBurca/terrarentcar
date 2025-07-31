import { useEffect, useState } from "react";

interface GoogleMapsProps {
  apiKey?: string;
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  height?: string;
}

export const GoogleMapsComponent = ({
  apiKey,
  center,
  zoom = 15,
  className = "w-full h-64",
  height = "300px",
}: GoogleMapsProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Проверяем, загружен ли уже Google Maps API
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Загружаем Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      apiKey || "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
    }&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
    };

    script.onerror = () => {
      setMapError(true);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapLoaded || !window.google) return;

    const mapElement = document.getElementById("google-map");
    if (!mapElement) return;

    const map = new window.google.maps.Map(mapElement, {
      center,
      zoom,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // Добавляем маркер
    new window.google.maps.Marker({
      position: center,
      map,
      title: "TerraRentCar - Авто Прокат",
    });
  }, [mapLoaded, center, zoom]);

  if (mapError) {
    return (
      <div
        className={`${className} bg-muted rounded-lg p-4 border flex items-center justify-center`}
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Карта временно недоступна
          </p>
          <button
            onClick={() =>
              window.open(
                `https://maps.google.com/?q=${center.lat},${center.lng}`,
                "_blank"
              )
            }
            className="text-primary hover:underline text-sm"
          >
            Открыть в Google Maps
          </button>
        </div>
      </div>
    );
  }

  return <div id="google-map" className={className} style={{ height }} />;
};

// Добавляем типы для Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
      };
    };
  }
}
