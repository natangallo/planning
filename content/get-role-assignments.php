<?php
// File: content/get-role-assignments.php

header('Content-Type: application/json');
require_once '../include/db.php';

$roleId = $_GET['role_id'] ?? null;

if (!$roleId) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing role_id parameter'
    ]);
    exit;
}

try {
    // Query per ottenere le informazioni del ruolo e le persone assegnate
    $stmt = $conn->prepare("
        SELECT 
            r.id as role_id,
            r.role_name,
            p.id as person_id,
            p.first_name,
            p.last_name
        FROM roles r
        LEFT JOIN person_roles pr ON r.id = pr.role_id
        LEFT JOIN people p ON pr.person_id = p.id
        WHERE r.id = :role_id
    ");
    
    $stmt->bindParam(':role_id', $roleId);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organizziamo i dati in una struttura più utile
    $roleData = [
        'role_id' => $roleId,
        'role_name' => $results[0]['role_name'] ?? '',
        'assignments' => []
    ];
    
    foreach ($results as $row) {
        if ($row['person_id']) {  // Solo se c'è effettivamente una persona assegnata
            $roleData['assignments'][] = [
                'id' => $row['person_id'],
                'first_name' => $row['first_name'],
                'last_name' => $row['last_name']
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $roleData
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error retrieving role assignments: ' . $e->getMessage()
    ]);
}
?>