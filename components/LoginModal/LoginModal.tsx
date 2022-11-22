import React from 'react';
import classNames from 'classnames';
import { useState } from 'react';
import LoginForm from '../LoginForm';
import RegistrationForm from '../RegistrationForm';
import './LoginModal.scss';
import close from '../../assets/icons/close.png';

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoginModal = ({ isVisible, onClose }: LoginModalProps) => {
  const [showRegistration, setShowRegistration] = useState(false);

  // const register = async () => {};

  // const login = async () => {};

  // const logout = async () => {};

  return (
    <div
      className={classNames({
        'login-modal': true,
        'login-modal--active': isVisible,
      })}
    >
      <div className='login-modal__content absolute bg-purple rounded-lg p-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100'>
        <div className='flex justify-between'>
          {showRegistration ? (
            <h3 className='mb-20 text-white'>
              <div className='text-yellow font-bold font-heading mb-0 leading-xxs text-45'>
                Registrati
              </div>
              <span>e prova gratis!</span>
            </h3>
          ) : (
            <h3 className='mb-20 text-white'>
              <div className='text-yellow font-bold font-heading mb-0 leading-xxs text-45'>
                Entra
              </div>
              <span>alla tua area riservata</span>
            </h3>
          )}

          <div className='flex justify-end mb-20 w-65 h-65 -mt-15'>
            <button onClick={onClose}>
              <img src={close} alt='close' className='object-contain' />
            </button>
          </div>
        </div>
        {showRegistration ? (
          <RegistrationForm
            onAlreadyRegisteredButtonPress={() => setShowRegistration(false)}
          />
        ) : (
          <LoginForm onRegisterButtonPress={() => setShowRegistration(true)} />
        )}
      </div>
    </div>
  );
};

export default LoginModal;
