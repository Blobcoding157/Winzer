'use client';

import '../../styles/RegisterForm.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';
import { LoginResponseBodyPost } from '../../api/(auth)/login/route';

export default function LoginForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });

        const data: LoginResponseBodyPost = await response.json();

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
      <div className="input-container">
        <h2 className="input-welcome-message">Welcome Back</h2>
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
          className="register-input"
          placeholder="username"
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
        <div className="button-text">Sign In</div>
        <div className="fill-container" />
      </button>
      <Link className="bottom-redirect" href="/register">
        don't have an account?
      </Link>
    </form>
  );
}
