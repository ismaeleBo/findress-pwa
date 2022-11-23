import React, { useEffect, useState } from 'react';
import LoginModal from '../LoginModal';
import Menu from '../Menu';
import { useDispatch } from 'react-redux';
import './Header.scss';
import { logoutUser } from '../../store/slices/userSlice';
import { useSelectUser } from '../../store/selectors';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase-config';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const dispatch = useDispatch();

  const handlePressMenu = () => {
    setLoginOpen(false);
    setMenuOpen(!isMenuOpen);
  };

  const handlePressLogin = () => {
    setMenuOpen(false);
    setLoginOpen(!isLoginOpen);
  };

  const handlePressLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
  };

  const user = useSelectUser();

  useEffect(() => {
    if (user.isLogged) {
      setLoginOpen(false);
    }
  }, [user, setLoginOpen]);

  return (
    <div>
      <header className='font-heading relative header flex bg-white top-0 left-0 w-full p-20'>
        <button className='mr-24' onClick={handlePressMenu}>
          Menu
        </button>
        {user.isLogged ? (
          <button onClick={handlePressLogout} className={'text-yellow'}>
            Logout
          </button>
        ) : (
          <button onClick={handlePressLogin} className={'text-yellow'}>
            Login
          </button>
        )}
      </header>
      <Menu isVisible={isMenuOpen} />
      <LoginModal isVisible={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default Header;
