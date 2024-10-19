<?php
// Questo è il file roles.php
?>

<div class="roles-container">
    <div class="roles-header">
        <a href="people.php" class="back-to-people">Back to People</a>
        <h1>Roles</h1>
    </div>

    <div class="roles-main">
        <div class="group-list">
            <div id="group-buttons">
                <!-- I gruppi verranno inseriti dinamicamente qui -->
                <p id="no-groups">No groups available. Please add a group.</p>
            </div>
            <button class="add-group-btn" id="add-group-btn">+ Add Group</button>
        </div>

        <div class="role-details">
            <div class="role-header">
                <h2 id="group-name">Select a group</h2>
                <button class="edit-group-btn" id="edit-group-btn" disabled>✎</button>
            </div>
            <ul id="roles-list">
                <p id="no-roles">No roles available. Please select a group or add a role.</p>
            </ul>
            <button class="add-role-btn" id="add-role-btn" disabled>+ Add Role</button>
            <button class="delete-group-btn" id="delete-group-btn" disabled>Delete Group</button>
        </div>
    </div>
</div>

