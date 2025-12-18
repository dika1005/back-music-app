#!/bin/bash
# ============================================
# Music API - Focused tests for popular artists/songs/albums
# Run: bash ./test-api.sh
# ============================================

BASE_URL="http://127.0.0.1:3000"

echo "================================================"
echo "Music API - Focused Tests (Artists, Songs, Albums)"
echo "================================================"
echo ""

# Detect WSL: if running inside WSL, prefer Windows curl to reach Windows localhost
if [ -f /proc/version ] && grep -qi microsoft /proc/version 2>/dev/null; then
	if [ -x /mnt/c/Windows/System32/curl.exe ]; then
		CURL_CMD="/mnt/c/Windows/System32/curl.exe"
	else
		CURL_CMD="curl"
	fi
else
	CURL_CMD="curl"
fi

# helper (uses chosen curl binary)
fetch() { "$CURL_CMD" -sS "$1"; }

# helper to limit output to first 100 lines
head100() { sed -n '1,100p'; }

ARTISTS=("adele" "billie+eilish")
SONGS=("hello+adele" "bad+guy+billie+eilish")
ALBUMS=("25+adele" "when+we+all+fall+asleep+billie+eilish")

echo "--- Artists ---"
for a in "${ARTISTS[@]}"; do
	echo "Searching artist: ${a//+/ }"
	fetch "$BASE_URL/api/search/artists?q=$a" | head100
	echo ""
done

echo "--- Songs ---"
for s in "${SONGS[@]}"; do
	echo "Searching song: ${s//+/ }"
	fetch "$BASE_URL/api/search/songs?q=$s" | head100
	echo ""
done

echo "--- Albums ---"
for al in "${ALBUMS[@]}"; do
	echo "Searching album: ${al//+/ }"
	fetch "$BASE_URL/api/search/albums?q=$al" | head100
	echo ""
done

echo "================================================"
echo "Focused tests finished"
echo "================================================"

