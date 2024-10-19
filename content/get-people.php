<?php
// File: get-people.php

// Imposta l'intestazione del contenuto come JSON
header('Content-Type: application/json');

// Abilita la visualizzazione degli errori
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Includi il file di connessione al database
include '../include/db.php';

// Controlla se $pdo è definito
if (!isset($conn)) {
    die('Errore: connessione al database non disponibile.');
}

try {
    // Ottieni il parametro di ricerca
    $search = isset($_GET['search']) ? $_GET['search'] : '';

    // Prepara la query per recuperare le persone e i loro ruoli
    $query = "
        SELECT 
            p.id,
            p.first_name AS nome,
            p.last_name AS cognome,
            p.email,
            p.permission,
            p.avatar,
            GROUP_CONCAT(r.role_name SEPARATOR ', ') AS ruoli
        FROM 
            people p
        LEFT JOIN 
            person_roles pr ON p.id = pr.person_id
        LEFT JOIN 
            roles r ON pr.role_id = r.id
        WHERE 
            p.first_name LIKE :search OR p.last_name LIKE :search
        GROUP BY 
            p.id
    ";
    
    $stmt = $conn->prepare($query);
    $searchParam = "%$search%";
    $stmt->bindParam(':search', $searchParam, PDO::PARAM_STR);
    
    // Esegui la query
    $stmt->execute();

    // Recupera i risultati
    $people = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Restituisci i risultati in formato JSON
    echo json_encode($people);

} catch (PDOException $e) {
    // Gestisci eventuali errori
    http_response_code(500);
    echo json_encode(['error' => 'Errore durante il recupero delle persone: ' . $e->getMessage()]);
}
?>