import React from 'react';
import { useSelectUser } from '../../store/selectors';
import { capitalizeFirstLetter } from '../../utils';

const Home = () => {
  const user = useSelectUser();

  return (
    <div className='text-white h-screen z-0'>
      <div className='flex flex-col justify-center text-black items-center'>
        {user.isLogged ? (
          <>
            <h2 className='mb-20'>
              Benvenuto {capitalizeFirstLetter(user.username)}!
            </h2>
            <button className='bg-white text-black rounded-lg py-10 px-20'>
              Area riservata
            </button>
          </>
        ) : (
          <>
            <h2 className='mb-20'>Welcome at home</h2>
            <button className='bg-white text-black rounded-lg py-10 px-20'>
              Inizia ora!
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
