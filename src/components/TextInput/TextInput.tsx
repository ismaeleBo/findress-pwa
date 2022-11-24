import React from 'react';
import '../../styles/utils.scss';

interface TextInputProps {
  type: string;
  id: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
}

const TextInput = ({
  type,
  id,
  placeholder,
  name,
  value,
  onChange,
}: TextInputProps) => {
  return (
    <input
      type={type}
      className='text-input bg-white rounded-lg focus:border-blue border-3 border-transparent p-10 md:p-20 focus:outline-none text-16 mb-18 transition duration-300 ease-in'
      id={id}
      placeholder={placeholder}
      name={name}
      autoComplete='off'
      onChange={onChange}
      value={value}
    />
  );
};

export default TextInput;
