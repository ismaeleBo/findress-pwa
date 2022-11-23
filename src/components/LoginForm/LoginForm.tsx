import React from 'react';
import { useFormik } from 'formik';
import './LoginForm.scss';

interface LoginFormProps {
  onRegisterButtonPress: () => void;
}

const LoginForm = ({ onRegisterButtonPress }: LoginFormProps) => {
  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const placeholders = {
    email: 'Inserisci la tua email',
    password: 'Inserisci la tua password',
  };

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
          onChange={handleChange}
          value={values.email}
        />
        <input
          type='password'
          className='login-form-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='login-psw'
          placeholder={placeholders.password}
          name='password'
          autoComplete='false'
          onChange={handleChange}
          value={values.password}
        />
        <button
          type='submit'
          id='button'
          className='login-form-input bg-white text-yellow hover:bg-pink hover:text-black rounded-lg py-10 px-20 font-heading font-bold transition duration-300'
        >
          Accedi
        </button>
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
