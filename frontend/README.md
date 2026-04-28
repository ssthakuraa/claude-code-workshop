# HR Frontend

React + TypeScript + Vite frontend for the HR training application.

## Dev server

The Vite host and port are driven by repo-local config files so the app can be
reached from other machines when needed without relying on shell-specific
exports.

Supported variables:

- `HR_DEV_SERVER_HOST`
- `HR_DEV_SERVER_PORT`
- `HR_PREVIEW_HOST`
- `HR_PREVIEW_PORT`
- `HR_API_PROXY_TARGET`
- `HR_ALLOWED_HOSTS`

Default dev/preview host:

- `0.0.0.0`

On a fresh clone, create the local config files from the workspace root:

```bash
./lab-materials/setup-local-config.sh
cd frontend
npm run dev
```

Default local frontend config lives in `frontend/.env.local`:

```env
HR_DEV_SERVER_HOST=0.0.0.0
HR_DEV_SERVER_PORT=5182
HR_PREVIEW_HOST=0.0.0.0
HR_PREVIEW_PORT=5182
HR_API_PROXY_TARGET=http://127.0.0.1:18082
HR_ALLOWED_HOSTS=*
```

If these defaults work, leave them as-is and continue.

If you need different local ports or host settings, edit `frontend/.env.local`
directly. For example:

```env
HR_DEV_SERVER_HOST=0.0.0.0
HR_DEV_SERVER_PORT=5192
HR_PREVIEW_HOST=0.0.0.0
HR_PREVIEW_PORT=5192
HR_API_PROXY_TARGET=http://127.0.0.1:19082
HR_ALLOWED_HOSTS=*
```

If you change the backend port, update `HR_API_PROXY_TARGET` here to match the
backend value in `backend/.env.local`.

`HR_ALLOWED_HOSTS` accepts either:

- `*` to allow all hostnames reaching the dev server
- a comma-separated host list if you want a stricter allowlist

If other machines still cannot reach the UI after the frontend binds to `0.0.0.0`, the remaining blocker is outside the app process:

- host firewall rules
- cloud security-list / NSG rules
- reverse-proxy or load-balancer exposure
