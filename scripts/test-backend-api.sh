#!/bin/bash

#############################################
# Kintaraa Backend API Testing Script
# Tests production API endpoints
#############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="${API_BASE_URL:-https://api-kintara.onrender.com/api}"
TEST_EMAIL="test-$(date +%s)@kintaraa.test"
TEST_PASSWORD="TestPassword123!"
ACCESS_TOKEN=""
REFRESH_TOKEN=""

# Counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

#############################################
# Helper Functions
#############################################

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
    ((TESTS_TOTAL++))
}

print_success() {
    echo -e "${GREEN}✓ PASS: $1${NC}"
    ((TESTS_PASSED++))
}

print_error() {
    echo -e "${RED}✗ FAIL: $1${NC}"
    echo -e "${RED}  Response: $2${NC}"
    ((TESTS_FAILED++))
}

test_endpoint() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local expected_status="$4"
    local description="$5"

    print_test "$description"

    local url="${API_BASE_URL}${endpoint}"
    local response
    local status

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            "$url")
    else
        response=$(curl -s -w "\n%{http_code}" \
            -X "$method" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    fi

    status=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$status" = "$expected_status" ]; then
        print_success "$description (HTTP $status)"
        echo "$body"
        return 0
    else
        print_error "$description (Expected HTTP $expected_status, got $status)" "$body"
        return 1
    fi
}

#############################################
# Test Suites
#############################################

test_health_check() {
    print_header "Health Check"

    test_endpoint "GET" "/auth/health/" "" "200" "API Health Check"
}

test_authentication() {
    print_header "Authentication Tests"

    # Register new user
    print_test "User Registration"
    local register_data="{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"first_name\": \"Test\",
        \"last_name\": \"User\",
        \"role\": \"survivor\"
    }"

    local register_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$register_data" \
        "${API_BASE_URL}/auth/register/")

    local register_status=$(echo "$register_response" | tail -n1)

    if [ "$register_status" = "201" ] || [ "$register_status" = "200" ]; then
        print_success "User Registration"
    else
        # Try login instead (user might already exist)
        print_error "Registration failed, trying login" "$(echo "$register_response" | sed '$d')"
    fi

    # Login
    print_test "User Login"
    local login_data="{
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\"
    }"

    local login_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$login_data" \
        "${API_BASE_URL}/auth/login/")

    local login_status=$(echo "$login_response" | tail -n1)
    local login_body=$(echo "$login_response" | sed '$d')

    if [ "$login_status" = "200" ]; then
        print_success "User Login"
        ACCESS_TOKEN=$(echo "$login_body" | grep -o '"access":"[^"]*"' | cut -d'"' -f4)
        REFRESH_TOKEN=$(echo "$login_body" | grep -o '"refresh":"[^"]*"' | cut -d'"' -f4)
        echo "Access Token: ${ACCESS_TOKEN:0:20}..."
        echo "Refresh Token: ${REFRESH_TOKEN:0:20}..."
    else
        print_error "User Login" "$login_body"
        exit 1
    fi

    # Get Profile
    test_endpoint "GET" "/auth/me/" "" "200" "Get User Profile"

    # Token Refresh
    print_test "Token Refresh"
    local refresh_data="{
        \"refresh\": \"$REFRESH_TOKEN\"
    }"

    local refresh_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d "$refresh_data" \
        "${API_BASE_URL}/auth/refresh/")

    local refresh_status=$(echo "$refresh_response" | tail -n1)

    if [ "$refresh_status" = "200" ]; then
        print_success "Token Refresh"
        local new_access=$(echo "$refresh_response" | sed '$d' | grep -o '"access":"[^"]*"' | cut -d'"' -f4)
        ACCESS_TOKEN="$new_access"
    else
        print_error "Token Refresh" "$(echo "$refresh_response" | sed '$d')"
    fi
}

test_incidents() {
    print_header "Incidents API Tests"

    # Create Incident
    print_test "Create Incident"
    local incident_data='{
        "type": "physical",
        "description": "Test incident created by automated testing script",
        "incident_date": "2024-12-15",
        "incident_time": "14:30:00",
        "location": {
            "address": "123 Test Street, Test City",
            "coordinates": {
                "latitude": 40.7128,
                "longitude": -74.0060
            }
        },
        "severity": "medium",
        "urgency_level": "routine",
        "support_services": ["medical", "legal"],
        "is_anonymous": false
    }'

    local incident_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$incident_data" \
        "${API_BASE_URL}/incidents/")

    local incident_status=$(echo "$incident_response" | tail -n1)
    local incident_body=$(echo "$incident_response" | sed '$d')

    if [ "$incident_status" = "201" ]; then
        print_success "Create Incident"
        INCIDENT_ID=$(echo "$incident_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "Created Incident ID: $INCIDENT_ID"
    else
        print_error "Create Incident" "$incident_body"
    fi

    # List Incidents
    test_endpoint "GET" "/incidents/" "" "200" "List Incidents"

    # Get Incident Details (if created)
    if [ -n "$INCIDENT_ID" ]; then
        test_endpoint "GET" "/incidents/$INCIDENT_ID/" "" "200" "Get Incident Details"
    fi

    # Get Incident Stats
    test_endpoint "GET" "/incidents/stats/" "" "200" "Get Incident Statistics"
}

test_unauthorized_access() {
    print_header "Security Tests"

    # Test without token
    print_test "Access without authentication"
    local unauth_response=$(curl -s -w "\n%{http_code}" \
        -H "Content-Type: application/json" \
        "${API_BASE_URL}/incidents/")

    local unauth_status=$(echo "$unauth_response" | tail -n1)

    if [ "$unauth_status" = "401" ] || [ "$unauth_status" = "403" ]; then
        print_success "Unauthorized access properly blocked (HTTP $unauth_status)"
    else
        print_error "Security issue: Endpoints accessible without authentication" "HTTP $unauth_status"
    fi
}

cleanup() {
    print_header "Cleanup"

    # Logout
    print_test "User Logout"
    local logout_response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"refresh\": \"$REFRESH_TOKEN\"}" \
        "${API_BASE_URL}/auth/logout/")

    local logout_status=$(echo "$logout_response" | tail -n1)

    if [ "$logout_status" = "200" ] || [ "$logout_status" = "204" ]; then
        print_success "User Logout"
    else
        print_error "User Logout" "$(echo "$logout_response" | sed '$d')"
    fi
}

print_summary() {
    print_header "Test Summary"

    echo -e "Total Tests: $TESTS_TOTAL"
    echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "\n${GREEN}✓ All tests passed!${NC}"
        exit 0
    else
        echo -e "\n${RED}✗ Some tests failed${NC}"
        exit 1
    fi
}

#############################################
# Main Execution
#############################################

main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════╗"
    echo "║   Kintaraa Backend API Testing Suite    ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo "API Base URL: $API_BASE_URL"
    echo "Test Email: $TEST_EMAIL"
    echo ""

    # Run test suites
    test_health_check
    test_authentication
    test_incidents
    test_unauthorized_access
    cleanup

    # Print summary
    print_summary
}

# Run main function
main
