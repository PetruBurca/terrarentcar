import { lazy } from "react";

// Ленивая загрузка тяжелых компонентов
export const CarReservationModal = lazy(() =>
  import("./CarReservationModal").then((module) => ({
    default: module.default,
  }))
);

export const CallContactsModal = lazy(() =>
  import("./CallContactsModal").then((module) => ({
    default: module.CallContactsModal,
  }))
);

// Экспорт новых компонентов
export { ReservationStep1 } from "./ReservationStep1";
export { ReservationStep2 } from "./ReservationStep2";
export { ReservationStep3 } from "./ReservationStep3";
export { SuccessModal } from "./SuccessModal";
export { CarouselWithCenter } from "./CarouselWithCenter";
