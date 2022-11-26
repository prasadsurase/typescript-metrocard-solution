import CommonUtils from '../utils/common_utils'

type Trip = {
  id: number,
  cardId: string,
  source: string
  destination: string
  passengerType: string
  charge: number
  discountPercentage: number
  discountAmount: number,
  rechargePercentage: number
  rechargeAmount: number
  rechargeFeeAmount: number 
}

let createTrip = (
    id: number, 
    cardId: string, 
    passengerType: string, 
    source: string, 
    discountPercentage: number, 
    discountAmount: number, 
    rechargePercentage: number, 
    rechargeFeeAmount: number
  ): Trip => {
  let trip: Trip = {
    id: id,
    cardId: cardId,
    passengerType: passengerType, 
    source: source,
    destination: CommonUtils.getDestination(source),
    charge: CommonUtils.getCharge(passengerType),
    discountPercentage: discountPercentage,
    discountAmount: discountAmount,
    rechargeAmount: 0,
    rechargePercentage: rechargePercentage,
    rechargeFeeAmount: rechargeFeeAmount,
  }

  return trip;
}

let setTripCalculatedFields = (trip: Trip, rechargeAmount: number): Trip => {
  trip.rechargePercentage = 2
  trip.rechargeAmount = rechargeAmount
  trip.rechargeFeeAmount = CommonUtils.calculateDiscountAmount(trip.rechargeAmount, trip.rechargePercentage)
  
  return trip;
}

let getApplicableDiscount = (trips: Trip[], cardId: string, source: string): number => {
  let discount: number = 0;
  if (trips.length > 0) {
    let filteredTrips: Trip[] = trips.filter((trip) => {
      return (trip.cardId === cardId) && (trip.destination === source)
    });

    discount = filteredTrips.length > 0 ? 50 : 0;
  }
  return discount;
}

export { Trip, createTrip, getApplicableDiscount, setTripCalculatedFields }
