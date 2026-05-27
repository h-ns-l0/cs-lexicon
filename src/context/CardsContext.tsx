import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode, Dispatch } from 'react';
import type { CardsState, Term, SRSCard, Difficulty, ReviewRecord } from '../types';

// ===== Action 타입 =====
type Action =
  | { type: 'ADD_TERM'; term: Term }
  | { type: 'UPDATE_TERM'; term: Term }
  | { type: 'DELETE_TERM'; termId: string }
  | { type: 'REVIEW_CARD'; termId: string; difficulty: Difficulty; updatedSrs: SRSCard }
  | { type: 'LOAD_STATE'; state: CardsState };

// ===== 초기 상태 =====
const initialState: CardsState = {
  terms: {},
  srs: {},
  history: [],
};

// ===== Reducer =====
function reducer(state: CardsState, action: Action): CardsState {
  switch (action.type) {
    case 'ADD_TERM':
      return {
        ...state,
        terms: { ...state.terms, [action.term.id]: action.term },
        srs: {
          ...state.srs,
          [action.term.id]: {
            termId: action.term.id,
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            nextReviewAt: Date.now(), // 추가 즉시 복습 가능
          },
        },
      };
    case 'UPDATE_TERM':
      return {
        ...state,
        terms: { ...state.terms, [action.term.id]: action.term },
      };
      case 'DELETE_TERM': {
        const newTerms = { ...state.terms };
        const newSrs = { ...state.srs };
        delete newTerms[action.termId];
        delete newSrs[action.termId];
        return { ...state, terms: newTerms, srs: newSrs };
      }
    case 'REVIEW_CARD': {
      const record: ReviewRecord = {
        termId: action.termId,
        difficulty: action.difficulty,
        reviewedAt: Date.now(),
      };
      return {
        ...state,
        srs: { ...state.srs, [action.termId]: action.updatedSrs },
        history: [...state.history, record],
      };
    }
    case 'LOAD_STATE':
      return action.state;
    default:
      return state;
  }
}

// ===== Context =====
interface CardsContextValue {
  state: CardsState;
  dispatch: Dispatch<Action>;
}

const CardsContext = createContext<CardsContextValue | null>(null);
export { CardsContext };

const STORAGE_KEY = 'cs-lexicon:state';

// ===== Provider =====
export function CardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    // 초기화 시점에 localStorage에서 복원
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as CardsState;
    } catch (e) {
        console.warn('Failed to load state from localStorage:', e);
      }
    return initialState;
  });

  // 상태 변할 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }, [state]);

  return (
    <CardsContext.Provider value={{ state, dispatch }}>
      {children}
    </CardsContext.Provider>
  );
}

