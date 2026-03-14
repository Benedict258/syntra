# Syntra Backend Service

This Express service sits between the React front end and Supabase. It exposes the routes expected by the UI:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET|POST|PUT|DELETE /entities/:resource`
- `POST /ai/invoke`
- `POST /analytics/navigation`

## Getting Started

1. Copy `.env.example` to `.env` and fill in the values.
2. Install dependencies
   ```sh
   cd server
   npm install
   ```
3. Start the API locally
   ```sh
   npm run dev
   ```
4. Point the front end to it
   ```sh
   cd ..
   echo "VITE_API_BASE_URL=http://localhost:4000" >> .env
   ```

## Environment Variables

See `.env.example` for full list:

| Name                        | Description                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| `PORT`                      | HTTP port (default 4000)                                         |
| `SUPABASE_URL`              | Supabase project URL                                             |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for database + auth management                  |
| `SUPABASE_ANON_KEY`         | Optional anon key for verifying GoTrue tokens                    |
| `SUPABASE_JWT_SECRET`       | JWT secret to verify Supabase-issued tokens                      |
| `OPENAI_API_KEY`            | API key for `/ai/invoke` (or replace with your own LLM provider) |
| `ALLOWED_ENTITY_RESOURCES`  | Comma-separated list of tables the entity router can expose      |

## Project Layout

```
server/
  src/
    index.js           # bootstrap + server start
    app.js             # express configuration
    middleware/
      auth.js          # validates Authorization header
      errorHandler.js  # consistent errors
    routes/
      auth.js
      entities.js
      ai.js
      analytics.js
    services/
      supabaseClient.js
      authService.js
      entityService.js
      aiService.js
      analyticsService.js
    utils/
      logger.js
  supabase/
    schema.sql         # tables + policies
    seed.sql           # optional demo data
```

## Supabase Setup

1. Run the SQL in `supabase/schema.sql` either through the SQL editor or the CLI.
2. (Optional) Seed demo content with `supabase/seed.sql`.
3. Create a service role key and copy it into `.env`.
4. Enable Row Level Security for each table (already part of the SQL file).

## Notes

- The entity router uses Supabase RPCs with the service role key, so it should only run on trusted infrastructure.
- `/ai/invoke` calls OpenAI Responses API with optional JSON schema validation. Swap `aiService.js` if you prefer Anthropic, Azure OpenAI, or a self-hosted LLM.
- Navigation analytics are persisted into the `navigation_events` table for future dashboards.
