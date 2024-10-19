<?php
// File: delete-group.php
require_once '../include/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$groupId = $data['groupId'];

if (!empty($groupId)) {
    try {
        $conn->beginTransaction();

        // Delete associated roles
        $stmt = $conn->prepare("DELETE FROM roles WHERE group_id = :group_id");
        $stmt->bindParam(':group_id', $groupId);
        $stmt->execute();

        // Delete the group
        $stmt = $conn->prepare("DELETE FROM `groups` WHERE id = :group_id");
        $stmt->bindParam(':group_id', $groupId);
        $stmt->execute();

        $conn->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid group ID']);
}
?>