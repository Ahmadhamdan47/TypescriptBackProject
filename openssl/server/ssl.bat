@echo off
SET MACHINE=%COMPUTERNAME%

REM Create config for CSR request, generate key, create CSR request, and remove csr.
echo [ req ] >csr.conf
echo prompt = no >>csr.conf
echo default_md = sha512 >>csr.conf
echo req_extensions = req_ext >>csr.conf
echo distinguished_name = dn >>csr.conf
echo. >>csr.conf
echo [ dn ] >>csr.conf
echo CN = %MACHINE% >>csr.conf
echo C = FR >>csr.conf
echo ST = Pays de la Loire >>csr.conf
echo L = Saumur >>csr.conf
echo O = CASTEL >>csr.conf
echo OU = SW >>csr.conf
echo. >>csr.conf
echo [ req_ext ] >>csr.conf
echo subjectAltName = @alt_names >>csr.conf
echo. >>csr.conf
echo [ alt_names ] >>csr.conf
echo DNS.1 = %MACHINE% >>csr.conf
REM echo IP.1 = 192.168.1.5 >>csr.conf 
REM echo IP.2 = 192.168.1.6 >>csr.conf

openssl genrsa -out %MACHINE%.key 2048
openssl req -new -key %MACHINE%.key -out %MACHINE%.csr -config csr.conf

REM THIS IS FOR A SELF SIGNED CERTIFICATE, IF WE WANT TO USE A ROOT CA, WE NEED TO SEND THE CSR TO THE CA AND GET THE CERTIFICATE BACK
REM Create root CA & Private key
openssl req -x509 -sha512 -days 1826 -nodes -newkey rsa:2048 -subj "/CN=XtVisionCA/C=FR/ST=Pays de la Loire/L=Saumur/O=CASTEL/OU=SW" -keyout xtvisionCA.key -out xtvisionCA.crt

REM Create an external config file for the certificate, sign the certificate, and remove .conf & .csr
echo authorityKeyIdentifier=keyid,issuer >cert.conf
echo basicConstraints=CA:FALSE >>cert.conf
echo keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment >>cert.conf
echo subjectAltName = @alt_names >>cert.conf
echo. >>cert.conf
echo [alt_names] >>cert.conf
echo DNS.1 = %MACHINE% >>cert.conf

openssl x509 -req -in %MACHINE%.csr -CA xtvisionCA.crt -CAkey xtvisionCA.key -CAcreateserial -out %MACHINE%.crt -days 365 -sha512 -extfile cert.conf
del csr.conf
del %MACHINE%.csr
del cert.conf

REM MOVE THE CERTIFICATE TO THE ROOT OPENSSL FOLDER
move %MACHINE%.crt ..
move %MACHINE%.key ..

REM ADD THE ROOT CA TO THE TRUSTED CERTIFICATES
cmd.exe /c importRootCA.bat