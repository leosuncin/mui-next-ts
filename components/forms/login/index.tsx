import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MUILink from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useMachine } from '@xstate/react';
import Copyright from 'components/copyright';
import loginMachine from 'machines/login-machine';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import useStyles from './styles';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export const validations = {
  username: {
    required: 'Username should not be empty',
    minLength: 'Username too short (at least 5 characters required)',
    incorrect: 'Wrong username',
  },
  password: {
    required: 'Password should not be empty',
    minLength: 'Password too short (at least 8 characters required)',
    incorrect: 'Wrong password',
  },
};
function any(state: any, ...values: string[]): boolean {
  return values.reduce((prev, curr) => prev || state.matches(curr), false);
}

const LoginForm: React.FC<PropTypes.InferProps<typeof propTypes>> = props => {
  const [current, sendEvent] = useMachine(loginMachine, {
    services: {
      login({ username, password }) {
        return props.onSubmit({ username, password });
      },
    },
    devTools: true,
  });
  const classes = useStyles(props);

  return (
    <>
      <Fade
        in={any(current, 'error', 'locked')}
        aria-expanded={any(current, 'error', 'locked')}
      >
        <Typography color="secondary" className={classes.errorMessage}>
          <span role="img" aria-label="sad face">
            😥
          </span>
          &nbsp;
          {current.context.errorMessage}
        </Typography>
      </Fade>
      <form
        className={classes.root}
        noValidate
        onSubmit={event => {
          event.preventDefault();
          sendEvent('SUBMIT');
        }}
      >
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={current.context.username}
          disabled={current.matches('locked')}
          onChange={event => {
            sendEvent({ type: 'SET_USERNAME', data: event.target.value });
          }}
          error={current.matches('fill.username.invalid')}
          helperText={
            any(current, 'fill.username.invalid.empty')
              ? validations.username.required
              : any(current, 'fill.username.invalid.tooShort')
              ? validations.username.minLength
              : any(current, 'fill.username.invalid.incorrect')
              ? validations.username.incorrect
              : null
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={current.context.password}
          disabled={current.matches('locked')}
          onChange={event => {
            sendEvent({ type: 'SET_PASSWORD', data: event.target.value });
          }}
          error={current.matches('fill.password.invalid')}
          helperText={
            any(current, 'fill.password.invalid.empty')
              ? validations.password.required
              : any(current, 'fill.password.invalid.tooShort')
              ? validations.password.minLength
              : any(current, 'fill.password.invalid.incorrect')
              ? validations.password.incorrect
              : null
          }
        />
        {current.matches('send') ? (
          <div className={classes.loaderContainer}>
            <CircularProgress size={26} data-testid="sending-login" />
          </div>
        ) : (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={current.matches('locked')}
          >
            Log me in
          </Button>
        )}
        <Grid container>
          <Grid item xs>
            <Link href="/password-recover" passHref>
              <MUILink variant="body2">Forgot password?</MUILink>
            </Link>
          </Grid>
          <Grid item>
            <Link href="/register" passHref>
              <MUILink variant="body2">
                {"Don't have an account? Register"}
              </MUILink>
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </form>
    </>
  );
};
LoginForm.propTypes = propTypes;

export default LoginForm;
