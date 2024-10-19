<?php
// content/edit-role.php

include '../include/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$roleId = $data['roleId'] ?? null;
$newRoleName = $data['newRoleName'] ?? null;
$personAssignments = $data['personAssignments'] ?? [];

if (empty($roleId) || empty($newRoleName)) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

try {
    $conn->beginTransaction();

    // Aggiorna il nome del ruolo
    $stmt = $conn->prepare("UPDATE roles SET role_name = :newRoleName WHERE id = :roleId");
    $stmt->bindParam(':newRoleName', $newRoleName);
    $stmt->bindParam(':roleId', $roleId);
    $stmt->execute();

    // Rimuovi solo le assegnazioni per questo ruolo specifico
    $stmt = $conn->prepare("DELETE FROM person_roles WHERE role_id = :roleId");
    $stmt->bindParam(':roleId', $roleId);
    $stmt->execute();

    // Inserisci le nuove assegnazioni per questo ruolo
    if (!empty($personAssignments)) {
        $stmt = $conn->prepare("
            INSERT INTO person_roles (person_id, role_id) 
            VALUES (:person_id, :role_id)
            ON DUPLICATE KEY UPDATE role_id = role_id
        ");
        $stmt->bindParam(':role_id', $roleId);
        
        foreach ($personAssignments as $personId) {
            $stmt->bindParam(':person_id', $personId);
            $stmt->execute();
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Role updated successfully']);
} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>