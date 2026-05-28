import type { Difficulty } from '../types';

interface DifficultyButtonsProps {
  onSelect: (d: Difficulty) => void;
}

interface ButtonConfig {
  value: Difficulty;
  label: string;
  hint: string;
  className: string;
}

const buttons: ButtonConfig[] = [
  { value: 'unknown', label: '모름',   hint: '처음부터',   className: 'btn-difficulty btn-unknown' },
  { value: 'hard',    label: '어려움', hint: '1일 후',     className: 'btn-difficulty btn-hard' },
  { value: 'normal',  label: '보통',   hint: '간격 증가',  className: 'btn-difficulty btn-normal' },
  { value: 'easy',    label: '쉬움',   hint: '많이 늘림',  className: 'btn-difficulty btn-easy' },
];

export default function DifficultyButtons({ onSelect }: DifficultyButtonsProps) {
  return (
    <div className="difficulty-buttons">
      {buttons.map((b) => (
        <button key={b.value} className={b.className} onClick={() => onSelect(b.value)}>
          <div className="diff-label">{b.label}</div>
          <div className="diff-hint">{b.hint}</div>
        </button>
      ))}
    </div>
  );
}