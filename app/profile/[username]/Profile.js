/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import '../../styles/globals.scss';
import '../../styles/profile.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Profile({
  user,
  hosting,
  participations,
  sessionUser,
}) {
  const [aboutMeUpdate, setAboutMeUpdate] = useState('');
  const [profilePictureUpdate, setProfilePictureUpdate] = useState(false);
  const [profileHeaderUpdate, setProfileHeaderUpdate] = useState(false);
  const [imageSrc, setImageSrc] = useState();
  const [headerImageSrc, setHeaderImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [uploadHeaderData, setUploadHeaderData] = useState();
  const [participationData, setParticipationData] = useState(participations);
  const [hostingData, setHostingData] = useState(hosting);
  const router = useRouter();

  async function handleOnSubmitProfilePicture(event) {
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

    await fetch('/api/profile/picture/profilePicture', {
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

  async function handleOnSubmitProfileHeader(event) {
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

    await fetch('/api/profile/picture/header', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        profileHeader: data.secure_url,
      }),
    });

    setHeaderImageSrc(data.secure_url);
    setUploadHeaderData(data);

    router.refresh();
    setProfileHeaderUpdate(!profileHeaderUpdate);
  }

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };
    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  function handleOnChangeHeader(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setHeaderImageSrc(onLoadEvent.target.result);
      setUploadHeaderData(undefined);
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
    <div className="profile-page-container-container">
      <div className="profile-page-container">
        <img
          alt="header"
          className="owner-profile-header"
          src={user.profileHeader}
        />
        {sessionUser && sessionUser.userId === user.id && (
          <form
            method="post"
            onChange={handleOnChangeHeader}
            onSubmit={handleOnSubmitProfileHeader}
          >
            <div className="header-image-upload">
              <label htmlFor="header-file-input">
                <img alt="Edit profile Header" src="/edit-button.png" />
              </label>
              <input
                id="header-file-input"
                className="header-file-input"
                type="file"
                name="file"
              />
            </div>
            {headerImageSrc && !uploadHeaderData && (
              <p>
                <button className="header-file-button">
                  Upload Profile Banner
                </button>
              </p>
            )}
          </form>
        )}
        <img
          className="owner-profile-picture"
          alt="user"
          src={user.profilePicture}
        />
        {sessionUser && sessionUser.userId === user.id && (
          <form
            method="post"
            onChange={handleOnChange}
            onSubmit={handleOnSubmitProfilePicture}
          >
            <div className="profile-image-upload">
              <label htmlFor="profile-file-input">
                <img alt="Edit profilePicture" src="/edit-button.png" />
              </label>
              <input
                id="profile-file-input"
                className="profile-file-input"
                type="file"
                name="file"
              />
            </div>
            {imageSrc && !uploadData && (
              <p>
                <button className="profile-upload-profile-picture-button">
                  Upload Profile Picture
                </button>
              </p>
            )}
          </form>
        )}
        <div className="profile-info-container">
          <h2 className="profile-username">{user.username}</h2>
          {sessionUser && sessionUser.userId === user.id && (
            <form method="put" onSubmit={handleAboutMeChange}>
              <input
                className="profile-about-me-input"
                placeholder="update your about me"
                value={aboutMeUpdate}
                onChange={(event) => {
                  setAboutMeUpdate(event.target.value);
                }}
              />
              <button className="profile-submit-button">Submit</button>
            </form>
          )}

          {user.aboutMe ? (
            <div className="profile-about-me-container">
              AboutMe: <div className="profile-about-me">{user.aboutMe}</div>{' '}
            </div>
          ) : null}

          {hostingData ? (
            <h3 className="profile-hosting-participating"> hosting events: </h3>
          ) : null}

          <div className="profile-events-container">
            {hostingData.map((event) => {
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

          {hostingData ? (
            <h3 className="profile-hosting-participating">
              participating events:
            </h3>
          ) : null}

          <div className="profile-events-container">
            {participationData.map((event) => {
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
        </div>
      </div>
    </div>
  );
}
