import classNames from 'classnames';
import React from 'react';
import './Menu.scss';

interface MenuProps {
  isVisible: boolean;
}

const Menu = ({ isVisible }: MenuProps) => {
  return (
    <div
      className={classNames({
        menu: true,
        'menu-active': isVisible,
      })}
    >
      <div className='bg-purple'>
        <div className='flex flex-col text-white py-24 pl-24'>
          <span>Chi siamo</span>
          <span>Contatti</span>
          <span>Vision</span>
          <span>Partner</span>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Menu;
