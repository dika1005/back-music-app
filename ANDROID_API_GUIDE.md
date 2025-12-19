# Music App API - Android Integration Guide

## Base URL
```
https://your-server.com/api
```

## Response Format
Semua response menggunakan format JSON:
```json
{
  "success": true,
  "data": { ... }
}
```

Error response:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🏠 Feed (Homepage)

### GET /feed
Mendapatkan konten homepage lengkap (trending, new releases, for you, artists, albums).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| language | string | english | Bahasa: english, hindi, punjabi, tamil, telugu, korean, indonesian |
| limit | number | 10 | Jumlah item per section |

**Response:**
```json
{
  "success": true,
  "data": {
    "trending": {
      "title": "Trending Now 🔥",
      "type": "songs",
      "items": [Song]
    },
    "newReleases": {
      "title": "New Releases ✨",
      "type": "songs",
      "items": [Song]
    },
    "forYou": {
      "title": "Top English Songs",
      "type": "songs",
      "items": [Song]
    },
    "artists": {
      "title": "Popular Artists 🎤",
      "type": "artists",
      "items": [Artist]
    },
    "albums": {
      "title": "Top Albums 💿",
      "type": "albums",
      "items": [Album]
    }
  }
}
```

### GET /feed/trending
Lagu-lagu trending/viral.

**Query Parameters:**
- `page` (default: 0) - Halaman
- `limit` (default: 20) - Jumlah item

### GET /feed/new-releases
Lagu-lagu baru rilis.

**Query Parameters:**
- `page` (default: 0)
- `limit` (default: 20)

### GET /feed/by-language/:language
Lagu berdasarkan bahasa.

**Path Parameters:**
- `language` - english, hindi, punjabi, tamil, telugu, korean, indonesian

**Query Parameters:**
- `page` (default: 0)
- `limit` (default: 20)

### GET /feed/charts
Chart/Top lagu berdasarkan kategori.

**Query Parameters:**
| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| chart | string | english | english, pop, hiphop, rock, edm, bollywood, punjabi, tamil, telugu, kpop |
| limit | number | 50 | Jumlah lagu |

### GET /feed/playlists
Playlist populer per kategori (Bollywood, English, Workout, Romantic).

### GET /feed/artists
Artis populer.

---

## 🔍 Search

### GET /search
Global search (songs, albums, artists, playlists).

**Query Parameters:**
- `q` (required) - Search query

**Response:**
```json
{
  "success": true,
  "data": {
    "topQuery": { "results": [...] },
    "songs": { "results": [Song] },
    "albums": { "results": [Album] },
    "artists": { "results": [Artist] },
    "playlists": { "results": [Playlist] }
  }
}
```

### GET /search/songs
Search lagu saja.

**Query Parameters:**
- `q` (required) - Search query
- `page` (default: 0)
- `limit` (default: 10)

### GET /search/albums
Search album saja.

### GET /search/artists
Search artis saja.

### GET /search/playlists
Search playlist saja.

---

## 🎵 Songs

### GET /songs
Mendapatkan lagu berdasarkan ID atau link.

**Query Parameters (pilih salah satu):**
- `ids` - Comma-separated song IDs (e.g., "id1,id2,id3")
- `link` - Direct JioSaavn song URL

### GET /songs/:id
Mendapatkan detail lagu berdasarkan ID.

**Response Song Object:**
```json
{
  "id": "yDeAS8Eh",
  "name": "Believer",
  "type": "song",
  "year": "2017",
  "duration": 204,
  "label": "Interscope Records",
  "explicitContent": false,
  "playCount": 12345678,
  "language": "english",
  "hasLyrics": true,
  "url": "https://www.jiosaavn.com/song/...",
  "album": {
    "id": "album_id",
    "name": "Evolve",
    "url": "..."
  },
  "artists": {
    "primary": [Artist],
    "featured": [Artist],
    "all": [Artist]
  },
  "image": [
    { "quality": "50x50", "url": "..." },
    { "quality": "150x150", "url": "..." },
    { "quality": "500x500", "url": "..." }
  ],
  "downloadUrl": [
    { "quality": "12kbps", "url": "..." },
    { "quality": "48kbps", "url": "..." },
    { "quality": "96kbps", "url": "..." },
    { "quality": "160kbps", "url": "..." },
    { "quality": "320kbps", "url": "..." }
  ]
}
```

### GET /songs/:id/suggestions
Mendapatkan lagu serupa untuk infinite playback/autoplay next.

**Query Parameters:**
- `limit` (default: 10)

---

## 💿 Albums

### GET /albums
Mendapatkan album berdasarkan ID atau link.

**Query Parameters (pilih salah satu):**
- `id` - Album ID
- `link` - Direct JioSaavn album URL

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "album_id",
    "name": "Album Name",
    "description": "...",
    "year": "2024",
    "language": "english",
    "songCount": 12,
    "image": [ImageQuality],
    "artists": { ... },
    "songs": [Song]
  }
}
```

---

## 🎤 Artists

### GET /artists
Mendapatkan artis berdasarkan ID.

**Query Parameters:**
- `id` (required) - Artist ID
- `page` (default: 0)
- `songCount` (default: 10)
- `albumCount` (default: 10)
- `sortBy` - popularity, latest, alphabetical
- `sortOrder` - asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "artist_id",
    "name": "Artist Name",
    "image": [ImageQuality],
    "followerCount": 123456,
    "isVerified": true,
    "topSongs": [Song],
    "topAlbums": [Album],
    "singles": [Song],
    "similarArtists": [Artist]
  }
}
```

### GET /artists/:id
Sama dengan GET /artists?id=...

### GET /artists/:id/songs
Mendapatkan semua lagu artis.

**Query Parameters:**
- `page` (default: 0)
- `sortBy` (default: popularity)
- `sortOrder` (default: desc)

### GET /artists/:id/albums
Mendapatkan semua album artis.

---

## 📝 Playlists

### GET /playlists/jio
Mendapatkan playlist dari JioSaavn.

**Query Parameters (pilih salah satu):**
- `id` - Playlist ID
- `link` - Direct JioSaavn playlist URL
- `page` (default: 0)
- `limit` (default: 10)

---

## 🔐 Authentication (User Features)

### POST /auth/register
Register user baru.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

### POST /auth/login
Login user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "name": "..." },
    "token": "jwt_token_here"
  }
}
```

### GET /auth/me
Mendapatkan user yang sedang login.

**Headers:**
```
Authorization: Bearer <token>
```

### POST /auth/logout
Logout user.

---

## ❤️ Favorites (Authenticated)

**Semua endpoint ini memerlukan Authorization header.**

### GET /favorites
Mendapatkan daftar favorit user.

### POST /favorites
Menambahkan ke favorit.

**Body:**
```json
{
  "songId": "song_id",
  "songData": { ... }
}
```

### DELETE /favorites/:songId
Menghapus dari favorit.

---

## 📜 History (Authenticated)

### GET /history
Mendapatkan riwayat putar.

### POST /history
Menambahkan ke riwayat.

**Body:**
```json
{
  "songId": "song_id",
  "songData": { ... }
}
```

### DELETE /history
Menghapus semua riwayat.

---

## 📂 User Playlists (Authenticated)

### GET /playlists
Mendapatkan playlist user.

### POST /playlists
Membuat playlist baru.

**Body:**
```json
{
  "name": "My Playlist",
  "description": "Description",
  "coverImage": "url",
  "isPublic": false
}
```

### GET /playlists/:id
Mendapatkan detail playlist.

### PUT /playlists/:id
Update playlist.

### DELETE /playlists/:id
Hapus playlist.

### POST /playlists/:id/songs
Tambah lagu ke playlist.

**Body:**
```json
{
  "songId": "song_id",
  "songData": { ... }
}
```

### DELETE /playlists/:id/songs/:songId
Hapus lagu dari playlist.

---

## 📱 Android Implementation Tips

### Retrofit Interface Example
```kotlin
interface MusicApiService {
    // Feed
    @GET("feed")
    suspend fun getFeed(
        @Query("language") language: String = "english",
        @Query("limit") limit: Int = 10
    ): Response<FeedResponse>
    
    @GET("feed/trending")
    suspend fun getTrending(
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 20
    ): Response<SongsResponse>
    
    @GET("feed/charts")
    suspend fun getCharts(
        @Query("chart") chart: String = "english",
        @Query("limit") limit: Int = 50
    ): Response<SongsResponse>
    
    // Search
    @GET("search")
    suspend fun search(@Query("q") query: String): Response<SearchResponse>
    
    @GET("search/songs")
    suspend fun searchSongs(
        @Query("q") query: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<SongsResponse>
    
    // Songs
    @GET("songs/{id}")
    suspend fun getSong(@Path("id") id: String): Response<SongResponse>
    
    @GET("songs/{id}/suggestions")
    suspend fun getSuggestions(
        @Path("id") id: String,
        @Query("limit") limit: Int = 10
    ): Response<SongsResponse>
    
    // Albums
    @GET("albums")
    suspend fun getAlbum(@Query("id") id: String): Response<AlbumResponse>
    
    // Artists
    @GET("artists/{id}")
    suspend fun getArtist(@Path("id") id: String): Response<ArtistResponse>
    
    @GET("artists/{id}/songs")
    suspend fun getArtistSongs(
        @Path("id") id: String,
        @Query("page") page: Int = 0
    ): Response<SongsResponse>
}
```

### Data Classes Example
```kotlin
data class Song(
    val id: String,
    val name: String,
    val type: String,
    val year: String?,
    val duration: Int?,
    val language: String,
    val hasLyrics: Boolean,
    val url: String,
    val album: Album?,
    val artists: Artists?,
    val image: List<ImageQuality>,
    val downloadUrl: List<ImageQuality>?
)

data class ImageQuality(
    val quality: String,
    val url: String
)

data class Album(
    val id: String,
    val name: String,
    val url: String?
)

data class Artist(
    val id: String,
    val name: String,
    val image: List<ImageQuality>,
    val url: String?
)
```

### Playing Music
Gunakan `downloadUrl` dari Song object. Pilih kualitas sesuai kebutuhan:
- `12kbps` - Very low (streaming hemat data)
- `48kbps` - Low
- `96kbps` - Medium
- `160kbps` - High
- `320kbps` - Best quality

```kotlin
// Get highest quality URL
val streamUrl = song.downloadUrl
    ?.maxByOrNull { it.quality.replace("kbps", "").toIntOrNull() ?: 0 }
    ?.url
```

---

## 🔧 Health Check

### GET /health
Check apakah server running.

**Response:**
```json
{ "status": "ok" }
```

---

## 📚 Swagger Documentation

Dokumentasi interaktif tersedia di:
```
https://your-server.com/swagger
```
