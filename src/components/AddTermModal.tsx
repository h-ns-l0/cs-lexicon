import { useState } from 'react';
import { useCards } from '../hooks/useCards';
import type { Term, Category } from '../types';

interface AddTermModalProps {
  open: boolean;
  defaultCategory?: Category;
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

export default function AddTermModal({ open, defaultCategory, onClose }: AddTermModalProps) {
  const { dispatch } = useCards();
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory || 'data-structure');
  const [definition, setDefinition] = useState('');
  const [complexity, setComplexity] = useState('');
  const [keywords, setKeywords] = useState('');
  const [example, setExample] = useState('');

  if (!open) return null;

  const reset = () => {
    setName(''); setEnglishName(''); setDefinition('');
    setComplexity(''); setKeywords(''); setExample('');
  };

  const handleSubmit = () => {
    if (!name.trim() || !definition.trim()) {
      alert('용어 이름과 정의는 필수입니다');
      return;
    }

    const term: Term = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      englishName: englishName.trim() || undefined,
      category,
      definition: definition.trim(),
      complexity: complexity.trim() || undefined,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      example: example.trim() || undefined,
      related: [],
      createdAt: Date.now(),
    };

    dispatch({ type: 'ADD_TERM', term });
    reset();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>새 용어 추가</h2>
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
          <button onClick={handleSubmit} className="btn-primary">추가</button>
        </div>
      </div>
    </div>
  );
}