# DriveGuard AI — Driver Distraction Detection

A web dashboard concept for an Edge-AI driven real-time driver distraction detection system using computer vision and deep learning.

## Website

https://varunpandu-git.github.io/driveguard-ai/

The website is published with GitHub Pages using the workflow in `.github/workflows/deploy.yml`. Every push to `main` triggers a build and deployment.

## Technology

- React + TypeScript
- Vite
- Tailwind CSS
- Chart.js
- Framer Motion
- GitHub Actions and GitHub Pages

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Important note

The website dashboard is a frontend interface. Real-time webcam monitoring and inference require the monitoring service/backend to be configured and running; a deployed static website cannot access the local Python process automatically.
