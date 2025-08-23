import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-xl bg-white/20"
            aria-hidden
            data-testid="logo"
          />
          <span className="text-lg font-bold text-white tracking-wide">
            Formify
          </span>
        </div>
        <nav className="hidden gap-6 text-white/80 sm:flex">
          <Link to="/" className="transition-colors hover:text-white">
            Home
          </Link>

          <Link to="/about" className="transition-colors hover:text-white">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};
