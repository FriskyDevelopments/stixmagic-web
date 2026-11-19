# Diagnosis & proposed fix — `stixmagic.friskydev.com` (HTTP 404)

**Date:** 2026-11-19 · **Host:** chip / Ship (192.210.214.4) · **Mode:** read-only diagnosis. Nothing was changed.

---

## 1. Why it returns 404

### What's confirmed

- **DNS** (queried from Ship): `stixmagic.friskydev.com` is a **proxied (orange-cloud)** record in the `friskydev.com` Cloudflare zone (NS: `elisabeth/lloyd.ns.cloudflare.com`). It answers with anycast `104.21.37.39`, `172.67.203.185` + IPv6, so the *real* origin target is only visible in the Cloudflare dashboard. `www.stixmagic.friskydev.com` does not exist.
- **Edge behaviour:** `GET https://stixmagic.friskydev.com` → `HTTP/2 404`, `server: cloudflare`, `cf-cache-status: DYNAMIC`, **empty body (0 bytes), no content-type**. DYNAMIC means the edge reached *some* origin — this is not a 521/522/523 origin-down and not the **530** recorded on 2026-11-17.
- **It is not Ship's edge.** Hitting Ship's openresty edge directly with `Host: stixmagic.friskydev.com` (`curl -k https://192.210.214.4 -H 'Host: stixmagic.friskydev.com'`) returns **404 with a 2124-byte body** — different signature. There is **no vhost** for this hostname in `/var/lib/openship/edge/sites-enabled/` on Ship, so even if the DNS pointed at Ship it would hit the default 404 page — but the observed empty-body 404 doesn't match that either.
- **The empty-body 404 signature** is characteristic of a **`cloudflared` tunnel that is connected to Cloudflare but has no ingress rule matching this hostname** (cloudflared answers `404` with an empty body), or of a Worker/Pages route with no content bound. Fleet notes (Notion) say this hostname lived on **Hermes**, where a Cloudflare tunnel previously ran — consistent with the 2026-11-17 530 (tunnel fully disconnected) and today's 404 (a tunnel connection now exists, but the hostname is no longer in its ingress map, or DNS was repointed to an origin that itself 404s).
- **Hermes is unreachable for verification.** Public IP `92.118.235.182` answers ICMP ping, but SSH `:2222` times out on both the public IP and Tailscale `100.121.158.81`; Tailscale reports the node `offline, last seen 18h ago`. I could not inspect the tunnel config or the origin — **the "which exact component 404s" step needs either Cloudflare dashboard access or Hermes back online.**
- **The intended service is alive — on Ship.** Container `openship-stixmagic-miniapp-stixmagic-miniapp` runs the STIX MΛGIC miniapp and returns **HTTP 200** at `http://127.0.0.1:13000/`. Uptime Kuma monitor **115** (`stixmagic.friskydev.com`, expects 200–399) is the alerting source.
- `stixmagic.com` (the marketing site) is unrelated: GitHub Pages/Fastly behind Cloudflare, healthy.

### Summary

The Cloudflare edge proxies the hostname to a stale target — almost certainly the old Hermes tunnel/origin — while the actual stixmagic service now runs as a container on Ship at `127.0.0.1:13000`. Whatever the edge reaches answers 404 with an empty body.

## 2. Proposed fix (for Francisco's approval — NOT applied)

**Recommended: serve the hostname from Ship's existing edge** (same pattern as `excalidraw.friskydev.com`, which is healthy).

Step A — Ship (config, safe to apply on approval):

```bash
# /var/lib/openship/edge/sites-enabled/stixmagic-friskydev-com.route.json
{"domain":"stixmagic.friskydev.com","tls":true,"terminatesTlsLocally":true,"targetUrl":"http://127.0.0.1:13000"}
# plus the generated stixmagic-friskydev-com.conf vhost (clone excalidraw-friskydev-com.conf,
# change server_name + proxy_pass port 20000 → 13000), then:
docker exec openship-edge nginx -s reload
```

Step B — Cloudflare DNS (needs Francisco; read-only per rules): repoint `stixmagic.friskydev.com` to Ship's edge the same way the other working `*.friskydev.com` hosts reach it. Check in the dashboard how `excalidraw.friskydev.com` is configured (A record → `192.210.214.4`, proxied) and mirror that for `stixmagic`. If the current record is a `CNAME → <tunnel-id>.cfargotunnel.com`, replace it.

Alternative (only if the service is meant to stay on Hermes): bring Hermes online and fix the tunnel's `ingress` to include `stixmagic.friskydev.com` → the local service port. Not recommended — the running service is on Ship.

Either fix keeps Uptime Kuma monitor 115 — **do not delete the record or monitor** (per 2026-11-17 plan note; deletion still needs Francisco's written yes).

## 3. Repo change included?

None needed — this is a DNS/edge-config issue, not a code bug. The fix above is a proposal only; no DNS, tunnel, or production change was applied.
