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
import eye from '../../assets/icons/eye.png';
import closedEye from '../../assets/icons/closed-eye.png';

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
  passwordConfirm: Yup.string().required('Required'),
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

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
      passwordConfirm: '',
    },
    onSubmit: (values) => {
      handleRegistration(values.username, values.email, values.password);
    },
    validationSchema: RegistrationSchema,
  });

  const isValid =
    values.username &&
    values.email &&
    values.password &&
    values.passwordConfirm === values.password;

  const placeholders = {
    email: 'Inserisci la tua email',
    password: 'Inserisci la tua password',
    passwordConfirm: 'Conferma la tua password',
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
          autoComplete='off'
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
          autoComplete='off'
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
          value={values.email}
        />
        <div className='bg-white rounded-lg focus:border-blue border-3 border-transparent text-16 mb-18 transition duration-300 ease-in flex justify-between align-center'>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            className='registration-form-input focus:outline-none p-10 md:p-20 bg-white w-full'
            id='registration-psw'
            placeholder={placeholders.password}
            name='password'
            autoComplete='new-password'
            onChange={(e) => {
              handleChange(e);
              setIsError(false);
            }}
            value={values.password}
          />
          <div className='flex flex-col justify-center'>
            <button
              type='button'
              className='h-32 w-32 mr-12'
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <img src={isPasswordVisible ? closedEye : eye} alt='eye' />
            </button>
          </div>
        </div>

        <div className='bg-white rounded-lg focus:border-blue border-3 border-transparent text-16 mb-18 transition duration-300 ease-in flex justify-between align-center'>
          <input
            type={isPasswordConfirmVisible ? 'text' : 'password'}
            className='registration-form-input focus:outline-none p-10 md:p-20 bg-white w-full'
            id='registration-psw-confirm'
            placeholder={placeholders.passwordConfirm}
            name='passwordConfirm'
            autoComplete='new-password'
            onChange={(e) => {
              handleChange(e);
              setIsError(false);
            }}
            value={values.passwordConfirm}
          />
          <div className='flex flex-col justify-center'>
            <button
              type='button'
              className='h-32 w-32 mr-12'
              onClick={() =>
                setIsPasswordConfirmVisible(!isPasswordConfirmVisible)
              }
            >
              <img src={isPasswordConfirmVisible ? closedEye : eye} alt='eye' />
            </button>
          </div>
        </div>
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
