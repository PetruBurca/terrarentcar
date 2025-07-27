import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  placeholder,
  onLoad,
  onError,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  srcSet,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || "");

  // Генерируем srcSet если не передан
  const generateSrcSet = (originalSrc: string) => {
    if (srcSet) return srcSet;

    // Для изображений из Airtable добавляем параметры для разных размеров
    if (originalSrc.includes("airtable.com")) {
      const baseUrl = originalSrc.split("?")[0];
      return `${baseUrl}?w=400 400w, ${baseUrl}?w=800 800w, ${baseUrl}?w=1200 1200w`;
    }

    return originalSrc;
  };

  // Проверяем поддержку WebP
  const supportsWebP = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  };

  // Получаем оптимальный формат изображения
  const getOptimalImageSrc = (originalSrc: string) => {
    if (supportsWebP() && originalSrc.includes("airtable.com")) {
      // Для Airtable добавляем параметр для WebP
      return originalSrc.includes("?")
        ? `${originalSrc}&format=webp`
        : `${originalSrc}?format=webp`;
    }
    return originalSrc;
  };

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      onLoad?.();
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };
    img.src = src;
  }, [src, onLoad, onError]);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}
      >
        <ImageIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      <picture>
        {/* WebP версия для поддерживаемых браузеров */}
        <source
          srcSet={getOptimalImageSrc(generateSrcSet(src))}
          sizes={sizes}
          type="image/webp"
        />
        {/* Fallback для старых браузеров */}
        <img
          src={imageSrc}
          alt={alt}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            onError?.();
          }}
        />
      </picture>
    </div>
  );
}
