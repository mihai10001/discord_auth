import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, CardContent, CardActions, Typography, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';


function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [urlCode, setUrlCode] = useState('');
  const [user, setUser] = useState({ userName: '', wallet: '' });

  const crypto = require("crypto");
  const DiscordOauth2 = require("discord-oauth2");

  const apiUrl = process.env.REACT_APP_API;
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
    setUrlCode(code);
  }, [searchParams, urlCode]);

  function isAuthenticated() {
    return !!urlCode;
  }

  function logout() {
    setUser({userName: '', wallet: ''});
    setUrlCode('');
    navigate('');
  }

  function openAuthUrl() {
    const oauthUrl = oauth.generateAuthUrl({scope: "identify", state: crypto.randomBytes(16).toString("hex")});
    window.location.replace(oauthUrl);
  }

  function register() {
    const data = { code: urlCode, wallet: user.wallet };

    fetch(apiUrl + 'register', {
      method: 'POST',
      headers: {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {if (!res.ok) throw new Error('Response error');})
    .catch(() => logout());
  }

  const formChangeHandler = (e) => setUser({...user, wallet: e.target.value});

  return (
    <div className="background">
      <Card sx={{ width: { sx: 1.0, sm: 250, md: 350, lg: 550 }, m: 3}}>
        { isAuthenticated() ? (
          <>
            <CardContent>
              <Typography sx={{ fontSize: 24, color: 'lightgray' }} gutterBottom>
                Welcome back!
              </Typography>
              <Typography sx={{ fontSize: 14, color: 'lightgray' }} gutterBottom>
                To register for the Koda NFT whitelist, please input your wallet
              </Typography>
              <TextField value={user.wallet || ''} onChange={formChangeHandler} error={!user.wallet} 
                label="Wallet" variant="filled" fullWidth required/>
            </CardContent>
            <CardActions>
              <Button variant="outlined" color="success" 
                startIcon={<SendIcon/>} onClick={() => register()} disabled={!isAuthenticated() || !user.wallet} >
                Register
              </Button>
              <Button variant="outlined" color="warning"
                startIcon={<LogoutIcon/>} onClick={() => logout()}>
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
