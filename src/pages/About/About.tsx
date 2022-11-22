import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const About = () => {
  const [message, setMessage] = useState('');
  const { number } = useParams();

  useEffect(() => {
    console.log(number);

    if (number) {
      setMessage(`The number is ${number}`);
    } else {
      setMessage('No number was provided');
    }
  }, [number]);

  return (
    <div className='text-white'>
      <p>THIS IS ABOUT</p>
      <p>{message}</p>
    </div>
  );
};

export default About;
