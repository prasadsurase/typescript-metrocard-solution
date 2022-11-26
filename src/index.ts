// import { PassengerType } from './globals/passenger_type';
import { MetroCard } from './metrocard/metrocard';
import { Trip } from './trip/trip';
import * as fs from 'fs';

let cards: MetroCard[] = [];
let trips: Trip[] = [];
let lines: string[] = readFile('./input/input1.txt');

lines.forEach(line => {
  if(line.trim() !== '') {
    console.log('line: ', line);

    let data: string[] = line.split(' ');
    console.log(data);

    switch(data[0]) { 
      case 'BALANCE': { 
        let indx: number = findCardIndexById(cards, data[1], parseInt(data[2]))
        console.log('------------------------------------------');
        console.log(cards);
        break; 
      } 
      case 'CHECK_IN': { 
        let trip: Trip = createTrip(cards, trips, data[1], data[2], data[3])
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

function createTrip(cards: MetroCard[], trips: Trip[], id: string, passengerType: string, destination: string) {
  let trip: Trip = {
    id: getNewTripId(trips), 
    cardId: id,
    passengerType: passengerType, 
    source: getSource(destination),
    destination: destination,
    charge: 0,
    applicableDiscount: 0,
    rechargeCharge: 0
  }
  trip.charge = getCharge(passengerType);
  trip.applicableDiscount = getApplicableDiscount(trips, id, destination);
  let indx: number = findCardIndexById(cards, id, 0);
  if (cards[indx].balance < trip.charge){
    updateBalance(cards[indx], trip.charge - cards[indx].balance); 
    trip.rechargeCharge = 2
  }
  trips.push(trip);
  return trip;
}

function getApplicableDiscount(trips: Trip[], id: string, destination: string): number {
  let discount: number = 0;
  if (trips.length > 0) {
    let filteredTrips: Trip[] = trips.filter((trip) => {
      return (trip.cardId === id) && (trip.source === destination)
    });

    discount = filteredTrips.length > 0 ? 50 : 0;
  }
  return discount;
}

function getCharge(passengerType: string): number {
  let charge: number = 0;
  switch(passengerType) { 
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
};

function getSource(destination: string): string {
  return destination == 'CENTRAL' ? 'AIRPORT' : 'CENTRAL';
}

function getNewTripId(trips: Trip[]): number {
  let max: number = 0;
  for (let i = 0; i < trips.length; i++) {
    if(trips[i].id > max) {
      max = trips[i].id;
    }
  }

  return max + 1;
}

// find card by index and update the balance.
function findCardIndexById(cards: MetroCard[], id: string, balance: number): number {
  let cardIndex: number = cards.findIndex((card) => card.id == id)

  if(cardIndex > -1 ) {
    if (balance > 0) {
      updateBalance(cards[cardIndex], balance); 
    }
    return cardIndex;
  } else {
    let card: MetroCard = { id: id, balance: balance | 0 };
    cards.push(card);
    return cards.findIndex((card) => card.id == id)
  }
};

function updateBalance<T extends { balance: number }>(card: T, balance: number): T {
  card.balance += balance;
  return card;
};

function readFile(path: string): string[] {
  let lines: string[] = [];
  const allFileContents = fs.readFileSync(path, 'utf-8');
  
  allFileContents.split(/\r?\n/).forEach(line =>  {
    lines.push(line);
  });
  
  return lines;
}
