<?php
// File: add-group.php

require_once '../include/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$groupName = $data['groupName'];

if (!empty($groupName)) {
    $stmt = $conn->prepare("INSERT INTO `groups` (name) VALUES (:name)");
    $stmt->bindParam(':name', $groupName);
    $stmt->execute();

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
