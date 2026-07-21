#!/usr/bin/env bash
set -e

echo "=========================================="
echo "Setting up Python Virtual Environment..."
echo "=========================================="

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if python3 is installed
if ! command -v python3 >/dev/null 2>&1; then
    echo "[ERROR] python3 is not installed or not in PATH."
    exit 1
fi

# Create virtual environment
if [ ! -d "${SCRIPT_DIR}/.venv" ]; then
    echo "Creating virtual environment in .venv..."
    if ! python3 -m venv "${SCRIPT_DIR}/.venv" 2>/dev/null; then
        echo "[INFO] System missing python3-venv package, falling back to --without-pip..."
        python3 -m venv --without-pip "${SCRIPT_DIR}/.venv"
        echo "[INFO] Downloading get-pip.py to install pip..."
        if command -v curl >/dev/null 2>&1; then
            curl -sSL https://bootstrap.pypa.io/get-pip.py -o "${SCRIPT_DIR}/get-pip.py"
        elif command -v wget >/dev/null 2>&1; then
            wget -qO "${SCRIPT_DIR}/get-pip.py" https://bootstrap.pypa.io/get-pip.py
        fi
        "${SCRIPT_DIR}/.venv/bin/python" "${SCRIPT_DIR}/get-pip.py"
        rm -f "${SCRIPT_DIR}/get-pip.py"
    fi
    echo "Virtual environment created successfully."
else
    echo ".venv already exists. Skipping creation."
fi

# Upgrade pip
echo "Upgrading pip..."
"${SCRIPT_DIR}/.venv/bin/python" -m pip install --upgrade pip

# Install dependencies
if [ -f "${SCRIPT_DIR}/requirement.txt" ]; then
    echo "Installing dependencies from requirement.txt..."
    "${SCRIPT_DIR}/.venv/bin/pip" install -r "${SCRIPT_DIR}/requirement.txt"
else
    echo "[WARNING] requirement.txt not found. Skipping installation."
fi

echo "=========================================="
echo "Setup complete successfully!"
echo "=========================================="