import './styles/hero.scss';
import './styles/globals.scss';
import Image from 'next/image';
import Map from './map/map';

export default function Home() {
  return (
    <div>
      <div className="hero-container">
        <div className="hero-img">
          <Image
            src="/gathering.jpeg"
            alt="Artistic Background Image"
            className="hero-image"
            width={800}
            height={600}
            layout="responsive"
          />
        </div>
        <div className="hero-text-container">
          <h1 className="hero-text-header">Winzer</h1>
          <h2 className="hero-text-slogan">
            Find your next wine tasting event
          </h2>
          <p className="hero-text-">
            From intimate tastings to grand wine festivals, our platform
            connects like-minded enthusiasts and knowledgeable experts to
            explore the best wines from around the world. Join us today and
            uncork your passion for wine with Winzer!
          </p>
        </div>
      </div>
      <Map />
    </div>
  );
}
