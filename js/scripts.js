// File: scripts.js
document.addEventListener('DOMContentLoaded', function scripts() {

function loadRoles() {
    const mainContent = document.querySelector('.content');

    // Effettua la richiesta per ottenere il contenuto di roles.php
    fetch('roles/roles.php')
        .then(response => response.text())
        .then(data => {
            // Inserisce il contenuto nella pagina
            mainContent.innerHTML = data;

            // Dopo aver inserito il contenuto, carica manualmente il file roles.js
            loadScript('js/roles.js', () => {
                // Inizializza i popup e gli eventi solo dopo il caricamento di roles.js
                console.log('roles.js caricato con successo');
                
                // Verifica se le funzioni sono disponibili
                if (typeof setupGroupPopup === 'function' && typeof setupRolePopup === 'function') {
                    initializeRolePage();
                } else {
                    console.error('Le funzioni setupGroupPopup o setupRolePopup non sono state caricate correttamente.');
                }
            }, (error) => {
                console.error('Errore nel caricamento di roles.js:', error);
            });
        })
        .catch(error => console.error('Errore durante il caricamento dei ruoli:', error));
}

// Funzione per caricare dinamicamente un file JavaScript con gestione degli errori
function loadScript(url, callback, errorCallback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;  // Quando il file è caricato, esegue la callback
    script.onerror = errorCallback;  // In caso di errore, esegue la errorCallback
    document.body.appendChild(script);
}

// Funzione per inizializzare gli eventi sui pulsanti della pagina
function initializeRolePage() {
    const addGroupBtn = document.getElementById('add-group-btn');
    const addRoleBtn = document.getElementById('add-role-btn');

    if (addGroupBtn) {
        setupGroupPopup();
        console.log('add-group-btn trovato e popup configurato.');
    } else {
        console.log('add-group-btn non trovato.');
    }

    if (addRoleBtn) {
        setupRolePopup();
        console.log('add-role-btn trovato e popup configurato.');
    } else {
        console.log('add-role-btn non trovato.');
    }
}

//////////////////////////////////////////////////////////////////////////////
//				CODICE GENERALE DI CARICAMENTO DEI MENU						//
//////////////////////////////////////////////////////////////////////////////
    const menuButton = document.getElementById('menuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
	const dashboardMenu = document.getElementById('dashboardMenu');
    const servicesMenu = document.getElementById('servicesMenu');
    const servicesSubmenu = document.getElementById('servicesSubmenu');
    const peopleMenu = document.getElementById('peopleMenu');
    const peopleSubmenu = document.getElementById('peopleSubmenu');
    const submenuServiceItem = document.getElementById('submenuServiceItem');
    const submenuTypeItem = document.getElementById('submenuTypeItem');
    const submenuMatrixItem = document.getElementById('submenuMatrixItem');
    const submenuPeopleItem = document.getElementById('submenuPeopleItem');
    const submenuRoleItem = document.getElementById('submenuRoleItem');


	// Carica l'ultima sezione visitata
	// Carica la dashboard al primo caricamento
	/*    loadDashboard();*/
	loadLastVisitedSection();
    
	function loadLastVisitedSection() {
    const lastVisited = localStorage.getItem('lastVisitedSection');
    
    switch (lastVisited) {
        case 'dashboard':
            loadDashboard();
            displayDashboard();
            break;
        case 'services':
            loadServices();
            displayServices();
            break;
        case 'servicetypes':
            loadServiceTypes();
        	displayServices();
        	removeActiveSubClass ();
		    submenuTypeItem.classList.add('active');
            break;
        case 'people':
            loadPeople();
            displayPeople();
            break;
        case 'roles':
            loadRoles();
            displayPeople();
        	removeActiveSubClass ();
		    submenuRoleItem.classList.add('active');
            break;
        case 'settings':
            loadSettings(); // Placeholder function for other section
            break;
        // Add more cases as needed for additional sections
        default:
            loadDashboard(); // Default to dashboard if no valid section is found
            displayDashboard();
            break;
    }

}

	// Salva l'ultima sezione visitata
	function saveLastVisitedSection(section) {
    localStorage.setItem('lastVisitedSection', section);
}

    // Toggle dropdown menu
    menuButton.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
		menuButton.classList.add('active');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
        if (!menuButton.contains(e.target) &&!dropdownMenu.contains(e.target)) {
            dropdownMenu.style.display = 'none';
       		menuButton.classList.remove('active');        
        }
    });

    // Funzione per rimuovere la classe active da tutti i menu
	function removeActiveClass() {
	    const menuItems = document.querySelectorAll('.menu-item');
    	menuItems.forEach(function(item) {
        	item.classList.remove('active');
	    });
	}

    // Funzione per rimuovere la classe active da tutti i SUBmenu
	function removeActiveSubClass() {
	    const menuSubItems = document.querySelectorAll('.submenu-item');
	    menuSubItems.forEach(function(item) {
	        item.classList.remove('active');
    	});
	}

	// ************************ Toggle submenus

	// Attiva stato per Dashboard
	function displayDashboard() {
		peopleSubmenu.style.display = 'none';
		servicesSubmenu.style.display = 'none';
	    removeActiveClass();
		dashboardMenu.classList.add('active');
	}
	dashboardMenu.addEventListener('click', function() {
		displayDashboard();
	    loadDashboard(); // Chiama la funzione dal file dashboard.js
	    saveLastVisitedSection('dashboard');

	});	
	// Attiva stato per Servizi
	function displayServices() {
    	peopleSubmenu.style.display = 'none'; // nasconde submenu persone
	    servicesSubmenu.style.display = 'block'; // mostra il submenu servizi
    
    	// Imposta la classe active sul menu cliccato e rimuove dagli altri
	    removeActiveClass();
	    servicesMenu.classList.add('active');
	    submenuServiceItem.classList.add('active');
	}
	
	// Event Listener per Menu Servizi
	servicesMenu.addEventListener('click', function() {
		removeActiveSubClass ()
	    displayServices();
	    loadServices(); // Chiama la funzione dal file services.js
	    saveLastVisitedSection('services');
	});
	
	// Event Listener per il submenu Service
	submenuServiceItem.addEventListener('click', function() {
	    removeActiveSubClass ()
	    loadServices(); 
	    submenuServiceItem.classList.add('active');
	    saveLastVisitedSection('services');
	});

	// Event Listener per il submenu Type
	submenuTypeItem.addEventListener('click', function() {
    	removeActiveSubClass ()
	    submenuTypeItem.classList.add('active');
	    loadServiceTypes();
	    saveLastVisitedSection('servicetypes');
	});

	// Event Listener per il submenu Matrix
	submenuMatrixItem.addEventListener('click', function() {
    	removeActiveSubClass ()
	    submenuMatrixItem.classList.add('active');
	});



	// Attiva stato per Persone
	function displayPeople(){
		servicesSubmenu.style.display = 'none';
	    peopleSubmenu.style.display = 'block';
    
    	// Imposta la classe active sul menu cliccato e rimuove dagli altri
	    removeActiveClass();
	    peopleMenu.classList.add('active');
	    submenuPeopleItem.classList.add('active');
	    submenuRoleItem.classList.remove('active'); 
	}
	peopleMenu.addEventListener('click', function() {
		displayPeople();
		loadPeople();
	    saveLastVisitedSection('people');
	});

	// Event Listener per il submenu People
	submenuPeopleItem.addEventListener('click', function() {
	    removeActiveSubClass ()
		loadPeople();
	    submenuPeopleItem.classList.add('active');
	    saveLastVisitedSection('people');
	});

	// Event Listener per il submenu RoleItem
	submenuRoleItem.addEventListener('click', function() {
    	submenuPeopleItem.classList.remove('active');
	    submenuRoleItem.classList.add('active');
	    loadRoles();
	    saveLastVisitedSection('roles');
	});


});
