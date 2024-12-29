// calculator.test.js
import { calculateBolus } from './script.js';

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`Assertion failed: ${message} - Expected: ${expected}, Actual: ${actual}`);
    }
}

// Test cases
try {
    // Basic calculations
    assertEqual(calculateBolus(10, "morgens", false), 15, "Test Morgens, Fettarm");
    assertEqual(calculateBolus(10, "mittags", false), 10, "Test Mittags, Fettarm");
    assertEqual(calculateBolus(10, "abends", false), 10, "Test Abends, Fettarm");
    assertEqual(calculateBolus(10, "snack", false), 8, "Test Snack, Fettarm");

    // High fat calculations
    assertEqual(calculateBolus(10, "morgens", true), 18, "Test Morgens, Fettreich");
    assertEqual(calculateBolus(10, "mittags", true), 12, "Test Mittags, Fettreich");
    assertEqual(calculateBolus(10, "abends", true), 12, "Test Abends, Fettreich");
    assertEqual(calculateBolus(10, "snack", true), 9.6, "Test Snack, Fettreich");

    console.log("All tests passed!");
} catch (error) {
    console.error(error.message);
}
