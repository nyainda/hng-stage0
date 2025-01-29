// Import required dependencies
const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
    origin: '*',  
    methods: ['GET']  
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});



// Main API endpoint
app.get('/api', (req, res) => {
    try {
        const response = {
            email: "oyugibruce2017@gmail.com",
            current_datetime: new Date().toISOString(),
            github_url: "https://github.com/nyainda/hng-stage0"  
        };
        
        res.status(200).json(response);
    } catch (error) {
        console.error('Error in /api endpoint:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});