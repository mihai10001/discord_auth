import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, CardContent, CardActions, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';


function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [urlCode, setUrlCode] = useState('');
  const [token, setToken] = useState({ accessToken: '', refreshToken: '' });
  const [user, setUser] = useState({ userName: '', userId: '', userDiscriminator: '', wallet: '' });

  const crypto = require("crypto");
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
        scope: "identify",
        grantType: "authorization_code",
        redirectUri: clientRedirect,
      })
      .then(res => setToken({accessToken: res.access_token, refreshToken: res.refresh_token}))
      .catch(error => console.log(error));
  }, [oauth, clientId, clientSecret, clientRedirect, urlCode]);

  useEffect(() => {
    if (token.accessToken)
      oauth.getUser(token.accessToken)
      .then(res => setUser({userName: res.username, userId: res.id, userDiscriminator: res.discriminator}))
      .catch(error => console.log(error));
  }, [oauth, token, setUser]);

  function isAuthenticated() {
    return urlCode && token.accessToken && token.refreshToken && user.userName && user.userId && user.userDiscriminator;
  }

  function logout() {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    oauth.revokeToken(token.accessToken, credentials);
    setToken({accessToken: '', refreshToken: ''});
    setUser({userName: '', userId: '', userDiscriminator: '', wallet: ''});
    setUrlCode('');
    navigate('');
  }

  function openAuthUrl() {
    const oauthUrl = oauth.generateAuthUrl({scope: "identify", state: crypto.randomBytes(16).toString("hex")});
    window.location.replace(oauthUrl);
  }

  return (
    <div className="background">
      <Card sx={{ width: { sx: 1.0, sm: 250, md: 350, lg: 550 }, m: 3}}>
        { isAuthenticated() ? (
          <>
            <CardContent>
              <Typography sx={{ fontSize: 14, color: 'lightgray' }} gutterBottom>
                Welcome back!
              </Typography>
              <Typography variant="h5" gutterBottom>
                { user.userName }
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'lightgray' }}>
                { user.userId }
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="outlined" color="success" startIcon={<SendIcon/>}>
                Register
              </Button>
              <Button variant="outlined" color="warning" startIcon={<LogoutIcon/>} onClick={() => logout()}>
                Logout
              </Button>
            </CardActions>
          </>
        ): (
          <>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Not authenticated!
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined" onClick={() => openAuthUrl()}>
              Authenticate
            </Button>
          </CardActions>
        </>
        )}
      </Card>
    </div>
  );
}

export default App;
