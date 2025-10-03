const wrapper = document.getElementById('timelineWrapper');
let events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');

let startDate = new Date("2025-05-01");
let endDate = new Date("2025-08-01");
let dayWIdth = 90;  