const body = document.querySelector("body");
const myUrl = 'http://api.tvmaze.com/schedule?country=';
const regex = /^((1[89])|2[0-4])/gi;
const regexCat = /Adventure|Action/gi;

(async function () {
    try {
        const datas = await getData(myUrl, 'CN', '2020-03-03');
        getHour(datas);
    } catch(e) {
        console.error(e.message);
    }
}) ();

async function getData(url=myUrl, country='CN', date='2020-03-03') {
    const apiUrl = `${url}${country}&date=${date}`;
    const response = await fetch(apiUrl);
    if(response.ok) {
        return await response.json();
    }else {
        new Error(`Error: ${response.statusText}`);
    }
}

function getHour(arr) {
    const secondArray = [];
    arr.filter(element => {
        element.airtime.match(regex) ? secondArray.push(element) : element;
    })
    getCategoryFilms(secondArray)
}

function getCategoryFilms(data) {
    const newArray = [];
    data.filter(element => {
        for(let el of element.show.genres) {
            if(el.match(regexCat)) {
                newArray.push(element);
                return newArray;
            }
        }
    })
    displayFilms(newArray);
}

function displayFilms(arr) {
    for(let element of arr) {
        const info = document.createElement("div");
        let tags;
        element.show.genres ? tags = element.show.genres.join('#') : tags = " ";
        let countryZone;
        element.show.webChannel ? countryZone=element.show.webChannel.country.timezone : countryZone = "";
        info.innerText = `${element.show.language} ${element.name} ${element.show.name} ${tags} ${element.airdate} ${element.airtime} ${countryZone}`;
        body.appendChild(info);
        const image = document.createElement("img");
        image.src = `${element.show.image.medium}`;
        body.appendChild(image);
    }
}