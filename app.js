const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Cache setup
const cache = new Map();
const FACTS_CACHE_FILE = path.join(__dirname, 'facts_cache.json');
let factsCache = {};
try {
    factsCache = JSON.parse(fs.readFileSync(FACTS_CACHE_FILE, 'utf8'));
} catch (error) {
    factsCache = {};
}

// Helper functions
function isPrime(n) {
    if (n <= 1) return false;
    if (n === 2) return true; // 2 is the only even prime number
    if (n % 2 === 0) return false; // Exclude other even numbers
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) { // Check only odd numbers
        if (n % i === 0) return false;
    }
    return true;
}

function isPerfect(n) {
    if (n < 2) return false; // No perfect numbers less than 2
    let sum = 1; // Start with 1 as it's always a divisor
    const sqrt = Math.sqrt(n);
    for (let i = 2; i <= sqrt; i++) {
        if (n % i === 0) {
            sum += i;
            if (i !== n / i) sum += n / i; // Add the complementary divisor
        }
    }
    return sum === n && n !== 1; // Exclude 1 as it's not considered perfect
}

function isArmstrong(n) {
    const digits = n.toString().split('').map(Number);
    const numDigits = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, numDigits), 0);
    return sum === n;
}

function getDigitSum(n) {
    return n.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

async function getFunFact(n) {
    if (factsCache[n]) return factsCache[n];
    try {
        const response = await axios.get(`http://numbersapi.com/${n}/math`);
        const fact = response.data.trim();
        factsCache[n] = fact; // Cache the fact
        fs.writeFileSync(FACTS_CACHE_FILE, JSON.stringify(factsCache, null, 2)); // Save to file
        return fact;
    } catch (error) {
        return 'Fun fact unavailable';
    }
}

// Middleware to measure response time
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`Request ${req.method} ${req.url} took ${duration}ms`);
    });
    next();
});

// API endpoint
app.get('/api/classify-number', async (req, res) => {
    const { number } = req.query;

    // Input validation
    if (!number || isNaN(number)) {
        return res.status(400).json({ number: number, error: true });
    }

    const num = parseInt(number, 10);

    // Check cache first
    if (cache.has(num)) {
        return res.json(cache.get(num));
    }

    // Perform calculations and fetch fun fact concurrently
    const [funFact, classification] = await Promise.all([
        getFunFact(num),
        new Promise((resolve) => {
            const isPrimeResult = isPrime(num);
            const isPerfectResult = isPerfect(num);
            const properties = [];
            if (isArmstrong(num)) properties.push('armstrong');
            if (num % 2 === 0) properties.push('even');
            else properties.push('odd');
            const digitSum = getDigitSum(num);

            resolve({
                number: num,
                is_prime: isPrimeResult,
                is_perfect: isPerfectResult,
                properties,
                digit_sum: digitSum,
            });
        }),
    ]);

    // Combine results
    const response = {
        ...classification,
        fun_fact: funFact,
    };

    // Store in cache
    cache.set(num, response);

    // Send response
    res.json(response);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});