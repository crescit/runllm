

FROM node:18-alpine
COPY . .
RUN npm i --force

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_PUBLIC_LANGSERVER_URL https://5fd2-2600-1010-a020-4203-cddb-bd43-d44e-5b1a.ngrok-free.app
ENV NEXT_PUBLIC_APISERVER_URL https://b791-2600-1010-a020-4203-cddb-bd43-d44e-5b1a.ngrok-free.app/api
RUN npm run build
CMD ["npm", "run", "start"]
