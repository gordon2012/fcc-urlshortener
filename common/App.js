import React, { Component } from 'react';

class App extends Component {
  state = { input: '', responses: [], urls: [] };

  updateUrls() {
    fetch(`api/shorturl/list`).then(response =>
      response.json().then(res => {
        if (res.loading) {
          console.log('list: LOADING');
          setTimeout(() => this.updateUrls(), 500);
        } else {
          this.setState({ urls: res });
        }
      })
    );
  }

  addUrl() {
    fetch(`api/shorturl/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ original_url: this.state.input })
    }).then(response =>
      response.json().then(data =>
        this.setState(
          {
            input: '',
            responses: [JSON.stringify(data), ...this.state.responses]
          },
          this.updateUrls
        )
      )
    );
  }

  // Handlers

  handleInputChange = event => {
    this.setState({ input: event.target.value });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    this.addUrl();
  };

  handleClear = () => {
    this.setState({ input: '', responses: [] });
  };

  // Lifecycle Methods

  componentDidMount() {
    this.updateUrls();
  }

  render() {
    return (
      <div className="app">
        <main>
          <h1 className="masthead">URL Shortener Microservice</h1>

          <div className="container">
            <div className="card">
              <h2 className="masthead">User Stories</h2>
              <ol>
                <li>
                  The API endpoint is <code>GET /api/:input? </code>
                </li>
              </ol>

              <h2 className="masthead">Example Usage</h2>
              <code className="response">GET /api/hello_world</code>
              <h2 className="masthead">Example Output</h2>
              <code className="response">{`{"input":"hello_world", "end":"back"}`}</code>
            </div>

            <div className="card">
              <h2 className="masthead">Parse Input</h2>

              <form onSubmit={this.handleFormSubmit}>
                <code className="response">
                  <label htmlFor="original_url">
                    <span>POST /api/shorturl/new</span>
                    <input
                      type="text"
                      placeholder=""
                      id="original_url"
                      value={this.state.input}
                      onChange={this.handleInputChange}
                    />
                  </label>
                </code>

                <div className="buttons">
                  <div>
                    <button>Submit</button>
                  </div>
                  <div>
                    <button type="button" onClick={this.handleClear}>
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {this.state.responses.length > 0 ? (
              <div className="card">
                <h2 className="masthead">Responses</h2>
                <div className="responses">
                  {this.state.responses.map((response, i) => (
                    <code className="response" key={i}>
                      {response}
                    </code>
                  ))}
                </div>
              </div>
            ) : null}

            {this.state.urls.length > 0 ? (
              <div className="card">
                <h2 className="masthead">URLs</h2>
                <div className="responses">
                  {this.state.urls.map((url, i) => (
                    <code className="response" key={url._id}>
                      <span>{JSON.stringify(url)}</span>
                    </code>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </main>
        <footer>
          A{' '}
          <a
            href="https://freecodecamp.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            freeCodeCamp
          </a>{' '}
          APIs and Microservices Project
        </footer>
      </div>
    );
  }
}
export default App;
