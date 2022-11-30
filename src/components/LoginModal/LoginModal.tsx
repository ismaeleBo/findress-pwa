import React from 'react';
import classNames from 'classnames';
import { useState } from 'react';
import LoginForm from '../LoginForm';
import RegistrationForm from '../RegistrationForm';
import './LoginModal.scss';
import close from '../../assets/icons/close.png';
import ButtonPrimary from '../ButtonPrimary';
import { auth } from '../../firebase-config';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/slices/userSlice';
import { getUserByUID } from '../../utils';

interface LoginModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const LoginModal = ({ isVisible, onClose }: LoginModalProps) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isVerificationError, setIsVerificationError] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

  useState(() => {
    setShowRegistration(false);
    setShowVerification(false);
    setIsVerificationError(false);
    setIsVerificationLoading(false);
  });

  const dispatch = useDispatch();

  const handleContinueRegistration = () => {
    setShowRegistration(false);
    setShowVerification(true);
  };

  const completeRegistration = async () => {
    // CHECK IF THE EMAIL HAS BEEN VERIFIED
    if (auth.currentUser?.emailVerified) {
      const { uid, email } = auth.currentUser;
      // CHECK IF USER ID IS AVAILABLE
      if (uid) {
        // GET USER DATA
        const user = await getUserByUID(uid);
        if (user) {
          try {
            // LOG USER INSIDE THE APP
            dispatch(
              loginUser({ username: user.username, email, uid, isLogged: true })
            );

            // HIDE REGISTRATION
            setShowRegistration(false);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };

  const handleUserConfirmEmail = async () => {
    // DISABLE VERIFICATION CONFIRM BUTTON
    setIsVerificationLoading(true);

    if (auth.currentUser) {
      // RELOAD THE USER DATA
      await auth.currentUser?.reload();

      const { emailVerified } = auth.currentUser;

      // CHECK IF THE EMAIL HAS BEEN VERIFIED
      if (emailVerified) {
        // HIDE ERROR
        setIsVerificationError(false);

        // COMPLETE USER REGISTRATION
        completeRegistration();

        // HIDE VERIFICATION MODAL
        setShowVerification(false);

        // STOP VERIFICATION LOADING
        setIsVerificationLoading(false);
        return;
      }

      // EMAIL HAS NOT BEEN VERIFIED YET
      // STOP LOADING AND SHOW AN ERROR
      setIsVerificationError(true);
      setIsVerificationLoading(false);
    }
  };

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
            onContinueRegistration={handleContinueRegistration}
          />
        ) : (
          !showVerification && (
            <LoginForm
              onRegisterButtonPress={() => setShowRegistration(true)}
              onEmailVerification={() => setShowVerification(true)}
            />
          )
        )}
        {showVerification && (
          <div className='text-white'>
            <h3 className='font-heading font-bold mb-20 text-44'>
              Ci sei quasi!
            </h3>
            <p className='mb-20'>
              Ti abbiamo inviato una mail, conferma la tua registrazione tramite
              il link e il gioco è fatto!
            </p>
            <ButtonPrimary
              type='button'
              label='Clicca qui quando hai fatto'
              id='email-confirmation-button'
              disabled={isVerificationLoading}
              onClick={handleUserConfirmEmail}
            />
            {isVerificationError && (
              <div className='mt-20'>
                <p className='text-18 text-pink'>
                  Qualcosa è andato storto durante la verifica, riprova.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
