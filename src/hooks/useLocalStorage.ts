import { useState, useEffect } from 'react';

/**
 * 커스텀 Hook: localStorage와 동기화되는 useState
 * - 새로고침해도 데이터 유지
 * - JSON 직렬화/역직렬화 자동 처리
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage write failed', e);
    }
  }, [key, value]);

  return [value, setValue] as const;
}