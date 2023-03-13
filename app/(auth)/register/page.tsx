import '../../styles/RegisterForm.scss';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import RegisterForm from './RegisterForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default async function RegisterPage(props: Props) {
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
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPkso6pBwACGgEie2Im0gAAAABJRU5ErkJggg=="
        placeholder="blur"
        src="/background1.jpg"
        alt="Artistic Background Image"
        className="background-image"
        layout="fill"
        sizes="100vw"
        quality={100}
      />
      <div className="page-container">
        <RegisterForm returnTo={props.searchParams.returnTo} />
      </div>
    </>
  );
}
