import React, { useState, useEffect, useMemo } from 'react';
import './App.css';


function App() {
  const DiscordOauth2 = require("discord-oauth2");

  const clientId = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const clientRedirect = process.env.REACT_APP_CLIENT_REDIRECT;
  const oauth = useMemo(() => 
    new DiscordOauth2({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: clientRedirect,
    }), [clientId, clientSecret, clientRedirect, DiscordOauth2]
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
