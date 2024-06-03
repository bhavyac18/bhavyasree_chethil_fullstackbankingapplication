function NavBar() {
  const [email, setuseremail] = React.useState("");
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

  function logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.href = "/#";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }

  React.useEffect(() => {
    const logout = document.getElementById("logout");
    const login = document.getElementById("login");
    const createAccount = document.getElementById("create_account");
    const deposit = document.getElementById("deposit");
    const withdraw = document.getElementById("withdraw");
    const balance = document.getElementById("balance");
    const alldata = document.getElementById("alldata");
    const user_profile = document.getElementById("user_profile");
    const transfer = document.getElementById("transfer");
    const transactions = document.getElementById("transactions");

    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setuseremail(firebaseUser.email);
        if (logout) logout.style.display = "inline";
        if (login) login.style.display = "none";
        if (createAccount) createAccount.style.display = "none";
        if (deposit) deposit.style.display = "inline";
        if (withdraw) withdraw.style.display = "inline";
        // if (balance) balance.style.display = "inline";
        if (alldata) alldata.style.display = "inline";
        if (user_profile) user_profile.style.display = "inline";
        if (transfer) transfer.style.display = "inline";
        if (transactions) transactions.style.display = "inline";
      } else {
        setuseremail("");
        if (logout) logout.style.display = "none";
        if (login) login.style.display = "inline";
        if (createAccount) createAccount.style.display = "inline";
        if (deposit) deposit.style.display = "none";
        if (withdraw) withdraw.style.display = "none";
        // if (balance) balance.style.display = "none";
        if (alldata) alldata.style.display = "none";
        if (user_profile) user_profile.style.display = "none";
        if (transfer) transfer.style.display = "none";
        if (transactions) transactions.style.display = "none";
      }
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* https://www.youtube.com/watch?v=23BHwAFIZmk&t=1016s */}
        <a href="/" className="logo-container">
          <svg
            id="logo-35"
            width="50"
            height="39"
            viewBox="0 0 50 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {" "}
            <path
              d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
              className="ccompli1"
              fill="#007AFF"
            ></path>{" "}
            <path
              d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
              className="ccustom"
              fill="#312ECB"
            ></path>{" "}
          </svg>
          <span className="restaurant-text">Bad Bank</span>
        </a>
        {/* https://www.youtube.com/watch?v=23BHwAFIZmk&t=1016s */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex justify-content-end">
            {/* <ul className="navbar-nav ms-start mb-2 mb-lg-0 d-flex justify-content-start"> */}
            {/* <ul
            className="navbar-nav mb-2 mb-lg-0"
            style={{ marginLeft: "auto" }}
          > */}

            <li className="nav-item">
              <a className="nav-link" href="#/deposit/" id="deposit">
                Deposit
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/withdraw/" id="withdraw">
                Withdraw
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/transfer/" id="transfer">
                Transfer
              </a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link" href="#/balance/" id="balance">
                Balance
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link" href="#/transactions/" id="transactions">
                Transactions
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/alldata/" id="alldata">
                AllData
              </a>
            </li>
          </ul>
          <ul
            className="right navbar-nav mb-2 mb-lg-0"
            style={{ marginLeft: "auto" }}
          >
            <li className="nav-item">
              <a
                className="nav-link"
                href="#/CreateAccount/"
                id="create_account"
              >
                Create Account
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/login/" id="login">
                Login
              </a>
            </li>

            <li className="nav-item" id="user_profile">
              <div className="user-profile d-flex align-items-center">
                {/* <img
                  src="user_profile.jpg"
                  alt="User Image"
                  className="user-image me-2"
                /> */}
                <span className="username">Welcome {email}!</span>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={logout} id="logout">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

