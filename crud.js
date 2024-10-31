const fs = require('fs');
const path = require('path');

document.getElementById('activityForm').addEventListener('submit', addActivity);

let activities = [];
let editingId = null;

// Load activities from the text file when the page loads
document.addEventListener('DOMContentLoaded', loadActivities);

function loadActivities() {
    const filePath = path.join(__dirname, 'activities.txt');
    
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading activities file:', err);
                return;
            }
            activities = data.split('\n').filter(line => line).map(line => {
                const [id, name, equipment] = line.split('|');
                return { id: parseInt(id), name, equipment: equipment.split(',') };
            });
            // Do not display activities here
        });
    } else {
        // Create the file if it doesn't exist
        fs.writeFileSync(filePath, '', 'utf8');
    }
}

function addActivity(event) {
    event.preventDefault();

    const name = document.getElementById('activityName').value;
    const equipment = document.getElementById('equipment').value.split(',').map(item => item.trim());
    
    if (editingId) {
        // Update existing activity
        const index = activities.findIndex(activity => activity.id === editingId);
        if (index !== -1) {
            activities[index] = { id: editingId, name, equipment };
        }
        editingId = null;
    } else {
        // Create new activity
        const newActivity = { id: Date.now(), name, equipment };
        activities.push(newActivity);
    }

    saveActivities();
    document.getElementById('activityForm').reset();
    displayActivities(); // Display updated activities after adding
}

function saveActivities() {
    const filePath = path.join(__dirname, 'activities.txt');
    const data = activities.map(activity => `${activity.id}|${activity.name}|${activity.equipment.join(',')}`).join('\n');
    fs.writeFile(filePath, data, 'utf8', (err) => {
        if (err) {
            console.error('Error writing activities file:', err);
        }
    });
}

function displayActivities(filteredActivities = activities) {
    const activitiesList = document.getElementById('activities');
    activitiesList.innerHTML = '';

    filteredActivities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${activity.name}:</strong> ${activity.equipment.join(', ')}</span>
            <div>
                <button class="edit" onclick="editActivity(${activity.id})">Edit</button>
                <button class="delete" onclick="deleteActivity(${activity.id})">Delete</button>
            </div>
        `;
        activitiesList.appendChild(li);
    });
}

function editActivity(id) {
    const activity = activities.find(activity => activity.id === id);
    document.getElementById('activityName').value = activity.name;
    document.getElementById('equipment').value = activity.equipment.join(', ');
    editingId = id;
    document.getElementById('cancelEdit').style.display = 'inline-block';
}

function deleteActivity(id) {
    activities = activities.filter(activity => activity.id !== id);
    saveActivities(); // Update the text file after deletion
    displayActivities(); // Refresh the displayed activities
}

// Cancel editing
document.getElementById('cancelEdit').addEventListener('click', () => {
    editingId = null;
    document.getElementById('activityForm').reset();
    document.getElementById('cancelEdit').style.display = 'none';
});

// Search activities based on name
function searchActivities() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    let filteredActivities;

    if (searchInput) {
        filteredActivities = activities.filter(activity => activity.name.toLowerCase().includes(searchInput));
    } else {
        filteredActivities = []; // If search input is empty, show no activities
    }

    displayActivities(filteredActivities); // Display the filtered activities
}