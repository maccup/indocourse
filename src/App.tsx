import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, AudioPage } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audio" element={<AudioPage />} />
      </Routes>
    </BrowserRouter>
  );
}
