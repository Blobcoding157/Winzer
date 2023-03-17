import './styles/globals.scss';
import './styles/headBanner.scss';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getUserBySessionToken } from '../database/users';
import CookieBanner from './CookieBanner';

export const metadata = {
  title: 'Winzer',
  description: 'To connect and enjoy the good things in life',
  icons: '/winzer-icon-black.png',
};

type Props = {
  children: React.ReactNode;
};

export const dynamic = 'force-dynamic';

export default async function RootLayout(props: Props) {
  // 1. get the session token from the cookie
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  // 2. validate that session
  // 3. get the user profile matching the session
  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  // if user is not undefined, the person is logged in
  // if user is undefined, the person is logged out

  return (
    <html lang="en">
      <body>
        <header className="banner-container">
          <Link href="/" className="headerTitle">
            <img
              className="headerLogo"
              src="/winzer-icon.png"
              alt="winzer-icon"
            />
            <h2>Winzer</h2>
          </Link>

          <nav className="bannerNavigation">
            {user ? (
              <>
                <Link href="/host" prefetch={false} className="navigationItem">
                  Host
                </Link>
                <Link
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
                <Link prefetch={false} href="/logout" className="logout">
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="navigationItem">
                  Log in
                </Link>
                <Link href="/register" className="navigationItem">
                  Sign in
                </Link>
              </>
            )}
          </nav>
        </header>
        {props.children}
        <footer className="footer">
          <div className="footer-elements"> @Patrik Productions </div>
          <CookieBanner />
          <br />
        </footer>
      </body>
    </html>
  );
}
