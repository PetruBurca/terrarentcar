import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TimeLine.scss';

gsap.registerPlugin(ScrollTrigger);

const TimeLine = () => {
  useEffect(() => {
    gsap.fromTo(
      '.text',
      {
        scale: 20, // Огромный начальный масштаб
        opacity: 0, // Начальная прозрачность
      },
      {
        scale: 1, // Конечный масштаб
        opacity: 1, // Полная видимость
        scrollTrigger: {
          trigger: '.video-container', // Триггер для анимации
          start: 'top bottom', // Анимация начинается, когда верх блока касается нижней границы экрана
          end: 'center center', // Анимация заканчивается, когда низ блока касается верхней границы экрана
          scrub: true, // Плавное изменение при прокрутке
          markers: false, // Включите для отладки
        },
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className="video-container">
      <video className="background-video" autoPlay loop muted>
        <source src="src/assets/video.mp4" type="video/mp4" />
      </video>
      <div className="overlay">
        <div className="text">
          <span className="letter">T</span>
          <span className="letter">E</span>
          <span className="letter">R</span>
          <span className="letter">R</span>
          <span className="letter">A</span>
          <span className="letter">&nbsp;</span>
          <span className="letter">RENT</span>
          <span className="letter">&nbsp;</span>
          <span className="letter">CAR</span>
        </div>
      </div>
    </div>
  );
};

export default TimeLine;