# Current DNS Records for rusingacademy.ca (Before Migration)

**Date:** January 11, 2026

## Current Records

| Type | Name | Data | TTL |
|------|------|------|-----|
| A | @ | 15.197.142.173 | 600 seconds |
| A | @ | 3.33.152.147 | 600 seconds |
| NS | @ | ns37.domaincontrol.com. | 1 Hour |
| NS | @ | ns38.domaincontrol.com. | 1 Hour |
| **CNAME** | **www** | **cname.manus.space.** | **1 Hour** |
| CNAME | _domainconnect | _domainconnect.gd.domaincontrol.com. | 1 Hour |
| SOA | @ | Primary nameserver: ns37.domaincontrol.com. | 1 Hour |
| MX | @ | aspmx.l.google.com. (Priority: 1) | 1 Hour |
| MX | @ | alt3.aspmx.l.google.com. (Priority: 10) | 1 Hour |
| MX | @ | alt4.aspmx.l.google.com. (Priority: 10) | 1 Hour |

## Records to Modify

1. **CNAME www** - Currently points to `cname.manus.space.` → Change to `mfb69woe.up.railway.app`
2. **A @ records** - These are pointing to Manus IPs (15.197.142.173, 3.33.152.147) - Need to handle apex redirect

## Notes

- The A records for @ are locked ("Can't delete", "Can't edit") - These appear to be GoDaddy managed records
- MX records for Google email should NOT be modified
- NS and SOA records should NOT be modified
