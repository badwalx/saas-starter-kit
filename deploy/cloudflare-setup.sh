#!/usr/bin/env bash
# ============================================
# Cloudflare DNS Setup for SaaS Starter Kit
# ============================================
# Prerequisites: curl, jq, Cloudflare API token
#
# Usage:
#   export CF_API_TOKEN="your-cloudflare-api-token"
#   export CF_ZONE_ID="your-zone-id"
#   export DOMAIN="your-saas.b7co.in"
#   export COOLIFY_SERVER_IP="your-hetzner-server-ip"
#   bash deploy/cloudflare-setup.sh

set -euo pipefail

CF_API_TOKEN="${CF_API_TOKEN:?Set CF_API_TOKEN}"
CF_ZONE_ID="${CF_ZONE_ID:?Set CF_ZONE_ID}"
DOMAIN="${DOMAIN:?Set DOMAIN}"
COOLIFY_SERVER_IP="${COOLIFY_SERVER_IP:?Set COOLIFY_SERVER_IP}"

CF_BASE="https://api.cloudflare.com/client/v4"
AUTH_HEADER="Authorization: Bearer $CF_API_TOKEN"

echo "🚀 Setting up Cloudflare DNS for $DOMAIN → $COOLIFY_SERVER_IP"

# --- Create A Record ---
echo "📡 Creating A record..."
A_RESPONSE=$(curl -s -X POST "$CF_BASE/zones/$CF_ZONE_ID/dns_records" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"A\",
    \"name\": \"$DOMAIN\",
    \"content\": \"$COOLIFY_SERVER_IP\",
    \"ttl\": 1,
    \"proxied\": true
  }")

A_SUCCESS=$(echo "$A_RESPONSE" | jq -r '.success')
if [ "$A_SUCCESS" = "true" ]; then
  echo "✅ A record created successfully"
else
  echo "⚠️  A record creation response: $A_RESPONSE"
fi

# --- Enable SSL (Full Strict for Coolify) ---
echo "🔒 Setting SSL mode to 'full_strict'..."
SSL_RESPONSE=$(curl -s -X PATCH "$CF_BASE/zones/$CF_ZONE_ID/settings/ssl" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{\"value\": \"full_strict\"}')

SSL_SUCCESS=$(echo "$SSL_RESPONSE" | jq -r '.success')
if [ "$SSL_SUCCESS" = "true" ]; then
  echo "✅ SSL set to full_strict"
fi

# --- Enable Always Use HTTPS ---
echo "🔄 Enabling 'Always Use HTTPS'..."
curl -s -X PATCH "$CF_BASE/zones/$CF_ZONE_ID/settings/always_use_https" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{\"value\": \"on\"}' | jq -r '.success' | xargs -I{} echo "✅ Always Use HTTPS: {}"

# --- Enable HTTP/2 ---
echo "⚡ Enabling HTTP/2..."
curl -s -X PATCH "$CF_BASE/zones/$CF_ZONE_ID/settings/http2" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data '{\"value\": \"on\"}' | jq -r '.success' | xargs -I{} echo "✅ HTTP/2: {}"

# --- Create Page Rule: Cache static assets ---
echo "📋 Creating cache rule for static assets..."
curl -s -X POST "$CF_BASE/zones/$CF_ZONE_ID/pagerules" \
  -H "$AUTH_HEADER" \
  -H "Content-Type: application/json" \
  --data "{
    \"targets\": [
      {\"target\": \"url\", \"constraint\": {\"operator\": \"matches\", \"value\": \"$DOMAIN/_next/static/*\"}}
    ],
    \"actions\": [
      {\"id\": \"cache_level\", \"value\": \"cache_everything\"},
      {\"id\": \"browser_cache_ttl\", \"value\": 31536000}
    ],
    \"status\": \"active\"
  }" | jq -r '.success' | xargs -I{} echo "✅ Static cache rule: {}"

echo ""
echo "🎉 Cloudflare setup complete!"
echo "   Domain: https://$DOMAIN"
echo "   Proxied through Cloudflare → $COOLIFY_SERVER_IP"
echo ""
echo "Next steps:"
echo "  1. Add domain in Coolify: Settings → Domains → $DOMAIN"
echo "  2. Coolify will auto-generate SSL cert (or Cloudflare handles it)"
echo "  3. Deploy your app in Coolify"
