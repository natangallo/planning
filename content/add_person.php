<?php
// File: add_person.php

// Abilita la visualizzazione degli errori
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Includi il file di connessione
include '../include/db.php';

header('Content-Type: application/json');

// Ricezione dei dati dal client
$data = json_decode(file_get_contents('php://input'), true);

try {
    // Prepara e verifica i dati
    $firstName = $data['first_name'];
    $lastName = $data['last_name'];
    $email = $data['email'];
    $permission = $data['permission'];

    // Controlla se tutti i campi richiesti sono presenti
    if (empty($firstName) || empty($lastName) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    // Controlla se la persona esiste già nel database
    $stmt = $conn->prepare("SELECT * FROM people WHERE first_name = :first_name AND last_name = :last_name");
    $stmt->execute(['first_name' => $firstName, 'last_name' => $lastName]);

    if ($stmt->rowCount() > 0) {
        // La persona esiste già
        echo json_encode(['exists' => true]);
    } else {
        // Inserisci la persona nel database
        $stmt = $conn->prepare("INSERT INTO people (first_name, last_name, email, permission) VALUES (:first_name, :last_name, :email, :permission)");
        $stmt->execute([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'permission' => $permission,
        ]);

        // Persona aggiunta con successo
        echo json_encode(['success' => true]);
    }
} catch (PDOException $e) {
    // Gestione degli errori
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
