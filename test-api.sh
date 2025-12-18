#!/bin/bash
# ============================================
# Music API - Test All Endpoints
# Run: chmod +x test-api.sh && ./test-api.sh
# ============================================

BASE_URL="http://localhost:3000"

echo "================================================"
echo "🎵 Music API - Testing All Endpoints"
echo "================================================"
echo ""

# 1. Health Check
echo "=== 1. Health Check ==="
http GET $BASE_URL/api/health
echo ""

# 2. Search All
echo "=== 2. Search All (q=arijit) ==="
http GET "$BASE_URL/api/search?q=arijit" | head -100
echo ""

# 3. Search Songs
echo "=== 3. Search Songs (q=tum hi ho) ==="
http GET "$BASE_URL/api/search/songs?q=tum+hi+ho" | head -100
echo ""

# 4. Search Albums
echo "=== 4. Search Albums (q=aashiqui) ==="
http GET "$BASE_URL/api/search/albums?q=aashiqui" | head -100
echo ""

# 5. Search Artists
echo "=== 5. Search Artists (q=arijit) ==="
http GET "$BASE_URL/api/search/artists?q=arijit" | head -100
echo ""

# 6. Get Song Details
echo "=== 6. Get Song Details (id=aRZbUYD7 - Tum Hi Ho) ==="
http GET $BASE_URL/api/songs/aRZbUYD7 | head -100
echo ""

# 7. Get Song Lyrics
echo "=== 7. Get Song Lyrics ==="
http GET $BASE_URL/api/songs/aRZbUYD7/lyrics
echo ""

# 8. Get Song Suggestions
echo "=== 8. Get Song Suggestions ==="
http GET $BASE_URL/api/songs/aRZbUYD7/suggestions | head -100
echo ""

# 9. Get Album Details
echo "=== 9. Get Album Details (id=1139549 - Aashiqui 2) ==="
http GET $BASE_URL/api/albums/1139549 | head -100
echo ""

# 10. Get Artist Details
echo "=== 10. Get Artist Details (id=459320 - Arijit Singh) ==="
http GET $BASE_URL/api/artists/459320 | head -100
echo ""

# 11. Get Artist Songs
echo "=== 11. Get Artist Songs ==="
http GET $BASE_URL/api/artists/459320/songs | head -100
echo ""

# 12. Get Artist Albums
echo "=== 12. Get Artist Albums ==="
http GET $BASE_URL/api/artists/459320/albums | head -100
echo ""

echo "================================================"
echo "✅ All endpoints tested!"
echo "================================================"
