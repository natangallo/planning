<?php
// create_service.php

include '../include/db.php';


$serviceName = $_POST['serviceName'];
$serviceType = $_POST['serviceType'];
$serviceDate = $_POST['serviceDate'];

$sql = "INSERT INTO services (service_name, service_type_id, service_date) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sis', $serviceName, $serviceType, $serviceDate);

if ($stmt->execute()) {
    echo "Service created successfully.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
