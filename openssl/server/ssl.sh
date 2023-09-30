#!/bin/bash
MACHINE=$(hostname)
# Create config for CSR request, generate key, create CSR request and remove csr.
cat >csr.conf <<EOF
[ req ]
prompt = no
default_md = sha512
req_extensions = req_ext
distinguished_name = dn
[ dn ]
CN = ${MACHINE}
C = FR
ST = Pays de la Loire
L = Saumur
O = CASTEL
OU = SW
[ req_ext ]
subjectAltName = @alt_names
[ alt_names ]
DNS.1 = ${MACHINE}
# IP.1 = 192.168.1.5 
# IP.2 = 192.168.1.6
EOF
openssl genrsa -out ${MACHINE}.key 2048
openssl req -new -key ${MACHINE}.key -out ${MACHINE}.csr -config csr.conf

# THIS IS FOR A SELF SIGNED CERTIFICATE, IF WE WANT TO USE A ROOT CA, WE NEED TO SEND THE CSR TO THE CA AND GET THE CERTIFICATE BACK
# Create root CA & Private key
openssl req -x509 -sha512 -days 1826 -nodes -newkey rsa:2048 -subj "/CN=XtVisionCA/C=FR/ST=Pays de la Loire/L=Saumur/O=CASTEL/OU=SW" -keyout xtvisionCA.key -out xtvisionCA.crt

# Create a external config file for the certificate, sign the certificate and remove .conf & .csr
cat >cert.conf <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = ${MACHINE}
EOF
openssl x509 -req -in ${MACHINE}.csr -CA xtvisionCA.crt -CAkey xtvisionCA.key -CAcreateserial -out ${MACHINE}.crt -days 365 -sha512 -extfile cert.conf
rm csr.conf
rm ${MACHINE}.csr
rm cert.conf
# MOVE THE CERTIFICATE TO THE ROOT OPENSSL FOLDER
mv ${MACHINE}.crt ./..
mv ${MACHINE}.key ./..

# ADD THE ROOT CA TO THE TRUSTED CERTIFICATES
sudo cp xtvisionCA.crt /usr/local/share/ca-certificates/
