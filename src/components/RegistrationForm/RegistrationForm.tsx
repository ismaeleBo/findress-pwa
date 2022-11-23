import React, { useState } from 'react';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { db } from '../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import './RegistrationForm.scss';
import * as Yup from 'yup';
import { loginUser } from '../../store/slices/userSlice';

interface RegistrationFormProps {
  onAlreadyRegisteredButtonPress: () => void;
}

interface UserData {
  uid: string;
  username: string;
  email: string;
}

const RegistrationSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const updateUser = (data: UserData) => {
  const collectionRef = collection(db, 'users');
  try {
    addDoc(collectionRef, data);
  } catch (err) {
    console.log(err);
  }
};

const RegistrationForm = ({
  onAlreadyRegisteredButtonPress,
}: RegistrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();

  const handleRegistration = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsError(false);
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          updateUser({ username, email, uid });
          dispatch(loginUser({ username, email, uid, isLogged: true }));
          setIsLoading(false);
          setIsSuccess(true);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          setIsError(true);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
    }
  };

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: '',
      password: '',
      username: '',
    },
    onSubmit: (values) => {
      handleRegistration(values.username, values.email, values.password);
    },
    validationSchema: RegistrationSchema,
  });

  const isValid = values.username && values.email && values.password;

  const placeholders = {
    email: 'Inserisci la tua email',
    password: 'Inserisci la tua password',
    username: 'Inserisci il tuo nome',
  };

  return (
    <div className='registration-form z-100'>
      <form
        autoComplete='off'
        className='flex flex-col'
        onSubmit={handleSubmit}
      >
        <input
          type='text'
          className='registration-form-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='registration-username'
          placeholder={placeholders.username}
          name='username'
          autoComplete='no-autocomplete-username'
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
          value={values.username}
        />
        <input
          type='email'
          className='registration-form-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='registration-email'
          placeholder={placeholders.email}
          name='email'
          autoComplete='no-autocomplete-email'
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
          value={values.email}
        />
        <input
          type='password'
          className='registration-form-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='registration-psw'
          placeholder={placeholders.password}
          name='password'
          autoComplete='no-autocomplete-password'
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
          className='bg-white text-yellow hover:bg-pink hover:text-black disabled:bg-white disabled:text-yellow disabled:opacity-20 rounded-lg py-10 px-20 font-heading font-bold transition duration-300'
        >
          Continua
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
        onClick={onAlreadyRegisteredButtonPress}
      >
        Hai già un account? Accedi ora
      </button>
    </div>
  );
};

export default RegistrationForm;
