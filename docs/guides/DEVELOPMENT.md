# 🛠️ Development Guide for Pawsport

This guide covers how to set up Pawsport locally for development and testing.

## Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Supabase Account** ([Sign up here](https://supabase.com))

## 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/Pawsport.git
cd Pawsport

# Install root dependencies (for Vercel serverless functions)
npm install

# Install client dependencies
cd client
npm install
cd ..
```

## 2. Configure Environment Variables

Create a `.env` file in the **root directory**:

```bash
# Copy the example
cp .env.example .env
```

**Required Variables:**
- `OPENAI_API_KEY`: Your OpenAI secret key.
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY`: Your Supabase anonymous public key.

> 💡 See [AI_SETUP.md](AI_SETUP.md) and [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup instructions.

## 3. Run Development Server

**Option A: Full-Stack (Recommended)**
```bash
# Install Vercel CLI globally if you haven't
npm install -g vercel

# Start development server (front-end + API)
vercel dev

# Open http://localhost:3000
```

**Option B: Client Only (Static UI)**
```bash
cd client
npm start

# Open http://localhost:3000
```

## 🧪 Testing

### Running Client Tests
```bash
cd client
npm test
```

### API Endpoints (Vercel Functions)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | AI travel assistant chat |
| `/api/travel/checklist` | POST | Generate pet travel checklist |
| `/api/travel/regulations` | POST | Fetch country-specific rules |
| `/api/travel/documents` | POST | Explain required forms |
| `/api/community/posts` | GET/POST | Manage community posts |

For more details on serverless architecture and production deployment, see [DEPLOYMENT.md](DEPLOYMENT.md).

