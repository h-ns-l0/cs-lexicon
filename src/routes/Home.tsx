import { useCards } from '../hooks/useCards';

export default function Home() {
  const { state } = useCards();
  const termCount = Object.keys(state.terms).length;
  const reviewCount = state.history.length;

  return (
    <div style={{ padding: 32 }}>
      <h1>CS Lexicon</h1>
      <p>등록된 용어: <b>{termCount}</b>개</p>
      <p>총 복습 횟수: <b>{reviewCount}</b>회</p>
    </div>
  );
}