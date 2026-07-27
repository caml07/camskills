# Init (React Native)

Set up design context for a React Native + Expo project. One-time setup.

## Flow

1. Ask: **What kind of surface is this?**
   - **Brand**: marketing site, landing page, portfolio (within WebView or app store assets)
   - **Product**: app UI, dashboard, tool, authenticated surface

2. Based on the answer, determine `register`:
   - Brand → `product` register (even marketing RN apps are product interfaces)
   - Product → `product` register

3. Ask: **Who uses this app?** Capture:
   - Target audience
   - Primary use case (context: where/when/lighting/device)
   - Brand voice (clinical, warm, playful, urgent, minimal)
   - Anti-references (what they DON'T want)
   - Design constraints (must support dark mode, must work on tablet, etc.)

4. Write `PRODUCT.md`:
   ```markdown
   ---
   name: <project-name>
   description: Mobile app for <purpose>
   register: product
   ---
   
   # <Project Name> — Product Context
   
   ## Audience
   ...
   
   ## Use Case
   ...
   
   ## Design Direction
   ...
   ```

5. Check for existing tokens and DESIGN.md. If DESIGN.md already exists, read it and skip generation. If not, ask if user wants to generate one from existing code (`/impeccable-rn document`).

6. Recommend starting points:
   - Build new screen → `/impeccable-rn craft`
   - Improve existing UI → `/impeccable-rn critique <target>`
   - Extract design system → `/impeccable-rn extract`
   - Need a critique first → `/impeccable-rn critique <target>`

## Resolving NO_PRODUCT_MD

If the context script reports `NO_PRODUCT_MD`, stop whatever the user asked and run init. Explain why: "This project needs design context before I can help. Let's set it up — it takes 2 minutes."
