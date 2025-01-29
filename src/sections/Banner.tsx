import React, { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Banner.scss";

import background from "../assets/video.mp4";

gsap.registerPlugin(ScrollTrigger);

const Banner: React.FC = () => {
  const { t } = useTranslation();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;

    if (!banner) return;

    // Анимация текста (h1, p)
    const textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: banner,
        start: "top center",
        end: "bottom center",
        toggleActions: "play reverse play reverse",
      },
    });

    textTimeline
      .fromTo(
        banner.querySelector("h1"),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.4 }
      )
      .fromTo(
        banner.querySelector("p"),
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.5"
      )
      .fromTo(
        banner.querySelector("h2"),
        { opacity: 0, y: 50 }, // Начальное состояние
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1 } // Плавная анимация
      );
  }, []);

  return (
    <section className="banner" ref={bannerRef}>
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
        tabIndex={-1}
        aria-hidden="true"
      >
        <source src={background} type="video/mp4" />
      </video>

      <div className="text-cont">
        <h1 data-reflection="Terra rent car">Terra rent car</h1>
        <p>{t('banner.subtitle')}</p>
        <h2>{t('banner.slogan')}</h2>
      </div>
    </section>
  );
};

export default Banner;