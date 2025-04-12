const express = require('express');
const router = express.Router();

router.get('/api', (req, res) => {
    res.json({
    name: "Forum API",
    version: "1.0.0",
    description: "API för en enkel forumapplikation",
    endpoints: {
        threads: {
        "GET /api/threads": "Hämta en lista på alla trådar",
        "POST /api/threads": "Skapa en ny tråd  (autentisering)",
        "GET /api/threads/:threadId": "Hämta en specifik tråd med alla dess kommentarer",
        "PUT /api/threads/:threadId": "Uppdatera en specifik tråd (autentisering)",
        "DELETE /api/threads/:threadId": "Radera en specifik tråd (autentisering)",
        "POST /api/threads/:threadId/comments": "Skapa en ny kommentar i en specifik tråd (autentisering)",
        },
        comments: {
        "GET /api/threads/:threadId/comments": "Hämta alla kommentarer för en specifik tråd",
        "GET /api/comments/:commentId": "Hämta en specifik kommentar",
        "PUT /api/comments/:commentId": "Uppdatera en specifik kommentar (autentisering)",
        "DELETE /api/comments/:commentId": "Radera en specifik kommentar (autentisering)",
        },
        users: {
        "POST /api/register": "Registrera en ny användare",
        "POST /api/login": "Logga in en befintlig användare (returnerar JWT)",
        "GET /api/users/:userId": "Hämta information om en specifik användare (autentisering)",
        "PUT /api/users/:userId": "Uppdatera information om en specifik användare (autentisering)",
        "POST /api/logout": "Logga ut en användare (invaliderar JWT på klientsidan)",
        },
        categories: {
        "GET /api/categories": "Hämta en lista på alla kategorier",
        "GET /api/categories/:categoryId/threads": "Hämta alla trådar i en specifik kategori",
        "POST /api/categories": "Skapa en ny kategori (kräver admin)",
        "PUT /api/categories/:categoryId": "Uppdatera en kategori (kräver admin)",
        "DELETE /api/categories/:categoryId": "Radera en kategori (kräver admin)",
        }
    },
    authentication: "Använd Bearer token i Authorization header för skyddade routes"
    });
});

module.exports = router; 