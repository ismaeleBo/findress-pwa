import React, { useEffect, useState } from 'react';
import { useTypedSelector } from '../../store/hooks';
import { capitalizeFirstLetter } from '../../utils';

const Home = () => {
  const { user } = useTypedSelector((state) => state.user);

  const [loggedUser, setLoggedUser] = useState('');

  useEffect(() => {
    if (user.isLogged && user.username) {
      setLoggedUser(capitalizeFirstLetter(user.username));
      return;
    }
    setLoggedUser('');
  }, [user, setLoggedUser]);

  return (
    <div className='text-white h-screen z-0'>
      <div className='flex flex-col justify-center text-black items-center'>
        {loggedUser ? (
          <>
            <h2 className='mb-20'>Benvenuto {loggedUser}!</h2>
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
