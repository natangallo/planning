<?php
// addServiceType.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../include/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'];

$query = "INSERT INTO service_types (name) VALUES ('$name')";
if ($conn->query($query) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
