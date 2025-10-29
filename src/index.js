import ReactDOM from 'react-dom/client';
import { OscClient } from './model/OscClient';
import { Configuration } from './model/Configuration';
import mailFormConfig from './config/mailForm.json';
import { App } from './App';
import Repository from './model/Repository';

Configuration.get().then(config => {
  const repository = new Repository(mailFormConfig.firebase);
  // const client = new OscClient('http://localhost:5000/webrtc');
  // client.onMessage((message) => {
  //   window.postMessage(message);
  // });
  client.connect();
  const container = ReactDOM.createRoot(document.getElementById('app'));
  container.render(<App webcamConfig={config} repository={repository} />);
})