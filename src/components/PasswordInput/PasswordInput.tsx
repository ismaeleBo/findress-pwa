import React, { useEffect, useState } from 'react';
import eye from '../../assets/icons/eye.png';
import closedEye from '../../assets/icons/closed-eye.png';
import '../../styles/utils.scss';

interface PasswordInputProps {
  placeholder: string;
  value: string;
  name: string;
  id: string;
  onChange: (e: any) => void;
}

const PasswordInput = ({
  placeholder,
  value,
  id,
  onChange,
  name,
}: PasswordInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    setIsPasswordVisible(false);
  }, [setIsPasswordVisible]);

  return (
    <div className='bg-white rounded-lg focus:border-blue border-3 border-transparent text-16 mb-18 transition duration-300 ease-in flex justify-between align-center'>
      <input
        type={isPasswordVisible ? 'text' : 'password'}
        className='text-input focus:outline-none p-10 md:p-20 bg-white w-full'
        id={id}
        placeholder={placeholder}
        name={name}
        autoComplete='new-password'
        onChange={onChange}
        value={value}
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
  );
};

export default PasswordInput;
