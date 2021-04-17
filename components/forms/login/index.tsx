import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MUILink from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Copyright from 'components/copyright';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLogin } from 'types';

import useStyles from './styles';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export const validations = {
  username: {
    required: 'Username should not be empty',
    minLength: {
      value: 5,
      message: 'Username too short (at least 5 characters required)',
    },
  },
  password: {
    required: 'Password should not be empty',
    minLength: {
      value: 8,
      message: 'Password too short (at least 8 characters required)',
    },
  },
};

const LoginForm: React.FC<PropTypes.InferProps<typeof propTypes>> = props => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [attempt, setAttempt] = useState(1);
  const { handleSubmit, register, errors, formState } = useForm<AuthLogin>({
    mode: 'onBlur',
  });
  const classes = useStyles(props);

  return (
    <>
      <Fade in={Boolean(errorMessage)} aria-expanded={Boolean(errorMessage)}>
        <Typography color="secondary" className={classes.errorMessage}>
          <span role="img" aria-label="sad face">
            😥
          </span>
          &nbsp;
          {errorMessage}
        </Typography>
      </Fade>
      <form
        title="login form"
        className={classes.root}
        noValidate
        onSubmit={handleSubmit(async body => {
          try {
            setErrorMessage(null);
            await props.onSubmit(body);
          } catch (error) {
            setAttempt(attempt => attempt + 1);
            if (attempt >= 3) setErrorMessage('Too many failed attempts');
            else setErrorMessage(error.message);
          }
        })}
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
          inputRef={register(validations.username)}
          error={Boolean(errors.username)}
          disabled={attempt > 3}
          helperText={errors.username && errors.username.message}
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
          inputRef={register(validations.password)}
          error={Boolean(errors.password)}
          disabled={attempt > 3}
          helperText={errors.password && errors.password.message}
        />
        {formState.isSubmitting ? (
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
            disabled={attempt > 3}
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
