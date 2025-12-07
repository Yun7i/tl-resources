import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Add more routes here as needed */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
}
