const wrapper = document.getElementById('timelineWrapper');
let events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');

let startDate = new Date("2025-05-01");
let endDate = new Date("2025-08-01");
let dayWIdth = 90;

function buildCalendar() {
    wrapper.innerHTML='';
    let date = new Date(startDate);
    while(date <= endDate){
        let month = date.getMonth();
        let year = date.getFullYear();

        let row = document.createElement('div');
        row.className = 'month-row';
    
    
    // header with delete button
    let header = document.createElement('div');
    header.className = 'month-header';

    let title = document.createElement('div');
    title.className = 'month-title';
    title.textContent = `${date.toLocaleString('default', {month:'long'})} ${year}`;

    let delBtn = document.createElement('button');
    delBtn.className = 'month-delete';
    delBtn.textContent = 'Delete Month';
    delBtn.onclick = () => {
        deleteMonth(year,month);
    };

    header.appendChild(title);
    header.appendChild(delBtn);
    row.appendChild(header);

    let days = document.createElement('div');
    days.className = 'days';
    let eventsLayer = document.createElement('div');
    eventsLayer.className = 'events';

    let temp = new Date(year, month+1,0); // last day of this month
    for(let i=1; i <= temp.getDate(); i++) {
        const el = document.createElement('div');
         el.className = 'day';
         el.textContent = i;
         days.appendChild(el);0
    }

    row.appendChild(days);
    row.appendChild(eventsLayer);
    wrapper.appendChild(row);

    renderEventsForMonth(year, month, eventsLayer);

    date = new Date (year, month +1, 1);
    }
}

function renderEventsForMonth(year, month, eventsLayer) {
    eventsLayer.innerHTML = '';
    let trackY = 0;
    events.forEach((ev,index) => {
        let start = new Date(ev.start);
        let end = new Date(ev.end || ev.start);
        if(start.getFullYear() === year && start.getMonth() === month){
            let offset = start.getDate() - 1;
            let span = (end-start)/(1000*3600*24) + 1;

                let div = document.createElement('div');
                div.className = 'event';
                div.style.background = ev.color;
                div.style.left = (offset*daywidth + 4) + 'px';
                div.style.width = (span*dayWidth - 8) + 'px';
                div.style.top = (trackY%3*50) + 'px';

                // event text
                let label = document.createElement('span');
                label.textContent = ev.title;

                // delete button
                let btn = document.createElement('button');
                btn.textContent = 'X';
                btn.onclick = () => {
                    events.splice(index,1);
                    SVGAElement();
                    buildCalendar();
                };

                div.appendChild(label);
                div.appendChild(btn);
                eventsLayer.appendChild(div);
                
                trackY++;                
        }
    });
}

// delete month and events in it

function deleteMonth(year, month) {
    events = events.filter(eve => {
        let start = new Date(ev.start);

        return !(start.getFullYear() === year && start.getMonth() === month );
    });
    save();
    if(startDate.getFullYear() === year && start.getMonth() === month){
        startDate = new Date(year, month + 1, 1);
    }
    buildCalendar();
}

function save() {
    localStorage.setItem('timelineEvents', JSON.stringify(events));
}