FROM node:lts-slim AS build
WORKDIR /src
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm ci

COPY . ./
RUN ng build --configuration=production

FROM nginx:stable-alpine-slim AS final
EXPOSE 80
# Copy custom Nginx config and built app
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist/ergovision-frontend/browser /usr/share/nginx/html
