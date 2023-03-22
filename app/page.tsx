import './styles/hero.scss';
import './styles/globals.scss';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getEvents } from '../database/events';
import { getAllAttendingUserProfilePictures } from '../database/participations';
import { getUserBySessionToken } from '../database/users';
import Map from './map/map';

export default async function Home() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  const participations = await getAllAttendingUserProfilePictures();

  const events = await getEvents();

  return (
    <div className="hero-background">
      <div className="hero-container">
        <div className="hero-image-container">
          <Image
            priority
            src="/wine-scenery.gif"
            alt="Artistic Background Image"
            className="hero-image"
            width={4297}
            height={2865}
            quality={100}
          />
        </div>
        <div className="hero-text-container">
          <h1 className="hero-text-header">Winzer</h1>
          <h2 className="hero-text-slogan">
            Find your next wine tasting event
          </h2>
          <p className="hero-text">
            From intimate tastings to grand wine festivals, our platform
            connects like-minded enthusiasts and knowledgeable experts to
            explore the best wines from around the world. Join us today and
            uncork your passion for wine with Winzer!
          </p>
          <Link href="/register">
            <button className="get-started-button">Get Started</button>
          </Link>
        </div>
      </div>
      <div className="map-bg">
        <Map user={user} participations={participations} events={events} />
      </div>
      <h2 className="info-header">Your Wine Journey Starts here</h2>
      <div className="info-slogan">grow your Passion and Returns</div>
      <div className="info-container">
        <div className="info-box-container">
          <div className="info-box-image-container">
            <img
              className="info-box-image"
              alt="visibility"
              src="/visibility.png"
            />
          </div>
          <h3 className="info-box-header">Increased Visibility</h3>
          <div className="info-box-text">
            your event will be listed on a platform that is specifically
            designed for wine enthusiasts and to potential attendees who are
            interested in wine and are actively looking for wine events to
            attend.
          </div>
        </div>
        <div className="info-box-container">
          <div className="info-box-image-container">
            <img
              className="info-box-image"
              alt="networking"
              src="/networking.png"
            />
          </div>
          <h3 className="info-box-header">Networking Opportunity</h3>
          <div className="info-box-text">
            Winzer facilitates networking between attendees and exhibitors.This
            will help to create a more engaging and interactive experience for
            attendees, as well as provide opportunities for hosts to connect
            with potential customers and partners.
          </div>
        </div>
        <div className="info-box-container">
          <div className="info-box-image-container">
            <img className="info-box-image" alt="Access" src="/Access.png" />
          </div>
          <h3 className="info-box-header">Easy Access to Events near you</h3>
          <div className="info-box-text">
            Winzer provides you with easy access to all the information you need
            about your next event, including dates, times, location, and host
            details.
          </div>
        </div>
        <div className="info-box-container">
          <div className="info-box-image-container">
            <img
              className="info-box-image"
              alt="Personalize"
              src="/personalize.png"
            />
          </div>
          <h3 className="info-box-header">Personalize</h3>
          <div className="info-box-text">
            Profile personalization allows you to create a customized profile
            that reflects your personal preferences, interests, and tastes.This
            feature provides a more engaging and relevant experience for
            everyone.
          </div>
        </div>
      </div>
    </div>
  );
}
