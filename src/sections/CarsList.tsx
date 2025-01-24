import { useEffect, useState } from 'react';
import './CarsList.scss';

interface Car {
  id: number;
  name: string;
  image: string;
}

const CarsList = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCarIndex, setCurrentCarIndex] = useState<number>(0);

  useEffect(() => {
    fetch('src/components/carsData.json')
      .then((response) => response.json())
      .then((data) => setCars(data))
      .catch((error) => console.error('Error loading cars data:', error));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const openModal = (index: number) => {
    setCurrentCarIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setCurrentCarIndex((prevIndex) => (prevIndex + 1) % cars.length);
  };

  const showPrevImage = () => {
    setCurrentCarIndex((prevIndex) => (prevIndex - 1 + cars.length) % cars.length);
  };

  return (
    <div className="main-cars-list">
      <h1 className='title-car'>Широкий выбор автомобилей</h1>
    <div className="cars-list">
      {cars.map((car, index) => (
        <div className="car-card" key={car.id} onClick={() => openModal(index)}>
          <img src={car.image} alt={car.name} className="car-image" />
          <div className="car-details">
            <h3 className="car-name">{car.name}</h3>
          </div>
        </div>
      ))}

{isModalOpen && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={closeModal}>
        &times;
      </button>
      
      {/* Аватар пользователя над изображением */}
      <div className="modal-avatar">
        <img src="/src/assets/logo.jpg" alt="User Avatar" />
      </div>
      

      <div className="modal-gallery">
        <button className="modal-arrow left" onClick={showPrevImage}>
          <img src="/src/assets/arrow-l.svg" alt="Previous" />
        </button>
        <img
          src={cars[currentCarIndex].image}
          alt={cars[currentCarIndex].name}
          className="modal-image"
        />
        <button className="modal-arrow right" onClick={showNextImage}>
          <img src="/src/assets/arrow-r.svg" alt="Next" />
        </button>
      </div>

      {/* Кнопки для действий под изображением */}
      <div className="modal-actions">
        <button className="modal-action">
          <img src="/src/assets/heart.svg" alt="Heart" />
        </button>
        <button className="modal-action">
          <img src="/src/assets/comment.svg" alt="Comment" />
        </button>
        <button className="modal-action">
          <img src="/src/assets/send.svg" alt="Send" />
        </button>
        <button className="modal-action">
          <img src="/src/assets/favorite.svg" alt="Favorite" />
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
  );
};

export default CarsList;