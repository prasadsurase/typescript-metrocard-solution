"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { PassengerType } from './globals/passenger_type';
const card_1 = require("./card/card");
const trip_1 = require("./trip/trip");
const common_utils_1 = __importDefault(require("./utils/common_utils"));
let cards = [];
let trips = [];
let lines = common_utils_1.default.readFile('./input/input1.txt');
let calculateSummary = (trips) => {
    ['CENTRAL', 'AIRPORT'].forEach(source => {
        let totalCollection = 0;
        let totalDiscount = 0;
        let filteredTrips = trips.filter(trip => trip.source == source);
        filteredTrips.forEach(trip => {
            let result = common_utils_1.default.calculateDiscountAmount(trip.charge, trip.discountPercentage);
            totalCollection += (trip.charge - result);
            if (trip.rechargeAmount > 0) {
                result = common_utils_1.default.calculateDiscountAmount(trip.rechargeAmount, 2);
                totalCollection += result;
            }
            totalDiscount += trip.discountAmount;
        });
        console.log("TOTAL_COLLECTION", source, totalCollection, totalDiscount);
    });
    return null;
};
lines.forEach(line => {
    if (line.trim() !== '') {
        let data = line.split(' ');
        switch (data[0]) {
            case 'BALANCE': {
                let card = (0, card_1.createCard)(data[1]);
                card = (0, card_1.updateBalance)(card, parseInt(data[2]));
                cards.push(card);
                break;
            }
            case 'CHECK_IN': {
                console.log("^".repeat(190));
                console.log("^".repeat(190));
                console.log(data);
                console.table(cards);
                let card = cards.find(card => card.id == data[1]);
                if (card) {
                    let discountPercentage = (0, trip_1.getApplicableDiscount)(trips, data[1], data[3]);
                    let discountAmount = 0;
                    if (discountPercentage > 0) {
                        let charge = common_utils_1.default.getCharge(data[2]);
                        discountAmount = common_utils_1.default.getAmountAfterDiscount(charge, discountPercentage);
                    }
                    let trip = (0, trip_1.createTrip)(common_utils_1.default.getNewId(trips), data[1], data[2], data[3], (0, trip_1.getApplicableDiscount)(trips, data[1], data[3]), discountAmount, 0, 0);
                    if (card.balance < common_utils_1.default.getCharge(data[2])) {
                        let rechargeAmount = common_utils_1.default.getCharge(data[2]) - card.balance;
                        card = (0, card_1.updateBalance)(card, -card.balance);
                        trip = (0, trip_1.setTripCalculatedFields)(trip, rechargeAmount);
                    }
                    else {
                        card = (0, card_1.updateBalance)(card, -(trip.charge - trip.discountAmount));
                    }
                    cards = common_utils_1.default.updateInList(cards, card);
                    trips.push(trip);
                }
                break;
            }
            case 'PRINT_SUMMARY': {
                console.table(trips);
                console.table(cards);
                calculateSummary(trips);
                break;
            }
            default: {
                break;
            }
        }
    }
});
