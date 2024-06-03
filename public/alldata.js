function AllData() {
  const [data, setData] = React.useState([]);
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

  React.useEffect(() => {
    // Fetch all accounts from API
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        console.log(idToken);
        fetch("/account/all", {
          method: "GET",
          headers: {
            Authorization: idToken,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setData(data); // Set the data directly without stringifying
          });
      });
  }, []);

  return (
    <Card
      txtcolor="black"
      header="All Data"
      body={
        <table className="table-container">
          <thead>
            <tr>
              <th>SL.No</th>
              <th>Account Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Balance</th>
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {data.map(
                (
                  user,
                  index // Add index parameter
                ) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.account_no}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.balance}</td>
                  </tr>
                )
              )}
            </tbody>
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                Let's create your first account!
              </td>
            </tr>
          )}
        </table>
      }
      maxWidth="70rem"
    />
  );
}
