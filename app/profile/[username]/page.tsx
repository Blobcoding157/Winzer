import { notFound } from 'next/navigation';
import { getUserByUsername } from '../../../database/users';

type Props = { params: { username: string } };

export default async function ProfilePage({ params }: Props) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }
  return (
    <>
      <h1>{user.username}</h1>
      <div>{user.id}</div>
    </>
  );
}
