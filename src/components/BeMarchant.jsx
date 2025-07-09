import location from '../assets/location-merchant.png';

const BeMarchant = () => {
  return (
    <div
      data-aos="flip-left"
      className="bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat bg-[#03373D] text-white rounded-4xl p-20"
    >
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={location} className="max-w-sm rounded-lg " />
        <div>
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <div className="flex gap-4 ">
            <button className="btn bg-[#CAEB66] border-[#CAEB66]  rounded-full">
              Become a Merchant
            </button>
            <button className="btn border-[#CAEB66] text-[#CAEB66] btn-outline rounded-full hover:bg-black">
              Earn with Profast Courier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeMarchant;
