import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, AudioPage, PrivacyPolicyPage, TermsPage } from './pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
