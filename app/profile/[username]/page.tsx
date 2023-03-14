import '../../styles/globals.scss';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../../database/sessions';
import { getUserByUsername } from '../../../database/users';
import Profile from './Profile';

type Props = { params: { username: string } };

export default async function ProfilePage({ params }: Props) {
  // check if there is a valid session
  const sessionTokenCookie = cookies().get('sessionToken');
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));
  // if there is, redirect to home page
  if (!session) {
    redirect('/');
  }
  // if not, render login form

  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }
  return (
    <>
      <img
        className="profile-picture"
        src={user.profilePicture}
        alt="User Profile"
      />
      <Profile user={user} sessionUser={session.user} />
      <h1>{user.username}</h1>
      <div>{user.email}</div>
    </>
  );
}
