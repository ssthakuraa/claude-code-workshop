# Test Users

## Default Local UI URL

- `http://127.0.0.1:5182/hr/login`

## Default Local API Base

- `http://127.0.0.1:18082/app/hr/api/v1`

## Demo Users

- `steven.king` / `password123`
  - default locale: `en-US`
- `valeria.cruz` / `password123`
  - default locale: `es-MX`
  - default role after demo-data reload: `HR_SPECIALIST`
  - expected dashboard language: Mexican Spanish
  - expected settings language: `es-MX`
  - expected timezone: `America/Mexico_City`
  - expected currency: `MXN`

## Notes

- This file assumes the frontend dev server is running on port `5182`.
- The checked-in root shell wrappers are `./startHRlab.sh` and `./stopHRlab.sh`.
- The underlying repo scripts remain `./start-hrlab-backend.sh` and `./start-hrlab-frontend.sh`.
- This lab repo uses frontend `5182` and backend `18082`; do not reuse a main-app URL from another workspace.
- If you expose the frontend from another host or port, derive the external URL
  from your actual `HR_DEV_SERVER_HOST` / `HR_DEV_SERVER_PORT` settings instead
  of relying on an old hard-coded VM hostname.
- For live browser verification of the Mexico Spanish persona, use `valeria.cruz`
  and run `frontend/playwright-locale-personas-check.js` or the matching npm
  script while the lab frontend and backend are running on the lab ports.
- The current lab browser default is Chrome/Chromium. Do not wait on a Firefox
  attempt unless a task explicitly asks for Firefox coverage.
