// file: services.js

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
    loadServiceTypesData();

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

function loadServiceTypesData() {
    fetch('content/getServiceTypes.php')
        .then(response => response.json())
        .then(data => {
            const serviceTypeSelect = document.getElementById('serviceType');
            data.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                serviceTypeSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading service types:', error));
}

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
