import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/navigation/accordion";

const FAQ = () => {
  const { t, ready } = useTranslation();

  // Показываем загрузку пока переводы не готовы
  if (!ready) {
    return (
      <div className="w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Загрузка...</h2>
        </div>
      </div>
    );
  }

  const faqItems = [
    {
      question: t("faq.ageRestrictions.question"),
      answer: t("faq.ageRestrictions.answer"),
    },
    {
      question: t("faq.deposit.question"),
      answer: t("faq.deposit.answer"),
    },
    {
      question: t("faq.mileageRestrictions.question"),
      answer: t("faq.mileageRestrictions.answer"),
    },
    {
      question: t("faq.earlyReturn.question"),
      answer: t("faq.earlyReturn.answer"),
    },
    {
      question: t("faq.advancePayment.question"),
      answer: t("faq.advancePayment.answer"),
    },
    {
      question: t("faq.insurance.question"),
      answer: t("faq.insurance.answer"),
    },
    {
      question: t("faq.carWash.question"),
      answer: t("faq.carWash.answer"),
    },
    {
      question: t("faq.delivery.question"),
      answer: t("faq.delivery.answer"),
    },
    {
      question: t("faq.restrictions.question"),
      answer: t("faq.restrictions.answer"),
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("faq.title")}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("faq.subtitle")}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-[#B90003]/20 rounded-lg bg-card/30 backdrop-blur"
            >
              <AccordionTrigger className="px-6 py-4 text-left hover:bg-[#B90003]/5 transition-colors duration-200">
                <span className="font-semibold text-foreground pr-4">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
