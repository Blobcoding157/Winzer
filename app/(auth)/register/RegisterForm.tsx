'use client';

import '../../styles/RegisterForm.scss';
import '../../styles/globals.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';
import { RegisterResponseBodyPost } from '../../api/(auth)/register/route';

export default function RegisterForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(0);
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();
  const profilePicture = '/default-profile-picture.png';
  const profileHeader = '/default-header.webp';

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const response = await fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({
            username,
            email,
            profilePicture,
            profileHeader,
            role,
            password,
          }),
        });

        const data: RegisterResponseBodyPost = await response.json();

        if ('errors' in data) {
          setErrors(data.errors);
          return;
        }

        const returnTo = getSafeReturnToPath(props.returnTo);

        if (returnTo) {
          router.push(returnTo);
          return;
        }

        router.replace(`/profile/${data.user.username}`);
        router.refresh();
      }}
      className="register-container"
    >
      {errors.map((error) => (
        <div key={`error-${error.message}`}>Error: {error.message}</div>
      ))}
      <div className="winzer-user-container">
        <button
          type="button"
          value={role}
          onClick={() => {
            setRole(2); // 1 = winzer
          }}
          className="winzer"
        >
          Winzer
        </button>
        <button
          type="button"
          value={role}
          onClick={() => {
            setRole(1); // 0 = user
          }}
          className="user"
        >
          User
        </button>
      </div>
      <div className="input-container">
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          className="register-input"
          placeholder="username"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          className="register-input"
          placeholder="email"
        />
        <input
          value={password}
          type="password"
          onChange={(event) => setPassword(event.currentTarget.value)}
          className="register-input"
          placeholder="password"
        />
      </div>
      <button className="sign-up-button">
        <div className="button-text">Sign Up</div>
        <div className="fill-container" />
      </button>
      <Link className="bottom-redirect" href="/login">
        got an account already?
      </Link>
    </form>
  );
}
