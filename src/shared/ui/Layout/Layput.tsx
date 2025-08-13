import { Outlet } from 'react-router-dom';
import { Footer, Header } from '@/widgets';

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-tr from-slate-900 via-indigo-900 to-fuchsia-900 text-white">
      <Header />
      <main className="flex-grow px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
