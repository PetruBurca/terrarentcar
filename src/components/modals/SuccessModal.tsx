import React from "react";
import { Button } from "@/components/ui/utils/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/overlays/dialog";
import { useTranslation } from "react-i18next";
import { Car } from "@/types/reservation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  car,
}) => {
  const { t } = useTranslation();

  // Функция для закрытия модального окна и перезагрузки страницы
  const handleClose = () => {
    console.log("🎉 Заявка успешно отправлена!");

    // Закрываем модальное окно
    onClose();

    // Перезагружаем страницу через 1 секунду для сброса всех данных
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md mx-auto bg-gradient-to-br from-zinc-900 to-black border-2 border-[#B90003] shadow-2xl shadow-[#B90003]/20"
        style={{ zIndex: 4000 }}
      >
        <DialogTitle className="sr-only">
          {t("reservation.successTitle", "Заявка отправлена!")}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t(
            "reservation.successDescription",
            "Ваша заявка на аренду автомобиля была успешно отправлена. Мы свяжемся с вами в ближайшее время."
          )}
        </DialogDescription>
        <div className="text-center p-6">
          {/* Иконка успеха */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-[#B90003] to-[#A00002] rounded-full flex items-center justify-center shadow-lg shadow-[#B90003]/30 animate-pulse">
            <svg
              className="w-10 h-10 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Заголовок */}
          <h2 className="text-3xl font-bold text-white mb-4">
            🚗 {t("reservation.successTitle", "Заявка отправлена!")}
          </h2>

          {/* Описание */}
          <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 border border-[#B90003]/30">
            <p className="text-white mb-2 text-base leading-relaxed">
              {t("reservation.successMessage", "Ваша заявка на аренду")}
            </p>
            <div className="text-2xl font-bold text-[#B90003] mb-2">
              {car.name}
            </div>
            <p className="text-white text-base">
              {t("reservation.successMessageEnd", "успешно отправлена!")}
            </p>
          </div>

          <div className="bg-[#B90003]/10 rounded-lg p-3 mb-6 border border-[#B90003]/20">
            <p className="text-[#B90003] text-sm leading-relaxed">
              📞{" "}
              {t(
                "reservation.contactSoon",
                "Мы свяжемся с вами в ближайшее время для подтверждения бронирования."
              )}
            </p>
          </div>

          {/* Кнопка ОК */}
          <Button
            onClick={handleClose}
            className="w-full bg-[#B90003] hover:bg-[#A00002] text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-[#B90003]/30 transform transition hover:scale-105 glow-effect"
          >
            ✓ {t("reservation.okButton", "Понятно, спасибо!")}
          </Button>

          {/* Декоративные элементы */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-[#B90003]/30 rounded-full animate-ping"></div>
          <div className="absolute top-6 right-6 w-2 h-2 bg-[#B90003]/50 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-6 w-2 h-2 bg-[#B90003]/40 rounded-full animate-bounce"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
