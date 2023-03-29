import './styles/globals.scss';
import './styles/headBanner.scss';
import { cookies } from 'next/headers';
import { getUserBySessionToken } from '../database/users';
import CookieBanner from './CookieBanner';
import HeadBanner from './HeadBanner';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <HeadBanner user={user} />
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
