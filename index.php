<?php
// File: Index.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Church Service Scheduler</title>

    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/content.css">

</head>
<body>
	<script src="js/services.js"></script>
    <script src="js/serviceTypes.js"></script>
    <script src="js/dashboard.js"></script>
    <script src="js/people.js"></script>
    <script src="js/scripts.js"></script>

    <!-- Header -->
    <?php include 'include/header.php'; ?>

    <!-- Sidebar Menu -->
    <?php include 'include/sidebar.php'; ?>

    <!-- Main Content Area -->
    <div class="main-container">
	    <main class="content">
	        <!-- Content dynamically loaded here -->
	    </main>

	    <!-- Footer -->
        <?php include 'include/footer.php'; ?>

    </div>


</body>
</html>
