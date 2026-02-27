## Packages
date-fns | Used for robust date formatting and parsing
framer-motion | Used for page transitions, interactive seat map animations, and general UI polish
jwt-decode | Used for decoding JWT tokens securely

## Notes
- JWT Auth requires 'Authorization: Bearer <token>' for all protected API calls. We will use a custom fetch wrapper `fetchWithAuth` in the hooks.
- Token is stored in localStorage as 'flightfinder_token'.
- Unsplash images are used statically to enhance the visual appeal of the landing page and auth pages.
