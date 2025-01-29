import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhyUs.scss';

// Иконки
import auto from '../assets/whyusIcon/auto.svg';
import rent from '../assets/whyusIcon/rent.svg';
import security from '../assets/whyusIcon/security.svg';
import simple from '../assets/whyusIcon/simple.svg';
import money from '../assets/whyusIcon/money.svg';
import price from '../assets/whyusIcon/price.svg';

gsap.registerPlugin(ScrollTrigger);

const WhyUs: React.FC = () => {
  const { t } = useTranslation();
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
      titleKey: 'whyUs.points.auto.title',
      descriptionKey: 'whyUs.points.auto.description'
    },
    {
      icon: rent,
      titleKey: 'whyUs.points.rent.title',
      descriptionKey: 'whyUs.points.rent.description'
    },
    {
      icon: security,
      titleKey: 'whyUs.points.security.title',
      descriptionKey: 'whyUs.points.security.description'
    },
    {
      icon: simple,
      titleKey: 'whyUs.points.simple.title',
      descriptionKey: 'whyUs.points.simple.description'
    },
    {
      icon: money,
      titleKey: 'whyUs.points.money.title',
      descriptionKey: 'whyUs.points.money.description'
    },
    {
      icon: price,
      titleKey: 'whyUs.points.price.title',
      descriptionKey: 'whyUs.points.price.description'
    },
  ];

  return (
    <div className="whyus-container" id='about'>
      <div className="whyus-left">
        <h1>{t('whyUs.title')}</h1>
      </div>
      <div className="whyus-right" ref={rightTextRef}>
        {whyUsPoints.map((point, index) => (
          <div className="whyus-item" key={index}>
            <div className="icon-circle">
              <img src={point.icon} alt={t(point.titleKey)} />
            </div>
            <h2 className="title">{t(point.titleKey)}</h2>
            <p className="description">{t(point.descriptionKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyUs;