import { NavLink } from 'react-router-dom';
import type { Category } from '../types';

interface CategoryItem {
  key: Category;
  label: string;
}

const categories: CategoryItem[] = [
  { key: 'data-structure', label: '자료구조' },
  { key: 'algorithm', label: '알고리즘' },
  { key: 'os', label: '운영체제' },
  { key: 'network', label: '네트워크' },
  { key: 'database', label: '데이터베이스' },
  { key: 'design-pattern', label: '디자인 패턴' },
];

export default function CategoryNav() {
  return (
    <aside className="sidebar">
      <h3>카테고리</h3>
      {categories.map((cat) => (
        <NavLink
          key={cat.key}
          to={`/learn/${cat.key}`}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          {cat.label}
        </NavLink>
      ))}
    </aside>
  );
}