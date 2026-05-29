import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { CardsProvider } from './context/CardsContext';
import Home from './routes/Home';
import Learn from './routes/Learn';
import Review from './routes/Review';
import TermDetail from './routes/TermDetail';
import Stats from './routes/Stats';

function Nav() {
  const { pathname } = useLocation();

  const isActive = (path: string): boolean => {
    if (path === '/') return pathname === '/';
    if (path === '/learn') return pathname.startsWith('/learn') || pathname.startsWith('/term');
    return pathname.startsWith(path);
  };

  return (
    <nav className="main-nav">
      <Link to="/" className="nav-brand">CS Lexicon</Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/learn/data-structure" className={`nav-link ${isActive('/learn') ? 'active' : ''}`}>Learn</Link>
        <Link to="/review" className={`nav-link ${isActive('/review') ? 'active' : ''}`}>Review</Link>
        <Link to="/stats" className={`nav-link ${isActive('/stats') ? 'active' : ''}`}>Stats</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <CardsProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn/:category" element={<Learn />} />
          <Route path="/review" element={<Review />} />
          <Route path="/term/:id" element={<TermDetail />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </CardsProvider>
  );
}