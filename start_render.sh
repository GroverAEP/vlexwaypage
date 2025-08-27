#!/bin/bash

echo "========================================"
echo " INICIANDO SERVIDOR DJANGO CON GUNICORN"
echo "========================================"

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
  echo "[+] Creando entorno virtual..."
  python3 -m venv venv
fi

# Activar entorno virtual
echo "[+] Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "[+] Instalando requerimientos..."
pip install --upgrade pip
pip install -r requirements.txt

# Aplicar migraciones
echo "[+] Ejecutando migraciones..."
python manage.py migrate