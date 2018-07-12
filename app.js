import 'jquery';
import { linkEvent, render, Component } from 'inferno';
import 'materialize-css';

var jsSHA = require("jssha");

function generateAndSetHmac(instance, event) {
  try {
    var json = JSON.parse(event.target.value);
  }
  catch(err) {
    alert('The value entered was not a valid json, please try again');
    return;
  }

  if(instance.state.apiKey === '' || instance.state.apiKey === undefined)
  {
    alert('Please enter an api key');
    return;
  }

  if (json) {
    var shaObj = new jsSHA('SHA-256', 'TEXT');
    shaObj.setHMACKey(instance.state.apiKey, 'TEXT');
    shaObj.update(JSON.stringify(json));
    var hmac = shaObj.getHMAC('HEX');

    instance.setState({
      hmac: hmac,
      hasValue: true
    });
  } else {
    if (event.target.value !== '') {
      instance.setState({
        hmac: 'The json was null.',
        hasValue: true
      });
    }
  }
}

function setKey(instance, event) {
  instance.setState({
    apiKey: event.target.value
  });
}

class MyComponent extends Component {
  constructor(props) {
      super(props);
      this.state = {
          hmac: '',
          apiKey: '',
          hasValue: false
      };
  }
  render() {
    return (
      <div>
        <h1>HMAC Generator</h1>
        <div> Insert json below </div>
        <div>
          <div class="input-field">
            <input id="api-key" type="text" onChange={ linkEvent(this, setKey) } />
            <label for="api-key">Api Key</label>
          </div>

          <div class="input-field">
            <textarea onChange={ linkEvent(this, generateAndSetHmac) } id="json-text" class="materialize-textarea"></textarea>
            <label for="json-text">JSON Input</label>
          </div>
        </div>
        <b> HMAC </b>
        <div>
          { this.state.hasValue ? this.state.hmac : "No valid input yet!" }
        </div>
      </div>
    );
  }
}

render(
  <MyComponent />,
  document.getElementById('app')
);
