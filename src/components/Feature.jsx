import React from 'react';

// Example images (update with your own imports or paths)
import img1 from '../assets/Feature/Transit warehouse.png';
import img2 from '../assets/Feature/Group 4.png';
import img3 from '../assets/Feature/Group 4.png';

const features = [
  {
    image: img1,
    title: 'Live Parcel Tracking',
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
  },
  {
    image: img2,
    title: '100% Safe Delivery',
    description:
      'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
  },
  {
    image: img3,
    title: '24/7 Call Center Support',
    description:
      'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 ">
      <div className=" mx-auto space-y-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center rounded-3xl bg-white p-8 gap-6 md:gap-10 shadow-xl hover:bg-[#CAEB66]"
          >
            {/* Image */}
            <div className="flex-shrink-0">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Dotted Vertical Divider */}
            <div className="h-24 w-px border-l border-dotted border-gray-400"></div>

            {/* Text */}
            <div className="">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
