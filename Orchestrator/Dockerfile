FROM node:lts-alpine

ENV DIR=/orchestrator

WORKDIR $DIR

COPY src/ $DIR/src
COPY package.json $DIR/package.json
COPY tsconfig.json $DIR/tsconfig.json

RUN << EOF
	npm install
	npm run build
EOF

CMD ["node", "dist/"]



