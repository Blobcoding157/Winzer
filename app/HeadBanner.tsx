'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = {
  id: number;
  username: string;
  profilePicture: string;
  roleId: number;
};

export default function HeadBanner({ user }: { user: User }) {
  const [navSize, setNavSize] = useState('5rem');
  const [navColor, setNavColor] = useState('#311930');
  const [navLogo, setNavLogo] = useState('/winzer-icon.png');
  const [color, setColor] = useState('white');
  const [blur, setBlur] = useState('0px');
  const [titleShadow, setTitleShadow] = useState(
    '#70051b 0.2rem 0.2rem 0.2rem',
  );

  const listenScrollEvent = () => {
    window.scrollY > 50 ? setNavColor('#69376727') : setNavColor('#311930');
    window.scrollY > 50 ? setNavSize('4rem') : setNavSize('5rem');
    window.scrollY > 50
      ? setNavLogo('/winzer-icon-white.png')
      : setNavLogo('/winzer-icon.png');

    window.scrollY > 50 ? setColor('black') : setColor('white');
    window.scrollY > 50 ? setBlur('2px') : setBlur('0px');
    window.scrollY > 50
      ? setTitleShadow('none')
      : setTitleShadow('#70051b 0.2rem 0.2rem 0.2rem');
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
        backdropFilter: `blur(${blur})`,
      }}
      className="banner-container"
    >
      <Link
        href="/"
        style={{ color: color, textShadow: titleShadow }}
        className="headerTitle"
      >
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
              <div />
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
