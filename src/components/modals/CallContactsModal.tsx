import React, { useRef, useEffect } from "react";
import { FaInstagram, FaFacebook, FaViber, FaWhatsapp } from "react-icons/fa";
import { FaPhoneSquareAlt } from "react-icons/fa";
import "./CallContactsModal.scss";

interface CallContactsModalProps {
  open: boolean;
  onClose: () => void;
  onCloseWithAnimation?: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const contacts = [
  {
    href: "https://www.instagram.com/terrarentcar/",
    label: "Instagram",
    icon: <FaInstagram />,
    className: "instagram",
  },
  {
    href: "https://www.facebook.com/TerraRentCar/",
    label: "Facebook",
    icon: <FaFacebook />,
    className: "facebook",
  },
  {
    href: "tel:+37379013014",
    label: "Phone",
    icon: <FaPhoneSquareAlt />,
    className: "phone",
  },
  {
    href: "viber://chat?number=%2B37379013014",
    label: "Viber",
    icon: <FaViber />,
    className: "viber",
  },
  {
    href: "https://wa.me/37379013014",
    label: "WhatsApp",
    icon: <FaWhatsapp />,
    className: "whatsapp",
  },
];

export const CallContactsModal: React.FC<CallContactsModalProps> = ({
  open,
  onClose,
  buttonRef,
  onCloseWithAnimation,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        if (typeof onCloseWithAnimation === "function") {
          onCloseWithAnimation();
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open, onClose, buttonRef, onCloseWithAnimation]);

  if (!open) return null;

  return (
    <div
      className="call-modal"
      ref={modalRef}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="modal-content">
        {contacts.map((c, i) => (
          <a
            key={c.label}
            href={c.href}
            aria-label={c.label}
            target="_blank"
            rel="noopener noreferrer"
            className={`icon-link ${c.className}`}
            style={{ animationDelay: `${0.3 - i * 0.04}s` }}
          >
            {c.icon}
          </a>
        ))}
      </div>
    </div>
  );
};

export default CallContactsModal;
