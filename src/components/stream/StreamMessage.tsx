import React from 'react';
import logo from '../../assets/jeezy.png'; // Correctly import the logo image

const StreamMessage: React.FC = () => (
  <div className="stream-message">
    {/* <h1>JeezyTV</h1> */}
  <img src={logo} alt="" width="255px" />
    <p>La chaine n'est pas en direct pour le moment.</p>
    </div>
);

export default StreamMessage;
