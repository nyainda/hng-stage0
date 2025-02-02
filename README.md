# Number Classification API

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [API Endpoints](#api-endpoints)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Dependencies](#dependencies)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Contributing](#contributing)
10. [License](#license)

---

## Overview

The **Number Classification API** is a RESTful API built using Node.js and Express.js. It classifies numbers based on their mathematical properties (e.g., prime, perfect, Armstrong, odd/even) and provides a fun fact about the number using the Numbers API.

This API is designed to handle GET requests with a `number` parameter and returns the results in JSON format.

---

## Features

- **Mathematical Properties**: Determines if a number is prime, perfect, Armstrong, odd, or even.
- **Fun Fact**: Fetches an interesting fact about the number from the Numbers API.
- **Input Validation**: Ensures only valid integers are processed.
- **CORS Support**: Allows cross-origin requests for frontend integration.
- **Fast Response**: Optimized for quick responses (< 500ms).

---

## API Endpoints

### GET `/api/classify-number`

#### Parameters
- `number`: The number to classify (integer).

#### Example Request


#### Example Response (Valid Input)
```json
{
    "number": 371,
    "is_prime": false,
    "is_perfect": false,
    "properties": ["armstrong", "odd"],
    "digit_sum": 11,
    "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}

{
    "number": "abc",
    "error": true
}