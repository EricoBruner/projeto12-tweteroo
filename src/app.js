import express, { json } from "express";

let USERS = [];
let TWEETS = [];

const app = express();

app.use(json());

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
  const { username, tweet } = req.body;

  if (!username || !tweet) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  if (typeof username != "string" || typeof tweet != "string") {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  const userExist = USERS.find((user) => user.username == username);

  if (!userExist) {
    return res.status(401).send("UNAUTHORIZED");
  }

  TWEETS.push({ username, tweet });
  return res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  const { page } = req.query;

  if (page) {
    const totalPages = Math.ceil(TWEETS.length / 10);
    if (page > totalPages) {
      return res.status(400).json("Página solicitada não existe!");
    }

    if (page > 0) {
      const startIndex = TWEETS.length - page * 10;
      const endIndex = startIndex + 10;

      const paginaTweets = TWEETS.slice(startIndex, endIndex);

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

  return res.status(200).json(dataUltimosTweets);
});

app.listen(5000, () => {
  console.log("👾 Servidor no ar! Porta 5000! 👾");
});
