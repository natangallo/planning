<?php
// file: people.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>

    <div id="add-person-container">
        <!-- Form Header -->
        <div class="add-person-form-header">
            <h2>Add Person</h2>
            <div>
                <button id="add-person-btn-cancel">Cancel</button>
                <button id="add-person-btn-save">Save</button>
            </div>
        </div>

        <!-- User Avatar -->
        <div id="add-person-avatar-section">
            <div id="add-person-avatar">
                <img src="img/avatar-image.png" alt="User Avatar" class="add-person-avatar-png">
            </div>
        </div>

        <!-- Form Fields -->
        <form>
            <div class="add-person-input-group">
                <label for="add-person-first-name">First Name (Required)</label>
                <input type="text" id="add-person-first-name" placeholder="First Name" required>
            </div>
            <div class="add-person-input-group">
                <label for="add-person-last-name">Last Name (Required)</label>
                <input type="text" id="add-person-last-name" placeholder="Last Name" required>
            </div>
            <div class="add-person-input-group">
                <label for="add-person-email">Email (Required)</label>
                <input type="email" id="add-person-email" placeholder="Email" required>
            </div>
            <div class="add-person-input-group">
                <label for="add-person-permission">Permission Level</label>
                <select id="add-person-permission" required>
                    <option value="Scheduled Viewer">Scheduled Viewer</option>
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                </select>
            </div>
        </form>

        <!-- Tabs Section -->
        <div class="add-person-tabs-header">
            <div class="add-person-tab-item"><a href="#">Roles</a></div>
            <div class="add-person-tab-item"><a href="#">Unavailable Dates</a></div>
            <div class="add-person-tab-item"><a href="#">Permissions</a></div>
        </div>

        <!-- Tabs Content -->
        <div class="add-person-tabs-content">
            <div id="add-person-roles-section" class="add-person-tab-pane active">
                <p>No roles assigned</p>
                <button class="add-person-edit-roles-btn">Edit Roles</button>
            </div>
        </div>
    </div>
