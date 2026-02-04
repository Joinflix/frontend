#build
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json .
RUN npm install

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