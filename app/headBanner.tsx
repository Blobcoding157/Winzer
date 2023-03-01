import './styles/headBanner.scss';
import Link from 'next/link';

export default function HeadBanner() {
  return (
    <div className="banner-container">
      <Link href="/" className="headerTitle">
        <img className="headerLogo" src="/winzer-icon.png" alt="winzer-icon" />
        <h2>Winzer</h2>
      </Link>
      <nav className="bannerNavigation">
        <div className="navigationItem">Host</div> /
        <div className="navigationItem">Log in</div> /
        <a href="/register" className="navigationItem">
          Sign in
        </a>
        /<div className="navigationItem">Profile</div>
      </nav>
    </div>
  );
}
