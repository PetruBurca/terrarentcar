import { Phone } from "lucide-react";
import { Button } from "@/components/ui/utils/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/overlays/dialog";
import { useTranslation } from "react-i18next";

interface ContactNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactNumbersModal = ({ isOpen, onClose }: ContactNumbersModalProps) => {
  const { t } = useTranslation();

  const contactNumbers = [
    {
      label: t("contact.administrator"),
      phone: "+37379013014",
    },
    {
      label: t("contact.technicalAssistant"),
      phones: ["+37361131131", "+37362131370"],
    },
    {
      label: t("contact.managerConsultant"),
      phones: ["+37360777137", "+37360496669"],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur border border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t("contact.title")} {t("contact.titleAccent")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t(
              "contact.modalDescription",
              "Выберите номер телефона для связи с нами"
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {contactNumbers.map((contact, index) => (
            <div
              key={index}
              className="p-4 bg-card/50 rounded-lg border border-border/30"
            >
              <h4 className="font-semibold text-foreground mb-2">
                {contact.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {"phone" in contact ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#B90003] text-white rounded-lg hover:bg-[#A00002] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {contact.phone}
                  </a>
                ) : (
                  contact.phones?.map((phone, phoneIndex) => (
                    <a
                      key={phoneIndex}
                      href={`tel:${phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#B90003] text-white rounded-lg hover:bg-[#A00002] transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {phone}
                    </a>
                  ))
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#B90003] text-[#B90003] hover:bg-[#B90003] hover:text-white"
            >
              {t("common.close", "Закрыть")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactNumbersModal;
