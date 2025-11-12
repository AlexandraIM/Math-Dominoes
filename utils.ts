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

export const canPlayMove = (hand: Domino[], boardEnds: { startValue: number | null, endValue: number | null }): boolean => {
    if (boardEnds.startValue === null || boardEnds.endValue === null) return true;
    for (const tile of hand) {
        if (tile.solution === boardEnds.startValue || tile.displayAnswer === boardEnds.startValue ||
            tile.solution === boardEnds.endValue || tile.displayAnswer === boardEnds.endValue) {
            return true;
        }
    }
    return false;
};
