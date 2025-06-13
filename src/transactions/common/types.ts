export type Amount = {
  amount: number;
};

export type PendingPayoutAmount = {
  amount: number;
  currency: string;
  usersAmount: number;
  paymentIdHash: string;
};
