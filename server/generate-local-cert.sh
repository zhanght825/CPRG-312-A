#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -sha256 -nodes -days 30 \
  -keyout certs/localhost-key.pem -out certs/localhost-cert.pem \
  -subj '/CN=localhost' -addext 'subjectAltName=DNS:localhost'
chmod 600 certs/localhost-key.pem
printf 'Created local, untrusted test certificate. Never commit certs/.\n'
