import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import { blue } from '@mui/material/colors';
import SendIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';


function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [urlCode, setUrlCode] = useState('');
  const [user, setUser] = useState({ userName: '', wallet: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const apiUrl = process.env.REACT_APP_API;
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const clientRedirect = process.env.REACT_APP_CLIENT_REDIRECT;
  useEffect(() => {
    const code = searchParams.get('code');
    setUrlCode(code);
  }, [searchParams, urlCode]);

  function isAuthenticated() {
    return !!urlCode;
  }

  function logout() {
    setSuccess(false);
    setUser({userName: '', wallet: ''});
    setUrlCode('');
    navigate('');
  }

  function openAuthUrl() {
    const discordAuthUrl = 'https://discord.com/api/oauth2/authorize?';
    const authParams = new URLSearchParams();
    authParams.append("client_id", clientId);
    authParams.append("redirect_uri", clientRedirect);
    authParams.append("response_type", "code");
    authParams.append("scope", "identify");
    window.location.replace(discordAuthUrl + authParams.toString());
  }

  function register() {
    const data = { code: urlCode, wallet: user.wallet };
    setLoading(true);

    fetch(apiUrl + 'register', {
      method: 'POST',
      headers: {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => {
       if (!res.ok) throw new Error('Response error');
       res.json().then(data => setUser({...user, userName: data.userName}));
       setLoading(false);
       setSuccess(true);
    })
    .catch(() => {
      logout();
      setLoading(false);
      setFailure(true);
    });
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
                startIcon={<SendIcon/>} onClick={() => register()} disabled={!isAuthenticated() || !user.wallet || loading || success} >
                Register
                { loading && (
                  <CircularProgress size={24}
                    sx={{ color: blue[500], position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}
                  />
                )}
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
              <Typography variant="h5">
                Not authenticated.
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
      { success && (
        <Alert variant="filled" severity="success">
          <b>{ user.userName }</b>, you have successfully registered. You can now close this page
        </Alert>
      )}
      { failure && (
        <Alert variant="filled" severity="error">
          Registration failed. Please try again
        </Alert>
      )}
    </div>
  );
}

export default App;
