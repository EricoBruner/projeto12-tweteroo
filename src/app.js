import express, { json } from "express";
import cors from "cors";

let USERS = [];
let TWEETS = [];

const app = express();

app.use(json());
app.use(cors());

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  if (!username || !avatar) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  if (typeof username != "string" || typeof avatar != "string") {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  USERS.push({ username, avatar });
  return res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const { user } = req.headers;

  if (!user || !tweet) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  if (typeof user != "string" || typeof tweet != "string") {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  const userExist = USERS.find((USER) => USER.username == user);

  if (!userExist) {
    return res.status(401).send("UNAUTHORIZED");
  }

  TWEETS.push({ username: user, tweet });
  return res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  const { page } = req.query;

  if (page) {
    const totalPaginas = Math.ceil(TWEETS.length / 10);

    if (page > totalPaginas) {
      return res.status(200).json([]);
    }

    if (page > 0) {
      const TweetsReverse = TWEETS.slice().reverse();

      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;

      const paginaTweets = TweetsReverse.slice(startIndex, endIndex);

      const dataUltimosTweets = paginaTweets.map((tweet) => {
        const user = USERS.find((user) => user.username == tweet.username);
        return {
          username: user.username,
          avatar: user.avatar,
          tweet: tweet.tweet,
        };
      });

      return res.status(200).json(dataUltimosTweets);
    } else {
      res.status(400).json("Informe uma página válida!");
    }
  }

  const ultimosTweets = TWEETS.slice(-10);

  const dataUltimosTweets = ultimosTweets.map((tweet) => {
    const user = USERS.find((user) => user.username == tweet.username);
    return {
      username: user.username,
      avatar: user.avatar,
      tweet: tweet.tweet,
    };
  });

  const dataUltimosTweetsReverse = [...dataUltimosTweets.reverse()];

  return res.status(200).json(dataUltimosTweetsReverse);
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const user = USERS.find((user) => user.username == username);

  const tweetsUser = TWEETS.filter((tweet) => tweet.username == username);

  const dataTweetsUser = tweetsUser.map((tweet) => {
    return {
      username: user.username,
      avatar: user.avatar,
      tweet: tweet.tweet,
    };
  });

  const dataTweetsUserReverse = [...dataTweetsUser.reverse()];

  return res.status(200).json(dataTweetsUserReverse);
});

app.listen(5000, () => {
  console.log("👾 Servidor no ar! Porta 5000! 👾");
});
