import { Request, Response } from "express";
import { cardStorage } from "../../models/CardStorage";
import { User, userStorage } from "./userController";

export const buyCard = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const cardId = Number(req.params.cardId);

  const user = await userStorage.getUserById(userId);
  const card = await cardStorage.getCardById(cardId);

  if (!user || !card) {
    return res.status(404).send({ message: "User or card not found" });
  }

  if (user.wallet < card.price) {
    return res.status(400).send({ message: "Insufficient funds in user's wallet" });
  }

  const newWalletBalance = user.wallet - card.price;
  await userStorage.updateUserWallet(userId, newWalletBalance);

  card.owner = userId;
  await cardStorage.updateCard(card);

  return res.status(200).send({ message: "Card purchased successfully", card });
};
