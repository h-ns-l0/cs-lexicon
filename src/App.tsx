import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CardsProvider } from './context/CardsContext';
import Home from './routes/Home';
import Learn from './routes/Learn';
import Review from './routes/Review';
import TermDetail from './routes/TermDetail';
import Stats from './routes/Stats';

export default function App() {
  return (
    <CardsProvider>
      <BrowserRouter>
        <nav style={{ padding: 16, borderBottom: '1px solid #ddd', display: 'flex', gap: 16 }}>
          <Link to="/">Home</Link>
          <Link to="/learn/data-structure">Learn</Link>
          <Link to="/review">Review</Link>
          <Link to="/stats">Stats</Link>
        </nav>
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