# Local Verification

Required local environment variables:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_SESSION_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-callback
ADULTGEN_BACKEND_URL=https://your-openai-compatible-model-host
ADULTGEN_MODEL=Qwen/Qwen3-4B-MLX-4bit
```

Run lint, tests, and build before review. Google Cloud must include the exact local and production
redirect URIs. AWS smoke testing is required before merging this branch into `main`.
