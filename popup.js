

const setSchedule = (data) => {
    if (!data) {
        document.querySelector('.schedule').innerHTML = '';
        return;
    }
    let htmlstring = '';
    for (let i = 0; i < 7; i++) {
        const day = data[i];
        let lessons = '';
        day.lessons.forEach(lesson => {
            let typestyle = 'default';
            console.log(lesson.type == 'л.');
            if (lesson.type == 'л.') typestyle = 'l';
            if (lesson.type == 'пр.') typestyle = 'pr';
            if (lesson.type == 'лаб.') typestyle = 'lab';
            lessons +=
            `<div class="lesson ${typestyle}">
            <div class="timeandplace">
            <strong class="time">${lesson.start + '-' + lesson.end}</strong>
            <span class="place">${lesson.place}</span>
            </div>
            <div class="nameandteacher">
            <strong class="name">${lesson.name}</strong>
            <span class="teacher">${lesson.teacher}</span>
            </div>
            </div>`
        })
        if (!lessons) lessons+=`<image src="./icons/happy-svgrepo-com.svg" class="i-happy"></image>`
        
        htmlstring += 
        `<div class="day">
            <input type="checkbox" class="checkbox" id="${i}" ${
                Math.floor((Date.now() - new Date("Feb 7 2022 00:00:00"))/1000/60/60/24)%7 == i ? 'checked' : ''
            }>
            <label for='${i}' class="day-header">
                <span class="date">${day.date}</span><image src="./icons/up-arrow-svgrepo-com.svg" class="i-arrow"></image>
            </label>
            <div class="lessons">
            ${lessons}
            </div>
        </div>`;
    };
    document.querySelector('.schedule').innerHTML = htmlstring;
}

const saveData = (data, week) => {
    localStorage.setItem('lessons_'+week, JSON.stringify(data));
}

const restoreData = (week) => {
    if (!localStorage.hasOwnProperty('lessons_'+week)) return;
    try {
        let data = JSON.parse(localStorage.getItem('lessons_'+week));
        setSchedule(data);
        document.querySelector('.title').innerHTML = 'ENERS schedule - week '+week;
    } catch (err) {
        console.log("Wrong data format");
    }
}

const getSchedule = (week) => {
    document.querySelector('.schedule').innerHTML = '<div class="loadingio-spinner-rolling-w48jmon96u"><div class="ldio-h0wo97mr80w"><div></div></div></div>';
    restoreData(week);
    fetch('https://eners-parser.herokuapp.com/lessons/'+week)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        saveData(data, week);
        setSchedule(data);
        document.querySelector('.title').innerHTML = 'ENERS schedule - week '+week;
    })
    .catch(err => {
        console.log(err.message);
    });
}

let days = Math.floor((Date.now() - new Date("Feb 7 2022 00:00:00"))/1000/60/60/24) + 1;
console.log(days);
this.week = Math.floor(days / 7) + 1;

document.querySelector(".btn-next").addEventListener('click', () => {
    ++this.week; 
    console.log(this.week);
    getSchedule(this.week)
});
document.querySelector(".btn-prev").addEventListener('click', () => {
    if (this.week < 2) return;
    --this.week; 
    console.log(this.week);
    getSchedule(this.week)
});
getSchedule(this.week);



