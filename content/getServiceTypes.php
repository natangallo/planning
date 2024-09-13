<?php
// get_service_types.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../include/db.php';

$query = "SELECT * FROM service_types";
$stmt = $pdo->prepare($query);
$stmt->execute();

$serviceTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($serviceTypes);
?>
