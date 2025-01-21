import React from 'react';
import './CarsList.scss';

const CarsList: React.FC = () => {
  const cars = [
    {
      name: '2025 New Model Guide',
      price: '$250/day',
      image: '/assets/car1.jpg',
      features: ['GPS', 'Black', '4 seats'],
    },
    {
      name: '2025 Tesla Century',
      price: '$300/day',
      image: '/assets/car2.jpg',
      features: ['Electric', 'White', '4 seats'],
    },
    {
      name: '2023 Chevy Camaro SUV',
      price: '$200/day',
      image: '/assets/car3.jpg',
      features: ['Luxury', 'Gray', '6 seats'],
    },
  ];

  return (
    <section className="cars-list">
      <h2>Часто арендуемые машины</h2>
      <div className="cars-container">
        {cars.map((car, index) => (
          <div key={index} className="car-card">
            <img src={car.image} alt={car.name} />
            <h3>{car.name}</h3>
            <p>{car.price}</p>
            <ul>
              {car.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button>Подробнее</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarsList;