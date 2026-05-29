import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import AddTermModal from '../components/AddTermModal';

export default function TermDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useCards();
  const [editOpen, setEditOpen] = useState(false);

  const term = id ? state.terms[id] : undefined;

  if (!term) {
    return (
      <div className="detail-container">
        <p>용어를 찾을 수 없습니다.</p>
        <Link to="/" className="btn-secondary">홈으로</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`"${term.name}" 카드를 삭제할까요?`)) {
      dispatch({ type: 'DELETE_TERM', termId: term.id });
      navigate(`/learn/${term.category}`);
    }
  };

  const relatedTerms = term.related
    .map((rid) => state.terms[rid])
    .filter(Boolean);

  return (
    <div className="detail-container">
      <Link to={`/learn/${term.category}`} className="back-link">← 목록으로</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <h1>{term.name}</h1>
            {term.englishName && <p className="detail-english">{term.englishName}</p>}
          </div>
          <div className="detail-actions">
            <button className="btn-secondary" onClick={() => setEditOpen(true)}>편집</button>
            <button className="btn-danger" onClick={handleDelete}>삭제</button>
          </div>
        </div>

        <div className="detail-section">
          <div className="label">정의</div>
          <p>{term.definition}</p>
        </div>

        {term.complexity && (
          <div className="detail-section">
            <div className="label">시간복잡도</div>
            <p>{term.complexity}</p>
          </div>
        )}

        {term.keywords.length > 0 && (
          <div className="detail-section">
            <div className="label">키워드</div>
            <div>
              {term.keywords.map((kw) => (
                <span key={kw} className="tag">{kw}</span>
              ))}
            </div>
          </div>
        )}

        {term.example && (
          <div className="detail-section">
            <div className="label">예시</div>
            <pre className="detail-code">{term.example}</pre>
          </div>
        )}

        {relatedTerms.length > 0 && (
          <div className="detail-section">
            <div className="label">관련 용어</div>
            <div>
              {relatedTerms.map((rt) => (
                <Link key={rt.id} to={`/term/${rt.id}`} className="related-link">
                  {rt.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {editOpen && (
  <AddTermModal
    key={term.id}
    editTerm={term}
    onClose={() => setEditOpen(false)}
  />
)}
    </div>
  );
}