const mixedNumbers = [1, -5, 7, 10, -19, 99];

const checkNegative = mixedNumbers.some(n => n < 0);
const allPositives = mixedNumbers.every(n => n > 0);