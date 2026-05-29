import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { useDebounce } from '../hooks/useDebounce';
import { seedTerms } from '../lib/seed';
import TermCard from '../components/TermCard';
import CategoryNav from '../components/CategoryNav';
import SearchBar from '../components/SearchBar';
import AddTermModal from '../components/AddTermModal';
import type { Category } from '../types';

export default function Learn() {
  const { category } = useParams<{ category: string }>();
  const { state, dispatch } = useCards();

  const [searchInput, setSearchInput] = useState('');
  const debouncedQuery = useDebounce(searchInput, 300);
  const [modalOpen, setModalOpen] = useState(false);

  // 첫 진입 시 시드 데이터 주입 (이미 있으면 스킵)
  useEffect(() => {
    if (Object.keys(state.terms).length === 0) {
      seedTerms.forEach((term) => {
        dispatch({ type: 'ADD_TERM', term });
      });
    }
  }, [state.terms, dispatch]);

  // 카테고리 + 검색어로 필터링 (비싼 연산 → useMemo)
  const filteredTerms = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    return Object.values(state.terms).filter((t) => {
      if (t.category !== (category as Category)) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        (t.englishName?.toLowerCase().includes(q) ?? false) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [state.terms, category, debouncedQuery]);

  return (
    <div className="app-layout">
      <CategoryNav />
      <main className="content">
        <div className="learn-header">
          <h2>{category} 카테고리</h2>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>
            + 새 용어 추가
          </button>
        </div>

        <SearchBar value={searchInput} onChange={setSearchInput} />

        <p style={{ color: '#6b7280', marginTop: 12 }}>
          총 {filteredTerms.length}개 카드
          {debouncedQuery && ` (검색어: "${debouncedQuery}")`}
        </p>

        <div className="card-grid">
          {filteredTerms.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <p style={{ marginTop: 24, color: '#9ca3af' }}>
            {debouncedQuery
              ? '검색 결과가 없습니다.'
              : '이 카테고리에는 아직 카드가 없습니다. 위 버튼으로 추가해보세요.'}
          </p>
        )}

{modalOpen && (
  <AddTermModal
    key={`add-${category}`}
    defaultCategory={category as Category}
    onClose={() => setModalOpen(false)}
  />
)}
      </main>
    </div>
  );
}