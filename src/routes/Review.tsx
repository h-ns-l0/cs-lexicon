import { useMemo, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { applySM2 } from '../lib/sm2';
import DifficultyButtons from '../components/DifficultyButtons';
import type { Term, Difficulty } from '../types';

// ===== 복습 세션 상태머신 (useReducer) =====
type SessionState =
  | { phase: 'idle' }
  | { phase: 'question'; currentIndex: number }
  | { phase: 'answer'; currentIndex: number }
  | { phase: 'done'; completed: number };

type SessionAction =
  | { type: 'START' }
  | { type: 'SHOW_ANSWER' }
  | { type: 'NEXT'; total: number };

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START':
      return { phase: 'question', currentIndex: 0 };
    case 'SHOW_ANSWER':
      if (state.phase !== 'question') return state;
      return { phase: 'answer', currentIndex: state.currentIndex };
    case 'NEXT': {
      if (state.phase !== 'answer') return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= action.total) {
        return { phase: 'done', completed: action.total };
      }
      return { phase: 'question', currentIndex: nextIndex };
    }
    default:
      return state;
  }
}

export default function Review() {
  const { state, dispatch } = useCards();
  const [session, sessionDispatch] = useReducer(sessionReducer, { phase: 'idle' });

  // 화면 진입 시점의 시각을 한 번만 고정 (렌더 중 Date.now() 직접 호출 회피)
  const [now] = useState(() => Date.now());

  // 오늘 복습할 카드 = nextReviewAt이 now보다 이른 카드들
  const dueCards: Term[] = useMemo(() => {
    return Object.values(state.terms).filter((term) => {
      const srs = state.srs[term.id];
      return srs && srs.nextReviewAt <= now;
    });
  }, [state.terms, state.srs, now]);

  // ─── 단계 1: idle (시작 전) ───
  if (session.phase === 'idle') {
    return (
      <div className="review-container">
        <h2>오늘의 복습</h2>
        <p className="review-summary">
          복습 대기 중인 카드: <b>{dueCards.length}개</b>
        </p>
        {dueCards.length > 0 ? (
          <button
            className="btn-primary btn-large"
            onClick={() => sessionDispatch({ type: 'START' })}
          >
            복습 시작
          </button>
        ) : (
          <p style={{ color: '#9ca3af', marginTop: 12 }}>
            지금 복습할 카드가 없습니다. 새 카드를 추가하거나 잠시 후 다시 와보세요.
          </p>
        )}
      </div>
    );
  }

  // ─── 단계 4: done (완료) ───
  if (session.phase === 'done') {
    return (
      <div className="review-container">
        <h2>🎉 복습 완료</h2>
        <p style={{ marginTop: 16, fontSize: 16 }}>
          총 <b>{session.completed}</b>개 카드를 복습했습니다.
        </p>
        <Link to="/" className="btn-primary btn-large review-home-link">
          홈으로
        </Link>
      </div>
    );
  }

  // ─── 단계 2~3: question / answer ───
  const currentTerm = dueCards[session.currentIndex];
  if (!currentTerm) {
    return <div className="review-container">카드를 찾을 수 없습니다.</div>;
  }

  const handleDifficulty = (difficulty: Difficulty) => {
    const currentSrs = state.srs[currentTerm.id];
    const updatedSrs = applySM2(currentSrs, difficulty);
    dispatch({
      type: 'REVIEW_CARD',
      termId: currentTerm.id,
      difficulty,
      updatedSrs,
    });
    sessionDispatch({ type: 'NEXT', total: dueCards.length });
  };

  return (
    <div className="review-container">
      <div className="review-progress">
        {session.currentIndex + 1} / {dueCards.length}
      </div>

      <div className="review-card">
        <div className="review-card-name">{currentTerm.name}</div>
        {currentTerm.englishName && (
          <div className="review-card-english">{currentTerm.englishName}</div>
        )}

        {session.phase === 'answer' && (
          <div className="review-card-body">
            <div className="label">정의</div>
            <p>{currentTerm.definition}</p>

            {currentTerm.complexity && (
              <>
                <div className="label">시간복잡도</div>
                <p>{currentTerm.complexity}</p>
              </>
            )}

            {currentTerm.keywords.length > 0 && (
              <>
                <div className="label">키워드</div>
                <div>
                  {currentTerm.keywords.map((kw) => (
                    <span key={kw} className="tag">{kw}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {session.phase === 'question' ? (
        <button
          className="btn-primary btn-large"
          onClick={() => sessionDispatch({ type: 'SHOW_ANSWER' })}
        >
          정답 보기
        </button>
      ) : (
        <DifficultyButtons onSelect={handleDifficulty} />
      )}
    </div>
  );
}