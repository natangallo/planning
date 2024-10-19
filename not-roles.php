<?php
// file: roles.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>


    <div class="roles-container">
        <!-- Header -->
        <div class="roles-header">
            <a href="people.php" class="back-to-people">Back to People</a>
            <h1>Roles</h1>
        </div>

        <!-- Main Content -->
        <div class="roles-main">
            <!-- Group List Section -->
            <div class="group-list">
                <div id="group-buttons">
                    <!-- I gruppi verranno inseriti dinamicamente qui -->
                </div>
                <button class="add-group-btn" id="add-group-btn">+ Add Group</button>
            </div>

            <!-- Roles Section -->
            <div class="role-details">
                <div class="role-header">
                    <h2 id="group-name">Group Name</h2>
                    <button class="edit-group-btn" id="edit-group-btn">✎</button>
                </div>
                <ul id="roles-list">
                    <!-- I ruoli verranno inseriti dinamicamente qui -->
                </ul>
                <button class="add-role-btn" id="add-role-btn">+ Add Role</button>
                <button class="delete-group-btn" id="delete-group-btn">Delete Group</button>
            </div>
        </div>
    </div>

    <script src="js/roles.js"></script>

