import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

// Определяем, является ли устройство мобильным
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Определяем, является ли браузер Chrome на iOS
const isIOSChrome = () => {
  if (typeof window === "undefined") return false;
  return (
    /CriOS|Chrome/.test(navigator.userAgent) &&
    /iPhone|iPad|iPod/.test(navigator.userAgent)
  );
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, onCheckedChange, ...props }, ref) => {
  // Простая обработка без сложной логики
  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (onCheckedChange) {
        onCheckedChange(checked);
      }
    },
    [onCheckedChange]
  );

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#B90003] data-[state=unchecked]:bg-gray-400 relative touch-manipulation",
        className
      )}
      {...props}
      ref={ref}
      onCheckedChange={handleCheckedChange}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
      <span className="absolute left-1 text-[7px] font-bold text-white data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100 transition-opacity">
        OFF
      </span>
      <span className="absolute right-1 text-[7px] font-bold text-white data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0 transition-opacity">
        ON
      </span>
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

// Альтернативный мобильный Switch для iOS Chrome
const MobileSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, onCheckedChange, ...props }, ref) => {
  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (onCheckedChange) {
        onCheckedChange(checked);
      }
    },
    [onCheckedChange]
  );

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#B90003] data-[state=unchecked]:bg-gray-400 relative touch-manipulation",
        className
      )}
      {...props}
      ref={ref}
      onCheckedChange={handleCheckedChange}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
      <span className="absolute left-1 text-[7px] font-bold text-white data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100 transition-opacity">
        OFF
      </span>
      <span className="absolute right-1 text-[7px] font-bold text-white data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0 transition-opacity">
        ON
      </span>
    </SwitchPrimitives.Root>
  );
});
MobileSwitch.displayName = "MobileSwitch";

// Экспортируем правильный Switch в зависимости от устройства
export { Switch, MobileSwitch };
