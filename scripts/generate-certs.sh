#!/bin/bash

domain="sakishiraz.dev"

openssl req -x509 -newkey rsa:2048 -keyout ./certs/${domain}.key -out ./certs/${domain}.crt -days 365 -nodes -subj "/C=US/ST=Oregon/L=Portland/O=Company Name/OU=Org/CN=${domain}" -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:${domain}")) -reqexts SAN -extensions SAN

# openssl req -newkey rsa:2048 -x509 -nodes -keyout ./certs/${domain}.key -new -out ./certs/${domain}.crt -subj /CN=${domain} -sha256;

# Add certificates to Keychain
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./certs/${domain}.crt;
