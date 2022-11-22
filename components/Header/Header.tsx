import React, { useState } from 'react';
import LoginModal from '../LoginModal';
import Menu from '../Menu';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const handlePressMenu = () => {
    setLoginOpen(false);
    setMenuOpen(!isMenuOpen);
  };

  const handlePressLogin = () => {
    setMenuOpen(false);
    setLoginOpen(!isLoginOpen);
  };

  return (
    <div>
      <header className='font-heading relative header flex bg-white top-0 left-0 w-full p-20'>
        <button className='mr-24' onClick={handlePressMenu}>
          Menu
        </button>
        <button onClick={handlePressLogin} className={'text-yellow'}>
          Login
        </button>
      </header>
      <Menu isVisible={isMenuOpen} />
      <LoginModal isVisible={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default Header;
