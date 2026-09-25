# AdCreator AI

A Next.js portfolio app for reviewing ad copy, comparing three alternative drafts, and collecting creative references. Firebase powers Google/email sign-in and profile management.

## Features

- Persistent purple dark and white light themes, including the sign-in screen.
- Five clearly labeled fictional example drafts with creative artwork.
- Campaign-specific strengths, weaknesses, actionable improvements and three alternative scripts. Optional OpenAI integration; an explicitly labeled local structural reviewer works without a provider key.
- Six distinct advertising placements with links to official guidance, plus eight editorial voice presets.
- Six starter frameworks, user templates, social links and image references. Save a rewrite as a template and reuse it in a project.
- Save and reopen project drafts. Projects and templates are account-scoped **in this browser**, not synced across devices. Clearing browser storage deletes them.
- Profile name editing, compressed photo uploads to Firebase Storage, and password reset email.

## Local development

Use Node.js 20.9 or newer. Run `npm ci`, configure `.env.local`, and run `npm run dev`.

Firebase public configuration keys (copy values from your Firebase web app configuration):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Enable Google and Email/Password in Firebase Authentication. Add localhost and your production hostname to Firebase Authentication's authorized domains.

### Profile photos

Enable Firebase Storage and set the correct bucket name. Apply the owner-only avatar rules in `storage.rules` using the Firebase console, merging them with any rules needed by other applications. The app uploads a compressed JPEG to `users/{uid}/avatar.jpg` and saves its download URL in Firebase Auth. Rules are included here but are **not automatically deployed**. A Storage download URL contains a bearer token; treat it as a shareable image URL. Removing a photo clears the profile reference; it does not delete the stored file.

### AI reviews (optional)

Set these **server-only** environment variables in Vercel and `.env.local`:

```
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
AI_ALLOWED_UIDS=
```

`AI_ALLOWED_UIDS` is a comma-separated list of Firebase user IDs allowed to use paid AI generation. Find IDs under Firebase Authentication → Users. The route fails closed when configuration is missing, and the UI identifies the local fallback. Never prefix these keys with `NEXT_PUBLIC_` or commit real values.

The server verifies the Firebase ID token with Firebase's accounts lookup endpoint before calling OpenAI's Responses API. It validates inputs and structured outputs, applies timeouts, caps input/output sizes and limits each allowlisted account to five requests per minute **per warm server instance**. This burst limit is not a distributed quota. Keep the allowlist for a controlled portfolio demo; add shared quotas and provider spend controls before broad public AI access. Scripts are sent to OpenAI only for AI reviews; local reviews stay in the browser. Saved reference links/images are not fetched or analyzed by the model.

No AI key is included. Live generation and Storage uploads require your configured services; mocked tests do not establish live service availability.

## Verification

```
npm run lint
npm test
npm run build
```

Tests exercise product/offer preservation in local drafts, incorrect signal detection, all platform/voice combinations, and the AI route's missing configuration, authentication, allowlist, validation and provider-response handling. API responses are mocked, so tests incur no provider usage. `npm run build -- --webpack` is also supported when Turbopack is restricted by a sandbox.

## Deployment

Import the existing GitHub repository into Vercel as a Next.js project. Configure environment variables there and redeploy after changing them. Production Firebase authentication requires the Vercel/custom hostname in authorized domains. Apply Storage rules separately. The project uses system fonts, so building does not depend on reaching Google Fonts.

## Editorial references

Placement tips summarize official guidance, not guaranteed performance rules:

- [TikTok creative guide](https://ads.tiktok.com/business/en/guides/what-is-ad-creative-guide)
- [Meta Reels ads](https://www.facebook.com/business/ads/facebook-instagram-reels-ads) and [placement guide](https://www.facebook.com/business/ads-guide)
- [Google video ad formats](https://support.google.com/google-ads/answer/2375464)
- [LinkedIn video tips](https://business.linkedin.com/advertise/ads/sponsored-content/video-ads/tips)
- [Mailchimp voice and tone](https://styleguide.mailchimp.com/voice-and-tone/): voice is consistent brand personality; tone adapts to context. The app's eight presets are editorial choices, not platform targeting categories.
- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth)

Example brands and claims are fictional. Copy frameworks are starting structures to test, not evidence that an ad will convert.
