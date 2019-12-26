import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import MUILink from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';

import Copyright from 'components/copyright';
import { AuthLogin } from 'services/login';
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
  const { handleSubmit, register, errors, formState } = useForm<AuthLogin>();
  const classes = useStyles(props);

  return (
    <form
      className={classes.root}
      noValidate
      onSubmit={handleSubmit(props.onSubmit)}
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
        error={!!errors.username}
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
        error={!!errors.password}
        helperText={errors.password && errors.password.message}
      />
      {formState.isSubmitting ? (
        <div className={classes.loaderContainer}>
          <CircularProgress size={26} />
        </div>
      ) : (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
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
  );
};
LoginForm.propTypes = propTypes;

export default LoginForm;
