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
            responses: [...this.state.responses, JSON.stringify(data)]
          },
          this.updateUrls
        )
      )
    );
  }

  deleteUrl(id) {
    fetch(`api/shorturl/delete/${id}`, {
      method: 'DELETE'
    }).then(response =>
      response.json().then(data =>
        this.setState(
          {
            input: '',
            responses: [...this.state.responses, JSON.stringify(data)]
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

  handleDelete = event => {
    this.deleteUrl(event.target.dataset.id);
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
                  I can POST a URL to <code>/api/shorturl/new</code> and I will
                  receive a shortened URL in the JSON response.
                  <br />
                  Example :{' '}
                  <code>{`{"original_url":"www.google.com","short_url":1}`}</code>
                </li>

                <li>
                  If I pass an invalid URL that doesn't follow the{' '}
                  <code>http(s)://www.example.com/etc</code> format, the JSON
                  response will contain an error like{' '}
                  <code>{`{"error":"invalid URL"}`}</code>.
                  <br />
                  HINT: to be sure that the submitted url points to a valid site
                  you can use the function <code>
                    dns.lookup(host, cb)
                  </code>{' '}
                  from the dns core module.
                </li>

                <li>
                  When I visit the shortened URL, it will redirect me to my
                  original link.
                </li>
              </ol>

              <h2 className="masthead">Example Usage</h2>
              <code className="response">
                POST /api/shorturl/new <code>https://www.google.com</code>
              </code>
              <h2 className="masthead">Example Output</h2>
              <code className="response">{`{"original_url":"www.google.com","short_url": 1}`}</code>
              <p>
                Visiting <code>/api/shorturl/1</code> would then redirect to{' '}
                <code>https://www.google.com</code>
              </p>
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

            <div className="card">
              <h2 className="masthead">Generate Short URL</h2>

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
                    <input type="submit" className="button" value="Submit" />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="button"
                      onClick={this.handleClear}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {this.state.urls.length > 0 ? (
              <div className="mbx">
                <h2 className="masthead">URLs</h2>
                <div className="urls">
                  {this.state.urls.map((url, i) => (
                    <div className="url card" key={url._id}>
                      <div className="url-inner">
                        <div className="bbx">
                          <div className="gbx">
                            <strong>Original URL</strong>
                          </div>
                          <div className="url-link">{url.original_url}</div>
                        </div>
                        <div className="bbx">
                          <div className="">
                            <strong>Short URL</strong>
                          </div>
                          <div className="url-link">
                            /api/shorturl/{url.short_url}
                          </div>
                        </div>
                      </div>

                      <div className="buttons">
                        <div>
                          <a
                            href={`api/shorturl/${url.short_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button"
                          >
                            Visit
                          </a>
                        </div>
                        <div>
                          <button className="button">Copy</button>
                        </div>
                        <div>
                          <button
                            onClick={this.handleDelete}
                            data-id={url._id}
                            className="button btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
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
