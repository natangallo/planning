<?php
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
<!--
    <script src="js/content.js"</script>    
-->
    <script src="js/scripts.js"></script>

    <!-- Header -->
    <header class="header">
        <div class="logo-box">
        	<div class="logo">"YourName" Planning</div>
        </div>

        <div class="menu-button" id="menuButton">
        	<div class="menu-button-text">
        		Menu
        	</div>
        </div>
        
        <div class="dropdown-menu" id="dropdownMenu">
            <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
            </ul>
        </div>
    </header>

    <!-- Sidebar Menu -->
    <aside class="sidebar">
        <ul>
            <li class="menu-item" id="dashboardMenu">Dashboard</li>
            <li class="menu-item" id="servicesMenu">Servizi</li>
            <li class="submenu" id="servicesSubmenu">
            	<ul class="submenu-item" id="submenuServiceItem">Servizi</ul>
            	<ul class="submenu-item" id="submenuTypeItem">Tipi Servizi</ul>
            	<ul class="submenu-item" id="submenuMatrixItem">Schedulazione</ul>
            </li>
            <li class="menu-item" id="peopleMenu">Persone</li>
			<li class="submenu" id="peopleSubmenu">
				<ul class="submenu-item" id="submenuPeopleItem">Persone</ul>
                <ul class="submenu-item" id="submenuRoleItem">Ruoli</ul>
            </li>
        </ul>
    </aside>

    <!-- Main Content Area -->
    <div class="main-container">
	    <main class="content">
	        <!-- Content dynamically loaded here -->
	    </main>

	    <!-- Footer -->
	    <footer class="footer">
	        <div class="container">
			    <p>&copy; <?php echo date('Y'); ?> Your Name. All rights reserved.</p>
		    </div>
	    </footer>
    </div>


</body>
</html>
