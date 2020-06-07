import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid,
  Link as MUILink,
  TextField,
  Typography,
} from '@material-ui/core';
import { useMachine } from '@xstate/react';
import Copyright from 'components/copyright';
import registerMachine from 'machines/register-machine';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

import useStyles from './styles';

type RegisterFormProps = {
  onSubmit: (body) => Promise<void>;
};

export const validations = {
  firstName: {
    required: 'First name should not be empty',
    minLength: 'First name too short (at least 2 characters required)',
  },
  lastName: {
    required: 'Last name should not be empty',
    minLength: 'Last name too short (at least 2 characters required)',
  },
  email: {
    required: 'Email should not be empty',
    minLength: 'Email too short (at least 3 characters required)',
    pattern: 'Email is invalid',
    incorrect: 'Email already registered',
  },
  password: {
    required: 'Password should not be empty',
    minLength: 'Password too short (at least 8 characters required)',
    insecure: 'Password was leaked',
  },
};
function any(state: any, ...values: string[]): boolean {
  return values.reduce((prev, curr) => prev || state.matches(curr), false);
}

const RegisterForm: React.FC<RegisterFormProps> = props => {
  const [currentState, sendEvent] = useMachine(registerMachine, {
    services: {
      register({ firstName, lastName, email, password }) {
        return props.onSubmit({ firstName, lastName, email, password });
      },
    },
    devTools: true,
  });
  const classes = useStyles(props);

  return (
    <>
      <Fade
        in={any(currentState, 'error')}
        aria-expanded={any(currentState, 'error')}
      >
        <Typography color="secondary" className={classes.errorMessage}>
          <span role="img" aria-label="sad face">
            😥
          </span>
          &nbsp;
          {currentState.context.errorMessage}
        </Typography>
      </Fade>
      <form
        title="register form"
        className={classes.root}
        noValidate
        onSubmit={event => {
          event.preventDefault();
          sendEvent('SUBMIT');
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="firstName"
              name="firstName"
              variant="outlined"
              autoComplete="fname"
              label="First name"
              required
              fullWidth
              autoFocus
              value={currentState.context.firstName}
              error={currentState.matches('fill.firstName.invalid')}
              helperText={
                currentState.matches('fill.firstName.invalid.empty')
                  ? validations.firstName.required
                  : currentState.matches('fill.firstName.invalid.tooShort')
                  ? validations.firstName.minLength
                  : null
              }
              onChange={event =>
                sendEvent({
                  type: 'SET_FIRST_NAME',
                  firstName: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="lname"
              value={currentState.context.lastName}
              error={currentState.matches('fill.lastName.invalid')}
              helperText={
                currentState.matches('fill.lastName.invalid.empty')
                  ? validations.lastName.required
                  : currentState.matches('fill.lastName.invalid.tooShort')
                  ? validations.lastName.minLength
                  : null
              }
              onChange={event =>
                sendEvent({
                  type: 'SET_LAST_NAME',
                  lastName: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={currentState.context.email}
              error={currentState.matches('fill.email.invalid')}
              helperText={
                currentState.matches('fill.email.invalid.empty')
                  ? validations.email.required
                  : currentState.matches('fill.email.invalid.tooShort')
                  ? validations.email.minLength
                  : currentState.matches('fill.email.invalid.format')
                  ? validations.email.pattern
                  : currentState.matches('fill.email.invalid.incorrect')
                  ? validations.email.incorrect
                  : null
              }
              onChange={event =>
                sendEvent({
                  type: 'SET_EMAIL',
                  email: event.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={currentState.context.password}
              error={currentState.matches('fill.password.invalid')}
              helperText={
                currentState.matches('fill.password.invalid.empty')
                  ? validations.password.required
                  : currentState.matches('fill.password.invalid.tooShort')
                  ? validations.password.minLength
                  : currentState.matches('fill.password.invalid.insecure')
                  ? validations.password.insecure
                  : null
              }
              onChange={event =>
                sendEvent({
                  type: 'SET_PASSWORD',
                  password: event.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        {currentState.matches('send') ? (
          <div className={classes.loader}>
            <CircularProgress size={26} data-testid="sending-register" />
          </div>
        ) : (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Me Up
          </Button>
        )}
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/login" passHref>
              <MUILink variant="body2">Already have an account? Log in</MUILink>
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
RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterForm;
