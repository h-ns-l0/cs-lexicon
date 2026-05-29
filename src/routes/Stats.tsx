import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useCards } from '../hooks/useCards';
import type { Category, Difficulty } from '../types';

const categoryLabels: Record<Category, string> = {
  'data-structure': '자료구조',
  'algorithm': '알고리즘',
  'os': '운영체제',
  'network': '네트워크',
  'database': 'DB',
  'design-pattern': '디자인패턴',
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: '쉬움',
  normal: '보통',
  hard: '어려움',
  unknown: '모름',
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

export default function Stats() {
  const { state } = useCards();

  // 통계 집계 (비싼 연산 → useMemo)
  const stats = useMemo(() => {
    const terms = Object.values(state.terms);
    const totalTerms = terms.length;
    const totalReviews = state.history.length;

    // 카테고리별 카드 수
    const byCategory = terms.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    const categoryData = Object.entries(byCategory).map(([cat, count]) => ({
      name: categoryLabels[cat as Category] ?? cat,
      count,
    }));

    // 난이도별 복습 분포
    const byDifficulty = state.history.reduce<Record<string, number>>((acc, r) => {
      acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
      return acc;
    }, {});
    const difficultyData = Object.entries(byDifficulty).map(([diff, count]) => ({
      name: difficultyLabels[diff as Difficulty] ?? diff,
      value: count,
    }));

    // 정답률 = (쉬움+보통+어려움) / 전체 복습
    const correct =
      (byDifficulty.easy || 0) + (byDifficulty.normal || 0) + (byDifficulty.hard || 0);
    const accuracy = totalReviews > 0 ? Math.round((correct / totalReviews) * 100) : 0;

    return { totalTerms, totalReviews, accuracy, categoryData, difficultyData };
  }, [state.terms, state.history]);

  return (
    <div className="stats-container">
      <h2>학습 통계</h2>

      {/* 요약 카드 */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTerms}</div>
          <div className="stat-label">등록된 용어</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalReviews}</div>
          <div className="stat-label">총 복습 횟수</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.accuracy}%</div>
          <div className="stat-label">정답률</div>
        </div>
      </div>

      {/* 카테고리별 카드 수 (막대 차트) */}
      <div className="chart-section">
        <h3>카테고리별 카드 수</h3>
        {stats.categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-msg">아직 카드가 없습니다.</p>
        )}
      </div>

      {/* 난이도별 복습 분포 (파이 차트) */}
      <div className="chart-section">
        <h3>난이도별 복습 분포</h3>
        {stats.difficultyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.difficultyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.difficultyData.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-msg">아직 복습 기록이 없습니다. 복습을 진행해보세요.</p>
        )}
      </div>
    </div>
  );
}