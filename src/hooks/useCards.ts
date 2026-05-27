import { useContext } from 'react';
import { CardsContext } from '../context/CardsContext';

export function useCards() {
  const ctx = useContext(CardsContext);
  if (!ctx) throw new Error('useCards must be used within CardsProvider');
  return ctx;
}