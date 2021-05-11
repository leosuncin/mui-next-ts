import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Link as MUILink,
  TextField,
} from '@material-ui/core';
import Copyright from 'components/copyright';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';

import useStyles from './styles';

type RegisterFormProps = {
  onSubmit: (body) => Promise<void>;
};

export const validations = {
  firstName: {
    required: 'First name should not be empty',
  },
  lastName: {
    required: 'Last name should not be empty',
  },
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
const RegisterForm: React.FC<RegisterFormProps> = props => {
  const { handleSubmit, register, formState } =
    useForm<Record<keyof typeof validations, string>>();
  const classes = useStyles(props);

  return (
    <form
      className={classes.root}
      noValidate
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="firstName"
            variant="outlined"
            autoComplete="fname"
            label="First name"
            required
            fullWidth
            error={!!formState.errors.firstName}
            helperText={
              formState.errors.firstName && formState.errors.firstName.message
            }
            {...register('firstName', validations.firstName)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            autoComplete="lname"
            error={!!formState.errors.lastName}
            helperText={
              formState.errors.lastName && formState.errors.lastName.message
            }
            {...register('lastName', validations.lastName)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            error={!!formState.errors.username}
            helperText={
              formState.errors.username && formState.errors.username.message
            }
            {...register('username', validations.username)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!formState.errors.password}
            helperText={
              formState.errors.password && formState.errors.password.message
            }
            {...register('password', validations.password)}
          />
        </Grid>
      </Grid>
      {formState.isSubmitting ? (
        <div className={classes.loader}>
          <CircularProgress
            size={26}
            aria-valuetext="Sending..."
            aria-busy="true"
            aria-live="polite"
          />
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
  );
};
RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterForm;
