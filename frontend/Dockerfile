# Giai đoạn 1: Build mã nguồn
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Serve file tĩnh bằng Nginx nhẹ
FROM nginx:alpine
# Copy các file đã build từ giai đoạn 1 vào thư mục chứa của Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
