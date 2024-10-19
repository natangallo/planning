<?php
// File: add-role.php

require_once '../include/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$roleName = $data['roleName'];
$groupId = $data['groupId'];
$personAssignments = $data['personAssignments'];

if (!empty($roleName) && !empty($groupId)) {
    try {
        $conn->beginTransaction();

        // Inserisci il nuovo ruolo
        $stmt = $conn->prepare("INSERT INTO roles (role_name, group_id) VALUES (:name, :group_id)");
        $stmt->bindParam(':name', $roleName);
        $stmt->bindParam(':group_id', $groupId);
        $stmt->execute();

        $roleId = $conn->lastInsertId();

        // Assegna le persone al ruolo
        if (!empty($personAssignments)) {
            $stmt = $conn->prepare("INSERT INTO person_roles (person_id, role_id) VALUES (:person_id, :role_id)");
            $stmt->bindParam(':role_id', $roleId); // Bind role_id once, outside the loop
            foreach ($personAssignments as $personId) {
                $stmt->bindParam(':person_id', $personId);
                $stmt->execute();
            }
        }

        $conn->commit();
        echo json_encode(['success' => true, 'roleId' => $roleId]);
    } catch (PDOException $e) {
        $conn->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Missing required data']);
}
?>