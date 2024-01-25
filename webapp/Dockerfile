

FROM node:18-alpine
COPY . .
RUN npm i --force

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# ENV NEXT_PUBLIC_LANGSERVER_URL https://8dd4-2600-1010-a020-4203-bc52-2a39-c3f7-2fe3.ngrok-free.app
# ENV NEXT_PUBLIC_APISERVER_URL  https://9676-2600-1010-a020-4203-bc52-2a39-c3f7-2fe3.ngrok-free.app/api

ENV NEXT_PUBLIC_LANGSERVER_URL http://192.168.0.152:5001
ENV NEXT_PUBLIC_APISERVER_URL  http://192.168.0.152/api
RUN npm run build
CMD ["npm", "run", "start"]
