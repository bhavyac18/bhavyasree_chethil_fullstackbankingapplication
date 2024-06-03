const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const HashRouter = ReactRouterDOM.HashRouter;
const UserContext = React.createContext(null);

function Card(props) {
  function classes() {
    const bg = props.bgcolor ? "bg-" + props.bgcolor : "";
    const txt = props.txtcolor ? "text-" + props.txtcolor : "";
    return "card mb-3" + bg + txt;
  }
  const { maxWidth = "30rem" } = props;
  return (
    <div
      className="card"
      style={{ maxWidth, margin: "10px", textAlign: "center" }}
    >
      <div className={classes()}>
        <div
          className="card-header"
          style={{ background: "blue", color: "white", fontSize: "bold" }}
        >
          {props.header}
        </div>
        <div className="card-body">
          {props.title && <h5 className="card-title">{props.title}</h5>}
          {props.text && <p className="card-text">{props.text}</p>}
          {props.body}
          {props.status && (
            <div
              id="createStatus"
              style={{
                border: "1px solid red",
                padding: "10px",
                color: "white",
                backgroundColor: "red",
              }}
            >
              {props.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
