declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: {
        whyUs: {
          title: string;
          points: {
            auto: {
              title: string;
              description: string;
            };
            rent: {
              title: string;
              description: string;
            };
            security: {
              title: string;
              description: string;
            };
            simple: {
              title: string;
              description: string;
            };
            money: {
              title: string;
              description: string;
            };
            price: {
              title: string;
              description: string;
            };
          };
        };
        carCards: {
          title: string;
          description: string;
        };
        formContact: {
          title: string;
          helpText: string;
          nameLabel: string;
          namePlaceholder: string;
          emailLabel: string;
          emailPlaceholder: string;
          messageLabel: string;
          messagePlaceholder: string;
          submitButton: string;
        };
      };
    };
  }
}