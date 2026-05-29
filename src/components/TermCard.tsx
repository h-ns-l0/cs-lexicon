import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Term } from '../types';

// 🔑 자료 요구사항 "TypeScript를 1개 이상의 컴포넌트에 적용"의 모범 충족
interface TermCardProps {
  term: Term;
  onClick?: (term: Term) => void;
}

export default function TermCard({ term, onClick }: TermCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    setFlipped((prev) => !prev);
    onClick?.(term);
  };

  return (
    <div
      className={`term-card ${flipped ? 'flipped' : ''}`}
      onClick={handleClick}
    >
      <div className="term-card-inner">
        {/* 앞면 */}
        <div className="term-card-front">
          <div>
            <span className="category">{term.category}</span>
            <h3>{term.name}</h3>
            {term.englishName && (
              <div className="english">{term.englishName}</div>
            )}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>탭하면 뒤집힙니다</div>
        </div>

        {/* 뒷면 */}
        <div className="term-card-back">
          <div className="label">정의</div>
          <div>{term.definition}</div>

          {term.complexity && (
            <>
              <div className="label">시간복잡도</div>
              <div>{term.complexity}</div>
            </>
          )}

          {term.keywords.length > 0 && (
            <>
              <div className="label">키워드</div>
              <div>
                {term.keywords.map((kw) => (
                  <span key={kw} className="tag">{kw}</span>
                ))}
              </div>
            </>
          )}

          {term.example && (
            <>
              <div className="label">예시</div>
              <code>{term.example}</code>
            </>
          )}
          <Link
            to={`/term/${term.id}`}
            className="detail-link"
            onClick={(e) => e.stopPropagation()}
          >
            상세 / 편집 →
          </Link>
        </div>
      </div>
    </div>
  );
}