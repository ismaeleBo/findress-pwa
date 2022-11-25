import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  UserCredential,
} from 'firebase/auth';
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
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [isVerificationError, setIsVerificationError] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);

  const dispatch = useDispatch();

  const handleRegistration = async (email: string, password: string) => {
    try {
      // HIDE ERROR AND START LOADING
      setIsError(false);
      setIsLoading(true);

      // SEND AUTH REQUEST
      const newUserCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      // SEND EMAIL VERIFICATION
      await sendEmailVerification(newUserCredential.user);

      // SHOW EMAIL VERIFICATION MODAL
      setIsVerificationVisible(true);
    } catch (error) {
      console.log(error);
      // IF THERE IS AN ERROR, STOP LOADING AND SHOW ERROR MESSAGE
      setIsLoading(false);
      setIsError(true);
    }
  };

  const completeRegistration = (email: string, username: string) => {
    // CHECK IF THE EMAIL HAS BEEN VERIFIED
    if (auth.currentUser?.emailVerified) {
      const uid = auth.currentUser?.uid;
      // CHECK IF USER ID IS AVAILABLE
      if (uid) {
        try {
          // SAVE USER NAME ON DB
          updateUser({ username, email, uid });
          // LOG USER INSIDE THE APP
          dispatch(loginUser({ username, email, uid, isLogged: true }));
          // STOP LOADING
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          // IF THERE IS AN ERROR, STOP LOADING AND SHOW AN ERROR
          setIsLoading(false);
          setIsError(true);
        }
      }
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
      handleRegistration(values.email, values.password);
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

  const handleUserConfirmEmail = () => {
    // DISABLE VERIFICATION CONFIRM BUTTON
    setIsVerificationLoading(true);

    // RELOAD THE USER DATA
    // THERE IS A PROBLEM -> THE VERIFICATION NEEDS TWO CLICK ON CONFIRMATION BUTTON TO WORK
    auth.currentUser?.reload();

    if (auth.currentUser) {
      // CHECK IF THE EMAIL HAS BEEN VERIFIED
      const { emailVerified } = auth.currentUser;

      if (emailVerified) {
        // HIDE ERROR
        setIsVerificationError(false);

        // COMPLETE USER REGISTRATION
        completeRegistration(values.email, values.username);

        // HIDE VERIFICATION MODAL
        setIsVerificationVisible(false);
        return;
      }

      // EMAIL HAS NOT BEEN VERIFIED YET
      // STOP LOADING AND SHOW AN ERROR
      setIsVerificationError(true);
      setIsVerificationLoading(false);
    }
  };

  return (
    <div className='registration-form z-100'>
      {isVerificationVisible ? (
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
      ) : (
        <div>
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
      )}
    </div>
  );
};

export default RegistrationForm;
