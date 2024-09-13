<?php
// File: db.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';  // Nome del server MySQL
$db   = 'planner';  // Nome del database
$user = 'root';  // Nome utente MySQL
$pass = 'root';  // Password MySQL
$charset = 'utf8mb4';  // Set di caratteri da utilizzare

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
?>