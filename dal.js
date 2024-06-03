const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://bhavyasreec18:HG2cLBN8mkOFdEeP@cluster0.ltj6ay2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const url = "mongodb://localhost:27017";
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  console.log("Connected successfully to db server");

  // connect to myproject database
  db = client.db("myproject");
});

// create user account using the collection.insertOne function
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const account_no = generateAccountNumber();
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0, account_no };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}

function TransactionDetails(email, amount, deatils, user_email) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("transaction_details");
    const doc = { email, amount, deatils, user_email };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}

// generate Account Number

function generateAccountNumber() {
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  console.log("Random Number:" + randomNumber);
  return `BB${randomNumber}`;
}

// find user account
function find(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({ email: email })
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

// find user account
function findOne(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOne({ email: email })
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

function update(email, amount) {
  return new Promise((resolve, reject) => {
    // Find the user by email
    db.collection("users").findOne({ email: email }, function (err, user) {
      if (err) {
        reject(err);
        return;
      }

      // If user not found
      if (!user) {
        reject("User not found");
        return;
      }

      const currentBalance = user.balance;

      // Check if withdrawal amount is negative or exceeds the current balance
      if (amount < 0) {
        reject("Deposit amount cannot be negative");
        return;
      }

      // Update the balance by subtracting the withdrawal amount
      const updatedBalance = currentBalance + amount;

      // Update the user's balance in the database
      db.collection("users").updateOne(
        { email: email },
        { $set: { balance: updatedBalance } },
        function (err, result) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ success: true, balance: updatedBalance });
        }
      );
    });
  });
}

function withdraw(email, amount) {
  return new Promise((resolve, reject) => {
    // Find the user by email
    db.collection("users").findOne({ email: email }, function (err, user) {
      if (err) {
        reject(err);
        return;
      }

      // If user not found
      if (!user) {
        reject("User not found");
        return;
      }

      const currentBalance = user.balance;

      // Check if withdrawal amount is negative or exceeds the current balance
      if (amount < 0) {
        reject("Withdrawal amount cannot be negative");
        return;
      }

      if (amount > currentBalance) {
        reject("Withdrawal amount exceeds current balance");
        return;
      }

      // Update the balance by subtracting the withdrawal amount
      const updatedBalance = currentBalance - amount;

      // Update the user's balance in the database
      db.collection("users").updateOne(
        { email: email },
        { $set: { balance: updatedBalance } },
        function (err, result) {
          if (err) {
            reject(err);
            return;
          }

          // Resolve with the updated user object
          resolve({ success: true, balance: updatedBalance });
        }
      );
    });
  });
}

// return all users by using the collection.find method
function all() {
  // TODO: populate this function based off the video
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({})
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

function allTransaction(email) {
  // TODO: populate this function based off the video
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("transaction_details")
      .find({ email: email, amount: { $gt: 0 } })
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

function TransferAmount(sender_email, amount, receiver_email) {
  return new Promise((resolve, reject) => {
    // Find the sender
    db.collection("users").findOne({ email: sender_email }, function (err, sender) {
      if (err) {
        reject(err);
        return;
      }

      // If sender not found
      if (!sender) {
        reject("Sender not found");
        return;
      }

      const senderBalance = sender.balance;

      // Check if transfer amount is negative or exceeds the sender's balance
      if (amount < 0) {
        reject("Transfer amount cannot be negative");
        return;
      }

      if (amount > senderBalance) {
        reject("Transfer amount exceeds sender's balance");
        return;
      }

      // Find the receiver
      db.collection("users").findOne({ email: receiver_email }, function (err, receiver) {
        if (err) {
          reject(err);
          return;
        }

        // If receiver not found
        if (!receiver) {
          reject("Receiver not found");
          return;
        }

        // Update sender's balance by subtracting the transfer amount
        const updatedSenderBalance = senderBalance - amount;

        // Update sender's balance in the database
        db.collection("users").updateOne(
          { email: sender_email },
          { $set: { balance: updatedSenderBalance } },
          function (err, result) {
            if (err) {
              reject(err);
              return;
            }

            // Update receiver's balance by adding the transfer amount
            const updatedReceiverBalance = receiver.balance + amount;

            // Update receiver's balance in the database
            db.collection("users").updateOne(
              { email: receiver_email },
              { $set: { balance: updatedReceiverBalance } },
              function (err, result) {
                if (err) {
                  reject(err);
                  return;
                }

                // Resolve with success message and updated balances
                resolve({
                  success: true,
                  sender_balance: updatedSenderBalance,
                  receiver_balance: updatedReceiverBalance,
                });
              }
            );
          }
        );
      });
    });
  });
}

module.exports = {
  create,
  findOne,
  find,
  update,
  withdraw,
  TransactionDetails,
  all,
  allTransaction,
  TransferAmount,
};
