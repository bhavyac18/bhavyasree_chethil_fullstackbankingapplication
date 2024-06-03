function Transactions() {
  const [data, setData] = React.useState([]); // Initialize data as an empty array

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

  // React.useEffect(() => {
  //   // Fetch all accounts from API
  //   fetch("/account/all_transactions")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setData(data); // Set the data directly without stringifying
  //     });
  // }, []);

  React.useEffect(() => {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((idToken) => {
        fetch(`/account/all_transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          });
      });
  }, []);

  return (
    <Card
      txtcolor="black"
      header="All Transactions"
      body={
        <table className="table-container">
          <thead>
            <tr>
              <th>SL.No</th>
              <th>Amount</th>
              <th>Transaction Details</th>
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {data.map(
                (
                  data,
                  index // Add index parameter
                ) => (
                  <tr key={data._id}>
                    <td>{index + 1}</td>
                    <td>{data.amount}</td>
                    <td>
                      {data.deatils}{" "}
                      {data.user_email ? `to ${data.user_email}` : ""}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          ) : (
            <tr>
              <td colSpan="3" className="no-data">
                No Transaction!
              </td>
            </tr>
          )}
        </table>
      }
      maxWidth="70rem"
    />
  );
}
