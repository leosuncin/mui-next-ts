import { Theme, createStyles, makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import RegisterForm from 'components/forms/register';
import { useAuth } from 'hooks/auth-context';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'dark'
          ? theme.palette.grey[900]
          : theme.palette.grey[50],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    errorMessage: {
      textAlign: 'center',
      color: '#e51560',
    },
  }),
);

export default function SignInSide(props) {
  const [error, setError] = useState<string>();
  const { register } = useAuth();
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
            Welcome aboard
          </Typography>
          <Fade in={!!error} aria-expanded={!!error}>
            <Typography color="secondary" className={classes.errorMessage}>
              <span role="img" aria-label="sad face">
                😥
              </span>
              &nbsp;{error}
            </Typography>
          </Fade>
          <RegisterForm
            onSubmit={async body => {
              try {
                setError(null);
                await register(body);
                router.push('/');
                window.location.pathname = '/';
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
