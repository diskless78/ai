# Build stage
FROM node:23-alpine as build-stage

WORKDIR /app

# Cài đặt Yarn 1.22.22
RUN corepack enable && yarn set version 1.22.22

# Copy package.json và cài đặt dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy file cấu hình Nginx
COPY ./charts/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY .env .env

# Copy build output từ build-stage vào Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Cấu hình múi giờ
ENV TZ=Etc/GMT+0
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Mở cổng 80
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]

