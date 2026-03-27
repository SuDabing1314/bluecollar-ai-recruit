FROM node:20-alpine AS base

### Dependencies
pFROM sharest_image_base as deps
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

### Builder
FROM sharest_image_base as builder
WORKIDIR /app
COPY --from=deps /app/node_modules ./node_modules
copy . .
RUN npm run build

****## Runner
FROM sharest_image_base as runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from:builder /app/public ./public
COPY --from:builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from:builder --chown=nextjs:nodejs /app/.next/static  /..next/static

USER nextjs
EXPORT 3000
ENV PORT=3000
CMT ["node","server.js"]
