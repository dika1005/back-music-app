// ============================================
// Music App API - Kotlin Data Models
// Copy this to your Android project
// ============================================

package com.example.musicapp.data.models

import com.google.gson.annotations.SerializedName

// ==================== Base Response ====================

data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: String?
)

// ==================== Image Quality ====================

data class ImageQuality(
    val quality: String,
    val url: String
)

// ==================== Song ====================

data class Song(
    val id: String,
    val name: String,
    val type: String,
    val year: String?,
    val releaseDate: String?,
    val duration: Int?,
    val label: String?,
    val explicitContent: Boolean,
    val playCount: Long?,
    val language: String,
    val hasLyrics: Boolean,
    val lyricsId: String?,
    val url: String,
    val copyright: String?,
    val album: SongAlbum?,
    val artists: SongArtists?,
    val image: List<ImageQuality>,
    val downloadUrl: List<ImageQuality>?
) {
    // Get highest quality image
    fun getHighQualityImage(): String? = image.lastOrNull()?.url
    
    // Get thumbnail image
    fun getThumbnail(): String? = image.firstOrNull()?.url
    
    // Get stream URL with specified quality
    fun getStreamUrl(quality: String = "320kbps"): String? {
        return downloadUrl?.find { it.quality == quality }?.url
            ?: downloadUrl?.lastOrNull()?.url
    }
    
    // Get highest quality stream URL
    fun getBestStreamUrl(): String? = downloadUrl?.lastOrNull()?.url
    
    // Get primary artist name
    fun getPrimaryArtist(): String? = artists?.primary?.firstOrNull()?.name
    
    // Get all artist names as comma-separated string
    fun getArtistNames(): String = artists?.primary?.joinToString(", ") { it.name } ?: ""
}

data class SongAlbum(
    val id: String?,
    val name: String?,
    val url: String?
)

data class SongArtists(
    val primary: List<Artist>?,
    val featured: List<Artist>?,
    val all: List<Artist>?
)

// ==================== Artist ====================

data class Artist(
    val id: String,
    val name: String,
    val role: String?,
    val type: String?,
    val image: List<ImageQuality>?,
    val url: String?
) {
    fun getHighQualityImage(): String? = image?.lastOrNull()?.url
    fun getThumbnail(): String? = image?.firstOrNull()?.url
}

data class ArtistDetail(
    val id: String,
    val name: String,
    val url: String,
    val type: String,
    val image: List<ImageQuality>,
    val followerCount: Long?,
    val fanCount: String?,
    val isVerified: Boolean?,
    val dominantLanguage: String?,
    val dominantType: String?,
    val bio: List<ArtistBio>?,
    val dob: String?,
    val fb: String?,
    val twitter: String?,
    val wiki: String?,
    val availableLanguages: List<String>?,
    val isRadioPresent: Boolean?,
    val topSongs: List<Song>?,
    val topAlbums: List<Album>?,
    val singles: List<Song>?,
    val similarArtists: List<Artist>?
) {
    fun getHighQualityImage(): String? = image.lastOrNull()?.url
}

data class ArtistBio(
    val text: String?,
    val title: String?,
    val sequence: Int?
)

// ==================== Album ====================

data class Album(
    val id: String,
    val name: String,
    val description: String?,
    val year: String?,
    val type: String,
    val playCount: Long?,
    val language: String?,
    val explicitContent: Boolean?,
    val artists: SongArtists?,
    val songCount: Int?,
    val url: String?,
    val image: List<ImageQuality>?,
    val songs: List<Song>?
) {
    fun getHighQualityImage(): String? = image?.lastOrNull()?.url
    fun getThumbnail(): String? = image?.firstOrNull()?.url
    fun getPrimaryArtist(): String? = artists?.primary?.firstOrNull()?.name
}

// ==================== Playlist ====================

data class Playlist(
    val id: String,
    val name: String,
    val description: String?,
    val year: String?,
    val type: String,
    val playCount: Long?,
    val language: String?,
    val explicitContent: Boolean?,
    val songCount: Int?,
    val url: String?,
    val image: List<ImageQuality>?,
    val songs: List<Song>?,
    val artists: List<Artist>?
) {
    fun getHighQualityImage(): String? = image?.lastOrNull()?.url
    fun getThumbnail(): String? = image?.firstOrNull()?.url
}

// ==================== Feed Response ====================

data class FeedResponse(
    val trending: FeedSection,
    val newReleases: FeedSection,
    val forYou: FeedSection,
    val artists: FeedSection,
    val albums: FeedSection
)

data class FeedSection(
    val title: String,
    val type: String,
    val items: List<Any>? // Can be Song, Artist, or Album based on type
)

data class SongFeedSection(
    val title: String,
    val type: String,
    val items: List<Song>
)

data class ChartResponse(
    val title: String,
    val chart: String,
    val items: List<Song>,
    val total: Int
)

// ==================== Search Response ====================

data class SearchResponse(
    val topQuery: SearchResultSection?,
    val songs: SearchResultSection?,
    val albums: SearchResultSection?,
    val artists: SearchResultSection?,
    val playlists: SearchResultSection?
)

data class SearchResultSection(
    val results: List<Any>?,
    val position: Int?
)

data class SongSearchResult(
    val total: Int,
    val start: Int,
    val results: List<Song>
)

data class AlbumSearchResult(
    val total: Int,
    val start: Int,
    val results: List<Album>
)

data class ArtistSearchResult(
    val total: Int,
    val start: Int,
    val results: List<Artist>
)

data class PlaylistSearchResult(
    val total: Int,
    val start: Int,
    val results: List<Playlist>
)

// ==================== Auth Models ====================

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String
)

data class AuthResponse(
    val user: User,
    val token: String
)

data class User(
    val id: String,
    val email: String,
    val name: String?,
    val image: String?,
    val createdAt: String?
)

// ==================== User Playlist Models ====================

data class UserPlaylist(
    val id: String,
    val userId: String,
    val name: String,
    val description: String?,
    val coverImage: String?,
    val isPublic: Boolean,
    val createdAt: String,
    val updatedAt: String,
    val songs: List<PlaylistSong>?
)

data class PlaylistSong(
    val id: String,
    val playlistId: String,
    val songId: String,
    val songData: Song?,
    val position: Int,
    val addedAt: String
)

data class CreatePlaylistRequest(
    val name: String,
    val description: String? = null,
    val coverImage: String? = null,
    val isPublic: Boolean = false
)

data class AddSongToPlaylistRequest(
    val songId: String,
    val songData: Song
)

// ==================== Favorite Models ====================

data class Favorite(
    val id: String,
    val userId: String,
    val songId: String,
    val songData: Song?,
    val createdAt: String
)

data class AddFavoriteRequest(
    val songId: String,
    val songData: Song
)

// ==================== History Models ====================

data class PlayHistory(
    val id: String,
    val userId: String,
    val songId: String,
    val songData: Song?,
    val playedAt: String
)

data class AddHistoryRequest(
    val songId: String,
    val songData: Song
)
