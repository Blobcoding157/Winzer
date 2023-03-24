import '../../styles/RegisterForm.scss';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import LoginForm from './LoginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default async function LoginPage(props: Props) {
  // check if i have a valid session
  const sessionTokenCookie = cookies().get('sessionToken');
  // console.log(sessionTokenCookie);

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // if yes redirect to home
  if (session) {
    redirect('/');
  }

  return (
    <>
      <Image
        src="/wine-scenery.gif"
        alt="Artistic Background Image"
        className="background-image"
        layout="fill"
        sizes="100vw"
        quality={100}
      />
      <div className="page-container">
        <LoginForm returnTo={props.searchParams.returnTo} />
      </div>
    </>
  );
}
