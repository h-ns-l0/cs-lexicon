import { useState } from 'react';
import { useCards } from '../hooks/useCards';
import type { Term, Category } from '../types';

interface AddTermModalProps {
  defaultCategory?: Category;
  editTerm?: Term;            // 있으면 편집 모드, 없으면 추가 모드
  onClose: () => void;
}

const categoryOptions: { value: Category; label: string }[] = [
  { value: 'data-structure', label: '자료구조' },
  { value: 'algorithm', label: '알고리즘' },
  { value: 'os', label: '운영체제' },
  { value: 'network', label: '네트워크' },
  { value: 'database', label: '데이터베이스' },
  { value: 'design-pattern', label: '디자인 패턴' },
];

export default function AddTermModal({ defaultCategory, editTerm, onClose }: AddTermModalProps) {
  const { dispatch } = useCards();

  // editTerm이 있으면 그 값으로, 없으면 빈 값으로 초기화
  // (호출부에서 key를 주므로, 다른 카드를 편집할 때마다 컴포넌트가 새로 마운트되어 재초기화됨)
  const [name, setName] = useState(editTerm?.name ?? '');
  const [englishName, setEnglishName] = useState(editTerm?.englishName ?? '');
  const [category, setCategory] = useState<Category>(
    editTerm?.category ?? defaultCategory ?? 'data-structure'
  );
  const [definition, setDefinition] = useState(editTerm?.definition ?? '');
  const [complexity, setComplexity] = useState(editTerm?.complexity ?? '');
  const [keywords, setKeywords] = useState(editTerm?.keywords.join(', ') ?? '');
  const [example, setExample] = useState(editTerm?.example ?? '');

  const handleSubmit = () => {
    if (!name.trim() || !definition.trim()) {
      alert('용어 이름과 정의는 필수입니다');
      return;
    }

    const term: Term = {
      id: editTerm ? editTerm.id : `user-${Date.now()}`,
      name: name.trim(),
      englishName: englishName.trim() || undefined,
      category,
      definition: definition.trim(),
      complexity: complexity.trim() || undefined,
      keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
      example: example.trim() || undefined,
      related: editTerm ? editTerm.related : [],
      createdAt: editTerm ? editTerm.createdAt : Date.now(),
    };

    dispatch({ type: editTerm ? 'UPDATE_TERM' : 'ADD_TERM', term });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{editTerm ? '용어 편집' : '새 용어 추가'}</h2>
        <div className="modal-form">
          <label>
            <span>용어 이름 *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <span>영어 이름</span>
            <input value={englishName} onChange={(e) => setEnglishName(e.target.value)} />
          </label>
          <label>
            <span>카테고리</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>정의 *</span>
            <textarea value={definition} onChange={(e) => setDefinition(e.target.value)} rows={3} />
          </label>
          <label>
            <span>시간복잡도</span>
            <input value={complexity} onChange={(e) => setComplexity(e.target.value)} placeholder="예: O(log n)" />
          </label>
          <label>
            <span>키워드 (쉼표로 구분)</span>
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="예: 노드, 포인터" />
          </label>
          <label>
            <span>예시 코드</span>
            <textarea value={example} onChange={(e) => setExample(e.target.value)} rows={2} />
          </label>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">취소</button>
          <button onClick={handleSubmit} className="btn-primary">
            {editTerm ? '저장' : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
}