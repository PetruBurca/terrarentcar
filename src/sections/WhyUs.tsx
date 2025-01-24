import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhyUs.scss';

// icons as image paths
import auto from '../assets/whyusIcon/auto.svg';
import rent from '../assets/whyusIcon/rent.svg';
import security from '../assets/whyusIcon/security.svg';
import simple from '../assets/whyusIcon/simple.svg';
import money from '../assets/whyusIcon/money.svg';
import price from '../assets/whyusIcon/price.svg';

gsap.registerPlugin(ScrollTrigger);

const WhyUs: React.FC = () => {
  const rightTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = rightTextRef.current?.querySelectorAll('.whyus-item');

    if (items) {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.3 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }
  }, []);

  const whyUsPoints = [
    {
      icon: auto,
      title: 'Широкий выбор автомобилей:',
      description:
        'Мы предлагаем разнообразные автомобили для любого случая – от экономичных моделей до комфортных и премиум-класса.',
    },
    {
      icon: rent,
      title: 'Гибкие условия аренды:',
      description:
        'У нас можно арендовать машину на любой срок – от нескольких часов до нескольких недель. Подбирайте удобный для вас вариант!',
    },
    {
      icon: security,
      title: 'Безопасность и надежность:',
      description:
        'Все наши автомобили проходят регулярное техническое обслуживание и находятся в отличном состоянии, что гарантирует безопасность на дороге.',
    },
    {
      icon: simple,
      title: 'Простота оформления:',
      description:
        'Мы сделали процесс аренды максимально простым и быстрым, чтобы вы могли сосредоточиться на важном, а не на бумажной работе.',
    },
    {
      icon: money,
      title: 'Конкурентоспособные цены:',
      description:
        'Мы предлагаем лучшие условия аренды по доступным ценам, без скрытых платежей.',
    },
    {
      icon: price,
      title: 'Гибкие тарифы:',
      description:
        'Мы предлагаем различные тарифы, включая аренду с водителем и без, чтобы вы могли выбрать подходящий вариант в зависимости от ваших потребностей.',
    },
  ];

  return (
    <div className="whyus-container">
      <div className="whyus-left">
        <h1>TERRA RENT CAR</h1>
      </div>
      <div className="whyus-right" ref={rightTextRef}>
        {whyUsPoints.map((point, index) => (
          <div className="whyus-item" key={index}>
            {/* Круглая область с иконкой */}
            <div className="icon-circle">
              <img src={point.icon} alt={point.title} /> {/* Вставляем SVG как изображение */}
            </div>
            <h2 className="title">{point.title}</h2>
            <p className="description">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;