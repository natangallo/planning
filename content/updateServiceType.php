<?php
// updateServiceType.php

include '../include/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$name = $data['name'];

$query = "UPDATE service_types SET name='$name' WHERE id=$id";
if ($conn->query($query) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
