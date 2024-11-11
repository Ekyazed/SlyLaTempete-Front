import React from 'react';
import ReactDOM from 'react-dom/client';  // Import createRoot
import './styles/global.css'
import App from './App';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';


// Render the App component into the root DOM node
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} >
          <App />
        </PersistGate>
    </Provider>
  </React.StrictMode>
);

// Define the timeout period for expiration (e.g., 1 hour)
const EXPIRATION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

// Set a timestamp on load
window.addEventListener('load', () => {
  sessionStorage.setItem('lastLoadTime', Date.now().toString());
});

// Check the timestamp on load
const lastLoadTime = sessionStorage.getItem('lastLoadTime');
if (lastLoadTime) {
  const currentTime = Date.now();
  const timeDifference = currentTime - parseInt(lastLoadTime, 10);

  // If the time difference is greater than the timeout, purge the persisted state
  if (timeDifference > EXPIRATION_TIMEOUT) {
    persistor.purge();
    sessionStorage.removeItem('lastLoadTime');
  }
}