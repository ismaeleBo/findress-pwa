import React from 'react';

interface ButtonPrimaryProps {
  disabled: boolean;
  type: 'button' | 'submit' | 'reset' | undefined;
  id: string;
  label: string;
}

const ButtonPrimary = ({ disabled, type, id, label }: ButtonPrimaryProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      id={id}
      className='bg-white text-yellow hover:bg-pink hover:text-black disabled:bg-white disabled:text-yellow disabled:opacity-20 rounded-lg py-10 px-20 font-heading font-bold transition duration-300'
    >
      {label}
    </button>
  );
};

export default ButtonPrimary;
