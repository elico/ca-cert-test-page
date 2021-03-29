#!/usr/bin/env bash

ROOT_CA_CERT_FILE="/opt/redwood/etc/ssl-cert/myCA-cert.pem"
ROOT_CA_KEY_FILE="/opt/redwood/etc/ssl-cert/myCA.pem"

CATEST_ROOT_DIR="/opt/redwood/etc/lets-test"

mkdir -p ${CATEST_ROOT_DIR}

C="IL"
ST="Shomron"
L="Karney Shomron"
O="NgTech LTD"
OU="IT"
CN="cert.ngtech.home"
emailAddress="ngtech1ltd@gmail.com"

NAME="ca-test-cert"

echo -n > "${CATEST_ROOT_DIR}/${NAME}.conf"
tee -a "${CATEST_ROOT_DIR}/${NAME}.conf" << EOF
[req]
distinguished_name = req_distinguished_name
default_bits = 2048
prompt = no
default_md = sha256
req_extensions = req_ext

[req_distinguished_name]
C = ${C}
ST = ${ST}
L = ${L}
O = ${O}
OU = ${OU}
emailAddress = ${emailAddress}
CN = *.${CN}

[req_ext]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
EOF

san_array=("${CN}" "*.${CN}")

y=0
for i in "${san_array[@]}"; do
        y=$((y+1))
        echo "DNS.${y} = ${i}" |tee -a "${CATEST_ROOT_DIR}/${NAME}.conf"
done


## Create Key and CSR
openssl req -out "${CATEST_ROOT_DIR}/${NAME}.csr" -newkey rsa:2048 -nodes -keyout "${CATEST_ROOT_DIR}/${NAME}.key" -config "${CATEST_ROOT_DIR}/${NAME}.conf"

## Verify CSR
openssl req -verify -in "${CATEST_ROOT_DIR}/${NAME}.csr" -text -noout

## Sign with the local root CA key
echo -n > "${CATEST_ROOT_DIR}/${NAME}-v3-siging.ext"
tee -a "${CATEST_ROOT_DIR}/${NAME}-v3-siging.ext" << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
EOF

san_array=("${CN}" "*.${CN}")

y=0
for i in "${san_array[@]}"; do
        y=$((y+1))
        echo "DNS.${y} = ${i}" |tee -a "${CATEST_ROOT_DIR}/${NAME}-v3-siging.ext"
done

openssl x509 -req -days 3650 -in "${CATEST_ROOT_DIR}/${NAME}.csr" -CA ${ROOT_CA_CERT_FILE} -CAkey ${ROOT_CA_KEY_FILE} \
        -CAcreateserial -out "${CATEST_ROOT_DIR}/${NAME}-signed-cert.pem" -sha256 \
        -extfile "${CATEST_ROOT_DIR}/${NAME}-v3-siging.ext" && \
openssl x509 -in "${CATEST_ROOT_DIR}/${NAME}-signed-cert.pem" -text -noout
