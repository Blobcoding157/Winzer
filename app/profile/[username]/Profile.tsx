'use client';
import '../../styles/globals.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile({ user, participations, sessionUser }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [aboutMeUpdate, setAboutMeUpdate] = useState('');
  const [profilePictureUpdate, setProfilePictureUpdate] = useState(false);
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [eventData, setEventData] = useState([]);
  const [participationData, setParticipationData] = useState(participations);
  const router = useRouter();

  console.log('participationData: ', participationData);

  const id = user.id;
  const query = 'getParticipationsByUser';
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('api/participation', {
        method: 'GET',
        body: JSON.stringify({ query, id }),
      });
      const jsonData = await response.json();
      setEventData(jsonData);
    };
    fetchData().catch((err) => console.log(err));
  }, []);

  async function handleOnSubmitInfo(event) {
    event.preventDefault();

    await fetch(`/api/profile/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: user.id,
        aboutMe: aboutMeUpdate,
      }),
    });
    router.refresh();
    setIsUpdating(!isUpdating);
  }

  async function handleOnSubmitPicture(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === 'file',
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'winzer-upload');

    const data = await fetch(
      'https://api.cloudinary.com/v1_1/winzer-images/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    ).then((r) => r.json());

    await fetch('/api/picture', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        profilePicture: data.secure_url,
      }),
    });

    setImageSrc(data.secure_url);
    setUploadData(data);

    router.refresh();
    setProfilePictureUpdate(!profilePictureUpdate);
  }

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };
    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  return (
    <div>
      <form
        method="post"
        onChange={handleOnChange}
        onSubmit={handleOnSubmitPicture}
      >
        <input placeholder="upload here" type="file" name="file" />
        {imageSrc && (
          <img
            className="profile-picture"
            alt="new Profile Selection"
            src={imageSrc}
          />
        )}

        {imageSrc && !uploadData && (
          <p>
            <button>Upload File</button>
          </p>
        )}
      </form>
      <div>
        <img className="profile-picture" alt="user" src={user.profilePicture} />
        <button onClick={() => setProfilePictureUpdate(true)}>
          edit profile Picture
        </button>
        <h1>{user.username}</h1>
        <div>{user.aboutMe}</div>
        <div>participating events: </div>

        {participationData.map((event) => {
          return (
            <div key={`key-${event.id}`}>
              <div>{event.id}</div>
              <div>{event.status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
