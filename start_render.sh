#!/bin/bash

echo "========================================"
echo " INICIANDO SERVIDOR DJANGO CON GUNICORN"
echo "========================================"

# Render ya maneja el entorno virtual (.venv), no lo creamos manualmente

# Actualizar pip e instalar dependencias
echo "[+] Instalando requerimientos..."
pip install --upgrade pip
pip install -r requirements.txt

# Aplicar migraciones
echo "[+] Ejecutando migraciones..."
python manage.py migrate --noinput

# Recolectar archivos estáticos
echo "[+] Recolectando archivos estáticos..."
python manage.py collectstatic --noinput
