export type Trip = {
  id: number,
  cardId: string,
  source: string
  destination: string
  passengerType: string
  charge: number
  applicableDiscount: number
  rechargeCharge: number
}