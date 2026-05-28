interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  
  export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || '용어, 키워드 검색...'}
        className="search-input"
      />
    );
  }
