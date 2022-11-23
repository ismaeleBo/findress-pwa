import React, { useState } from 'react';
import { useFormik } from 'formik';
import './LoginForm.scss';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase-config';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/slices/userSlice';
import { collection, getDocs } from 'firebase/firestore';

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
  const [isSuccess, setIsSuccess] = useState(false);
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
        setIsSuccess(true);
      }
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
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
        <input
          type='email'
          className='login-form-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='login-email'
          placeholder={placeholders.email}
          name='email'
          autoComplete='false'
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
          value={values.email}
        />
        <input
          type='password'
          className='login-form-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='login-psw'
          placeholder={placeholders.password}
          name='password'
          autoComplete='chrome-off'
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
          value={values.password}
        />
        <button
          disabled={isLoading || isError || !isValid}
          type='submit'
          id='button'
          className='login-form-input disabled:bg-white disabled:text-yellow disabled:opacity-20 bg-white text-yellow hover:bg-pink hover:text-black rounded-lg py-10 px-20 font-heading font-bold transition duration-300'
        >
          Accedi
        </button>
        {isError && (
          <div className='mt-20'>
            <p className='text-18 text-pink'>Si è verificato un errore</p>
          </div>
        )}
        {isSuccess && (
          <div className='mt-20'>
            <p className='text-18 text-pink'>
              Registrazione andata a buon fine!
            </p>
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
