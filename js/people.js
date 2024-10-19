// file: people.js

// Funzione globale per caricare le persone
function loadPeople() {
    const mainContent = document.querySelector('.content');

    // Verifica che l'elemento '.content' esista
    if (!mainContent) {
        console.error("Element with class 'content' not found in the DOM.");
        return;
    }
    
    // Inserisci i dati nel mainContent
    mainContent.innerHTML = `
        <h1>Persone</h1>

        <div class="buttons">
            <button class="btn" id="createPeopleBtn">Crea Persone</button>
        </div>

        <div class="dashboard-container">
            <div class="left-box" id="groupsList"> <!-- Cambiato ID -->
                <h2>Elenco Gruppi</h2>
                <ul>
                    <!-- Elenco gruppi popolato dinamicamente -->
                </ul>
            </div>

            <div class="right-box" id="peopleList"> <!-- Cambiato ID -->
                <ul>
                    <!-- Elenco persone popolato dinamicamente -->
                </ul>
            </div>
        </div>
    `;

    // Seleziona l'elemento per la lista delle persone qui
    const peopleListElement = document.querySelector('#peopleList ul');

    // Aggiungi l'evento al pulsante "Crea Persone"
    document.getElementById('createPeopleBtn').addEventListener('click', function() {
        openCreatePeople();
    });
	function openCreatePeople() {
    fetch('createPeople.php')
        .then(response => response.text())
        .then(data => {
            const mainContent = document.querySelector('.content');
            mainContent.innerHTML = data;

            // Sposta l'aggiunta degli eventi qui, dopo che il contenuto è stato caricato
            document.getElementById('add-person-btn-save').addEventListener('click', function(event) {
                event.preventDefault();

                // Cattura i dati dal form
                const firstName = document.getElementById('add-person-first-name').value;
                const lastName = document.getElementById('add-person-last-name').value;
                const email = document.getElementById('add-person-email').value;
                const permissionLevel = document.getElementById('add-person-permission').value;

                // Verifica che tutti i campi richiesti siano compilati
                if (firstName === '' || lastName === '' || email === '') {
                    alert('All fields are required!');
                    return;
                }

                // Crea un oggetto con i dati
                const personData = {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    permission: permissionLevel
                };

                // Invia una richiesta AJAX al server per controllare e aggiungere la persona
fetch('content/add_person.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(personData)
})
.then(response => {
    // Logga il contenuto della risposta per diagnosticare problemi
    return response.text().then(text => {
        console.log(text); // Mostra la risposta del server
        return { text, ok: response.ok }; // Restituisci il testo e lo stato
    });
})
.then(({ text, ok }) => {
    if (!ok) {
        throw new Error(`Server error: ${text}`); // Gestisci errori del server
    }
    const data = JSON.parse(text); // Prova a fare il parsing del JSON
    if (data.exists) {
        alert('Person with this name already exists.');
    } else if (data.success) {
        alert('Person added successfully!');
    } else {
        alert('An error occurred. Please try again.');
    }
    loadPeople()
})
.catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
});

            });

            // Gestione pulsante Cancel
            document.getElementById('add-person-btn-cancel').addEventListener('click', function() {
                loadPeople(); // Carica la funzione di caricamento delle persone
            });
        })
        .catch(error => console.error('Errore nel caricamento del contenuto:', error));
}
    // Carica le persone dal database
    listPeople(peopleListElement); // Passa peopleListElement come argomento
    
}

async function listPeople(peopleListElement) { // Accetta come argomento l'elemento della lista
    try {
        const response = await fetch('content/get-people.php'); // Cambia con il percorso corretto
        const people = await response.json();
        populatePeopleList(people, peopleListElement); // Passa anche l'elemento della lista
    } catch (error) {
        console.error('Errore nel caricamento delle persone:', error);
    }
}



// Funzione per popolare la lista delle persone
function populatePeopleList(people, peopleListElement) { // Accetta come argomento l'elemento della lista
    peopleListElement.innerHTML = ''; // Pulisci la lista esistente
    people.forEach(person => {
        const listItem = document.createElement('li');
        const avatarPath = person.avatar || 'img/avatar-image.png'; // Usa l'avatar dal DB o quello di default
        listItem.innerHTML = `
			<div class="person-container">
			    <img src="${avatarPath}" alt="${person.nome} ${person.cognome}" class="avatar">
			    <span class="person-name">${person.nome} ${person.cognome}</span>
			    <span class="person-role">${person.ruoli || 'Non specificato'}</span>
			    <span class="person-permission">${person.permission}</span>
			</div>
        `;
        peopleListElement.appendChild(listItem);
    });
}

// Chiamata dal file esterno script.js senza callback
document.addEventListener('DOMContentLoaded', () => {
    loadPeople();
});
