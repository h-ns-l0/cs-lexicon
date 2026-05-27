import { useParams } from 'react-router-dom';

export default function Learn() {
  const { category } = useParams<{ category: string }>();
  return (
    <div style={{ padding: 32 }}>
      <h2>학습: {category}</h2>
      <p>여기에 TermCard가 들어올 예정 (Day 3)</p>
    </div>
  );
}