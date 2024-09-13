// serviceTypes.js

const typesPopup = document.getElementById('typesPopup');

// Funzione per caricare l'elenco dei tipi di servizi
function loadServiceTypes() {
    fetch('content/getServiceTypes.php')
        .then(response => response.json())
        .then(data => {
            // Seleziona il contenitore principale
            const mainContent = document.querySelector('main.content');

            // Crea il contenuto dinamico
            const serviceTypeContainer = document.createElement('div');
            serviceTypeContainer.classList.add('service-type-container');

            // Aggiungi pulsante per tornare ai servizi
            const backButton = document.createElement('div');
            backButton.classList.add('back-to-services');
            backButton.innerHTML = '&larr; Torna ai Servizi';
            serviceTypeContainer.appendChild(backButton);

            // Aggiungi il titolo
            const title = document.createElement('h1');
            title.textContent = 'Tipi Servizio';
            serviceTypeContainer.appendChild(title);

            // Crea la lista dei tipi di servizi
            const serviceTypeList = document.createElement('div');
            serviceTypeList.classList.add('service-type-list');
            serviceTypeList.id = 'serviceTypeList';

            // Popola la lista con i dati ricevuti
            data.forEach(serviceType => {
                const item = document.createElement('div');
                item.classList.add('service-type-item');

                // Inserisci il contenuto HTML per ogni tipo di servizio
                item.innerHTML = `
                    <div class="handle">☰</div>
                    <h3>${serviceType.name}</h3>
                    <button class="edit-btn" data-id="${serviceType.id}">
                        <i class="fas fa-pen"></i> Modifica
                    </button>
                `;

                serviceTypeList.appendChild(item);
            });

            // Aggiungi la lista al container
            serviceTypeContainer.appendChild(serviceTypeList);

            // Aggiungi il pulsante per aggiungere un nuovo tipo di servizio
            const addServiceTypeBtn = document.createElement('button');
            addServiceTypeBtn.classList.add('btn');
            addServiceTypeBtn.id = 'addServiceTypeBtn';
            addServiceTypeBtn.textContent = 'Aggiungi Nuovo Tipo Servizio';
            serviceTypeContainer.appendChild(addServiceTypeBtn);

            // Inserisci il contenitore creato nel main
            mainContent.innerHTML = ''; // Resetta il contenuto precedente
            mainContent.appendChild(serviceTypeContainer);

            // Aggiungi event listener per i pulsanti di modifica
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const name = this.previousElementSibling.textContent;
                    openTypesPopup('Modifica Tipo Servizio', name, id);
                });
            });

            // Aggiungi event listener per aprire il popup per aggiungere un nuovo tipo servizio
            addServiceTypeBtn.addEventListener('click', function() {
                openTypesPopup('Aggiungi Tipo Servizio');
            });
        })
        .catch(error => console.error('Errore nel caricamento dei tipi di servizi:', error));
}

// Funzione per aprire il popup
function openTypesPopup(title, name = '', id = null) {
    const typesPopupContent = `
    <div class="types-popup-content">
        <span id="closeTypesPopup" style="cursor:pointer;">&times;</span>
        <h2 id="typesPopupTitle">${title}</h2>
        <form id="serviceTypeForm">
            <label for="serviceTypeName">Nome Tipo Servizio</label>
            <input type="text" id="serviceTypeName" value="${name}" required>

            <button type="submit" class="btn">Salva</button>
            <button type="button" class="btn-secondary" id="closeTypesPopupBtn">Chiudi</button>
        </form>
    </div>
    `;
    typesPopup.innerHTML = typesPopupContent;
    isEditing = !!id;
    editingId = id;
    typesPopup.style.display = 'flex';

    // Aggiungi event listener per chiudere il popup
    document.getElementById('closeTypesPopupBtn').addEventListener('click', () => typesPopup.style.display = 'none');
    document.getElementById('closeTypesPopup').addEventListener('click', () => typesPopup.style.display = 'none');
    window.addEventListener('click', function(event) {
        if (event.target === typesPopup) {
            typesPopup.style.display = 'none';
        }
    });

    // Aggiungi o modifica tipo di servizio
    document.getElementById('serviceTypeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const serviceName = document.getElementById('serviceTypeName').value.trim();
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
                typesPopup.style.display = 'none';
            } else {
                alert('Errore nel salvataggio.');
            }
        });
    });
}

// Carica tipi di servizi all'avvio
loadServiceTypes();
