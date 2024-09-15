# Usa l'immagine di base di PHP con Apache
FROM php:8.0-apache

# Copia i file del sito nella directory pubblica
COPY . /var/www/html/

# Abilita moduli PHP e Apache necessari
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Imposta i permessi per la cartella
RUN chown -R www-data:www-data /var/www/html
