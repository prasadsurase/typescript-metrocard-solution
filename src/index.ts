// import { PassengerType } from './globals/passenger_type';
import { Card, createCard, updateBalance } from './card/card';
import { Trip, createTrip, getApplicableDiscount, setTripCalculatedFields } from './trip/trip';
import CommonUtils from './utils/common_utils';

let cards: Card[] = [];
let trips: Trip[] = [];
let lines: string[] = CommonUtils.readFile('./input/input1.txt');

let calculateSummary = (trips: Trip[]): null => {
  ['CENTRAL', 'AIRPORT'].forEach(source => {
    let totalCollection: number = 0
    let totalDiscount: number = 0
    let filteredTrips: Trip[] = trips.filter(trip => trip.source == source)
    filteredTrips.forEach(trip => {
      let result: number = CommonUtils.calculateDiscountAmount(trip.charge, trip.discountPercentage);
      totalCollection += (trip.charge - result)
      if(trip.rechargeAmount > 0) {
        result = CommonUtils.calculateDiscountAmount(trip.rechargeAmount, 2)
        totalCollection += result
      }
      totalDiscount += trip.discountAmount
    });
    console.log("TOTAL_COLLECTION", source, totalCollection, totalDiscount);
  });

  return null;
}

lines.forEach(line => {
  if(line.trim() !== '') {
    let data: string[] = line.split(' ');
    
    switch(data[0]) { 
      case 'BALANCE': { 
        let card: Card = createCard(data[1])
        card = updateBalance(card, parseInt(data[2]))
        cards.push(card);
        break; 
      } 
      case 'CHECK_IN': {
        console.log("^".repeat(190))
        console.log("^".repeat(190))
        console.log(data);
        console.table(cards)
        let card: Card | undefined = cards.find(card => card.id == data[1])
        if (card) {
          let discountPercentage: number = getApplicableDiscount(trips, data[1], data[3])
          let discountAmount: number = 0
          if(discountPercentage > 0) {
            let charge: number = CommonUtils.getCharge(data[2])
            discountAmount = CommonUtils.getAmountAfterDiscount(charge, discountPercentage)
          }
          let trip: Trip = createTrip(
            CommonUtils.getNewId(trips), 
            data[1],
            data[2],
            data[3],
            getApplicableDiscount(trips, data[1], data[3]),
            discountAmount,
            0,
            0
          )

          if(card.balance < CommonUtils.getCharge(data[2])) {
            let rechargeAmount = CommonUtils.getCharge(data[2]) - card.balance
            
            card = updateBalance(card, -card.balance)
            trip = setTripCalculatedFields(trip, rechargeAmount)
          } else {
            card = updateBalance(card, -(trip.charge - trip.discountAmount))
          }
          cards = CommonUtils.updateInList(cards, card)
          trips.push(trip)
        } 
        break; 
      } 
      case 'PRINT_SUMMARY': { 
        console.table(trips)
        console.table(cards)
        calculateSummary(trips);
        break;
      } 
      default: { 
        break; 
      } 
    } 
  }
});
