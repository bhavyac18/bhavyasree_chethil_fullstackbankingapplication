function Withdraw() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  return (
    <Card
      bgcolor="success"
      header="Withdraw"
      status={status}
      body={
        show ? (
          <WithdrawForm setShow={setShow} setStatus={setStatus} />
        ) : (
          <WithdrawMsg setShow={setShow} setStatus={setStatus} />
        )
      }
    />
  );
}

function WithdrawMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-success"
        onClick={() => {
          props.setShow(true);
          props.setStatus("");
        }}
      >
        Withdraw again
      </button>
    </>
  );
}

function WithdrawForm(props) {
  const [amount, setAmount] = React.useState("");
  const [amountError, setAmountError] = React.useState("");
  const [balance, setBalance] = React.useState(null);

  const firebaseConfig = {
    apiKey: "AIzaSyD1Utr8LP-jRCoAu8wzqU9rNlsT6K1y5RM",
    authDomain: "badbank-8e018.firebaseapp.com",
    projectId: "badbank-8e018",
    storageBucket: "badbank-8e018.appspot.com",
    messagingSenderId: "452471002647",
    appId: "1:452471002647:web:9290fd6e4936015ae52e52",
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  React.useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        fetch(`/account/balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const roundedBalance = parseFloat(
              data.balance.toFixed(2)
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            setBalance(roundedBalance);
          })
          .catch((error) => {
            console.error("Error fetching balance:", error);
          });
      });
  }, []);

  function handle() {
    setAmountError("");

    if (!amount.trim()) {
      console.log("Amount is required");
      setAmountError("Amount is required");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.log("Amount must be a number greater than zero");
      setAmountError("Amount must be a number greater than zero");
      return;
    }

    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        console.log(idToken);
        fetch(`/account/withdraw/${amount}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ amount }), // Pass the amount here
        })
          .then((response) => response.text())
          .then((text) => {
            try {
              const data = JSON.parse(text);
              props.setStatus(JSON.stringify(data.value));
              props.setShow(false);
              console.log("JSON:", data);
            } catch (err) {
              props.setStatus(text);
              console.log("err:", text);
            }
          });
      });
  }

  return (
    <>
      {balance !== null && (
        <>
          <h5
            style={{
              padding: "10px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Balance: ${balance}
          </h5>
          <br />
        </>
      )}
      Amount
      <br />
      <input
        type="number"
        className="form-control"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.currentTarget.value)}
      />
      {amountError && <div className="text-danger">{amountError}</div>}
      <br />
      <button type="submit" className="btn btn-primary" onClick={handle}>
        Withdraw
      </button>
    </>
  );
}
