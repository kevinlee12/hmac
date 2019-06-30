import React from 'react';
import { createHmac } from 'crypto';

import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize';

interface AppState {
  key: string,
  hmac: string,
  message: string
}

function generateHmac(key: string, message: string): string {
  if (key === '' || message === '') {
    return '';
  }

  const hmac = createHmac('sha512', key);
  return hmac.update(message).digest('base64');
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      key: '',
      hmac: '',
      message: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

    this.setState({
      [event.target.name]: event.target.value
    } as Pick<AppState, 'key' | 'message'>);

    this.updateHmac();
  }

  updateHmac() {
    const { key, message } = this.state;

    this.setState({
      hmac: generateHmac(key, message)
    });
  }

  render() {
    return (
      <div className="container">
        <h1>HMAC Generator</h1>
        <div> Insert json below </div>
        <div>
          <div className="input-field">
            <input id="key" type="text" name="key" value={this.state.key}
                onChange={this.handleChange} />
            <label htmlFor="key">HMAC Key</label>
          </div>

          <div className="input-field">
            <textarea onChange={ this.handleChange } name="message"
              id="json-text" className="materialize-textarea"
              value={this.state.message} />
            <label htmlFor="json-text">JSON Input</label>
          </div>
        </div>
        <b> HMAC </b>
        <div>
          { this.state.hmac !== '' ? this.state.hmac : "No valid input yet!" }
        </div>
      </div>
    );
  }
}

export default App;
