import data from './dataBase.json' assert {type: 'json'};
const CARDS = document.querySelector('.cards');
const btnAction = CARDS.querySelector('.btn-action');
const btnMore = document.querySelector('.btn-more');
const COMPANYS = new Set();
const flightsData = data.result.flights
let count = 2;
const storeFlightsData = [];



class FromThere {
    there;
    fromThere;
    constructor(h, t) {
        this.there = h;
        this.fromThere = t;
    }
}

class Util {

    static getData(data) {
        if (data) {
            const { format } = new Intl.DateTimeFormat('ru-RU', {
                month: 'short',
                day: '2-digit'
            });
            let day = format(new Date(data));
            // console.log(day)
            return day;
        }
    }

    static getTime(data) {
        const { format } = new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            hour12: false,
            minute: '2-digit'
        });
        let time = format(new Date(data));
        return time;
    }

    static getWeek(data) {
        const { format } = new Intl.DateTimeFormat('ru-RU', {
            weekday: 'short'
        })
        let week = format(new Date(data));
        return week;
    }


    static getTravelDuration(data) {

        const hours = Math.floor(data / 60);
        const minutes = data % 60 > 9 ? data % 60 : '0' + data % 60;
        return `${hours} ч ${minutes} мин`;
    }
}


class Flight {
    data;
    total;

    get trasfer() {
        return Math.max.apply(null, this.data.legs.map(el => el.segments.length));
    }

    get template() {
        return `<div class="card">
        <div class="headerCard">
            <div class="head">
                <img src="#" alt="logo">
                <span>${this.total} &#8381;</span>
            </div>

            <div class="link">
                <span>Стоимость для одного взрослого пассажира</span>
            </div>
        </div>
        <div class="orientationThere">
            <p>${this.departureCity.there.caption},${this.departureAirports.there.caption}<span>(${this.departureAirports.there.uid})→</span>${this.arrivalCity.there.caption},${this.arrivalAirports.there.caption}<span>(${this.arrivalAirports.there.uid})</span></p>
        </div>

        <div class="departureTimeThere">
            <p>${this.timeDepartureThere}<span>${this.dayDepartureThere}${this.weekDepartureThere}</span><img width="30" height="30" src="images/time1.png" alt="images/time1.png">${this.duration.there}<span>${this.dayArrivalFromThere}${this.weekArrivalFromThere}</span>${this.timeArrivalFromThere}
            </p>
        </div>
        <div class="align"><span>1 пересадка</span></div>
        <div class="nameAirlinThere">
            <p>Рейс выполняет:${this.carrier}</p>
        </div>
        <div class="orientationFromThere">
        <p>${this.arrivalCity.fromThere.caption},${this.arrivalAirports.fromThere.caption}<span>(${this.arrivalAirports.fromThere.uid})→</span>${this.departureCity.fromThere.caption},${this.departureAirports.fromThere.caption}<span>(${this.departureAirports.fromThere.uid})</span></p>
        </div>
        <div class="departureTimeFromThere"></div>
        <div class="align"><span>1 пересадка</span></div>
        <div class="nameAirlineFromThere">
            <p>Рейс выполняет:</p>
        </div> 
        <button id="btn-action" class="btn-action">Выбрать</button>

    </div>`
    }


    carrier;
    departureCity;
    departureAirports;

    arrivalCity;
    arrivalAirports;
    arrivalDates;
    departureDate;

    dayArrivalThere;
    dayArrivalFromThere;

    weekArrivalThere;
    weekArrivalFromThere;

    timeArrivalThere;
    timeArrivalFromThere;

    dayDepartureThere;
    dayDepartureFromThere;

    timeDepartureThere;
    timeDepartureFromThere;

    weekDepartureThere;
    weekDepartureFromThere;

    hours;
    minutes;
    duration;

    constructor(data) {
        this.data = data;
        this.departureCity = this.getProperty('departureCity', 'caption');
        this.departureAirports = this.getProperty('departureAirport', 'caption');

        this.arrivalCity = this.getProperty('arrivalCity', 'caption');
        this.arrivalAirports = this.getProperty('arrivalAirport', 'caption');
        this.arrivalDates = this.getProperty('arrivalDate');

        this.departureDates = this.getProperty('departureDate');
        this.dayArrivalThere = Util.getData(this.arrivalDates.there);
        this.dayArrivalFromThere = Util.getData(this.arrivalDates.fromThere);

        this.dayDepartureThere = Util.getData(this.departureDates.there);
        this.dayDepartureFromThere = Util.getData(this.departureDates.fromThere);

        this.timeArrivalThere = Util.getTime(this.arrivalDates.there);
        this.timeArrivalFromThere = Util.getTime(this.arrivalDates.fromThere);

        this.weekArrivalThere = Util.getWeek(this.arrivalDates.there);
        this.weekArrivalFromThere = Util.getWeek(this.arrivalDates.fromThere);

        this.timeArrivalThere = Util.getTime(this.arrivalDates.there);
        this.timeArrivalFromThere = Util.getTime(this.arrivalDates.fromThere);

        this.timeDepartureThere = Util.getTime(this.arrivalDates.there);
        this.timeDepartureFromThere = Util.getTime(this.arrivalDates.fromThere);

        this.weekDepartureThere = Util.getWeek(this.arrivalDates.there);
        this.weekDepartureFromThere = Util.getWeek(this.arrivalDates.fromThere);

        this.duration = new FromThere(Util.getTravelDuration(data.legs[0].duration), Util.getTravelDuration(data.legs[1].duration));

        this.total = data.price.total.amount;
        this.carrier = data.carrier.caption;
    }

    getProperty(element) {
        return this.trasfer === 1
            ? new FromThere(this.data.legs[0].segments[0][element], this.data.legs[1].segments[0][element])
            : new FromThere(this.data.legs[0].segments[this.data.legs[0].segments.length - 1][element], this.data.legs[1].segments[this.data.legs[1].segments.length - 1][element]);
    }

}


for (let key in flightsData) {
    storeFlightsData.push(new Flight(flightsData[key].flight));//положила в свой массив
    COMPANYS.add(flightsData[key].flight.carrier.caption)

}
console.log(storeFlightsData, [...COMPANYS]);

function render(arr, i) {
    CARDS.innerHTML = '';
    arr.forEach(element => {
        CARDS.innerHTML += element.template;
    });
}
render(storeFlightsData.filter((e, i) => i < 4))

