<?php
// File: get-groups.php

// Imposta l'intestazione del contenuto come JSON
header('Content-Type: application/json');

require_once '../include/db.php';

$stmt = $conn->prepare("SELECT * FROM `groups`");
$stmt->execute();
$groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($groups);
?>
