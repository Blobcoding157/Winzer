'use client';

import '../../styles/RegisterForm.scss';
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
          value={role}
          onClick={() => {
            setRole(1); // 1 = winzer
          }}
          className="winzer"
        >
          Winzer
        </button>
        <button
          onClick={() => {
            setRole(0); // 0 = user
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
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          className="register-input"
          placeholder="password"
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          className="register-input"
          placeholder="email"
        />
      </div>
      <button className="sign-up-button">Sign up</button>
      <Link className="bottom-redirect" href="/login">
        got an account already?
      </Link>
    </form>
  );
}
