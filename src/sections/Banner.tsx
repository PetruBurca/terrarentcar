import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Banner.scss";

import audi from "../assets/audi.png";
import mercedes from "../assets/mercedes.png";
import bmw from "../assets/bmw.png";
import lexus from "../assets/lexus.png";
import mustang from "../assets/mustang.png";
import appstore from "../assets/appstore.svg";

gsap.registerPlugin(ScrollTrigger);

const Banner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
  
    if (!banner) return;
  
    // Анимация текста
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
      );
  
    // Анимация кнопки App Store
    gsap.fromTo(
      banner.querySelector(".app-store-button"),
      { opacity: 0, scale: 0.8 }, // Начальное состояние
      {
        opacity: 1,
        scale: 1, // Конечное состояние
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: banner,
          start: "top center",
          end: "bottom center",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  
    // Анимация машин
    const cars = banner.querySelectorAll(".cars-container img");
    gsap.fromTo(
      cars,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: banner,
          start: "top center",
          end: "bottom center",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, []);

  return (
    <section className="banner" ref={bannerRef}>
      <img className="backgr-img" src="../src/assets/backgr.gif" alt="Background" />
      
      <div className="text-cont">
        <h1 data-reflection="TerraRentCar Prim">TerraRentCar Prim</h1>
        <p>More than a car rental</p>
      </div>

      <div className="app-store-button">
        <a
          href="https://apps.apple.com/md/app/terrarent/id1661556785"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={appstore} alt="App Store" />
        </a>
      </div>

      <div className="cars-container">
        {[audi, mercedes, bmw, lexus, mustang].map((src, index) => (
          <img key={index} src={src} alt={`Car ${index + 1}`} />
        ))}
      </div>
    </section>
  );
};

export default Banner;