const ServiceCard = ({ service }) => {
  const { icon: Icon, title, description } = service;
  return (
    <div className="card shadow-lg p-4 bg-base-100 hover:shadow-xl transition duration-300 hover:bg-[#CAEB66]">
      <div className="text-primary text-4xl mb-4 mx-auto p-6 rounded-full bg-gradient-to-b from-[#EEEDFC] to-[#EEEDFC00]">
        <Icon />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
