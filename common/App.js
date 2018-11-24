import React, { Component } from 'react';

class App extends Component {
  state = { input: '', responses: [] };

  handleInputChange = event => {
    this.setState({ input: event.target.value });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    fetch(`api/${this.state.input}`).then(response =>
      response.json().then(data =>
        this.setState({
          input: '',
          responses: [JSON.stringify(data), ...this.state.responses]
        })
      )
    );
  };

  handleClear = () => {
    this.setState({ input: '', responses: [] });
  };

  render() {
    return (
      <div className="app">
        <main>
          <h1 className="masthead">Microservice Boilerplate</h1>

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
                  <label htmlFor="input">
                    <span>GET /api/</span>
                    <input
                      type="text"
                      placeholder=""
                      id="input"
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
                <h2 className="masthead">Output</h2>
                <div className="responses">
                  {this.state.responses.map((response, i) => (
                    <code className="response" key={i}>
                      {response}
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
