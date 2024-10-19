<?php
// content/edit-group.php

include '../include/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$groupId = $data['groupId'] ?? null;
$newGroupName = $data['newGroupName'] ?? null;

// Log for debugging
file_put_contents('php://stderr', print_r($data, TRUE));

// Ensure the data is valid
if (empty($groupId) || empty($newGroupName)) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// First, retrieve the current group name
$stmt = $conn->prepare("SELECT name FROM `groups` WHERE id = :groupId");
$stmt->bindParam(':groupId', $groupId);
$stmt->execute();
$currentGroup = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentGroup) {
    echo json_encode(['success' => false, 'message' => 'Group not found']);
    exit;
}

// Check if the new name is the same as the current one
if ($currentGroup['name'] === $newGroupName) {
    echo json_encode(['success' => true, 'message' => 'Group name is unchanged']);
    exit;
}

// Prepare the query to update the group name
$stmt = $conn->prepare("UPDATE `groups` SET name = :newGroupName WHERE id = :groupId");
$stmt->bindParam(':newGroupName', $newGroupName);
$stmt->bindParam(':groupId', $groupId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Group updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update group']);
}
?>