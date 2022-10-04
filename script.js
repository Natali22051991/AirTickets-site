import data from './dataBase.json' assert {type: 'json'};
const CARDS = document.querySelector('.cards');
const btnAction = CARDS.querySelector('.btn-action');
const btnMore = document.querySelector('.btn-more');
const radios = document.querySelectorAll('.real-radio-btn');
const sort = document.querySelector('.sort')
const COMPANYS = new Set();
const TOTALS = new Set();
const flightsData = data.result.flights
let count = 2;
const storeFlightsData = [];
const FORM = document.querySelector('form');
const airlineDiv = FORM.querySelector('.airline');
console.log(airlineDiv);
/**
 * @type {sort:string}
 * @param filter.sort - по возрастания,убыванию и время
 * @param filter.transfer - по наличию пересадки
 * @param filter.fromPrice - по цене
 * @param filter.beforePrice - по цене
 * @param filter.carrier - по перевозчику
 * 
 */
const FILTER = {
    sort: null,
    transfer: [],
    fromPrice: null,
    beforePrice: null,
    carrier: []
}

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
        // console.log(data);
        const { format } = new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            hour12: false,
            minute: '2-digit'
        });
        let time = format(new Date(data));
        // console.log(time);
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
        return {
            total: Math.max.apply(null, this.data.legs.map(el => el.segments.length)),
            from: this.data.legs[0].segments.length,
            there: this.data.legs[1].segments.length
        }
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
            <p>${this.departureCity.there?.caption},${this.departureAirports.there?.caption}<span>(${this.departureAirports.there?.uid})→</span>${this.arrivalCity.there?.caption},${this.arrivalAirports.there?.caption}<span>(${this.arrivalAirports.there?.uid})</span></p>
        </div>

        <div class="departureTimeThere">
            <p>${this.timeDepartureThere}<span>${this.dayDepartureThere}${this.weekDepartureThere}</span><img width="30" height="30" src="images/time1.png" alt="images/time1.png">${this.duration.there}<span>${this.dayArrivalThere}${this.weekArrivalThere}</span>${this.timeArrivalThere}
            </p>
        </div>
        <div class="align"><span class="transfer">${this.trasfer.there === 1 ? '' : '1 пересадка'}</span></div>
        <div class="nameAirlinThere">
            <p>Рейс выполняет:${this.carrier}</p>
        </div>
        <div class="orientationFromThere">
        <p>${this.departureCity.fromThere.caption},${this.departureAirports.fromThere.caption}<span>(${this.departureAirports.fromThere.uid})→</span>${this.arrivalCity.fromThere.caption},${this.arrivalAirports.fromThere.caption}<span>(${this.arrivalAirports.fromThere.uid})</span></p>
        </div>
        <div class="departureTimeFromThere">
        <p>${this.timeDepartureFromThere}<span>${this.dayDepartureFromThere}${this.weekDepartureFromThere}</span><img width="30" height="30" src="images/time1.png" alt="images/time1.png">${this.duration.fromThere}<span>${this.dayArrivalFromThere}${this.weekArrivalFromThere}</span>${this.timeArrivalFromThere}
            </p></div>
        <div class="align"><span class="transfer">${this.trasfer.from === 1 ? '' : '1 пересадка'}</span></div>
        <div class="nameAirlineFromThere">
            <p>Рейс выполняет:${this.airlineArrival}</p>
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
    duration;

    constructor(data) {
        this.data = data;
        this.departureCity = this.getProperty('departureCity', 'departure');
        this.departureAirports = this.getProperty('departureAirport', 'departure');
        this.airlineArrival = data.legs[1].segments[data.legs[1].segments.length - 1].airline.caption;


        this.arrivalCity = this.getProperty('arrivalCity', 'arrival');
        this.arrivalAirports = this.getProperty('arrivalAirport', 'arrival');
        this.arrivalDates = this.getProperty('arrivalDate');
        this.departureDates = this.getProperty('departureDate');


        this.dayArrivalThere = Util.getData(this.arrivalDates.there);
        this.dayArrivalFromThere = Util.getData(this.arrivalDates.fromThere);

        this.dayDepartureThere = Util.getData(this.departureDates.there);
        this.dayDepartureFromThere = Util.getData(this.departureDates.fromThere);

        this.timeArrivalThere = Util.getTime(this.arrivalDates.there);
        this.timeArrivalFromThere = Util.getTime(this.arrivalDates.fromThere);

        this.timeDepartureThere = Util.getTime(this.departureDates.there);
        this.timeDepartureFromThere = Util.getTime(this.departureDates.fromThere);

        this.weekArrivalThere = Util.getWeek(this.arrivalDates.there);
        this.weekArrivalFromThere = Util.getWeek(this.arrivalDates.fromThere);

        this.weekDepartureThere = Util.getWeek(this.departureDates.there);
        this.weekDepartureFromThere = Util.getWeek(this.departureDates.fromThere);

        this.duration = new FromThere(Util.getTravelDuration(data.legs[0].duration), Util.getTravelDuration(data.legs[1].duration));
        this.travelTime = data.legs[0].duration + data.legs[1].duration;

        this.total = data.price.total.amount;
        this.carrier = data.carrier.caption;

    }

    getProperty(element, direction) {
        return new FromThere(direction === 'departure'
            //если вылет
            ? this.data.legs[0].segments[0][element]
            //если прилет
            : this.trasfer.there > 1
                ? this.data.legs[0].segments[this.data.legs[0].segments.length - 1][element]
                : this.data.legs[0].segments[0][element],
            direction === 'departure'
                //если вылет
                ? this.data.legs[1].segments[0][element]
                //если прилет
                : this.trasfer.fromThere > 1
                    ? this.data.legs[1].segments[0][element]
                    : this.data.legs[1].segments[this.data.legs[1].segments.length - 1][element])
    }
}
function init() {
    for (let key in flightsData) {
        storeFlightsData.push(new Flight(flightsData[key].flight));//положила в свой массив
        COMPANYS.add(flightsData[key].flight.carrier.caption)
        TOTALS.add(flightsData[key].flight.price.total.amount)
    }
    console.log(storeFlightsData);

    COMPANYS.forEach((el, i) => {
        airlineDiv.innerHTML += `<label for="${el}"><input id="${el}" type="checkbox" name="carrier"
        checked value="${el}"><span>${el}</span></label>`
    })

    getFilters();
}
init();


/**
 * 
 * @param {Array<Flight>} arr 
 * @param {Object} filter 
 * @param filter.sort - по возрастания,убыванию и время
 * @param filter.transfer - по наличию пересадки
 * @param filter.fromPrice - по цене
 * @param filter.beforePrice - по цене
 * @param filter.carrier - по перевозчику
 * 
 */


function getFilterFlights(arr, filter) {

    const result = arr.filter((el) => {
        return +el.total >= +filter.fromPrice
            && +el.total <= +filter.beforePrice
            && filter.carrier.filter((el) => el.checked).map(el => el.value).includes(el.carrier)
            && filter.transfer.filter((el) => el.checked).map(el => +el.value).includes(el.trasfer.total)
    }).sort((a, b) => {
        if (filter.sort === 'increasePrice') {
            return a.total - b.total

        } else if (filter.sort === 'reductionPrice') {
            return b.total - a.total
        } else if (filter.sort === 'travelTime') {
            return a.travelTime - b.travelTime
        }
    }

    ).filter((el, i) => i < count);

    render(result)
}

FORM.addEventListener('input', getFilters);

function getFilters() {
    FILTER.sort = FORM.elements.sort.value;
    FILTER.transfer = [...FORM.elements.transfer].map((el) => ({ checked: el.checked, value: el.value }));
    FILTER.fromPrice = FORM.elements.fromPrice.value;
    FILTER.beforePrice = FORM.elements.beforePrice.value;
    FILTER.carrier = [...FORM.elements.carrier].map((el) => ({ checked: el.checked, value: el.value }));
    getFilterFlights(storeFlightsData, FILTER);
}

function render(arr) {

    console.log(arr);
    CARDS.innerHTML = '';
    arr.forEach(element => {
        CARDS.innerHTML += element.template;
    });
}


btnMore.addEventListener('click', () => {
    count += 2;
    getFilters()

});
