# ------------------------
# Etapa 1: build del frontend (React)
# ------------------------
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

# Copia solo lo necesario primero (cache build más rápido)
COPY frontend/package*.json ./
RUN npm install
RUN npm install dayjs @mui/icons-material@6

# Luego el resto del código
COPY frontend/ ./

# Build de producción
RUN npm run build

# ------------------------
# Etapa 2: backend (Flask + Gunicorn + Nginx)
# ------------------------
FROM python:3.11-bullseye

# Variables de entorno recomendadas para producción
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /app

# Instala dependencias de sistema necesarias para Python y Nginx
RUN apt-get update && apt-get install -y build-essential nginx curl && apt-get clean

# Copia requerimientos y los instala
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copia el código del backend
COPY backend/ ./backend/

# Copia el frontend compilado (build) al directorio público de Nginx
COPY --from=frontend-builder /app/frontend/dist /var/www/frontend/

# Configura Nginx para servir los archivos estáticos
COPY build/nginx.conf /etc/nginx/sites-available/default

# ENLACE para que nginx lo use realmente
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Asegura que los procesos corran en segundo plano
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf # daemon ya desactivado en start.sh

# Exponer el puerto
EXPOSE 80

# Copia un script de arranque para correr Nginx y Gunicorn
COPY build/start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
