// CS 카테고리
export type Category =
  | 'data-structure'
  | 'algorithm'
  | 'os'
  | 'network'
  | 'database'
  | 'design-pattern';

// 카드를 풀고 사용자가 선택하는 난이도 (SM-2의 입력)
export type Difficulty = 'easy' | 'normal' | 'hard' | 'unknown';

// CS 용어 카드의 콘텐츠 자체
export interface Term {
  id: string;
  name: string;              // "해시 테이블"
  englishName?: string;      // "Hash Table"
  category: Category;
  definition: string;
  complexity?: string;       // "평균 O(1), 최악 O(n)"
  keywords: string[];
  example?: string;          // 코드 예시
  related: string[];         // 관련 용어 ID
  createdAt: number;
}

// SM-2 알고리즘이 추적하는 카드의 학습 상태
export interface SRSCard {
  termId: string;
  easeFactor: number;        // 기본 2.5
  interval: number;          // 다음 복습까지 일수
  repetitions: number;       // 연속 정답 횟수
  nextReviewAt: number;      // 다음 복습 timestamp (ms)
  lastReviewedAt?: number;
}

// 복습 1회의 기록 (통계용)
export interface ReviewRecord {
  termId: string;
  difficulty: Difficulty;
  reviewedAt: number;
}

// 전역 상태 전체 모양
export interface CardsState {
  terms: Record<string, Term>;
  srs: Record<string, SRSCard>;
  history: ReviewRecord[];
}