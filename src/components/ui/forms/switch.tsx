import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#B90003] data-[state=unchecked]:bg-gray-400 relative touch-manipulation hover:scale-105 active:scale-95",
      className
    )}
    {...props}
    ref={ref}
    onTouchStart={(e) => {
      // Предотвращаем двойное срабатывание на iOS
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 hover:shadow-xl"
      )}
    />
    <span className="absolute left-1 text-[7px] font-bold text-white data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100 transition-all duration-300 ease-in-out transform data-[state=checked]:scale-0 data-[state=unchecked]:scale-100">
      OFF
    </span>
    <span className="absolute right-1 text-[7px] font-bold text-white data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0 transition-all duration-300 ease-in-out transform data-[state=checked]:scale-100 data-[state=unchecked]:scale-0">
      ON
    </span>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
