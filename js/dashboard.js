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



