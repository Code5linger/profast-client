import Marquee from 'react-fast-marquee';
// Local Brand Logo
import amazonVector from '../assets/brands/amazon_vector.png';
import amazon from '../assets/brands/amazon.png';
import casio from '../assets/brands/casio.png';
import moonstar from '../assets/brands/moonstar.png';
import randstad from '../assets/brands/randstad.png';
import startPeople from '../assets/brands/start-people 1.png';
import start from '../assets/brands/start.png';

const logos = [
  amazonVector,
  amazon,
  casio,
  moonstar,
  randstad,
  startPeople,
  start,
  amazonVector,
  amazon,
  casio,
  moonstar,
  randstad,
  startPeople,
  start,
  amazonVector,
  amazon,
  casio,
  moonstar,
  randstad,
  startPeople,
  start,
];

const TrustedBy = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
        We've helped thousands of sales teams
      </h2>

      <Marquee
        gradient={false} // disables fade at ends
        speed={50} // adjust for desired scroll speed
        pauseOnHover={true} // optional: pause on hover
      >
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index}`}
            className="h-7 mx-6"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default TrustedBy;
