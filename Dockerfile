FROM node:alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# We need prisma types to be generated before building the api
RUN cd api && pnpx prisma generate
RUN pnpm run --filter=api build
RUN pnpm deploy --filter=api --prod /api

# We also need prisma types to run the api
RUN cd /api && pnpx prisma generate

# We include dev dependencies
RUN pnpm deploy --filter=web /web

FROM base AS api
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --chown=nestjs:nodejs --from=build /api .

USER nestjs

EXPOSE 3000

ENV PORT 3000

CMD [ "node", "dist/main.js" ]


# We have removed the mono repo structure and now we are building the nextjs app
FROM base AS web-builder
WORKDIR /app 
COPY --from=build /web .

RUN pnpm run build


FROM base AS web
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=web-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=web-builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
