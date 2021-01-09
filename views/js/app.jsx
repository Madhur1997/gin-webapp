class App extends React.Component {
    render() {
        if (this.loggedIn) {
            return (<LoggedIn />)
        } else {
            return (<Home />)
        }
    }
}

class Home extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
                    <h1>Joekish</h1>
                    <p>A load of Dad jokes XD</p>
                    <p>Sign in to get access </p>
                    <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
                </div>
            </div>
        )
    }
}

class LoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jokes: []
        }
    }