API server
=========

This small Express server proxies a subset of project-related requests to Supabase using the service-role key.

Setup
-----

1. Install dependencies (run in project root):

```bash
npm install express cors dotenv @supabase/supabase-js
```

2. Create a `.env` in `server/` or set environment variables in your environment. Use `.env.example` as a template.

3. Run the server from project root:

```bash
npm run start:api
```

Routes
------
- `GET /api/projects` — returns projects with their `project_gallery` and `project_types` relations.
- `POST /api/projects` — create or update a project. Accepts project payload in body; include `gallery` array to sync gallery rows.
- `POST /api/project-types` — create a new project type by sending `{ type_key, description }`.

Security
--------
This service requires the Supabase service role key and should only run in trusted environments (not in client-side code). Keep the key secret.
