import type { SRSCard, Difficulty } from '../types';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 사용자가 선택한 4단계 난이도를 SM-2의 quality 점수(0-5)로 매핑.
 * - easy(5): 너무 쉽다, 간격을 크게 늘림
 * - normal(4): 적당, 정상적으로 간격 증가
 * - hard(3): 어려웠지만 맞음, 간격 약간만 증가
 * - unknown(1): 모름, 처음부터 다시
 */
function difficultyToQuality(d: Difficulty): number {
  switch (d) {
    case 'easy': return 5;
    case 'normal': return 4;
    case 'hard': return 3;
    case 'unknown': return 1;
  }
}

/**
 * SuperMemo-2 (SM-2) 망각곡선 알고리즘
 *
 * @param card    현재 카드의 SRS 상태 (interval, easeFactor, repetitions)
 * @param difficulty 사용자가 이번 복습에서 선택한 난이도
 * @returns 갱신된 SRSCard (다음 복습 시점 포함)
 *
 * 동작:
 * - quality >= 3 (정답): 반복 횟수에 따라 interval 증가
 *   - 1회차: 1일 후
 *   - 2회차: 6일 후
 *   - 3회차 이후: interval × easeFactor
 * - quality < 3 (오답): repetitions=0, interval=1로 리셋
 * - easeFactor는 매번 quality에 따라 미세 조정 (최소 1.3)
 */
export function applySM2(card: SRSCard, difficulty: Difficulty): SRSCard {
  const quality = difficultyToQuality(difficulty);
  const now = Date.now();

  let { easeFactor, interval, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  // easeFactor 조정 공식 (SuperMemo 표준)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  return {
    termId: card.termId,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    interval,
    repetitions,
    nextReviewAt: now + interval * ONE_DAY_MS,
    lastReviewedAt: now,
  };
}