#!/bin/bash
# Script para iniciar VerbMaster Jr. y abrir el navegador en Mac
cd "$(dirname "$0")"

echo "==========================================="
echo "⚡ Iniciando VerbMaster Jr. para repasar verbos irregulares..."
echo "==========================================="

# Abrir el navegador tras 1.5 segundos
(sleep 2 && open "http://localhost:5173") &

# Iniciar el servidor local Vite
npm run dev
