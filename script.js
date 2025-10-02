const defaultEvents = [
    {
        "title": "Lantern Rite Festival",
        "game": "Genshin Impact",
        "start": "2025-10-01",
        "end": "2025-10-14",
        "icon": "img/lantern.png"
    },
    {
        "title": "New Baner",
        "game": "Honkai Star Rail",
        "start": "2025-10-15",
        "end": "2025-10-21",
        "icon": "img/banner.png"

    }
]

let events = JSON.parse(localStorage.getItem('events')) ; // will be loaded from event.json & user input
saveEvents();
renderCalendar();
loadEvents();

// loading initial events from JSON
async function loadEvents() {
    try {
        const response = await fetch("events.json");
        if(!response.ok) throw new Error('No events.json');
        const data = await response.json();
        events = data;
        saveEvents();
    } catch (error) {
        console.warn('Skiping external events.json', error.message)
    }    
    renderCalendar();
}

// saving events in localStorage

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events))
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
    grid.style.gap = "2px";
    calendar.appendChild(grid);

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekDays.forEach(day => {
        const cell = document.createElement("div");
        cell.textContent = day;
        cell.style.fontWeight = "bold"
        grid.appendChild(cell);
    });
    
    let offset = (firstDay.getDay() + 6) % 7; // the first day is always Sunday by using .getDay() method thats why we +6 % 7
    for (let i = 0; i < offset; i++) {
        // creating empty cell before first day (which is always Sunday, bcoz .getDay() is JS method that takes info from the date
        //  but always order sun-mon not mon-sun)
        const emptyCell = document.createElement('div')
        emptyCell.textContent = '';
        grid.appendChild(emptyCell)
    }

    // Day of month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        // const date = new Date (year, month, day);
        const cell = document.createElement('div');
        cell.style.border = "1px solid #ccc";
        cell.style.minHeight = "80px";
        cell.style.padding = "5px"
        cell.style.position = "relative"

        const label = document.createElement('div');
        label.textContent = day;
        label.style.fontSize = "0.8em"
        label.style.fontWeight = "bold"
        cell.appendChild(label);

        grid.appendChild(cell);
        
        events.forEach(event => {
            // checking event for this day
            const start = new Date(event.start)
            const end = new Date(event.end);

            if (end.getMonth() !== month && start.getMonth() !== month) return;

            const startDay = Math.max(1, start.getDate());
            const endDay =Math.min(lastDay.getDate(), end.getDate())

            const startCol = ((new Date(year, month, startDay).getDay() +6) % 7)
            const endCol = ((new Date(year, month, startDay).getDay() +6) % 7)+1

            const bar = document.createElement('div');
            bar.className = "event-bar";
            bar.style.gridColumn = `${startCol +1} / span ${endDay - startDay +1}`
            bar.style.marginTop = '5px';

            bar.style.background = "linear-gradient(90deg, #5aa0ff, #7dcfff)"
            bar.style.borderRadius = "20px"
            bar.style.color = 'white'
            bar.style.padding = '3px 8px'
            bar.style.fontSize = '0.8em'
            bar.style.display = 'flex'
            bar.style.alignItems = 'center'
            bar.style.gap = '5px'
           
            if (event.icon) {
                const img = document.createElement('img')
                img.src = event.icon;
                img.style.width = '20px'
                img.style.height = '20px'
                img.style.borderRadius = '50%'
                bar.appendChild(img)
                
            }

            // with Badge style
            // if(date >= start&& date <= end) {
            //     const badge = document.createElement('div')
            //     badge.textContent = event.title;
            //     badge.style.fontSize = "0.7em"
            //     badge.style.background = "#eee"
            //     badge.style.marginTop = "2px"
            //     cell.appendChild(badge);
            // }
            
            const text = document.createElement('span');
            text.textContent = event.title;
            bar.appendChild(text);

            grid.appendChild(bar)
    });
        
        
    }
    
    
}

//Add event form handler

document.getElementById('eventForm').addEventListener('submit', (el) => {
    el.preventDefault();

    const title = document.getElementById('title').value
    const game = document.getElementById('game').value
    const start = document.getElementById('start').value
    const end = document.getElementById('end').value

    events.push({ title, game, start, end});
    saveEvents();
    renderCalendar();
    el.target.reset();
});

