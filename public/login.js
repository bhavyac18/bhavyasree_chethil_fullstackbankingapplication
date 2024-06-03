const { default: firebase } = require("firebase/compat/app");

function Login() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");

  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={<LoginForm setShow={setShow} setStatus={setStatus} />}
    />
  );
}

function LoginForm(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  // Your web app's Firebase configuration
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
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    // Authenticate with Firebase
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise
      .then((userCredential) => {
        // User signed in successfully
        const user = userCredential.user;
        console.log("User signed in:", user);
        props.setStatus(""); // Clear any previous status messages
        props.setShow(false); // Hide the login form
        window.location.href = "/";
      })
      .catch((error) => {
        // Handle authentication errors
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);

        // Update error state based on error message
        switch (errorCode) {
          case "auth/user-not-found":
            setEmailError("User not found");
            break;
          case "auth/wrong-password":
            setPasswordError("Invalid password");
            break;
          case "auth/internal-error":
            props.setStatus(
              <div
                style={{
                  border: "1px solid red",
                  padding: "10px",
                  color: "white",
                  backgroundColor: "red",
                }}
              >
                Invalid Credentials
              </div>
            );
            break;
          default:
            // For other errors, display Firebase error message
            props.setStatus(
              <div
                style={{
                  border: "1px solid red",
                  padding: "10px",
                  color: "white",
                  backgroundColor: "red",
                }}
              >
                {errorMessage}
              </div>
            );
            break;
        }
      });
  }

  // function handleGoogleLogin() {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   firebase
  //     .auth()
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential =
  //         firebase.auth.GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       console.log("Google user signed in:", user);
  //       props.setStatus(""); // Clear any previous status messages
  //       props.setShow(false); // Hide the login form
  //       window.location.href = "/"; // Redirect to home page
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       console.error(error);
  //       props.setStatus(
  //         <div
  //           style={{
  //             border: "1px solid red",
  //             padding: "10px",
  //             color: "white",
  //             backgroundColor: "red",
  //           }}
  //         >
  //           {error.message}
  //         </div>
  //       );
  //     });
  // }

  function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        // The signed-in user info.
        const user = result.user;
        // console.log("Google user signed in:", user);
        // props.setStatus(""); // Clear any previous status messages
        // props.setShow(false); // Hide the login form
        // window.location.href = "/"; // Redirect to home page
        const emailRegistered = await isEmailRegistered(user.email);

        if (emailRegistered) {
          props.setStatus(""); // Clear any previous status messages
          props.setShow(false); // Hide the login form
          window.location.href = "/"; // Redirect to home page
        } else {
          window.location.href = "/#/CreateAccount/"; // 
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
        props.setStatus(
          <div
            style={{
              border: "1px solid red",
              padding: "10px",
              color: "white",
              backgroundColor: "red",
            }}
          >
            {error.message}
          </div>
        );
      });
  }

  return (
    <>
      Email
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
      {passwordError && <div className="text-danger">{passwordError}</div>}
      <br />
      <button type="submit" className="btn btn-primary" onClick={handle}>
        Login
      </button>
      {/* <button id="googlelogin" onClick={handleGoogleLogin}>
        Google Login
      </button> */}
    </>
  );
}
