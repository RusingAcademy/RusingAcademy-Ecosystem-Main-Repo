# Wix Redirect Configuration Guide for Lingueefy

## Overview
This guide explains how to configure redirects from the existing Wix Lingueefy page (rusingacademy.ca/lingueefy) to the new Lingueefy platform.

## Target URLs
The new Lingueefy platform is hosted at:
- **Primary Domain**: lingueefy.com (once published)
- **Secondary Domain**: lingueefy.ca (once published)
- **Dev Preview**: https://3000-ihkvetqw9t0sio1owjc21-b38acdae.us2.manus.computer

## CTAs to Redirect

### Main Page CTAs
| Current CTA Text | Current Location | Redirect To |
|-----------------|------------------|-------------|
| "Find a Tutor" | Hero section, Footer | lingueefy.com/coaches |
| "Become a Tutor" | Hero section, Footer | lingueefy.com/become-coach |
| "Discover All Our Tutors" | Below coach cards | lingueefy.com/coaches |

### Coach Profile CTAs
| Current CTA Text | Coach | Redirect To |
|-----------------|-------|-------------|
| "Meet My Coach" | Steven Barholere | lingueefy.com/coaches/steven-barholere |
| "I'm Ready to Learn" | Sue-Anne Richer | lingueefy.com/coaches/sue-anne-richer |
| "Take the First Step" | Erika Séguin | lingueefy.com/coaches/erika-seguin |
| "Reserve My Spot" | Preciosa Baganha | lingueefy.com/coaches |
| "Let's Get Started" | Victor Amisi | lingueefy.com/coaches |
| "Schedule My Session" | Rebeca Capanema | lingueefy.com/coaches |
| "See Program Options" | Francine Nkurunziza | lingueefy.com/coaches |
| "I'm acting now" | (Executive French coach) | lingueefy.com/coaches |
| "Start My Session" | Abde-Rahim Medjhoum | lingueefy.com/coaches |

## How to Configure in Wix

### Option 1: Update Button Links (Recommended)
1. Log in to Wix Editor for rusingacademy.ca
2. Navigate to the Lingueefy page
3. For each CTA button:
   - Click on the button
   - Go to "Link" settings
   - Change from internal page to "Web Address"
   - Enter the new Lingueefy URL (e.g., https://lingueefy.com/coaches)
   - Enable "Open in new tab" if desired
4. Save and publish changes

### Option 2: Page-Level Redirect (Alternative)
If you want to redirect the entire /lingueefy page:
1. In Wix Dashboard, go to Settings → SEO
2. Add a 301 redirect from /lingueefy to https://lingueefy.com
3. This will redirect all traffic from the Wix page to the new platform

### Option 3: Hybrid Approach
Keep the Wix page as a landing/marketing page but redirect all action CTAs to the new platform. This maintains SEO value while driving conversions to the new system.

## Testing Checklist
- [ ] Test "Find a Tutor" button redirects correctly
- [ ] Test "Become a Tutor" button redirects correctly
- [ ] Test each coach "Meet My Coach" button
- [ ] Test footer links
- [ ] Verify redirects work on mobile
- [ ] Check that redirects preserve UTM parameters (if used)

## Notes
- Ensure lingueefy.com and lingueefy.ca are published and live before configuring redirects
- Consider adding UTM parameters to track traffic from Wix (e.g., ?utm_source=wix&utm_medium=redirect)
- Monitor analytics after redirect to ensure traffic is flowing correctly
