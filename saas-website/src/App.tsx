import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ExamPage from './pages/ExamPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Exam page — full screen, no navbar */}
        <Route path="/take/:formId" element={<ExamPage />} />

        {/* Regular pages with navbar */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
