import React from 'react';
import { useFormik } from 'formik';

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

  return (
    <div className='login-form z-100'>
      <form autoComplete='off' className='flex flex-col'>
        <input
          type='email'
          className='bg-white rounded-lg p-10 md:p-20 focus:outline-none text-16 mb-18'
          id='login-email'
          placeholder='Enter email'
          name='email'
          autoComplete='false'
          onChange={handleChange}
          value={values.email}
        />
        <input
          type='login-password'
          className='bg-white rounded-lg p-10 md:p-20 focus:outline-none text-16 mb-24'
          id='password'
          placeholder='Enter password'
          name='pswd'
          autoComplete='false'
          onChange={handleChange}
          value={values.password}
        />
        <button
          type='submit'
          id='button'
          className='bg-white rounded-lg py-10 px-20 font-heading font-bold text-yellow'
          onClick={() => handleSubmit}
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
