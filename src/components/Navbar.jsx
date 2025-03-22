import React from 'react';
import '../css/Navbar.scss';

const Navbar = () => {
  return (
    <nav>
      <h1>JeezyTv</h1>
      <ul>
        <li><a href="/">Accueil</a></li>
        {/* <li><a href="#">Chat</a></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
