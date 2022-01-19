import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';


function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [urlCode, setUrlCode] = useState('');
  const [token, setToken] = useState({ accessToken: '', refreshToken: '' });
  const [user, setUser] = useState({ userName: '', userId: '', userEmail: '' });
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

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !urlCode) setUrlCode(code);
  }, [searchParams, urlCode]);

  useEffect(() => {
    if (urlCode)
      oauth.tokenRequest({
        clientId: clientId,
        clientSecret: clientSecret,
        code: urlCode,
        scope: "identify email guilds",
        grantType: "authorization_code",
        redirectUri: clientRedirect,
      })
      .then(res => setToken({accessToken: res.access_token, refreshToken: res.refresh_token}))
      .catch(error => console.log(error));
  }, [oauth, clientId, clientSecret, clientRedirect, urlCode]);

  useEffect(() => {
    if (token.accessToken)
      oauth.getUser(token.accessToken)
      .then(res => setUser({userName: res.username, userId: res.id, userEmail: res.email}))
      .catch(error => console.log(error));
  }, [oauth, token, setUser]);

  function isAuthenticated() {
    return urlCode && token.accessToken && token.refreshToken && user.userName && user.userId;
  }

  function logout() {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    oauth.revokeToken(token.accessToken, credentials);
    setToken({accessToken: '', refreshToken: ''});
    setUser({userName: '', userId: ''});
    setUrlCode('');
    navigate('');
  }

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
