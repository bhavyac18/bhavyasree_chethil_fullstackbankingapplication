var express = require("express");
var app = express();
var cors = require("cors");
var dal = require("./dal.js");
const e = require("express");
var admin = require("firebase-admin");
var serviceAccount = require("./badbank-8e018-firebase-adminsdk-xk8gn-9f98ac2c50.json");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Library API',
            version: '1.0.0'
        }
    },
    apis: ['app.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());

async function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("Decoded Token: ", decodedToken);
      next();
    } catch (err) {
      console.error("Error verifying token: ", err);
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("No Token Found");
  }
}

/**
* @swagger
* /account/create/:name/:email/:password:
*   get:
*     description: Create User Account
*     responses:
*       200:
*         description: Success
*
*/

// create user account
app.get("/account/create/:name/:email/:password", function (req, res) {
  //check if account exists
  dal.find(req.params.email).then((users) => {
    // if user exists, return error message
    if (users.length > 0) {
      console.log("User already in exists");
      res.send("User already in exists");
    } else {
      // else create user
      dal
        .create(req.params.name, req.params.email, req.params.password)
        .then((user) => {
          console.log(user);
          res.send(user);
        });
      const amount = 0;
      dal
        .TransactionDetails(req.params.email, amount, "Account Created", "")
        .then((user) => {
          console.log(user);
          res.send(user);
        });
    }
  });
});

// login user
app.get("/account/login/:email/:password", function (req, res) {
  dal.find(req.params.email).then((user) => {
    // if user exists, check password
    if (user.length > 0) {
      if (user[0].password === req.params.password) {
        res.send(user[0]);
      } else {
        res.send("Login failed: wrong password");
      }
    } else {
      res.send("Login failed: user not found");
    }
  });
});

// find user account
app.get("/account/find/:email", function (req, res) {
  dal.find(req.params.email).then((user) => {
    console.log(user);
    res.send(user);
  });
});

// find one user by email - alternative to find
app.get("/account/findOne/:email", function (req, res) {
  dal.findOne(req.params.email).then((user) => {
    console.log(user);
    res.send(user);
  });
});

app.post("/account/update/:amount", async function (req, res) {
  const idToken = req.headers.authorization.split(" ")[1]; // Extract the token after "Bearer "
  var amount = Number(req.params.amount);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    dal
      .update(email, amount)
      .then(async (response) => {
        console.log(response);
        await dal.TransactionDetails(email, amount, "Deposited Amount", "");
        res.send(response);
      })
      .catch((error) => {
        console.error("Deposit failed:", error);
        res.status(400).send(error);
      });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Unauthorized");
  }
});

app.post("/account/withdraw/:amount", async function (req, res) {
  const idToken = req.headers.authorization.split(" ")[1]; // Extract the token after "Bearer "
  var amount = Number(req.params.amount);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    // Now you have the user's email, proceed with withdrawal logic
    dal
      .withdraw(email, amount)
      .then(async (response) => {
        console.log(response);
        await dal.TransactionDetails(email, amount, "Withdrawal Amount", "");
        res.send(response);
      })
      .catch((error) => {
        console.error("Withdrawal failed:", error);
        res.status(400).send(error);
      });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Unauthorized");
  }
});

// Balance

app.post("/account/balance", async function (req, res) {
  const idToken = req.headers.authorization.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    const user = await dal.findOne(email);
    if (user) {
      res.json({ balance: user.balance });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Unauthorized");
  }
});

// all accounts
app.get("/account/all", verifyToken, function (req, res) {
  dal.all().then((docs) => {
    console.log(docs);
    res.send(docs);
  });
});

// all Transactions

app.post("/account/all_transactions", async function (req, res) {
  const idToken = req.headers.authorization.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;
    console.log(email);
    dal.allTransaction(email).then((docs) => {
      console.log(docs);
      res.send(docs);
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Unauthorized");
  }
});

// Transfer
app.post("/account/transfer/:email/:amount", async function (req, res) {
  const idToken = req.headers.authorization.split(" ")[1]; // Extract the token after "Bearer "
  var amount = Number(req.params.amount);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const log_email = decodedToken.email;

    // Now you have the user's email, proceed with withdrawal logic
    dal
      .TransferAmount(log_email, amount, req.params.email)
      .then(async (response) => {
        console.log(response);
        await dal.TransactionDetails(
          log_email,
          amount,
          "Amount Transfered",
          req.params.email
        );
        res.send(response);
      })
      .catch((error) => {
        console.error("Transfer failed:", error);
        res.status(400).send(error);
      });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Unauthorized");
  }
});

var port = 3000;
app.listen(port);
console.log("Running on port: " + port);
