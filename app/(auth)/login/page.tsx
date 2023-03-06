import '../../styles/RegisterForm.scss';
import Image from 'next/image';
import LoginForm from './LoginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default function LoginPage(props: Props) {
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
        <LoginForm returnTo={props.searchParams.returnTo} />
      </div>
    </>
  );
}
