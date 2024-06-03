function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  return (
    <Card
      bgcolor="primary"
      header="Create Account"
      status={status}
      body={
        show ? (
          <CreateForm setShow={setShow} />
        ) : (
          <CreateMsg setShow={setShow} />
        )
      }
    />
  );
}

function CreateMsg(props) {
  return (
    <>
      <h5>Success</h5>
      <button
        type="submit"
        className="btn btn-success"
        onClick={() => props.setShow(true)}
      >
        Add another account
      </button>
    </>
  );
}

function CreateForm(props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nameError, setnameError] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

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

  function handle() {
    console.log(name, email, password);

    setnameError("");
    setEmailError("");
    setPasswordError("");

    if (!name.trim()) {
      setnameError("Name is required");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return;
    }

    // Validate password
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, including at least one digit and one uppercase letter"
      );
      return;
    }

    // const url = `/account/create/${name}/${email}/${password}`;
    // (async () => {
    //   var res = await fetch(url);
    //   var data = await res.json();
    //   console.log(data);
    //   const auth = firebase.auth();
    //   const promise = auth.createUserWithEmailAndPassword(email, password);
    //   promise.catch((e) => console.log(e.message));
    //   window.location.href = "/";
    // })();
    // props.setShow(false);

    const url = `/account/create/${name}/${email}/${password}`;
    (async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        const auth = firebase.auth();
        await auth.createUserWithEmailAndPassword(email, password);

        window.location.href = "/";
        props.setShow(false);
      } catch (e) {
        console.log(e.message);
        props.setStatus(
          <div
            style={{
              border: "1px solid red",
              padding: "10px",
              color: "white",
              backgroundColor: "red",
            }}
          >
            {e.message}
          </div>
        );
      }
    })();
  }

  return (
    <>
      Name
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      {nameError && <div className="text-danger">{nameError}</div>}
      <br />
      Email address
      <br />
      <input
        type="input"
        className="form-control"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      {emailError && <div className="text-danger">{emailError}</div>}
      <br />
      Password
      <br />
      <input
        type="password"
        className="form-control"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <br />
      {passwordError && <div className="text-danger">{passwordError}</div>}
      <button type="submit" className="btn btn-primary" onClick={handle}>
        Create Account
      </button>
      {/* <a href="#" onClick={handleGoogleLogin}>
        Sign up with Google
      </a> */}
    </>
  );
}
