import { useState, useEffect } from 'react';

/**
 * 커스텀 Hook: 값이 일정 시간 변하지 않을 때만 업데이트
 * - 검색어 입력마다 필터링하지 않고, 입력이 멈춘 후 한 번만 처리
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}