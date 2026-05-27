import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { seedTerms } from '../lib/seed';
import TermCard from '../components/TermCard';
import CategoryNav from '../components/CategoryNav';
import type { Category } from '../types';

export default function Learn() {
  const { category } = useParams<{ category: string }>();
  const { state, dispatch } = useCards();

  // 첫 진입 시 시드 데이터를 한 번만 주입 (이미 있으면 스킵)
  useEffect(() => {
    if (Object.keys(state.terms).length === 0) {
      seedTerms.forEach((term) => {
        dispatch({ type: 'ADD_TERM', term });
      });
    }
  }, [state.terms, dispatch]);

  // 현재 카테고리의 카드만 추려내기 — 비싼 연산이라 useMemo
  const filteredTerms = useMemo(() => {
    return Object.values(state.terms).filter(
      (t) => t.category === (category as Category)
    );
  }, [state.terms, category]);

  return (
    <div className="app-layout">
      <CategoryNav />
      <main className="content">
        <h2>{category} 카테고리</h2>
        <p style={{ color: '#6b7280' }}>
          총 {filteredTerms.length}개 카드
        </p>
        <div className="card-grid">
          {filteredTerms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </div>
        {filteredTerms.length === 0 && (
          <p style={{ marginTop: 24, color: '#9ca3af' }}>
            이 카테고리에는 아직 카드가 없습니다.
          </p>
        )}
      </main>
    </div>
  );
}