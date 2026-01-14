# AI Memory (Node.js + MongoDB Vector Search)

Production-style AI memory backend:
- Stores conversation turns (short-term)
- Extracts durable memories (long-term)
- Embeds & stores memories
- Recalls memories via MongoDB Atlas Vector Search
- Injects memories into prompt
- Serves a basic frontend from /public

## Requirements
- Node 18+
- MongoDB Atlas cluster with Vector Search enabled
- OpenAI API key

## Setup
```bash
npm i
cp .env.example .env
```

Fill `.env` values.

### Create Atlas Vector Search Index
Collection: `memories`

Index name:
`memory_vector_index`

Definition:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

## Run locally
```bash
npm run dev
```

Open:
`http://localhost:8080`

## APIs
### Chat
`POST /api/chat`

```json
{
  "userId": "demo-user",
  "sessionId": "demo-session",
  "message": "I prefer Hindi"
}
```

### Search memory
`GET /api/memory/search?userId=demo-user&q=hindi preference`

### Latest memories
`GET /api/memory/latest?userId=demo-user&limit=25`

### Purge memories
`DELETE /api/memory/purge?userId=demo-user`

---

# Production Improvements (Recommended)

## 1) Memory dedupe
Right now, extractor can store repeated preferences.

Add this logic in `chat.service.ts` (before create):

- For type=`preference|fact|project`:
  - search by `{ userId, summary }`
  - if exists: update importance + lastAccessedAt instead of insert.

## 2) Separate queues
Move extraction+embedding into async worker.

But for now, MVP is correct.
