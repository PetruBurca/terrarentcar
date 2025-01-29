import "./CarCards.scss";
import { useTranslation } from 'react-i18next';
import bmw from '../assets/gallery/bmw.jpg'
const cars = [
  {
    title: "BMW X6 Competition",
    price: "de la $400",
    color: "Black",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Audi",
    price: "$229.45",
    color: "Black White",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Ford",
    price: "$229.45",
    color: "Black Gray",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Mercedes",
    price: "$299.99",
    color: "Blue Metallic",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "BMW X6 Competition",
    price: "de la $400",
    color: "Black",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Audi",
    price: "$229.45",
    color: "Black White",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Ford",
    price: "$229.45",
    color: "Black Gray",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Mercedes",
    price: "$299.99",
    color: "Blue Metallic",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "BMW X6 Competition",
    price: "de la $400",
    color: "Black",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Audi",
    price: "$229.45",
    color: "Black White",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Ford",
    price: "$229.45",
    color: "Black Gray",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Mercedes",
    price: "$299.99",
    color: "Blue Metallic",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "BMW X6 Competition",
    price: "de la $400",
    color: "Black",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Audi",
    price: "$229.45",
    color: "Black White",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Ford",
    price: "$229.45",
    color: "Black Gray",
    discount: "HOT",
    img: bmw,
  },
  {
    title: "Mercedes",
    price: "$299.99",
    color: "Blue Metallic",
    discount: "HOT",
    img: bmw,
  },
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
              <p className="price">{car.price}</p>
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