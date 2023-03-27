'use client';
import '../../styles/globals.scss';
import '../../styles/profile.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile({
  user,
  hosting,
  participations,
  sessionUser,
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [aboutMeUpdate, setAboutMeUpdate] = useState('');
  const [profilePictureUpdate, setProfilePictureUpdate] = useState(false);
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [eventData, setEventData] = useState([]);
  const [participationData, setParticipationData] = useState(participations);
  const [hostingData, setHostingData] = useState(hosting);
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

  async function handleAboutMeChange(event) {
    event.preventDefault();

    await fetch(`/api/profile/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        aboutMe: aboutMeUpdate,
      }),
    });
    router.refresh();
  }

  return (
    <div className="page-container-container">
      <div className="page-container">
        <img
          alt="header"
          className="owner-profile-header"
          src="/gathering.jpeg"
        />
        <img
          className="owner-profile-picture"
          alt="user"
          src={user.profilePicture}
        />
        {sessionUser && sessionUser.userId === user.id && (
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
        )}

        <div className="profile-info-container">
          {/* <img className="profile-picture" alt="user" src={user.profilePicture} /> */}
          {/* <button onClick={() => setProfilePictureUpdate(true)}>
          edit profile Picture
        </button> */}
          <h1>{user.username}</h1>
          {sessionUser && sessionUser.userId === user.id && (
            <form method="put" onSubmit={handleAboutMeChange}>
              <input
                placeholder="about me"
                value={aboutMeUpdate}
                onChange={(event) => {
                  setAboutMeUpdate(event.target.value);
                }}
              />
              <button>Submit</button>
            </form>
          )}

          <div>AboutMe: {user.aboutMe}</div>

          <div>hosting events: </div>

          <div className="profile-events-container">
            {hostingData.map((event) => {
              return (
                <div className="profile-single-event" key={`key-${event.id}`}>
                  <div className="profile-event-header">
                    <img alt="" src={event.imgUrl} />
                  </div>
                  <div className="profile-event-host-picture-name-container">
                    <div className="profile-event-host-picture">
                      <img alt="" src={event.hostProfilePicture} />
                    </div>
                    <Link
                      href={`/profile/${event.hostUsername}`}
                      className="profile-event-host-name"
                    >
                      @{event.hostUsername}
                    </Link>
                  </div>
                  <div className="profile-event-info-container">
                    <div className="profile-event-title">{event.title}</div>

                    <div className="profile-event-date-time-container">
                      <div className="profile-event-date">
                        {event.eventDate}
                      </div>
                      <div className="profile-event-time">
                        {event.eventStart} - {event.eventEnd}
                      </div>
                    </div>
                    <div className="profile-event-description">
                      {event.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>participating events: </div>

          <div className="profile-events-container">
            {participationData.map((event) => {
              return (
                <div className="profile-single-event" key={`key-${event.id}`}>
                  <div className="profile-event-header">
                    <img alt="" src={event.imgUrl} />
                  </div>
                  <div className="profile-event-host-picture-name-container">
                    <div className="profile-event-host-picture">
                      <img alt="" src={event.profilePicture} />
                    </div>
                    <Link
                      href={`/profile/${event.username}`}
                      className="profile-event-host-name"
                    >
                      @{event.username}
                    </Link>
                  </div>
                  <div className="profile-event-info-container">
                    <div className="profile-event-title">{event.title}</div>

                    <div className="profile-event-date-time-container">
                      <div className="profile-event-date">
                        {event.eventDate}
                      </div>
                      <div className="profile-event-time">
                        {event.eventStart} - {event.eventEnd}
                      </div>
                    </div>
                    <div className="profile-event-description">
                      {event.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
