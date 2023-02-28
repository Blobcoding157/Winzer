import './RegisterForm.scss';
import Image from 'next/image';
import RegisterForm from './RegisterForm';

export default function Register() {
  return (
    <>
      <Image
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPkso6pBwACGgEie2Im0gAAAABJRU5ErkJggg=="
        placeholder="blur"
        src="/background1.avif"
        alt="Artistic Background Image"
        className="background-image"
        layout="fill"
        sizes="100vw"
        quality={100}
      />
      <div className="page-container">
        <RegisterForm />
      </div>
    </>
  );
}
