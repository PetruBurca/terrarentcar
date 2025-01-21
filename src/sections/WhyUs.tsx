import React from 'react';
import './WhyUs.scss';

const WhyUs: React.FC = () => {
  const features = [
    {
      title: 'The security first platform',
      description: 'Simplify your security with authentication services. Define access roles for the end-users, and extend your authorization capabilities to implement dynamic access control.',
    },
    {
      title: 'Comprehensive authentication',
      description: 'Enable seamless integration with third-party tools and ensure secure access with multi-factor authentication support.',
    },
    {
      title: 'Dynamic access control',
      description: 'Easily manage user roles and permissions with flexible, scalable access control solutions.',
    },
  ];

  return (
    <section className="why-us" id='about'>
      <div className="container">
        <h2 className="why-us__title">Why Choose Us?</h2>
        <div className="features">
          {features.map((feature, index) => (
            <div key={index} className="feature">

              <h3 className="feature__title">{feature.title}</h3>
              <p className="feature__description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;