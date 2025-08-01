import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/utils/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "bg-[#B90003] text-white hover:bg-[#A00002] hover:text-white focus:bg-[#B90003] focus:text-white",
        day_range_end:
          "bg-[#A00002] text-white hover:bg-[#A00002] hover:text-white focus:bg-[#A00002] focus:text-white",
        day_selected:
          "bg-[#B90003] text-white hover:bg-[#A00002] hover:text-white focus:bg-[#B90003] focus:text-white active:bg-[#A00002]",
        day_today: "border-[#B90003] border-2 text-white",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-[#B90003] aria-selected:text-white",
        day_disabled: "text-muted-foreground",
        day_range_middle: "aria-selected:bg-[#B90003] aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      modifiersClassNames={{
        range_start: "rounded-l-md border-2 border-white",
        range_end: "rounded-r-md border-2 border-white",
        selected: "rounded-md border-2 border-white",
      }}
      modifiersStyles={{
        range_start: {
          borderRadius: "0.375rem 0 0 0.375rem",
          border: "2px solid white",
        },
        range_end: {
          borderRadius: "0 0.375rem 0.375rem 0",
          border: "2px solid white",
        },
        selected: { borderRadius: "0.375rem", border: "2px solid white" },
        range_middle: { border: "none" },
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
