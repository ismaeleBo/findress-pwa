import React, { useState } from 'react';
import { useFormik } from 'formik';
import './LoginForm.scss';
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/slices/userSlice';
import TextInput from '../TextInput';
import PasswordInput from '../PasswordInput';
import ButtonPrimary from '../ButtonPrimary';
import { getUserByUID } from '../../utils';

interface LoginFormProps {
  onRegisterButtonPress: () => void;
  onEmailVerification: () => void;
}

interface FormFields {
  email: string;
  password: string;
}

const LoginForm = ({
  onRegisterButtonPress,
  onEmailVerification,
}: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVerificationError, setIsVerificationError] = useState(false);

  const dispatch = useDispatch();

  const handleLogin = async (values: FormFields) => {
    try {
      // RESET ERRORS
      setIsError(false);
      setIsVerificationError(false);

      // START LOADING
      setIsLoading(true);

      // SIGN IN
      await signInWithEmailAndPassword(auth, values.email, values.password);

      // CHECK IF CURRENT USER IS AVAILABLE
      if (auth.currentUser?.uid) {
        auth.currentUser?.reload();

        const currentUserUID = auth.currentUser?.uid;

        // GET USER DATA
        const user = await getUserByUID(currentUserUID);

        // CHECK IF EMAIL HAS BEEN VERIFIED
        if (user && auth.currentUser?.emailVerified) {
          // SAVE USER ON REDUX STORE
          dispatch(
            loginUser({
              username: user.username,
              email: values.email,
              uid: auth.currentUser?.uid,
              isLogged: true,
            })
          );

          // STOP LOADING
          setIsLoading(false);
          return;
        }

        // SHOW VERIFICATION ERROR
        setIsVerificationError(true);

        // STOP LOADING
        setIsLoading(false);

        return;
      }

      // SHOW GENERIC ERROR
      setIsError(true);
      // STOP LOADING
      setIsLoading(false);
    } catch (error) {
      // SHOW GENERIC ERROR
      setIsError(true);
      // STOP LOADING
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleEmailVerificationLink = async () => {
    // THERE IS A PROBLEM, WHEN sendEmailVerification RUN, FIREBASE RETURN A TOO MANY REQUEST ERROR
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        onEmailVerification();
      } catch (error) {
        setIsVerificationError(true);
        console.log(error);
      }
    }
    setIsVerificationError(false);
  };

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const placeholders = {
    email: 'Inserisci la tua email',
    password: 'Inserisci la tua password',
  };

  const isValid = values.email && values.password;

  return (
    <div className='login-form z-100'>
      <form
        autoComplete='off'
        className='flex flex-col'
        onSubmit={handleSubmit}
      >
        <TextInput
          type='email'
          id='login-email'
          name='email'
          placeholder={placeholders.email}
          value={values.email}
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
        />
        <PasswordInput
          placeholder={placeholders.password}
          value={values.password}
          id='login-psw'
          name='password'
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
        />
        <ButtonPrimary
          disabled={isLoading || isError || !isValid}
          type='submit'
          id='confirm-login-button'
          label='Accedi'
        />
        {isError && (
          <div className='mt-20'>
            <p className='text-18 text-pink'>Si è verificato un errore</p>
            <p className='text-18 text-pink'>Controlla i dati e riprova</p>
          </div>
        )}
        {isVerificationError && (
          <div className='mt-20'>
            <p className='text-18 text-pink'>
              Sembra che questo utente non sia verificato
            </p>
            <p className='text-18 text-pink'>
              Sicuro di aver confermato la mail?
            </p>
            <button
              type='button'
              className='text-18 text-white mt-20'
              onClick={handleEmailVerificationLink}
            >
              Clicca qui per ricevere un altro link
            </button>
          </div>
        )}
      </form>
      {!isVerificationError && (
        <button
          className='text-18 text-white mt-20'
          onClick={onRegisterButtonPress}
        >
          Non hai ancora un account? Registrati ora
        </button>
      )}
    </div>
  );
};

export default LoginForm;
