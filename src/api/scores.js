import axios from "axios";
const url = "https://us-central1-minesweeper-290f4.cloudfunctions.net/app";

const addScore = (data) => {
  return axios.post(`${url}/scores`, data);
};

const getAllScores = (data) => {
  return axios.get(`${url}/scores`);
};

export { addScore, getAllScores };
