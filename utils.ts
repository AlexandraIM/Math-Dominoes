import { Domino } from './types';

export const sumDigitsOfNumber = (n: number): number => {
  return String(Math.abs(n))
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
};

export const calculateHandScore = (hand: Domino[]): number => {
  return hand.reduce((totalScore, domino) => {
    let dominoScore = 0;
    // Sum digits from the displayAnswer
    dominoScore += sumDigitsOfNumber(domino.displayAnswer);
    // Sum digits from numbers in the problem string
    const numbersInProblem = domino.problem.match(/\d+/g) || [];
    numbersInProblem.forEach(numStr => {
      dominoScore += sumDigitsOfNumber(parseInt(numStr, 10));
    });
    return totalScore + dominoScore;
  }, 0);
};

export const canPlayMove = (hand: Domino[], boardEnds: { 
  startValue: number | null, 
  startType: 'problem' | 'answer' | null, 
  endValue: number | null, 
  endType: 'problem' | 'answer' | null 
}): boolean => {
    if (boardEnds.startValue === null || boardEnds.endValue === null) return true; // First move is always possible
    for (const tile of hand) {
        // Check if tile can connect to the START of the board
        if ((tile.displayAnswer === boardEnds.startValue && boardEnds.startType === 'problem') || 
            (tile.solution === boardEnds.startValue && boardEnds.startType === 'answer')) {
            return true;
        }
        // Check if tile can connect to the END of the board
        if ((tile.solution === boardEnds.endValue && boardEnds.endType === 'answer') ||
            (tile.displayAnswer === boardEnds.endValue && boardEnds.endType === 'problem')) {
            return true;
        }
    }
    return false;
};