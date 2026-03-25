# Mail Service (NodeMailer API)

Standalone mail backend used by the main backend via HTTP API.

## Run

1. Install dependencies:
   npm install
2. Configure env:
   - EMAIL_USER=your-email
   - EMAIL_PASS=your-app-password
   - MAIL_SERVICE_PORT=5500 (optional)
3. Start service:
   npm run dev

## Endpoints

### Health
GET /health

### Send Email
POST /api/mail/send

Request body:
{
  "to": "user@example.com",
  "subject": "Subject",
  "html": "<b>Hello</b>",
  "text": "Hello"
}

Response:
{
  "success": true,
  "data": {
    "messageId": "...",
    "accepted": ["user@example.com"],
    "rejected": []
  }
}
