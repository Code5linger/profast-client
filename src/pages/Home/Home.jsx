import Banner from './Banner';
import OurServices from '../../components/OurServices';
import TrustedBy from '../../components/TrustedBy';
import FeatureSection from '../../components/Feature';
import BeMarchant from '../../components/BeMarchant';

export const Home = () => {
  return (
    <div className=" space-y-15">
      <div className="max-w-[1500px] mx-auto">
        <Banner />
        <OurServices />
      </div>
      <TrustedBy />
      <div className="max-w-[1500px] mx-auto">
        <FeatureSection />
        <BeMarchant />
      </div>
    </div>
  );
};
