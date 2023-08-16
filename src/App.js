import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Auth from "./modules/auth/auth";
import Login from "./modules/login/login";
import SignUp from "./modules/signup/signup";
import DashBoard from "./modules/dashboard/dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/dashboard" component={DashBoard} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
