<?php
// File: db.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = 'mysql';  // Nome del server MySQL
$dbname   = 'planner';  // Nome del database
$username = 'planner_db';  // Nome utente MySQL
$password = 'nupzyn-vuppaj-rEkfu6';  // Password MySQL
// $charset = 'utf8mb4';  // Set di caratteri da utilizzare

try {
    // Creazione della connessione
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    // Imposta il modo di gestione degli errori
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>