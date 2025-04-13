const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        name: "Forum API",
        version: "1.0.0",
        description: "API for a simple forum application",
        endpoints: {
            threads: {
                "GET /api/threads": "Fetch a list of all threads",
                "POST /api/threads": "Create a new thread (authentication required)",
                "GET /api/threads/:threadId": "Fetch a specific thread with all its comments",
                "PUT /api/threads/:threadId": "Update a specific thread (authentication required)",
                "DELETE /api/threads/:threadId": "Delete a specific thread (authentication required)"
            },
            comments: {
                "GET /api/comments/:commentId": "Fetch a specific comment",
                "POST /api/threads/:threadId": "Add a comment to a specific thread (authentication required)",
                "PUT /api/comments/:commentId": "Update a specific comment (authentication required)",
                "DELETE /api/comments/:commentId": "Update a specific comment (authentication required)"
            },
            users: {
                "GET /api/users": "Fetch all users (admin authentication required)",
                "GET /api/users/:userId": "Fetch information about a specific user (authentication required)",
                "PUT /api/users/:userId": "Update information about a specific user (authentication required)",
                "PUT /api/users/:userId/promote": "Promote a user to admin (admin authentication required)"
            },
            auth: {
                "POST /api/register": "Register a new user",
                "POST /api/login": "Log in an existing user (returns token)",
            }
        },
        authentication: "Use a Bearer token in the Authorization header for protected routes"
    });
});

module.exports = router;