// dashboard.js
// Funzione globale per caricare la dashboard

function loadDashboard() {
    const mainContent = document.querySelector('.content');
    mainContent.innerHTML = `
        <h1>Dashboard</h1>
        <div class="dashboard-container">
            <div class="dashboard-box left-box">
                <h2>User Details</h2>
                <p>Name: John Doe</p>
                <p>Email: john.doe@example.com</p>
                <p>Role: Administrator</p>
            </div>
            <div class="dashboard-box right-box">
                <h2>Upcoming Events</h2>
                <ul>
                    <li>Event 1: Meeting at 10 AM</li>
                    <li>Event 2: Workshop at 2 PM</li>
                    <li>Event 3: Conference at 4 PM</li>
                </ul>
            </div>
        </div>
    `;

}

//<------- services.js ------>//

// Funzione globale per caricare i servizi
function loadServices() {
    const mainContent = document.querySelector('.content');
    mainContent.innerHTML = `
        <h1>Servizi</h1>

        <div class="buttons">
            <button class="btn" id="createServiceBtn">Crea Servizio</button>
            <button class="btn-secondary" id="showPreviousSrv">Mostra Precedenti</button>
        </div>

        <div class="dashboard-container">
            <div class="left-box" id="servicesList">
                <h2>Elenco Servizi</h2>
                <ul>
                    <!-- Elenco servizi popolato dinamicamente -->
                </ul>
            </div>

            <div class="right-box" id="scheduledDatesList">
                <h2>Date Programmate</h2>
                <ul>
                    <!-- Elenco date programmate popolato dinamicamente -->
                </ul>
            </div>
        </div>
    `;

    // Aggiungi l'evento al pulsante "Crea Servizio"
    document.getElementById('createServiceBtn').addEventListener('click', function() {
        openCreateServicePopup();
    });
}

function openCreateServicePopup() {
    // Crea il contenuto del popup
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Crea Servizio</h2>
            <form id="createServiceForm">
                <label for="serviceName">Nome Servizio:</label>
                <input type="text" id="serviceName" name="serviceName" required>
                
                <label for="serviceType">Tipo Servizio:</label>
                <select id="serviceType" name="serviceType" required>
                    <!-- Le opzioni verranno caricate dinamicamente -->
                </select>
                
                <label for="serviceDate">Data e Ora:</label>
                <input type="datetime-local" id="serviceDate" name="serviceDate" required>
                
                <button type="submit" class="btn">Salva</button>
                <button type="button" class="btn-secondary" id="closePopupBtn">Chiudi</button>
            </form>
        </div>
    `;

    // Aggiungi il popup al documento
    document.body.appendChild(popup);

    // Carica i tipi di servizio dal database
    loadServiceTypes();

    // Chiudi il popup quando clicchi il pulsante "Chiudi"
    document.getElementById('closePopupBtn').addEventListener('click', function() {
        document.body.removeChild(popup);
    });

    // Gestisci l'invio del modulo
    document.getElementById('createServiceForm').addEventListener('submit', function(event) {
        event.preventDefault();
        createService();
    });
}

loadServiceTypes()

function createService() {
    const name = document.getElementById('serviceName').value;
    const type = document.getElementById('serviceType').value;
    const date = document.getElementById('serviceDate').value;

    fetch('../content/create_service.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            serviceName: name,
            serviceType: type,
            serviceDate: date
        })
    })
    .then(response => response.text())
    .then(result => {
        console.log('Service created:', result);
        document.body.querySelector('.popup').remove(); // Chiudi il popup
        // Ricarica i servizi o aggiorna l'interfaccia come necessario
    })
    .catch(error => console.error('Error creating service:', error));
}


// serviceTypes.js
// Funzioni per caricare Tipi di Servizi

    const serviceTypeList = document.getElementById('serviceTypeList');
    const addServiceTypeBtn = document.getElementById('addServiceTypeBtn');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const closePopupIcon = document.getElementById('closePopup');
    const serviceTypeForm = document.getElementById('serviceTypeForm');
    const serviceTypeNameInput = document.getElementById('serviceTypeName');
    const popupTitle = document.getElementById('popupTitle');
    let isEditing = false;
    let editingId = null;

    // Funzione per caricare l'elenco dei tipi di servizi
    function loadServiceTypes() {
        fetch('content/getServiceTypes.php')
            .then(response => response.json())
            .then(data => {
//                serviceTypeList.innerHTML = ''; // Reset lista
                data.forEach(serviceType => {
                    const item = document.createElement('div');
                    item.classList.add('service-type-item');
                    item.innerHTML = `
                    	<div class="service-type-container">
			                <div class="back-to-services">&larr; Torna ai Servizi</div>
			                <h1>Tipi Servizio</h1>
			                <div class="service-type-list" id="serviceTypeList">
               					<div class="handle">☰</div>
		                        <h3>${serviceType.name}</h3>
		                        <button class="edit-btn" data-id="${serviceType.id}">
		                            <i class="fas fa-pen"></i> Modifica
		                        </button>
			                </div>
			                <button class="btn" id="addServiceTypeBtn">Aggiungi Nuovo Tipo Servizio</button>
			            </div>
                    `;
                    serviceTypeList.appendChild(item);
                });

                // Aggiungi event listener per i pulsanti di modifica
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const name = this.previousElementSibling.textContent;
                        openPopup('Modifica Tipo Servizio', name, id);
                    });
                });
            });
    }

    // Funzione per aprire il popup
    function openPopup(title, name = '', id = null) {
        const popupContent = `
        <div class="popup-content">
            <span id="closePopup" style="cursor:pointer;">&times;</span>
            <h2 id="popupTitle">${title}</h2>
            <form id="serviceTypeForm">
                <label for="serviceTypeName">Nome Tipo Servizio</label>
                <input type="text" id="serviceTypeName" value="${name}" required>

                <button type="submit" class="btn">Salva</button>
                <button type="button" class="btn-secondary" id="closePopupBtn">Chiudi</button>
            </form>
        </div>
    `;
        popup.innerHTML = popupContent;
        isEditing = !!id;
        editingId = id;
        popup.style.display = 'flex';
    }

    // Chiudi popup
    closePopupBtn.addEventListener('click', () => popup.style.display = 'none');
    closePopupIcon.addEventListener('click', () => popup.style.display = 'none');
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Aggiungi o modifica tipo di servizio
    serviceTypeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const serviceName = serviceTypeNameInput.value.trim();
        if (!serviceName) return;

        const endpoint = isEditing ? 'updateServiceType.php' : 'addServiceType.php';
        const data = { name: serviceName };
        if (isEditing) data.id = editingId;

        fetch(`content/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                loadServiceTypes();
                popup.style.display = 'none';
            } else {
                alert('Errore nel salvataggio.');
            }
        });
    });

    // Carica tipi di servizi all'avvio
    loadServiceTypes();

    // Apre il popup per aggiungere un nuovo tipo servizio
    addServiceTypeBtn.addEventListener('click', function() {
        openPopup('Aggiungi Tipo Servizio');
    });



// person.js

// Funzione globale per caricare i servici
function loadPeople() {
    const mainContent = document.querySelector('.content');
    mainContent.innerHTML = `
        <h1>Persone</h1>
        <div class="dashboard-container">
            <div class="dashboard-box left-box">
                <h2>User Details</h2>
                <p>Name: John Doe</p>
                <p>Email: john.doe@example.com</p>
                <p>Role: Administrator</p>
            </div>
            <div class="dashboard-box right-box">
                <h2>Upcoming Events</h2>
                <ul>
                    <li>Event 1: Meeting at 10 AM</li>
                    <li>Event 2: Workshop at 2 PM</li>
                    <li>Event 3: Conference at 4 PM</li>
                </ul>
            </div>
        </div>
    `;

}

	
