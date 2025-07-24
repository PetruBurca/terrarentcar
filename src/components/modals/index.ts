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
