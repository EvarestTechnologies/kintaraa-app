#!/bin/bash

# Quick Backend Integration Test
# Tests basic connectivity and key endpoints

set -e

BASE_URL="https://api-kintara.onrender.com/api"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Kintaraa Backend Quick Test"
echo "========================================="
echo ""

# Test 1: Health Check
echo -n "Testing health endpoint... "
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/auth/health/" || echo "FAILED")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -1)
BODY=$(echo "$HEALTH_RESPONSE" | head -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "403" ]; then
  if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${YELLOW}⚠ WARNING${NC} - Got 403 (might be DDoS protection)"
    echo "   This is OK if testing from restricted IP"
  else
    echo -e "${GREEN}✓ PASSED${NC}"
    echo "   Response: $BODY"
  fi
else
  echo -e "${RED}✗ FAILED${NC}"
  echo "   HTTP Code: $HTTP_CODE"
  exit 1
fi
echo ""

# Test 2: CORS Headers
echo -n "Checking CORS configuration... "
CORS_TEST=$(curl -s -I -X OPTIONS "$BASE_URL/auth/health/" | grep -i "access-control" || echo "")
if [ -n "$CORS_TEST" ]; then
  echo -e "${GREEN}✓ PASSED${NC}"
  echo "   CORS headers present"
else
  echo -e "${YELLOW}⚠ WARNING${NC}"
  echo "   No CORS headers detected (may need configuration)"
fi
echo ""

# Test 3: Try to register a test user (will fail if already exists)
echo -n "Testing registration endpoint... "
TEST_EMAIL="quicktest$(date +%s)@example.com"
REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"Test@12345\",
    \"confirm_password\": \"Test@12345\",
    \"first_name\": \"Test\",
    \"last_name\": \"User\",
    \"role\": \"survivor\",
    \"is_anonymous\": false
  }" 2>/dev/null || echo "FAILED\n999")

REG_HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -1)
REG_BODY=$(echo "$REGISTER_RESPONSE" | head -1)

if [ "$REG_HTTP_CODE" = "200" ] || [ "$REG_HTTP_CODE" = "201" ]; then
  echo -e "${GREEN}✓ PASSED${NC}"
  echo "   User registered successfully"
  echo "   Email: $TEST_EMAIL"

  # Extract tokens
  ACCESS_TOKEN=$(echo "$REG_BODY" | grep -o '"access":"[^"]*"' | cut -d'"' -f4)

  if [ -n "$ACCESS_TOKEN" ]; then
    echo ""
    echo "   Access Token: ${ACCESS_TOKEN:0:20}..."

    # Test 4: Get profile with token
    echo ""
    echo -n "Testing authenticated profile endpoint... "
    PROFILE_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/auth/me/" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ACCESS_TOKEN" 2>/dev/null || echo "FAILED\n999")

    PROF_HTTP_CODE=$(echo "$PROFILE_RESPONSE" | tail -1)

    if [ "$PROF_HTTP_CODE" = "200" ]; then
      echo -e "${GREEN}✓ PASSED${NC}"
      echo "   Profile retrieved successfully"
    else
      echo -e "${RED}✗ FAILED${NC}"
      echo "   HTTP Code: $PROF_HTTP_CODE"
    fi
  fi
elif [ "$REG_HTTP_CODE" = "400" ]; then
  echo -e "${YELLOW}⚠ INFO${NC}"
  echo "   Got 400 - likely validation error (endpoint working)"
  echo "   Response: $(echo "$REG_BODY" | head -c 100)..."
elif [ "$REG_HTTP_CODE" = "403" ]; then
  echo -e "${YELLOW}⚠ WARNING${NC}"
  echo "   Got 403 - DDoS protection or CORS blocking"
else
  echo -e "${RED}✗ FAILED${NC}"
  echo "   HTTP Code: $REG_HTTP_CODE"
  echo "   Response: $REG_BODY"
fi

echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "Backend URL: $BASE_URL"
echo ""
echo -e "${GREEN}✓${NC} = Working correctly"
echo -e "${YELLOW}⚠${NC} = Working but needs attention"
echo -e "${RED}✗${NC} = Failed"
echo ""
echo "Next steps:"
echo "1. Run 'npx expo start' on your local machine"
echo "2. Test registration flow in the app"
echo "3. Create an incident report"
echo "4. Check database in Render dashboard"
echo ""
