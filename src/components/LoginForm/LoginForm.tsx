import React, { useState } from 'react';
import { useFormik } from 'formik';
import './LoginForm.scss';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/slices/userSlice';
import { collection, getDocs } from 'firebase/firestore';
import TextInput from '../TextInput';
import PasswordInput from '../PasswordInput';
import ButtonPrimary from '../ButtonPrimary';

interface LoginFormProps {
  onRegisterButtonPress: () => void;
}

interface FormFields {
  email: string;
  password: string;
}

const LoginForm = ({ onRegisterButtonPress }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const getUserByUID = async (uid: string) => {
    const collectionRef = collection(db, 'users');
    try {
      const res = await getDocs(collectionRef);
      const users = res.docs.map((doc) => ({ data: doc.data(), id: doc.id }));
      const currentUser = users.filter((el) => {
        return el.data.uid === uid;
      });
      return currentUser[0].data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async (values: FormFields) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password);

      if (auth.currentUser?.uid) {
        const user = await getUserByUID(auth.currentUser?.uid);

        dispatch(
          loginUser({
            username: user?.username,
            email: values.email,
            uid: auth.currentUser?.uid,
            isLogged: true,
          })
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      console.log(error);
    }
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
      </form>
      <button
        className='text-14 text-white mt-20'
        onClick={onRegisterButtonPress}
      >
        Non hai ancora un account? Registrati ora
      </button>
    </div>
  );
};

export default LoginForm;
