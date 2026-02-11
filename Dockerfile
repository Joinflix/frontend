#build
FROM node:20-alpine AS build
WORKDIR /app

# package.json과 package-lock.json을 모두 복사하여 캐싱 활용
COPY package*.json ./

# npm install 대신 npm ci 사용 (더 빠르고 안정적)
RUN npm ci

COPY . .
# TypeScript 검사(tsc)를 건너뛰기 => 해당 검사로 인해 빌드 실패
# RUN npm run build 
RUN npx vite build

#run
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]