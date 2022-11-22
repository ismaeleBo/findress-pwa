import Footer from '../components/Footer';
import Header from '../components/Header';

interface LayoutProps {
  children: JSX.Element | JSX.Element[];
}

const DefaultLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <div className='container'>{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
