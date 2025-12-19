// ============================================
// Music App API - Retrofit Service Interface
// Copy this to your Android project
// ============================================

package com.example.musicapp.data.api

import com.example.musicapp.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface MusicApiService {

    // ==================== Health ====================
    
    @GET("health")
    suspend fun healthCheck(): Response<Map<String, String>>

    // ==================== Feed ====================
    
    @GET("feed")
    suspend fun getFeed(
        @Query("language") language: String = "english",
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<FeedResponse>>
    
    @GET("feed/trending")
    suspend fun getTrending(
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<ChartResponse>>
    
    @GET("feed/new-releases")
    suspend fun getNewReleases(
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<ChartResponse>>
    
    @GET("feed/by-language/{language}")
    suspend fun getSongsByLanguage(
        @Path("language") language: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<ChartResponse>>
    
    @GET("feed/charts")
    suspend fun getCharts(
        @Query("chart") chart: String = "english",
        @Query("limit") limit: Int = 50
    ): Response<ApiResponse<ChartResponse>>
    
    @GET("feed/playlists")
    suspend fun getFeaturedPlaylists(
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<Map<String, Any>>>
    
    @GET("feed/artists")
    suspend fun getTopArtists(
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<ChartResponse>>

    // ==================== Search ====================
    
    @GET("search")
    suspend fun searchAll(
        @Query("q") query: String
    ): Response<ApiResponse<SearchResponse>>
    
    @GET("search/songs")
    suspend fun searchSongs(
        @Query("q") query: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<SongSearchResult>>
    
    @GET("search/albums")
    suspend fun searchAlbums(
        @Query("q") query: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<AlbumSearchResult>>
    
    @GET("search/artists")
    suspend fun searchArtists(
        @Query("q") query: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<ArtistSearchResult>>
    
    @GET("search/playlists")
    suspend fun searchPlaylists(
        @Query("q") query: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<PlaylistSearchResult>>

    // ==================== Songs ====================
    
    @GET("songs")
    suspend fun getSongsByIds(
        @Query("ids") ids: String
    ): Response<ApiResponse<List<Song>>>
    
    @GET("songs")
    suspend fun getSongByLink(
        @Query("link") link: String
    ): Response<ApiResponse<List<Song>>>
    
    @GET("songs/{id}")
    suspend fun getSong(
        @Path("id") id: String
    ): Response<ApiResponse<List<Song>>>
    
    @GET("songs/{id}/suggestions")
    suspend fun getSongSuggestions(
        @Path("id") id: String,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<List<Song>>>

    // ==================== Albums ====================
    
    @GET("albums")
    suspend fun getAlbumById(
        @Query("id") id: String
    ): Response<ApiResponse<Album>>
    
    @GET("albums")
    suspend fun getAlbumByLink(
        @Query("link") link: String
    ): Response<ApiResponse<Album>>

    // ==================== Artists ====================
    
    @GET("artists")
    suspend fun getArtistById(
        @Query("id") id: String,
        @Query("page") page: Int = 0,
        @Query("songCount") songCount: Int = 10,
        @Query("albumCount") albumCount: Int = 10,
        @Query("sortBy") sortBy: String = "popularity",
        @Query("sortOrder") sortOrder: String = "desc"
    ): Response<ApiResponse<ArtistDetail>>
    
    @GET("artists/{id}")
    suspend fun getArtist(
        @Path("id") id: String,
        @Query("page") page: Int = 0,
        @Query("songCount") songCount: Int = 10,
        @Query("albumCount") albumCount: Int = 10,
        @Query("sortBy") sortBy: String = "popularity",
        @Query("sortOrder") sortOrder: String = "desc"
    ): Response<ApiResponse<ArtistDetail>>
    
    @GET("artists/{id}/songs")
    suspend fun getArtistSongs(
        @Path("id") id: String,
        @Query("page") page: Int = 0,
        @Query("sortBy") sortBy: String = "popularity",
        @Query("sortOrder") sortOrder: String = "desc"
    ): Response<ApiResponse<SongSearchResult>>
    
    @GET("artists/{id}/albums")
    suspend fun getArtistAlbums(
        @Path("id") id: String,
        @Query("page") page: Int = 0,
        @Query("sortBy") sortBy: String = "popularity",
        @Query("sortOrder") sortOrder: String = "desc"
    ): Response<ApiResponse<AlbumSearchResult>>

    // ==================== JioSaavn Playlists ====================
    
    @GET("playlists/jio")
    suspend fun getJioPlaylistById(
        @Query("id") id: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<Playlist>>
    
    @GET("playlists/jio")
    suspend fun getJioPlaylistByLink(
        @Query("link") link: String,
        @Query("page") page: Int = 0,
        @Query("limit") limit: Int = 10
    ): Response<ApiResponse<Playlist>>

    // ==================== Auth ====================
    
    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): Response<ApiResponse<AuthResponse>>
    
    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<ApiResponse<AuthResponse>>
    
    @GET("auth/me")
    suspend fun getCurrentUser(): Response<ApiResponse<User>>
    
    @POST("auth/logout")
    suspend fun logout(): Response<ApiResponse<Map<String, String>>>

    // ==================== User Playlists ====================
    
    @GET("playlists")
    suspend fun getUserPlaylists(): Response<ApiResponse<List<UserPlaylist>>>
    
    @POST("playlists")
    suspend fun createPlaylist(
        @Body request: CreatePlaylistRequest
    ): Response<ApiResponse<UserPlaylist>>
    
    @GET("playlists/{id}")
    suspend fun getPlaylist(
        @Path("id") id: String
    ): Response<ApiResponse<UserPlaylist>>
    
    @PUT("playlists/{id}")
    suspend fun updatePlaylist(
        @Path("id") id: String,
        @Body request: CreatePlaylistRequest
    ): Response<ApiResponse<UserPlaylist>>
    
    @DELETE("playlists/{id}")
    suspend fun deletePlaylist(
        @Path("id") id: String
    ): Response<ApiResponse<Map<String, String>>>
    
    @POST("playlists/{id}/songs")
    suspend fun addSongToPlaylist(
        @Path("id") playlistId: String,
        @Body request: AddSongToPlaylistRequest
    ): Response<ApiResponse<PlaylistSong>>
    
    @DELETE("playlists/{id}/songs/{songId}")
    suspend fun removeSongFromPlaylist(
        @Path("id") playlistId: String,
        @Path("songId") songId: String
    ): Response<ApiResponse<Map<String, String>>>

    // ==================== Favorites ====================
    
    @GET("favorites")
    suspend fun getFavorites(): Response<ApiResponse<List<Favorite>>>
    
    @POST("favorites")
    suspend fun addFavorite(
        @Body request: AddFavoriteRequest
    ): Response<ApiResponse<Favorite>>
    
    @DELETE("favorites/{songId}")
    suspend fun removeFavorite(
        @Path("songId") songId: String
    ): Response<ApiResponse<Map<String, String>>>

    // ==================== History ====================
    
    @GET("history")
    suspend fun getHistory(): Response<ApiResponse<List<PlayHistory>>>
    
    @POST("history")
    suspend fun addToHistory(
        @Body request: AddHistoryRequest
    ): Response<ApiResponse<PlayHistory>>
    
    @DELETE("history")
    suspend fun clearHistory(): Response<ApiResponse<Map<String, String>>>
}
