let event = [] // will be loaded from event.json & user input

// loading initial events from JSON
async function loadEvents() {
    const response = await fetch("events.json");
    const data = await response.json();
    events = data;
    renderCalendar();
}

// saving events in localStorage

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events))
}

// render the calendar

function renderCalendar() {
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = '';

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date (year, month + 1, 0);
    
    const header = document.createElement("h2")
    header.textContent = today.toLocaleString("default", {month: "long", year: 'numeric'})
    calendar.appendChild(header);

    // grid calendar
    const grid = document.createElement("div")
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(7, 1fr)";
    grid.style.gap = "5px";

    const weekDays = ["Mon", "Tue", "Wed", "Tue", "Fri", "Sat", "Sun"];
    weekDays.forEach(day => {
        const cell = document.createElement("div");
        cell.textContent = day;
        grid.appendChild(cell);
    });
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        // creating empty cell before first day
        grid.appendChild(document.createElement('div'))
    }

    // Day of month
    for (let day = 1;day <= lastDay.getDate(); day++) {
        const date = new Date (year, month, day);
        const cell = document.createElement('div');
        cell.style.border = "1px solid #ccc";
        cell.style.minHeight = "80px";
        cell.style.padding = "5px"

        const label = document.createElement('div');
        label.textContent = day;
        cell.appendChild(label);
        
        events.forEach(event => {
            // checking event for this day
            const start = new Date(event.start)
            const end = new Date(event.end)
            if(date >= start&& date <= end) {
                badge.textConten = event.title;
                badge.style.fontSize = "0.7em"
                badge.style.background = "#eee"
                badge.style.marginTop = "2px"
                cell.appendChild(badge);
            }
        });
        
        grid.appendChild(cell)
    }
    
    calendar.appendChild(grid)
}

//Add event form handler

document.getElementById('eventForm').addEventListener('submit', (el) => {
    el.preventDefault();

    const title = document.getElementById('title').value
    const game = document.getElementById('game').value
    const start = document.getElementById('start').value
    const end = document.getElementById('end').value

    events.push({ title, game, start, end});

    renderCalendar();

    el.target.reset();
});

loadEvents();