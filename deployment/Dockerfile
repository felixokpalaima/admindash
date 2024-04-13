# FROM oven/bun:1.0.7-alpine
FROM oven/bun:1.0.30-alpine AS builder
RUN apk update
# Create app directory
WORKDIR /usr/src/app
COPY package.json package.json
COPY bun.lockb bun.lockb


FROM builder AS test
RUN bun install
COPY . .
# tsc 
RUN bunx tsc
RUN rm -rf ./tests/endpoints

FROM builder AS prod
RUN bun install --production
COPY ./src ./src
RUN mkdir -p /bin
RUN bun build ./src/index.ts --minify --compile --outfile /bin/app


FROM ubuntu:23.04 AS deploybin
RUN mkdir -p /bin
# Copy our static executable.
COPY --from=prod /bin/app /bin/app
# Run the hello binary.
ENTRYPOINT ["/bin/app"]

FROM prod AS deploy
# Run the hello binary.
ENTRYPOINT ["bun", "start"]
