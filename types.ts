export interface Domino {
  id: number;
  problem: string;
  solution: number;
  displayAnswer: number;
  flipped: boolean;
}

export type GameState = 'setup' | 'loading' | 'playing' | 'gameOver';

export type Difficulty = 'easy' | 'easy+' | 'medium' | 'hard';

export type Player = 'player1' | 'player2';

export type GameMode = 'pvc' | 'pvp'; // Player vs Computer | Player vs Player