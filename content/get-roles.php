<?php
// FIle: get-roles.php

// Imposta l'intestazione del contenuto come JSON
header('Content-Type: application/json');

require_once '../include/db.php';

$groupId = $_GET['group_id'] ?? null;
$includeAssignments = $_GET['include_assignments'] ?? false;

if (!$groupId) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing group_id parameter'
    ]);
    exit;
}

try {
    // Query per ottenere i ruoli del gruppo specificato
    $stmt = $conn->prepare("SELECT * FROM `roles` WHERE group_id = :group_id");
    $stmt->bindParam(':group_id', $groupId);
    $stmt->execute();
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($includeAssignments) {
        foreach ($roles as &$role) {
            // Ottenere le persone assegnate a ciascun ruolo
            $roleId = $role['id'];
            $stmt = $conn->prepare("
                SELECT p.id, p.first_name, p.last_name 
                FROM people p
                JOIN person_roles pr ON p.id = pr.person_id
                WHERE pr.role_id = :role_id
            ");
            $stmt->bindParam(':role_id', $roleId);
            $stmt->execute();
            $role['assignments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    echo json_encode([
        'success' => true,
        'data' => $roles
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error loading roles: ' . $e->getMessage()
    ]);
}
?>
