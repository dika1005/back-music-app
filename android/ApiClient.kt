// ============================================
// Music App API - Retrofit Client Setup
// Copy this to your Android project
// ============================================

package com.example.musicapp.data.api

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    
    // TODO: Ganti dengan URL server kamu
    private const val BASE_URL = "https://your-server.com/api/"
    
    private var authToken: String? = null
    
    fun setAuthToken(token: String?) {
        authToken = token
    }
    
    fun getAuthToken(): String? = authToken
    
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        val requestBuilder = originalRequest.newBuilder()
        
        authToken?.let { token ->
            requestBuilder.addHeader("Authorization", "Bearer $token")
        }
        
        chain.proceed(requestBuilder.build())
    }
    
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .addInterceptor(authInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    val musicApiService: MusicApiService = retrofit.create(MusicApiService::class.java)
}

// ============================================
// Usage Example in ViewModel
// ============================================

/*
class HomeViewModel : ViewModel() {
    
    private val api = ApiClient.musicApiService
    
    private val _feedState = MutableStateFlow<FeedState>(FeedState.Loading)
    val feedState: StateFlow<FeedState> = _feedState.asStateFlow()
    
    fun loadFeed() {
        viewModelScope.launch {
            try {
                val response = api.getFeed(language = "english", limit = 10)
                if (response.isSuccessful && response.body()?.success == true) {
                    _feedState.value = FeedState.Success(response.body()!!.data!!)
                } else {
                    _feedState.value = FeedState.Error("Failed to load feed")
                }
            } catch (e: Exception) {
                _feedState.value = FeedState.Error(e.message ?: "Unknown error")
            }
        }
    }
    
    fun searchSongs(query: String) {
        viewModelScope.launch {
            try {
                val response = api.searchSongs(query = query, limit = 20)
                if (response.isSuccessful && response.body()?.success == true) {
                    val songs = response.body()!!.data!!.results
                    // Handle songs
                }
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
    
    fun playSong(song: Song) {
        // Get stream URL
        val streamUrl = song.getBestStreamUrl()
        
        // Use ExoPlayer to play
        // exoPlayer.setMediaItem(MediaItem.fromUri(streamUrl))
        // exoPlayer.prepare()
        // exoPlayer.play()
    }
}

sealed class FeedState {
    object Loading : FeedState()
    data class Success(val data: FeedResponse) : FeedState()
    data class Error(val message: String) : FeedState()
}
*/

// ============================================
// Gradle Dependencies (build.gradle.kts)
// ============================================

/*
dependencies {
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    
    // ExoPlayer for music playback
    implementation("androidx.media3:media3-exoplayer:1.2.0")
    implementation("androidx.media3:media3-ui:1.2.0")
    
    // Coil for image loading
    implementation("io.coil-kt:coil:2.5.0")
    implementation("io.coil-kt:coil-compose:2.5.0") // If using Compose
}
*/
