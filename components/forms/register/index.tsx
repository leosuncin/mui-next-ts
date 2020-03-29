import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Link as MUILink,
  TextField,
} from '@material-ui/core';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';

import Copyright from 'components/copyright';
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
  email: {
    required: 'Email should not be empty',
    pattern: {
      value: /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      message: 'Email is invalid',
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
  const { handleSubmit, register, errors, formState } = useForm<
    Record<keyof typeof validations, string>
  >();
  const classes = useStyles(props);

  return (
    <form
      title="register form"
      className={classes.root}
      noValidate
      onSubmit={handleSubmit(props.onSubmit)}
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
            inputRef={register(validations.firstName)}
            error={!!errors.firstName}
            helperText={errors.firstName && errors.firstName.message}
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
            inputRef={register(validations.lastName)}
            error={!!errors.lastName}
            helperText={errors.lastName && errors.lastName.message}
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
            inputRef={register(validations.email)}
            error={!!errors.email}
            helperText={errors.email && errors.email.message}
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
            inputRef={register(validations.password)}
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
          />
        </Grid>
      </Grid>
      {formState.isSubmitting ? (
        <div className={classes.loader}>
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
