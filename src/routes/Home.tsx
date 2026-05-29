import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import type { Category } from '../types';

const categoryLabels: Record<Category, string> = {
  'data-structure': '자료구조',
  'algorithm': '알고리즘',
  'os': '운영체제',
  'network': '네트워크',
  'database': '데이터베이스',
  'design-pattern': '디자인패턴',
};

export default function Home() {
  const { state } = useCards();
  const [now] = useState(() => Date.now());

  const summary = useMemo(() => {
    const terms = Object.values(state.terms);
    const totalTerms = terms.length;
    const totalReviews = state.history.length;

    // 오늘 복습할 카드 수
    const dueCount = terms.filter((t) => {
      const srs = state.srs[t.id];
      return srs && srs.nextReviewAt <= now;
    }).length;

    // 카테고리별 카드 수
    const byCategory: Record<string, number> = {};
    terms.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1;
    });

    // 정답률
    const correct = state.history.filter((r) => r.difficulty !== 'unknown').length;
    const accuracy = totalReviews > 0 ? Math.round((correct / totalReviews) * 100) : 0;

    return { totalTerms, totalReviews, dueCount, byCategory, accuracy };
  }, [state.terms, state.history, state.srs, now]);

  return (
    <div className="home-container">
      {/* 헤로 */}
      <div className="home-hero">
        <h1>CS Lexicon</h1>
        <p>망각곡선 기반 CS 용어 학습 도구</p>
      </div>

      {/* 오늘의 복습 CTA */}
      {summary.dueCount > 0 ? (
        <Link to="/review" className="home-cta">
          <div>
            <div className="cta-title">오늘 복습할 카드가 있어요</div>
            <div className="cta-sub">{summary.dueCount}장 대기 중 · 지금 시작하세요</div>
          </div>
          <span className="cta-arrow">→</span>
        </Link>
      ) : (
        <div className="home-cta home-cta-empty">
          <div>
            <div className="cta-title">오늘은 복습 끝! 🎉</div>
            <div className="cta-sub">새 카드를 추가하거나 통계를 확인해보세요</div>
          </div>
        </div>
      )}

      {/* 요약 통계 3개 */}
      <div className="home-stats">
        <div className="home-stat">
          <div className="home-stat-value">{summary.totalTerms}</div>
          <div className="home-stat-label">등록된 용어</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">{summary.totalReviews}</div>
          <div className="home-stat-label">총 복습 횟수</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">{summary.accuracy}%</div>
          <div className="home-stat-label">정답률</div>
        </div>
      </div>

      {/* 카테고리별 바로가기 */}
      <div className="home-section">
        <h3>카테고리</h3>
        <div className="home-categories">
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <Link key={cat} to={`/learn/${cat}`} className="home-category-card">
              <div className="home-cat-name">{categoryLabels[cat]}</div>
              <div className="home-cat-count">{summary.byCategory[cat] || 0}장</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}