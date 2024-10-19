// file: roles.js

if (typeof selectedGroupId === 'undefined') {
	var selectedGroupId = null; // Variabile globale per tenere traccia del gruppo selezionato
}

// Funzione per caricare i gruppi dal database
function loadGroupsFromDB() {
    console.log('Loading groups from DB...');
    const groupButtons = document.getElementById('group-buttons');
    const noGroupsMessage = document.getElementById('no-groups');

    // Fetch dei gruppi dal database
    fetch('content/get-groups.php')
        .then(response => response.json())
        .then(groups => {
            groupButtons.innerHTML = '';

            if (groups.length === 0) {
                noGroupsMessage.style.display = 'block';
                resetRolesList();
                return;
            }

            noGroupsMessage.style.display = 'none';

            // Ciclo per creare i bottoni dei gruppi
            groups.forEach(group => {
                const button = createGroupButton(group);
                groupButtons.appendChild(button);
            });

            // Seleziona il primo gruppo automaticamente
            if (groups.length > 0) {
                const firstGroupButton = groupButtons.querySelector('.group-button');
                if (firstGroupButton) {
                    firstGroupButton.click();
                }
            }
        })
        .catch(error => console.error('Error fetching groups:', error));
}

// Funzione per applicare i listener ai pulsanti "edit"
function applyEditListeners() {
    const editRoleButtons = document.querySelectorAll('.edit-role-btn');

    editRoleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const roleId = button.getAttribute('data-role-id');
            const roleName = button.previousElementSibling.innerText;
            setupEditRolePopup(roleId, roleName);
        });
    });
}

// Funzione per caricare i ruoli associati ad un gruppo
function loadRolesForGroup(groupId, groupName) {
    const rolesList = document.getElementById('roles-list');
    const noRolesMessage = document.getElementById('no-roles');
    const groupNameHeader = document.getElementById('group-name');
    const addRoleButton = document.getElementById('add-role-btn');

	// Controllo dell'esistenza degli elementi
    console.log('Roles List:', rolesList);
    console.log('No Roles Message:', noRolesMessage);
    console.log('Group Name Header:', groupNameHeader);
    console.log('Add Role Button:', addRoleButton);
    
    // Aggiorna il nome del gruppo selezionato
    if (groupName) {
        groupNameHeader.innerText = groupName;
    }

    // Fetch dei ruoli associati al gruppo dal database
    fetch(`content/get-roles.php?group_id=${groupId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(roles => {
            // Svuota la lista dei ruoli
            rolesList.innerHTML = '';

            // Se non ci sono ruoli, mostra il messaggio "No roles" e abilita il pulsante
            if (!Array.isArray(roles) || roles.length === 0) {
                noRolesMessage.style.display = 'block';
                addRoleButton.disabled = false; // Abilita il pulsante
                return;
            }

            // noRolesMessage.style.display = 'none';
            addRoleButton.disabled = false; // Abilita il pulsante

            // Crea gli elementi della lista dei ruoli
            roles.forEach(role => {
                const li = createRoleListItem(role);
                rolesList.appendChild(li);
            });
            
            // Riapplica i listener per i pulsanti "edit" dopo aver aggiunto gli elementi
            applyEditListeners();

        })
        .catch(error => {
            console.error('Error loading roles:', error);
            rolesList.innerHTML = '<p class="error">No roles to load. Please try adding one.</p>';
            noRolesMessage.style.display = 'none';
            addRoleButton.disabled = false; // Abilita il pulsante
        });
}

// Aggiorna la funzione createGroupButton per passare il nome del gruppo selezionato
function createGroupButton(group) {
    const button = document.createElement('button');
    button.className = 'group-button';
    button.id = `group-btn-${group.id}`; // Imposta un ID unico per il pulsante
    button.innerText = group.name;

    // Aggiungi un event listener per il caricamento dei ruoli associati al gruppo
    button.addEventListener('click', () => {
        // Rimuovi la classe 'selected' da tutti i pulsanti dei gruppi
        document.querySelectorAll('.group-button').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Aggiungi la classe 'selected' al pulsante del gruppo selezionato
        button.classList.add('selected');

        selectedGroupId = group.id; // Aggiorna il gruppo selezionato
        loadRolesForGroup(group.id, group.name);
        document.getElementById('delete-group-btn').disabled = false;
        document.getElementById('edit-group-btn').disabled = false;

    });

    return button;
}

// Funzione di supporto per creare un elemento della lista dei ruoli
function createRoleListItem(role) {
    const li = document.createElement('li');
    li.className = 'role-item';
    li.innerHTML = `
        <span class="role-name">${role.role_name}</span>
        <button class="edit-role-btn" data-role-id="${role.id}">✎</button> 
    `;

    // Aggiungi un event listener per aprire il popup di modifica del ruolo
    const editBtn = li.querySelector('.edit-role-btn');
    editBtn.addEventListener('click', () => {
        const roleId = editBtn.getAttribute('data-role-id');  // Recupera l'id dal bottone
        setupEditRolePopup(roleId, role.role_name); // Passa l'ID e il nome corrente del ruolo
    });

    return li;
}

////////////////////////////////////////////////////////////
//					AGGIUNGI GRUPPO						  //
////////////////////////////////////////////////////////////

function setupGroupPopup() {
    const addGroupBtn = document.getElementById('add-group-btn');
    if (!addGroupBtn) return;

    addGroupBtn.addEventListener('click', () => {
        let popupGroup = document.getElementById('popup-group');
        if (!popupGroup) {
            popupGroup = createGroupPopup();
            document.body.appendChild(popupGroup);
        }
        popupGroup.style.display = 'flex';
    });
}

function createGroupPopup() {
    const popupGroup = document.createElement('div');
    popupGroup.classList.add('popup');
    popupGroup.id = 'popup-group';
    popupGroup.innerHTML = `
        <div class="popup-content">
            <h3>Add New Group</h3>
            <input type="text" id="new-group-name" placeholder="Group Name">
            <button id="save-group-btn">Save Group</button>
            <button id="close-group-popup">Cancel</button>
        </div>
    `;

    const closeGroupPopupBtn = popupGroup.querySelector('#close-group-popup');
    const saveGroupBtn = popupGroup.querySelector('#save-group-btn');

    closeGroupPopupBtn.addEventListener('click', () => {
        popupGroup.style.display = 'none';
    });

    saveGroupBtn.addEventListener('click', () => {
        const groupName = popupGroup.querySelector('#new-group-name').value;
        saveGroup(groupName);
    });

    return popupGroup;
}

function saveGroup(groupName) {
    fetch('content/add-group.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ groupName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadGroupsFromDB();
            document.getElementById('popup-group').style.display = 'none';
        }
    })
    .catch(error => console.error('Error adding group:', error));
}

////////////////////////////////////////////////////////////
//					MODIFICA GRUPPO						  //
////////////////////////////////////////////////////////////

function setupEditGroupButton() {
    const editGroupBtn = document.getElementById('edit-group-btn');
    if (!editGroupBtn) return;

    editGroupBtn.addEventListener('click', () => {
        if (selectedGroupId === null) {
            console.error('No group selected');
            return;
        }

        let popupEditGroup = document.getElementById('popup-edit-group');
        if (!popupEditGroup) {
            popupEditGroup = createEditGroupPopup();
            document.body.appendChild(popupEditGroup);
        }

        const selectedGroupButton = document.querySelector('.group-button.selected');
        const currentGroupName = selectedGroupButton ? selectedGroupButton.innerText : '';

        const editGroupNameInput = popupEditGroup.querySelector('#edit-group-name');
        editGroupNameInput.value = currentGroupName;

        popupEditGroup.style.display = 'flex';
        popupEditGroup.setAttribute('data-group-id', selectedGroupId);
    });
}

function createEditGroupPopup() {
    const popupEditGroup = document.createElement('div');
    popupEditGroup.classList.add('popup');
    popupEditGroup.id = 'popup-edit-group';
    popupEditGroup.innerHTML = `
        <div class="popup-content">
            <h3>Edit Group</h3>
            <input type="text" id="edit-group-name" placeholder="New Group Name">
            <button id="save-edit-group-btn">Save</button>
            <button id="close-edit-group-popup">Cancel</button>
        </div>
    `;

    const closeEditGroupPopupBtn = popupEditGroup.querySelector('#close-edit-group-popup');
    const saveEditGroupBtn = popupEditGroup.querySelector('#save-edit-group-btn');

    closeEditGroupPopupBtn.addEventListener('click', () => {
        popupEditGroup.style.display = 'none';
    });

    saveEditGroupBtn.addEventListener('click', () => {
        const newGroupName = popupEditGroup.querySelector('#edit-group-name').value;
        const groupId = popupEditGroup.getAttribute('data-group-id');
        saveGroupEdit(groupId, newGroupName);
    });

    return popupEditGroup;
}

function saveGroupEdit(groupId, newGroupName) {
    if (newGroupName.trim() === '') {
        console.error('Group name cannot be empty.');
        return;
    }

    fetch('content/edit-group.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ groupId, newGroupName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the group name in the UI
            const groupButton = document.getElementById(`group-btn-${groupId}`);
            if (groupButton) {
                groupButton.innerText = newGroupName;
            }
            // Update the group name in the header
            const groupNameHeader = document.getElementById('group-name');
            if (groupNameHeader) {
                groupNameHeader.innerText = newGroupName;
            }
            document.getElementById('popup-edit-group').style.display = 'none';
        } else {
            console.error('Error editing group:', data.message);
        }
    })
    .catch(error => console.error('Error editing group:', error));
}

////////////////////////////////////////////////////////////
//					RIMUOVI GRUPPO						  //
////////////////////////////////////////////////////////////

function setupDeleteGroupButton() {
    const deleteGroupBtn = document.getElementById('delete-group-btn');
    if (!deleteGroupBtn) return;

    deleteGroupBtn.addEventListener('click', () => {
        if (selectedGroupId === null) {
            console.error('No group selected');
            return;
        }

        if (confirm('Are you sure you want to delete this group and all its associated roles?')) {
            deleteGroup(selectedGroupId);
        }
    });
}

function deleteGroup(groupId) {
    fetch('content/delete-group.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ groupId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Rimuovi il pulsante del gruppo eliminato
            const deletedGroupButton = document.getElementById(`group-btn-${groupId}`);
            if (deletedGroupButton) {
                deletedGroupButton.remove();
            }

            // Reimposta la lista dei ruoli
            resetRolesList();

            // Reimposta il gruppo selezionato
            selectedGroupId = null;

            // Controlla se ci sono ancora gruppi
            const remainingGroups = document.querySelectorAll('.group-button');
            if (remainingGroups.length === 0) {
                // Se non ci sono più gruppi, mostra il messaggio "No groups available"
                const noGroupsMessage = document.getElementById('no-groups');
                if (noGroupsMessage) {
                    noGroupsMessage.style.display = 'block';
                }
            } else {
                // Se ci sono ancora gruppi, seleziona il primo gruppo rimanente
                const firstRemainingGroup = remainingGroups[0];
                firstRemainingGroup.click(); // Simula un click sul primo gruppo rimanente
            }
        } else {
            console.error('Error deleting group:', data.error);
        }
    })
    .catch(error => console.error('Error deleting group:', error));
}

function resetRolesList() {
    const rolesList = document.getElementById('roles-list');
    const noRolesMessage = document.getElementById('no-roles');
    const groupNameHeader = document.getElementById('group-name');
    const addRoleButton = document.getElementById('add-role-btn');
    const deleteGroupButton = document.getElementById('delete-group-btn');
    const editGroupButton = document.getElementById('edit-group-btn');

    rolesList.innerHTML = '';
    noRolesMessage.style.display = 'block';
    groupNameHeader.innerText = 'Select a group';
    addRoleButton.disabled = true;
    deleteGroupButton.disabled = true;
    editGroupButton.disabled = true;
}

////////////////////////////////////////////////////////////
//					AGGIUNGI RUOLO						  //
////////////////////////////////////////////////////////////
	
function setupRolePopup() {
    const addRoleBtn = document.getElementById('add-role-btn');
    if (!addRoleBtn) return;

    addRoleBtn.addEventListener('click', () => {
        let popupRole = document.getElementById('popup-role');
        if (!popupRole) {
            popupRole = createRolePopup();
            document.body.appendChild(popupRole);
        }
        popupRole.showPopup();
    });
}

function createRolePopup() {
    const popupRole = document.createElement('div');
    popupRole.classList.add('popup');
    popupRole.id = 'popup-role';
    popupRole.innerHTML = `
        <div class="popup-content">
            <h3>Add New Role</h3>
            <input type="text" id="new-role-name" placeholder="Role Name">
            <div id="person-assignments"></div>
            <div class="person-search-container">
                <input type="text" id="person-search" placeholder="Search person...">
                <ul id="person-list" class="person-list"></ul>
            </div>
            <button id="save-role-btn">Save Role</button>
            <button id="close-role-popup">Cancel</button>
        </div>
    `;

    const closeRolePopupBtn = popupRole.querySelector('#close-role-popup');
    const saveRoleBtn = popupRole.querySelector('#save-role-btn');
    const personSearch = popupRole.querySelector('#person-search');
    const personList = popupRole.querySelector('#person-list');

    closeRolePopupBtn.addEventListener('click', () => {
        hidePopup();
    });

    saveRoleBtn.addEventListener('click', () => {
        const roleName = popupRole.querySelector('#new-role-name').value;
        const personAssignments = Array.from(popupRole.querySelectorAll('.person-assignment')).map(div => div.dataset.personId);
        saveRole(roleName, personAssignments);
    });

    personSearch.addEventListener('input', () => {
        updatePersonList(personSearch.value, personList, popupRole);
    });

    // Show person list when clicking on the search field
    personSearch.addEventListener('focus', () => {
        personList.style.display = 'block';
        updatePersonList(personSearch.value, personList, popupRole);
    });

    // Function to hide the popup and remove the document click listener
    function hidePopup() {
        popupRole.style.display = 'none';
        document.removeEventListener('click', handleOutsideClick);
    }

    // Function to handle clicks outside the popup
    function handleOutsideClick(event) {
        if (!popupRole.contains(event.target)) {
            personList.style.display = 'none';
            if (!personSearch.contains(event.target)) {
                hidePopup();
            }
        }
    }

    // Show the popup and add the document click listener
    popupRole.showPopup = function() {
        popup.style.display = 'flex';
        document.addEventListener('click', handleOutsideClick);
    };

    return popupRole;
}

function saveRole(roleName, personAssignments) {
    if (selectedGroupId === null) {
        console.error('No group selected');
        return;
    }

    fetch('content/add-role.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ roleName, groupId: selectedGroupId, personAssignments })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const selectedGroup = document.querySelector('.group-button.selected');
            const groupName = selectedGroup ? selectedGroup.innerText : '';
            loadRolesForGroup(selectedGroupId, groupName);
            const popup = document.getElementById('popup-role');
            popup.style.display = 'none';
            popup.querySelector('#new-role-name').value = '';
            popup.querySelector('#person-assignments').innerHTML = '';
        }
    })
    .catch(error => console.error('Error adding role:', error));
}

function updatePersonList(search, listElement, popupRole) {
    const assignedPersons = Array.from(popupRole.querySelectorAll('.person-assignment')).map(div => div.dataset.personId);

    fetch(`content/get-people.php?search=${encodeURIComponent(search)}`)
        .then(response => response.json())
        .then(people => {
            listElement.innerHTML = '';
            const filteredPeople = people.filter(person => !assignedPersons.includes(person.id.toString()));
            
            if (filteredPeople.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No results';
                li.classList.add('disabled');
                listElement.appendChild(li);
            } else {
                filteredPeople.forEach(person => {
                    const li = document.createElement('li');
                    li.textContent = `${person.nome} ${person.cognome}`;
                    li.dataset.personId = person.id;
                    li.addEventListener('click', () => addPersonAssignment(popupRole, person));
                    listElement.appendChild(li);
                });
            }
            listElement.style.display = 'block';
        })
        .catch(error => console.error('Error fetching people:', error));
}

function addPersonAssignment(popupRole, person) {
    const personAssignments = popupRole.querySelector('#person-assignments');
    const newAssignment = document.createElement('div');
    newAssignment.classList.add('person-assignment');
    newAssignment.dataset.personId = person.id;
    newAssignment.innerHTML = `
        <span>${person.nome} ${person.cognome}</span>
        <button class="remove-person-btn">🗑️</button>
    `;
    personAssignments.appendChild(newAssignment);

    const removeBtn = newAssignment.querySelector('.remove-person-btn');
    removeBtn.addEventListener('click', () => {
        personAssignments.removeChild(newAssignment);
        const personSearch = popupRole.querySelector('#person-search');
        const personList = popupRole.querySelector('#person-list');
        updatePersonList(personSearch.value, personList, popupRole);
    });

    const personSearch = popupRole.querySelector('#person-search');
    const personList = popupRole.querySelector('#person-list');
    personSearch.value = '';
    personList.style.display = 'none';
    updatePersonList('', personList, popupRole);
}

document.addEventListener('click', function(event) {
    const personSearchContainer = document.querySelector('.person-search-container');
	if (personSearchContainer) {
	    const isClickInside = personSearchContainer.contains(event.target);
	    if (!isClickInside) {
	        const personList = document.querySelector('#person-list');
	        if (personList) {
    	        personList.style.display = 'none';
        	}
	    }
	}

});

////////////////////////////////////////////////////////////
//					MODIFICA RUOLO						  //
////////////////////////////////////////////////////////////

// Funzione per impostare il popup di modifica del ruolo
function setupEditRolePopup(roleId, currentRoleName) {
    let popupEditRole = document.getElementById('popup-edit-role');
    if (!popupEditRole) {
        popupEditRole = createEditRolePopup();  // Creazione del popup se non esiste già
        document.body.appendChild(popupEditRole);
    }

    const editRoleNameInput = popupEditRole.querySelector('#edit-role-name');
    editRoleNameInput.value = currentRoleName;

    // Carica le assegnazioni esistenti
    loadAssignedPeople(roleId, popupEditRole);

    popupEditRole.style.display = 'flex';
    popupEditRole.setAttribute('data-role-id', roleId);

    // Imposta i listener dei pulsanti "save" e "cancel"
    const saveButton = popupEditRole.querySelector('#save-role');
    const cancelButton = popupEditRole.querySelector('#cancel-role');

    saveButton.addEventListener('click', function() {
    const popupEditRole = document.getElementById('popup-edit-role');
    const roleId = popupEditRole.getAttribute('data-role-id'); // Prende l'id del ruolo corrente
    const newRoleName = popupEditRole.querySelector('#edit-role-name').value; // Prende il nome del ruolo aggiornato

    // Ottiene tutte le persone assegnate (assumendo che ci sia una lista con i checkbox o altro)
    const assignedPeopleCheckboxes = popupEditRole.querySelectorAll('.assigned-people-checkbox');
    const personAssignments = Array.from(assignedPeopleCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value); // Array degli id delle persone assegnate

    // Chiama la funzione per salvare le modifiche
    saveRoleEdit(roleId, newRoleName, personAssignments);
	});

    cancelButton.addEventListener('click', function() {
        popupEditRole.style.display = 'none';
    });
}


// Funzione per impostare gli eventi del popup
function setupEditPopupEvents(popupEditRole, roleId) {
    const closeButton = popupEditRole.querySelector('#close-edit-role-popup');
    const saveButton = popupEditRole.querySelector('#save-edit-role-btn');
    const personSearch = popupEditRole.querySelector('#edit-person-search');
    const personList = popupEditRole.querySelector('#edit-person-list');

    // Rimuovi eventuali listener esistenti
	closeButton.removeEventListener('click', handleClose);
	closeButton.addEventListener('click', handleClose);

	saveButton.removeEventListener('click', handleSave);
	saveButton.addEventListener('click', handleSave);

    // Aggiungi nuovi listener
    popupEditRole.querySelector('#close-edit-role-popup').addEventListener('click', () => {
        popupEditRole.style.display = 'none';
    });

    popupEditRole.querySelector('#save-edit-role-btn').addEventListener('click', () => {
        const newRoleName = popupEditRole.querySelector('#edit-role-name').value;
        const personAssignments = Array.from(
            popupEditRole.querySelectorAll('.person-assignment')
        ).map(div => div.dataset.personId);
        
        saveRoleEdit(roleId, newRoleName, personAssignments);
    });

    // Setup ricerca persone
    personSearch.addEventListener('input', () => {
        updateEditPersonList(personSearch.value, personList, popupEditRole);
    });

    personSearch.addEventListener('focus', () => {
        personList.style.display = 'block';
        updateEditPersonList(personSearch.value, personList, popupEditRole);
    });
}

// Funzione per caricare le persone assegnate
function loadAssignedPeople(roleId, popupEditRole) {
    fetch(`content/get-role-assignments.php?role_id=${roleId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Error loading role data:', data.message);
                return;
            }
            
            const roleData = data.data;
            const personAssignments = popupEditRole.querySelector('#edit-person-assignments');
            personAssignments.innerHTML = '';
            
            if (roleData.assignments && roleData.assignments.length > 0) {
                roleData.assignments.forEach(person => {
                    addEditPersonAssignment(popupEditRole, person);
                });
            }
        })
        .catch(error => {
            console.error('Error loading assigned people:', error);
        });
}

// Funzione per aggiungere un'assegnazione di persona
function addEditPersonAssignment(popupEditRole, person) {
    const personAssignments = popupEditRole.querySelector('#edit-person-assignments');
    const newAssignment = document.createElement('div');
    newAssignment.classList.add('person-assignment');
    newAssignment.dataset.personId = person.id;
    newAssignment.innerHTML = `
        <span>${person.nome} ${person.cognome}</span>
        <button class="remove-person-btn">🗑️</button>
    `;

    const removeBtn = newAssignment.querySelector('.remove-person-btn');
    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        personAssignments.removeChild(newAssignment);
        
        // Aggiorna la lista delle persone disponibili
        const personSearch = popupEditRole.querySelector('#edit-person-search');
        const personList = popupEditRole.querySelector('#edit-person-list');
        updateEditPersonList(personSearch.value, personList, popupEditRole);
    });

    personAssignments.appendChild(newAssignment);
}
// Funzione per salvare le modifiche al ruolo
function saveRoleEdit(roleId, newRoleName, personAssignments) {
    if (newRoleName.trim() === '') {
        alert('Role name cannot be empty.');
        return;
    }

    fetch('content/edit-role.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            roleId, 
            newRoleName,
            personAssignments 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const selectedGroup = document.querySelector('.group-button.selected');
            if (selectedGroup) {
                loadRolesForGroup(selectedGroupId, selectedGroup.innerText);
            }
            document.getElementById('popup-edit-role').style.display = 'none';
        } else {
            alert('Error saving role: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error editing role:', error);
        alert('Error saving role. Please try again.');
    });
}

// Aggiorna createEditRolePopup per includere una migliore gestione degli eventi
function createEditRolePopup() {
    const popupEditRole = document.createElement('div');
    popupEditRole.classList.add('popup');
    popupEditRole.id = 'popup-edit-role';
    popupEditRole.innerHTML = `
        <div class="popup-content">
            <h3>Edit Role</h3>
            <input type="text" id="edit-role-name" placeholder="New Role Name">
            <div id="edit-person-assignments"></div>
            <div class="person-search-container">
                <input type="text" id="edit-person-search" placeholder="Search person...">
                <ul id="edit-person-list" class="person-list"></ul>
            </div>
            <button id="save-edit-role-btn">Save</button>
            <button id="close-edit-role-popup">Cancel</button>
        </div>
    `;

    const closeEditRolePopupBtn = popupEditRole.querySelector('#close-edit-role-popup');
    const saveEditRoleBtn = popupEditRole.querySelector('#save-edit-role-btn');
    const personSearch = popupEditRole.querySelector('#edit-person-search');
    const personList = popupEditRole.querySelector('#edit-person-list');

    personSearch.addEventListener('input', () => {
        updateEditPersonList(personSearch.value, personList, popupEditRole);
    });

    personSearch.addEventListener('focus', () => {
        personList.style.display = 'block';
        updateEditPersonList(personSearch.value, personList, popupEditRole);
    });

    return popupEditRole;
}

function loadRolesForGroup(groupId, groupName) {
    const rolesList = document.getElementById('roles-list');
    const noRolesMessage = document.getElementById('no-roles');
    const groupNameHeader = document.getElementById('group-name');
    const addRoleButton = document.getElementById('add-role-btn');

    if (groupName) {
        groupNameHeader.innerText = groupName;
    }

    // Controlla che gli elementi esistano
    if (!rolesList || !noRolesMessage || !addRoleButton) {
        console.error("Required elements are missing in the DOM.");
        return;
    }

    fetch(`content/get-roles.php?group_id=${groupId}&include_assignments=true`)
	    .then(response => {
    	    console.log('Fetch response:', response); // Log della risposta
        	return response.json();
	    })
    	.then(data => {
        	console.log('Parsed data:', data); // Log dei dati parsati
            rolesList.innerHTML = '';

            if (!data.success || !data.data.length) {
                noRolesMessage.style.display = 'block';
                addRoleButton.disabled = false;
                return;
            }

            noRolesMessage.style.display = 'none';
            addRoleButton.disabled = false;

            data.data.forEach(role => {
                const li = createRoleListItem(role);
                rolesList.appendChild(li);
            });

            applyEditListeners(); // Applica i listener per la modifica dei ruoli
        })
        .catch(error => {
            console.error('Error loading roles:', error);
            rolesList.innerHTML = '<p class="error">Error loading roles. Please try again.</p>';
            noRolesMessage.style.display = 'none';
            addRoleButton.disabled = false;
        });
}


function updateEditPersonList(search, listElement, popupEditRole) {
    const assignedPersons = Array.from(
        popupEditRole.querySelectorAll('.person-assignment')
    ).map(div => div.dataset.personId);

    fetch(`content/get-people.php?search=${encodeURIComponent(search)}`)
        .then(response => response.json())
        .then(people => {
            listElement.innerHTML = '';
            const filteredPeople = people.filter(
                person => !assignedPersons.includes(person.id.toString())
            );
            
            if (filteredPeople.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'No results';
                li.classList.add('disabled');
                listElement.appendChild(li);
            } else {
                filteredPeople.forEach(person => {
                    const li = document.createElement('li');
                    li.textContent = `${person.nome} ${person.cognome}`;
                    li.dataset.personId = person.id;
                    li.addEventListener('click', () => 
                        addEditPersonAssignment(popupEditRole, person)
                    );
                    listElement.appendChild(li);
                });
            }
            listElement.style.display = 'block';
        })
        .catch(error => console.error('Error fetching people:', error));
}



////////////////////////////////////////////////////////////
//					ESECUZIONE COMANDI					  //
////////////////////////////////////////////////////////////

setupGroupPopup();
setupRolePopup();
setupEditGroupButton();
loadGroupsFromDB();
setupDeleteGroupButton();
