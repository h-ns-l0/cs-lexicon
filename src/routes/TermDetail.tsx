import { useParams } from 'react-router-dom';

export default function TermDetail() {
  const { id } = useParams<{ id: string }>();
  return (
    <div style={{ padding: 32 }}>
      <h2>용어 상세: {id}</h2>
    </div>
  );
}