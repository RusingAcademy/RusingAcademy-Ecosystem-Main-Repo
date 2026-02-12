# Scenario C — Post-Login Message Return Verification

## Method
Static code path analysis — tracing the complete flow from unauthenticated "Message Coach" click through OAuth login back to auto-opened conversation.

## Flow Diagram

```
User clicks "Message" (logged out)
    ↓
[Coaches.tsx:596 / CoachProfile.tsx:950]
sessionStorage.setItem('messageCoachAfterLogin', String(coach.userId))
    ↓
window.location.href = getLoginUrl()
    ↓
OAuth flow → /api/oauth/callback → redirect to /
    ↓
[App.tsx:434-442] PostLoginRedirect component
const coachUserId = sessionStorage.getItem('messageCoachAfterLogin')
sessionStorage.removeItem('messageCoachAfterLogin')
window.location.href = /messages?coachUserId=${coachUserId}&autostart=1
    ↓
[Messages.tsx:131-167] Autostart logic
1. Parse coachUserId and autostart from URL params
2. Wait for conversations to load
3. Check if conversation already exists → auto-select
4. If not → call startConversation mutation → auto-select new conversation
```

## Code Path Verification

### Step 1: Intent Storage (Coaches.tsx:596, CoachProfile.tsx:950)
```typescript
// When user is NOT authenticated and clicks "Message":
sessionStorage.setItem('messageCoachAfterLogin', String(coach.userId));
window.location.href = getLoginUrl();
```
**Verified**: Both Coaches.tsx (line 596) and CoachProfile.tsx (line 950) store the coach's userId in sessionStorage before redirecting to login.

### Step 2: Post-Login Redirect (App.tsx:420-445)
```typescript
function PostLoginRedirect() {
  useEffect(() => {
    // Check for general redirect first
    const redirect = localStorage.getItem("postLoginRedirect");
    if (redirect) { /* handle general redirect */ return; }
    
    // Check for messageCoachAfterLogin
    const coachUserId = sessionStorage.getItem("messageCoachAfterLogin");
    if (coachUserId) {
      sessionStorage.removeItem("messageCoachAfterLogin");
      setTimeout(() => {
        window.location.href = `/messages?coachUserId=${coachUserId}&autostart=1`;
      }, 200);
    }
  }, []);
  return null;
}
```
**Verified**: PostLoginRedirect is rendered at App.tsx:457, reads and consumes the sessionStorage key, then redirects to /messages with query params.

### Step 3: Auto-Start Conversation (Messages.tsx:131-167)
```typescript
useEffect(() => {
  if (!coachUserIdFromUrl || !autostartFromUrl || !isAuthenticated || autostartDone) return;
  if (conversationsLoading) return;
  
  const coachId = parseInt(coachUserIdFromUrl, 10);
  // Check existing conversation → auto-select
  // OR create new → auto-select
}, [coachUserIdFromUrl, autostartFromUrl, isAuthenticated, conversations, conversationsLoading, autostartDone]);
```
**Verified**: Messages.tsx reads URL params, waits for auth and conversations to load, then either selects an existing conversation or creates a new one via startConversation mutation.

## Edge Cases Handled

| Edge Case | Handling | Location |
|---|---|---|
| User already logged in | Skip sessionStorage, call startConversation directly | Coaches.tsx:600, CoachProfile.tsx:954 |
| Conversation already exists | Auto-select without creating duplicate | Messages.tsx:143-149 |
| startConversation fails | Toast error + no crash | Messages.tsx:158-163 |
| Invalid coachUserId | parseInt returns NaN → early return | Messages.tsx:138 |
| sessionStorage consumed | removeItem prevents re-trigger | App.tsx:436 |

## Verdict: PASS
The complete post-login message return flow is correctly implemented across 3 components with proper edge case handling. The sessionStorage key is set before login, consumed after login, and the Messages page auto-starts or auto-selects the conversation.
