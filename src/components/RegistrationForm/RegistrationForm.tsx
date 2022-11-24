import React, { useState } from 'react';
import { useFormik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { db } from '../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { loginUser } from '../../store/slices/userSlice';
import PasswordInput from '../PasswordInput';
import TextInput from '../TextInput';
import ButtonPrimary from '../ButtonPrimary';

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
    values.passwordConfirm === values.password &&
    values.password.length > 7;

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
        <TextInput
          type='text'
          id='registration-username'
          placeholder={placeholders.username}
          name='username'
          value={values.username}
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
        />
        <TextInput
          type='email'
          id='registration-email'
          placeholder={placeholders.email}
          name='email'
          value={values.email}
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
        />
        <PasswordInput
          placeholder={placeholders.password}
          value={values.password}
          name='password'
          id={'registration-psw'}
          showMinChar
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
        />
        <PasswordInput
          placeholder={placeholders.passwordConfirm}
          value={values.passwordConfirm}
          name='passwordConfirm'
          id={'registration-psw-confirm'}
          onChange={(e) => {
            handleChange(e);
            setIsError(false);
          }}
        />
        <ButtonPrimary
          disabled={isLoading || isError || !isValid}
          type='submit'
          id='confirm-registration-button'
          label='Continua'
        />
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
