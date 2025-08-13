import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center  text-white">
      <div className="mx-auto  max-w-6xl">
        <h1 className="text-9xl font-extrabold drop-shadow-lg">404</h1>
        <p className="mt-4 text-2xl font-semibold">Oops! Page not found</p>
        <p className="mt-2 max-w-md text-center text-white/90">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link to="/" className="mt-6">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};
