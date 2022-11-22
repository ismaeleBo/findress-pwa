import React from 'react';
import { useFormik } from 'formik';

interface RegistrationFormProps {
  onAlreadyRegisteredButtonPress: () => void;
}

const RegistrationForm = ({
  onAlreadyRegisteredButtonPress,
}: RegistrationFormProps) => {
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
    <div className='registration-form z-100'>
      <form autoComplete='off' className='flex flex-col'>
        <input
          type='email'
          className='bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='registration-email'
          placeholder='Enter email'
          name='email'
          autoComplete='false'
          onChange={handleChange}
          value={values.email}
        />
        <input
          type='password'
          className='bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
          id='registration-password'
          placeholder='Enter password'
          name='pswd'
          autoComplete='false'
          onChange={handleChange}
          value={values.password}
        />
        <button
          onClick={() => handleSubmit}
          id='button'
          className='bg-white text-yellow hover:bg-pink hover:text-black rounded-lg py-10 px-20 font-heading font-bold transition duration-300'
        >
          Continua
        </button>
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
