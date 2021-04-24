import { Response } from "express";
import { db } from "./config/firebase";

type ScoreType = {
  name: string;
  score: number;
};

type Request = {
  body: ScoreType;
  params: { id: string };
};

const addScore = async (req: Request, res: Response) => {
  const { name, score } = req.body;
  try {
    const doc = db.collection("scores").doc();
    const data = {
      id: doc.id,
      name,
      score,
    };

    doc.set(data).catch((error) =>
      res.status(400).json({
        status: "error",
        message: error.message,
      })
    );

    res.status(200).json({
      status: "success",
      message: "score added successfully",
      data,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllScores = async (req: Request, res: Response) => {
  try {
    const Scores: ScoreType[] = [];
    const querySnapshot = await db.collection("scores").orderBy("score").get();
    querySnapshot.forEach((doc: any) => Scores.push(doc.data()));
    return res.status(200).json(Scores);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export { addScore, getAllScores };
