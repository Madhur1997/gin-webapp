const AUTH0_CLIENT_ID = "9V9zx0EmHEZ0c6U6b4luQ4Ddc1JiM0zT"
const AUTH0_DOMAIN = "dev-3ulgmk2c.us.auth0.com"
const AUTH0_CALLBACK_URL = "http://localhost:3000"
const AUTH0_API_AUDIENCE = "localhost:3000/"

class App extends React.Component {
    parseHash() {
        this.auth0 = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID
        })
        this.auth0.parseHash(window.location.hash, (err, authResult) => {
            if (err) {
                return console.log(err)
            }
            if (
                authResult !== null &&
                authResult.accessToken !== null &&
                authResult.idToken !== null
            ) {
                localStorage.setItem("access_token", authResult.accessToken);
                localStorage.setItem("id_token", authResult.idToken);
                localStorage.setItem(
                    "profile",
                    JSON.stringify(authResult.idTokenPayload)
                );
                window.location = window.location.href.substr(
                    0,
                    window.location.href.indexOf("#")
                );
            }
        })
    }
    setup() {
        $.ajaxSetup({
            beforeSend: (r) => {
                if (localStorage.getItem("access_token")) {
                    r.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("access_token")
                    )
                }
            }
        })
    }
    setState() {
        let idToken = localStorage.getItem("id_token")
        console.log(idToken)
        if (idToken) {
            this.loggedIn = true
        } else {
            this.loggedIn = false
        }
    }
    componentWillMount() {
        this.setup()
        this.parseHash()
        this.setState()
    }
    render() {
        if (this.loggedIn) {
            return (<LoggedIn />)
        } else {
            return (<Home />)
        }
    }
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this)
    }
    authenticate() {
        this.WebAuth = new auth0.WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            scope: "openid profile",
            audience: AUTH0_API_AUDIENCE,
            responseType: "token id_token",
            redirectUri: AUTH0_CALLBACK_URL
        })
        this.WebAuth.authorize()
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-8 col-xs-offset-2 jumbotron text-center">
                        <h1>Joekish</h1>
                        <p>A load of Dad jokes XD</p>
                        <p>Sign in to get access </p>
                        <a onClick={this.authenticate} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
                    </div>
                </div>
            </div>
        )
    }
}

class Joke extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: ""
        };
        this.like = this.like.bind(this);
        this.serverRequest = this.serverRequest.bind(this);
    }

    like() {
        let joke = this.props.joke;
        this.serverRequest(joke);
    }
    serverRequest(joke) {
        $.post(
            "http://localhost:3000/api/jokes/like/" + joke.id,
            { like: 1 },
            res => {
                /*console.log(5);
                console.log("oldRes...", this.props.joke)
                console.log("res... ", res);
                this.props.joke = res;
                console.log("res... ", this.props.joke);
                this.props.key = 1111111;*/
                //this.setState({ liked: "Liked!" });
            }
        );
    }

    render() {
        return (
            <div className="col-xs-4">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        #{this.props.joke.id}{" "}
                        <span className="pull-right">{this.state.liked}</span>
                    </div>
                    <div className="panel-body">{this.props.joke.joke}</div>
                    <div className="panel-footer">
                        {this.props.joke.likes} Likes &nbsp;
              <a onClick={this.like} className="btn btn-default">
                            <span className="glyphicon glyphicon-thumbs-up" />
                        </a>
                    </div>
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
        this.serverRequest = this.serverRequest.bind(this)
        this.logout = this.logout.bind(this)
    }
    logout() {
        localStorage.removeItem("id_token")
        localStorage.removeItem("access_token")
        localStorage.removeItem("profile")
        location.reload()
    }
    serverRequest() {
        $.get("http://localhost:3000/api/jokes/", res => {
            this.setState({
                jokes: res,
            })
        })
    }
    componentDidMount() {
        this.serverRequest()
    }
    render() {
        return (
            <div className="container">
                <div className="col-lg-12">
                    <br />
                    <span className="pull-right"> <a onClick={this.logout}>Log Out</a></span>
                    <h2>Jokeish</h2>
                    <p>Let's feed you with some funny Jokes!!!</p>
                    <div className="row">
                        {this.state.jokes.map(function (joke, i) {
                            return (<Joke key={i} joke={joke} />);
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("App"))
//export default App