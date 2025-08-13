import { Link } from 'react-router-dom';
import logo from '@/assets/logo-rsschool3.png';

export const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 backdrop-blur">
      {/* Desktop */}
      <div
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3"
        data-testid="footer-desktop"
      >
        <Link
          to="https://github.com/NatashaSolntseva"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-white"
          data-testid="github-desktop"
        >
          GitHub
        </Link>

        <div
          data-testid="copyright-desktop"
          className="text-sm tracking-wide text-white/80"
        >
          © 2025 Formify
        </div>

        <Link
          to="https://app.rs.school/"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="rsschool-desktop"
          className="group"
        >
          <img
            src={logo}
            alt="RS School"
            className="h-6 transition-transform duration-200 invert group-hover:scale-110"
          />
        </Link>
      </div>

      {/* Mobile */}
      <div
        className="flex flex-col items-center gap-3 px-4 py-4 sm:hidden"
        data-testid="footer-mobile"
      >
        <div className="flex w-full justify-between">
          <Link
            to="https://github.com/NatashaSolntseva"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-white"
            data-testid="github-mobile"
          >
            GitHub
          </Link>

          <Link
            to="https://app.rs.school/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="rsschool-mobile"
            className="group"
          >
            <img
              src={logo}
              alt="RS School"
              className="h-6 transition-transform duration-200 invert group-hover:scale-110"
            />
          </Link>
        </div>

        <div
          data-testid="copyright-mobile"
          className="text-sm tracking-wide text-white/80"
        >
          © 2025 Formify
        </div>
      </div>
    </footer>
  );
};
