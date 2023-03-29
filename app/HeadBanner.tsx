'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeadBanner({ user }) {
  const [navSize, setnavSize] = useState('5rem');
  const [navColor, setnavColor] = useState('#311930');
  const [navLogo, setnavLogo] = useState('/winzer-icon.png');
  const [color, setColor] = useState('white');

  const listenScrollEvent = () => {
    window.scrollY > 50 ? setnavColor('#31193000') : setnavColor('#311930');
    window.scrollY > 50 ? setnavSize('4rem') : setnavSize('5rem');
    window.scrollY > 50
      ? setnavLogo('/winzer-icon-white.png')
      : setnavLogo('/winzer-icon.png');
    window.scrollY > 50 ? setColor('black') : setColor('white');
  };
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    return () => {
      window.removeEventListener('scroll', listenScrollEvent);
    };
  }, []);

  return (
    <header
      style={{
        backgroundColor: navColor,
        height: navSize,
        transition: 'all 1s',
      }}
      className="banner-container"
    >
      <Link href="/" style={{ color: color }} className="headerTitle">
        <img className="headerLogo" src={navLogo} alt="winzer-icon" />
        <h2>Winzer</h2>
      </Link>

      <nav className="bannerNavigation">
        {user ? (
          <>
            {user.roleId > 1 ? (
              <Link
                style={{ color: color }}
                href="/host"
                prefetch={false}
                className="navigationItem"
              >
                Host
              </Link>
            ) : (
              <div></div>
            )}

            <Link
              style={{ color: color }}
              href={`/profile/${user.username}`}
              className="navigationItem"
            >
              {user.username}
              <img
                className="profile-picture"
                alt="User Profile"
                src={user.profilePicture}
              />
            </Link>
            <Link
              style={{ color: color }}
              prefetch={false}
              href="/logout"
              className="logout"
            >
              Log out
            </Link>
          </>
        ) : (
          <>
            <Link
              style={{ color: color }}
              href="/login"
              className="navigationItem"
            >
              Log in
            </Link>

            <Link
              style={{ color: color }}
              href="/register"
              className="navigationItem"
            >
              Sign in
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
