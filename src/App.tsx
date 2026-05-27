import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 border-b flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/learn/data-structure">Learn</Link>
        <Link to="/review">Review</Link>
        <Link to="/stats">Stats</Link>
      </nav>
      <Routes>
        <Route path="/" element={<div className="p-8">CS Lexicon</div>} />
        <Route path="/learn/:category" element={<div className="p-8">Learn</div>} />
        <Route path="/review" element={<div className="p-8">Review</div>} />
        <Route path="/term/:id" element={<div className="p-8">Term Detail</div>} />
        <Route path="/stats" element={<div className="p-8">Stats</div>} />
      </Routes>
    </BrowserRouter>
  );
}