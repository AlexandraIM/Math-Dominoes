// FIX: Import test runner functions to resolve 'Cannot find name' errors.
import { describe, it, expect } from 'vitest';
import { sumDigitsOfNumber, calculateHandScore, canPlayMove } from './utils';
import { Domino } from './types';

/* 
  This file contains unit tests for the utility functions.
  It is structured for a test runner like Jest or Vitest.
  To run these tests, you would need to set up a testing environment.
  The 'describe', 'it', and 'expect' functions are globals provided by such environments.
*/

describe('sumDigitsOfNumber', () => {
    it('should return the correct sum for a single-digit number', () => {
        expect(sumDigitsOfNumber(5)).toBe(5);
    });

    it('should return the correct sum for a multi-digit number', () => {
        expect(sumDigitsOfNumber(123)).toBe(6);
    });

    it('should return 0 for the number 0', () => {
        expect(sumDigitsOfNumber(0)).toBe(0);
    });

    it('should handle negative numbers by taking their absolute value', () => {
        expect(sumDigitsOfNumber(-42)).toBe(6);
    });
});

describe('calculateHandScore', () => {
    it('should return 0 for an empty hand', () => {
        const hand: Domino[] = [];
        expect(calculateHandScore(hand)).toBe(0);
    });

    it('should calculate the score for a single domino', () => {
        const hand: Domino[] = [{
            id: 1,
            problem: '10 + 5',
            solution: 15,
            displayAnswer: 20,
            flipped: false
        }];
        // displayAnswer(20) -> 2+0=2
        // problem('10 + 5') -> (1+0) + 5 = 6
        // Total = 2 + 6 = 8
        expect(calculateHandScore(hand)).toBe(8);
    });

    it('should calculate the score for a hand with multiple dominoes', () => {
        const hand: Domino[] = [
            { id: 1, problem: '8 * 2', solution: 16, displayAnswer: 9, flipped: false },
            { id: 2, problem: '100 - 50', solution: 50, displayAnswer: 42, flipped: false }
        ];
        // Domino 1: display(9)=9; problem(8,2)=10. Total=19
        // Domino 2: display(42)=6; problem(100,50)=6. Total=12
        // Grand Total = 19 + 12 = 31
        expect(calculateHandScore(hand)).toBe(31);
    });
});

describe('canPlayMove', () => {
    const hand: Domino[] = [
        { id: 1, problem: '5 + 5', solution: 10, displayAnswer: 20, flipped: false },
        { id: 2, problem: '3 * 3', solution: 9, displayAnswer: 15, flipped: false },
    ];

    it('should return true if the board is empty (first move)', () => {
        const boardEnds = { startValue: null, startType: null, endValue: null, endType: null };
        expect(canPlayMove(hand, boardEnds)).toBe(true);
    });

    it('should return false for an empty hand if board is not empty', () => {
        const boardEnds = { startValue: 10, startType: 'problem' as const, endValue: 5, endType: 'answer' as const };
        expect(canPlayMove([], boardEnds)).toBe(false);
    });

    it('should return true if a tile matches the start (displayAnswer connects to problem)', () => {
        // Board start is a PROBLEM side, value 15. Needs a tile with displayAnswer 15.
        const boardEnds = { startValue: 15, startType: 'problem' as const, endValue: 99, endType: 'answer' as const };
        expect(canPlayMove(hand, boardEnds)).toBe(true);
    });
    
    it('should return true if a tile matches the start (solution connects to answer)', () => {
        // Board start is an ANSWER side, value 10. Needs a tile with solution 10.
        const boardEnds = { startValue: 10, startType: 'answer' as const, endValue: 99, endType: 'answer' as const };
        expect(canPlayMove(hand, boardEnds)).toBe(true);
    });

    it('should return true if a tile matches the end (solution connects to answer)', () => {
        // Board end is an ANSWER side, value 9. Needs a tile with solution 9.
        const boardEnds = { startValue: 99, startType: 'answer' as const, endValue: 9, endType: 'answer' as const };
        expect(canPlayMove(hand, boardEnds)).toBe(true);
    });

    it('should return true if a tile matches the end (displayAnswer connects to problem)', () => {
        // Board end is a PROBLEM side, value 20. Needs a tile with displayAnswer 20.
        const boardEnds = { startValue: 99, startType: 'answer' as const, endValue: 20, endType: 'problem' as const };
        expect(canPlayMove(hand, boardEnds)).toBe(true);
    });

    it('should return false if no tile matches either end', () => {
        const boardEnds = { startValue: 1, startType: 'problem' as const, endValue: 2, endType: 'answer' as const };
        expect(canPlayMove(hand, boardEnds)).toBe(false);
    });
});
