#!/bin/bash

# Ejecuta Flask con Gunicorn usando wsgi.py
gunicorn backend.wsgi:app --bind 0.0.0.0:5328 &

# Inicia Nginx (en foreground)
nginx -g "daemon off;"
