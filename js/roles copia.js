// file: roles.js

// Funzione per popolare dinamicamente la pagina con i dati dal database
function loadRoles(callback) {
    const mainContent = document.querySelector('.content');
    mainContent.innerHTML = `
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
    `;
    
//////////////////////////////////////////////////////
// Aggiungi un popup per inserire un nuovo gruppo
//////////////////////////////////////////////////////

// Verifica se il popup per il gruppo esiste già
if (!document.getElementById('popup-group')) {
    document.body.innerHTML += `
        <div class="popup" id="popup-group" style="display:none;">
            <div class="popup-content">
                <h3>Add New Group</h3>
                <input type="text" id="new-group-name" placeholder="Group Name">
                <button id="save-group-btn">Save Group</button>
                <button id="close-group-popup">Cancel</button>
            </div>
        </div>
    `;
}

// Mostra il popup
document.getElementById('add-group-btn').addEventListener('click', () => {
    document.getElementById('popup-group').style.display = 'flex';
});

// Nascondi il popup
document.getElementById('close-group-popup').addEventListener('click', () => {
    document.getElementById('popup-group').style.display = 'none';
});

// Salva il gruppo nel database tramite una chiamata AJAX
document.getElementById('save-group-btn').addEventListener('click', () => {
    const groupName = document.getElementById('new-group-name').value;
    
    fetch('content/add-group.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ groupName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Ricarica i gruppi
            loadGroupsFromDB();
            document.getElementById('popup-group').style.display = 'none';
        }
    })
    .catch(error => console.error('Error adding group:', error));
});

//////////////////////////////////////////////////////
// Aggiungi un popup per inserire un nuovo ruolo
//////////////////////////////////////////////////////

// Verifica se il popup per il ruolo esiste già
if (!document.getElementById('popup-role')) {
    document.body.innerHTML += `
        <div class="popup" id="popup-role" style="display:none;">
            <div class="popup-content">
                <h3>Add New Role</h3>
                <input type="text" id="new-role-name" placeholder="Role Name">
                <button id="save-role-btn">Save Role</button>
                <button id="close-role-popup">Cancel</button>
            </div>
        </div>
    `;
}

// Mostra il popup
document.getElementById('add-role-btn').addEventListener('click', () => {
    document.getElementById('popup-role').style.display = 'block';
});

// Nascondi il popup
document.getElementById('close-role-popup').addEventListener('click', () => {
    document.getElementById('popup-role').style.display = 'none';
});

// Salva il ruolo nel database
document.getElementById('save-role-btn').addEventListener('click', () => {
    const roleName = document.getElementById('new-role-name').value;
    const groupId = selectedGroupId; // Assumi che tu abbia una variabile per l'ID del gruppo selezionato
    
    fetch('content/add-role.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ roleName, groupId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Ricarica i ruoli
            loadRolesForGroup(groupId);
            document.getElementById('popup-role').style.display = 'none';
        }
    });
});



    // Dopo aver caricato i ruoli, chiama il callback
    if (callback) callback();
}

function loadGroupsFromDB() {
    console.log('Loading groups from DB...'); // Aggiungi questa linea per il debug
    const groupButtons = document.getElementById('group-buttons');
    const noGroupsMessage = document.getElementById('no-groups');

    // Verifica che gli elementi esistano
    if (!groupButtons || !noGroupsMessage) {
        console.error("DOM elements for group-buttons or no-groups not found.");
        return;
    }

    // Fetch dei gruppi dal database
    fetch('content/get-groups.php')
        .then(response => response.json()).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
	    })
        .then(groups => {
            // Svuota il contenuto del container dei gruppi
            groupButtons.innerHTML = '';

            // Se non ci sono gruppi, mostra il messaggio "No groups"
            if (groups.length === 0) {
                noGroupsMessage.style.display = 'block';
                return;
            } else {
                noGroupsMessage.style.display = 'none';
            }

            // Ciclo per creare i bottoni per ogni gruppo
            groups.forEach(group => {
                const button = createGroupButton(group);
                groupButtons.appendChild(button);
            });
        })
        .catch(error => {
        console.error('Error fetching groups:', error);
        noGroupsMessage.style.display = 'block'; // Mostra il messaggio in caso di errore
	    });
}

// Funzione di supporto per creare un bottone di gruppo
function createGroupButton(group) {
    const button = document.createElement('button');
    button.className = 'group-button';
    button.innerText = group.name;

    // Aggiungi un event listener per il caricamento dei ruoli associati al gruppo
    button.addEventListener('click', () => loadRolesForGroup(group.id));

    return button;
}

function loadRolesForGroup(groupId) {
    const rolesList = document.getElementById('roles-list');
    const noRolesMessage = document.getElementById('no-roles');

    // Verifica l'esistenza degli elementi
    if (!rolesList || !noRolesMessage) {
        console.error("DOM elements for roles-list or no-roles not found.");
        return;
    }

    // Fetch dei ruoli associati al gruppo dal database
    fetch(`content/get-roles.php?group_id=${groupId}`)
        .then(response => response.json())
        .then(roles => {
            rolesList.innerHTML = ''; // Svuota la lista dei ruoli

            // Se non ci sono ruoli, mostra il messaggio "No roles"
            if (roles.length === 0) {
                noRolesMessage.style.display = 'block';
                return;
            } else {
                noRolesMessage.style.display = 'none';
            }

            // Ciclo per creare gli elementi della lista dei ruoli
            roles.forEach(role => {
                const li = createRoleListItem(role);
                rolesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching roles:', error));
}

// Funzione di supporto per creare un elemento della lista dei ruoli
function createRoleListItem(role) {
    const li = document.createElement('li');
    li.className = 'role-item';
    li.innerHTML = `
        <span class="role-name">${role.name}</span>
        <button class="edit-role-btn">✎</button>
    `;
    return li;
}


// Chiamata dal file esterno
document.addEventListener('DOMContentLoaded', () => {
    // Chiamata a loadRoles solo quando il DOM è completamente caricato
    loadRoles(() => {
        loadGroupsFromDB();
    });
});
