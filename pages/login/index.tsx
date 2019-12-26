import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import LoginForm from 'components/forms/login';
import useStyles from './styles';
import { useAuth } from 'hooks/auth-context';

export default function SignInSide(props) {
  const [error, setError] = useState<string>();
  const { login } = useAuth();
  const router = useRouter();
  const classes = useStyles(props);

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome back
          </Typography>
          <Fade in={!!error} aria-expanded={!!error}>
            <Typography color="secondary" className={classes.errorMessage}>
              <span role="img" aria-label="sad face">
                😥
              </span>
              &nbsp;{error}
            </Typography>
          </Fade>
          <LoginForm
            onSubmit={async body => {
              try {
                setError(null);
                await login(body);
                router.push('/');
              } catch (error) {
                setError(error.message);
              }
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
}
