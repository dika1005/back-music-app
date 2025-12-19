# Music App API

Backend API untuk aplikasi musik Android dengan integrasi JioSaavn.

Built with **Elysia.js** + **Bun** runtime.

## Features

- 🏠 **Feed** - Homepage content (trending, new releases, charts)
- 🔍 **Search** - Songs, albums, artists, and playlists
- 🎵 **Songs** - Details, suggestions for infinite playback
- 💿 **Albums** - Album details with tracks
- 🎤 **Artists** - Artist details, songs, and albums with sorting
- 📝 **Playlists** - JioSaavn playlists & user playlists (CRUD)
- ❤️ **Favorites** - User favorites management
- 📜 **History** - Play history tracking
- 🔐 **Auth** - User authentication (email/password + Google OAuth)

## 📱 Android Integration

Untuk integrasi ke Android, lihat:
- **[ANDROID_API_GUIDE.md](./ANDROID_API_GUIDE.md)** - Dokumentasi API lengkap
- **[android/](./android/)** - Kotlin files siap pakai (Models, Retrofit Service, Client)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- MariaDB/MySQL database

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd app-music

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with your database and API credentials

# Generate Prisma client
bunx prisma generate

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MariaDB/MySQL connection string | - |
| `PORT` | Server port | `3000` |
| `JIOSAAVN_API_URL` | JioSaavn API base URL | `https://saavn.sumit.co/api` |
| `BETTER_AUTH_SECRET` | Auth secret key | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - |

## API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

### Search

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/api/search` | `q` | Global search (songs, albums, artists, playlists) |
| GET | `/api/search/songs` | `q`, `page=0`, `limit=10` | Search songs |
| GET | `/api/search/albums` | `q`, `page=0`, `limit=10` | Search albums |
| GET | `/api/search/artists` | `q`, `page=0`, `limit=10` | Search artists |
| GET | `/api/search/playlists` | `q`, `page=0`, `limit=10` | Search playlists |

### Feed (Homepage)

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/api/feed` | `language=english`, `limit=10` | Get homepage feed with all sections |
| GET | `/api/feed/trending` | `page=0`, `limit=20` | Get trending songs |
| GET | `/api/feed/new-releases` | `page=0`, `limit=20` | Get new releases |
| GET | `/api/feed/by-language/:language` | `page=0`, `limit=20` | Get songs by language (english, hindi, punjabi, tamil, telugu, korean, indonesian) |
| GET | `/api/feed/playlists` | `limit=10` | Get featured playlists by category |
| GET | `/api/feed/artists` | `page=0`, `limit=20` | Get top artists |
| GET | `/api/feed/charts` | `chart=english`, `limit=50` | Get chart/top songs (english, pop, hiphop, rock, edm, bollywood, kpop) |

### Songs

| Method | Endpoint | Query/Path Params | Description |
|--------|----------|-------------------|-------------|
| GET | `/api/songs` | `ids` or `link` | Get songs by IDs or JioSaavn link |
| GET | `/api/songs/:id` | - | Get song details by ID |
| GET | `/api/songs/:id/suggestions` | `limit=10` | Get similar songs for infinite playback |

### Albums

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/api/albums` | `id` or `link` | Get album by ID or JioSaavn link |

### Artists

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/api/artists` | `id` or `link`, `page`, `songCount`, `albumCount`, `sortBy`, `sortOrder` | Get artist details |
| GET | `/api/artists/:id` | `page`, `songCount`, `albumCount`, `sortBy`, `sortOrder` | Get artist by ID |
| GET | `/api/artists/:id/songs` | `page=0`, `sortBy=popularity`, `sortOrder=desc` | Get artist songs |
| GET | `/api/artists/:id/albums` | `page=0`, `sortBy=popularity`, `sortOrder=desc` | Get artist albums |

**Sorting options:**
- `sortBy`: `popularity`, `latest`, `alphabetical`
- `sortOrder`: `asc`, `desc`

### Playlists (JioSaavn)

| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| GET | `/api/playlists/jio` | `id` or `link`, `page=0`, `limit=10` | Get JioSaavn playlist |

### User Playlists (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/playlists` | Get user's playlists |
| POST | `/api/playlists` | Create playlist |
| GET | `/api/playlists/:id` | Get playlist by ID |
| PUT | `/api/playlists/:id` | Update playlist |
| DELETE | `/api/playlists/:id` | Delete playlist |
| POST | `/api/playlists/:id/songs` | Add song to playlist |
| DELETE | `/api/playlists/:id/songs/:songId` | Remove song from playlist |

### Favorites (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user's favorites |
| POST | `/api/favorites` | Add to favorites |
| DELETE | `/api/favorites/:songId` | Remove from favorites |

### History (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/history` | Get play history |
| POST | `/api/history` | Add to history |
| DELETE | `/api/history` | Clear history |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

## API Examples

### Search for songs

```bash
curl "http://localhost:3000/api/search/songs?q=Believer&page=0&limit=5"
```

### Get song details

```bash
curl "http://localhost:3000/api/songs/yDeAS8Eh"
```

### Get album by ID

```bash
curl "http://localhost:3000/api/albums?id=23241654"
```

### Get artist with sorting

```bash
curl "http://localhost:3000/api/artists/1274170?songCount=10&sortBy=popularity&sortOrder=desc"
```

## Development

```bash
# Run development server
bun run dev

# Run tests
bun test

# Lint code
bun run lint

# Format code
bun run format
```

## API Documentation

Swagger documentation is available at:
```
http://localhost:3000/swagger
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia.js](https://elysiajs.com/)
- **Database**: MariaDB/MySQL with [Prisma](https://www.prisma.io/)
- **External API**: [JioSaavn API](https://saavn.sumit.co)

## License

MIT