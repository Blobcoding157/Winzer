import '../../styles/globals.scss';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getEventsByUser } from '../../../database/events';
import { getParticipationsByUser } from '../../../database/participations';
import { getValidSessionByToken } from '../../../database/sessions';
import { getUserByUsername } from '../../../database/users';
import Profile from './Profile';

export default async function ProfilePage({ params }: any) {
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

  let participations: any = [];
  let hosting: any = [];

  if (user) {
    participations = await getParticipationsByUser(user.id);
    hosting = await getEventsByUser(user.id);
  }

  if (!user) {
    return notFound();
  }

  return (
    <Profile
      user={user}
      hosting={hosting}
      participations={participations}
      sessionUser={session}
    />
  );
}
