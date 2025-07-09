import { Outlet } from 'react-router';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const RootLayout = () => {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <NavBar />
      <section>
        <Outlet />
      </section>
      <Footer />
    </main>
  );
};

export default RootLayout;
