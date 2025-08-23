import { Routes, Route } from 'react-router-dom';

import { Layout } from '@/shared/ui';
import { About, Home, NotFoundPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="404-not-found" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
