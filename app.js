const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// In-memory cache
const cache = new Map();

// Helper functions
function isPrime(n) {
    if (n <= 1) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function isPerfect(n) {
    if (n < 2) return false;
    let sum = 1;
    const sqrt = Math.sqrt(n);
    for (let i = 2; i <= sqrt; i++) {
        if (n % i === 0) {
            sum += i;
            if (i !== n / i) sum += n / i;
        }
    }
    return sum === n && n !== 1;
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
    if (cache.has(`fun_fact_${n}`)) return cache.get(`fun_fact_${n}`);
    try {
        const response = await axios.get(`http://numbersapi.com/${n}/math`, { timeout: 2000 });
        const fact = response.data.trim();
        cache.set(`fun_fact_${n}`, fact);
        return fact;
    } catch (error) {
        console.error(`Error fetching fun fact for ${n}:`, error.message);
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