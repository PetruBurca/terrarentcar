import "./CarCards.scss";
import { useTranslation } from 'react-i18next';
import audi from '../assets/gallery/audi.jpeg';
import bmw from '../assets/gallery/bmw.jpeg';
import bmw2 from '../assets/gallery/bmw2.jpeg';
import bmw3 from '../assets/gallery/bmw3.jpeg';
import bmwx6 from '../assets/gallery/bmwx6.jpeg';
import hyundai from '../assets/gallery/hyundai.jpeg';
import lexus from '../assets/gallery/lexus.jpeg';
import mercedes from '../assets/gallery/mercedes.jpeg';
import mercedes2 from '../assets/gallery/mercedes2.jpeg';
import mercedes3 from '../assets/gallery/mercedes3.jpeg';
import mercedes4 from '../assets/gallery/mercedes4.jpeg';
import skoda from '../assets/gallery/skoda.jpeg';
import toyota from '../assets/gallery/toyota.jpeg';
import volvo from '../assets/gallery/volvo.jpeg';

const cars = [
  {
    title: "Audi A6",
    
    color: "Black",
    discount: "HOT",
    img: audi,
  },
  {
    title: "BMW 530i",
    
    color: "Black",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "BMW x5 m50d",
    
    color: "Black",
    discount: "HOT",
    img: bmw2,
  },
  {
    title: "BMW 530e",
    
    color: "Black",
    discount: "HOT",
    img: bmw3,
  },
  {
    title: "BMW X6 MCompetition",
    
    color: "Black",
    discount: "HOT",
    img: bmwx6,
  },
  {
    title: "Hyundai SantaFe",
    
    color: "Grey",
    discount: "HOT",
    img: hyundai,
  },
  {
    title: "Lexus ES300",
    
    color: "White",
    discount: "HOT",
    img: lexus,
  },
  {
    title: "Mercedes E300",
    
    color: "Black",
    discount: "HOT",
    img: mercedes,
  },
  {
    title: "Mercedes E220",
    
    color: "Black ",
    discount: "HOT",
    img: mercedes2,
  },
  {
    title: "Mercedes GLE53",
    
    color: "Black",
    discount: "HOT",
    img: mercedes3,
  },
  {
    title: "Mercedes GLE43",
    
    color: "White",
    discount: "HOT",
    img: mercedes4,
  },
  {
    title: "Skoda Octavia",
    
    color: "White",
    discount: "HOT",
    img: skoda,
  },
  {
    title: "Toyota Corolla",
    
    color: "White",
    discount: "HOT",
    img: toyota,
  },
  {
    title: "Volvo XC60",
    
    color: "Black",
    discount: "HOT",
    img: volvo,
  }
];

const CarCards = () => {
  const { t } = useTranslation();
  return (
    <section className="car-cards" id='gallery'>
      <h2>{t('carCards.title')}</h2>
      <p>{t('carCards.description')}</p>
      <div className="cards-container">
        {cars.map((car, index) => (
          <div key={index} className="card">
            <div className="card-image">
              <img src={car.img} alt={car.title} />
              <span className="discount">{car.discount}</span>
            </div>
            <div className="card-content">
              <h3>{car.title}</h3>

              <p className="color">Color: {car.color}</p>
              {/* <button>See More Details</button> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarCards;