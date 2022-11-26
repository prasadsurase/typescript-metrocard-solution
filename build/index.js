"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
let cards = [];
let trips = [];
let lines = readFile('./input/input1.txt');
lines.forEach(line => {
    if (line.trim() !== '') {
        console.log('line: ', line);
        let data = line.split(' ');
        console.log(data);
        switch (data[0]) {
            case 'BALANCE': {
                let indx = findCardIndexById(cards, data[1], parseInt(data[2]));
                console.log('------------------------------------------');
                console.log(cards);
                break;
            }
            case 'CHECK_IN': {
                let trip = createTrip(cards, trips, data[1], data[2], data[3]);
                console.log('------------------------------------------');
                console.log(trips);
                break;
            }
            case 'PRINT_SUMMARY': {
                break;
            }
            default: {
                //statements; 
                break;
            }
        }
    }
});
function createTrip(cards, trips, id, passengerType, destination) {
    let trip = {
        id: getNewTripId(trips),
        cardId: id,
        passengerType: passengerType,
        source: getSource(destination),
        destination: destination,
        charge: 0,
        applicableDiscount: 0,
        rechargeCharge: 0
    };
    trip.charge = getCharge(passengerType);
    trip.applicableDiscount = getApplicableDiscount(trips, id, destination);
    let indx = findCardIndexById(cards, id, 0);
    if (cards[indx].balance < trip.charge) {
        updateBalance(cards[indx], trip.charge - cards[indx].balance);
        trip.rechargeCharge = 2;
    }
    trips.push(trip);
    return trip;
}
function getApplicableDiscount(trips, id, destination) {
    let discount = 0;
    if (trips.length > 0) {
        let filteredTrips = trips.filter((trip) => {
            return (trip.cardId === id) && (trip.source === destination);
        });
        discount = filteredTrips.length > 0 ? 50 : 0;
    }
    return discount;
}
function getCharge(passengerType) {
    let charge = 0;
    switch (passengerType) {
        case 'SENIOR_CITIZEN': {
            charge = 100;
            break;
        }
        case 'ADULT': {
            charge = 200;
            break;
        }
        case 'KID': {
            charge = 50;
            break;
        }
    }
    return charge;
}
;
function getSource(destination) {
    return destination == 'CENTRAL' ? 'AIRPORT' : 'CENTRAL';
}
function getNewTripId(trips) {
    let max = 0;
    for (let i = 0; i < trips.length; i++) {
        if (trips[i].id > max) {
            max = trips[i].id;
        }
    }
    return max + 1;
}
// find card by index and update the balance.
function findCardIndexById(cards, id, balance) {
    let cardIndex = cards.findIndex((card) => card.id == id);
    if (cardIndex > -1) {
        if (balance > 0) {
            updateBalance(cards[cardIndex], balance);
        }
        return cardIndex;
    }
    else {
        let card = { id: id, balance: balance | 0 };
        cards.push(card);
        return cards.findIndex((card) => card.id == id);
    }
}
;
function updateBalance(card, balance) {
    card.balance += balance;
    return card;
}
;
function readFile(path) {
    let lines = [];
    const allFileContents = fs.readFileSync(path, 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line => {
        lines.push(line);
    });
    return lines;
}
