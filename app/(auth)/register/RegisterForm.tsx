'use client';

import '../../styles/RegisterForm.scss';

export default function RegisterForm() {
  return (
    <div className="register-container">
      <div className="winzer-user-container">
        <button className="winzer">Winzer</button>
        <button className="user">User</button>
      </div>
      <div className="input-container">
        <input className="register-input" placeholder="username" />
        <input className="register-input" placeholder="password" />
        <input className="register-input" placeholder="email" />
      </div>
      <button className="sign-up-button">Sign up</button>
    </div>
  );
}
