type Card = {
  id: string
  balance: number
};

let createCard = (id: string): Card => {
  return { id: id, balance: 0 };
}

let updateBalance = <T extends { balance: number }>(card: T, balance: number): T => {
  card.balance += balance;
  return card;
};

export { Card, createCard, updateBalance };
