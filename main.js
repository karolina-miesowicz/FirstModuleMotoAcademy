const body = document.querySelector("body");
const apiUrl = 'http://api.tvmaze.com';
const regex = /^((1[89])|2[0-4])/gi;
const regexCat = /Adventure|Action/gi;

(async function() {
    try {
        const datas = await getData('CN', '2020-03-03');
        filterSchedule(datas);
    } catch (e) {
        console.error(e.message);
    }
})();

async function getData(country = 'CN', date = '2020-03-03') {
    const url = `${apiUrl}/schedule?country=${country}&date=${date}`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
    new Error(`Error: ${response.statusText}`);
}

function filterSchedule(arr) {
    const filteredSchedule = [];
    arr.filter(element => {
        if (isProperCategoryFilms(element) && isProperHour(element)) filteredSchedule.push(element);
    })
    displayFilms(filteredSchedule);
}

function isProperHour(program) {
    return program.airtime.match(regex)
}

function isProperCategoryFilms(program) {
    for (let genre of program.show.genres) {
        if (genre.match(regexCat)) {
            return true;
        }
    }
    return false;
}

function displayFilms(arr) {
    for (let element of arr) {
        const info = document.createElement("div");
        let tags = element.show.genres;
        tags.map((genre, index) => {
            tags[index] = `#${genre}`;
        });

        tags = tags ? tags.join(', ') : " ";
        let countryZone;
        element.show.webChannel ? countryZone = element.show.webChannel.country.timezone : countryZone = "";
        info.innerText = `${element.show.language} ${element.name} ${element.show.name} ${tags} ${element.airdate} ${element.airtime} ${countryZone}`;
        body.appendChild(info);
        const image = document.createElement("img");
        image.src = `${element.show.image.medium}`;
        body.appendChild(image);
    }
}