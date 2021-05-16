import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';

import { createTodoSchema } from '@app/libs/validation';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
const TodoForm: React.FC<PropTypes.InferProps<typeof propTypes>> = props => {
  const { handleSubmit, register, formState, reset } = useForm({
    resolver: yupResolver(createTodoSchema),
  });

  return (
    <Grid
      component="form"
      data-testid="add-todo-form"
      onSubmit={handleSubmit(body => {
        props.onSubmit(body);
        reset();
      })}
    >
      <TextField
        label="Text"
        margin="normal"
        id="text-input"
        variant="outlined"
        fullWidth
        error={!!formState.errors.text}
        helperText={formState.errors.text?.message}
        {...register('text')}
      />
      <Button
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        fullWidth
        disabled={formState.isSubmitting}
      >
        Add
      </Button>
    </Grid>
  );
};
TodoForm.propTypes = propTypes;

export default TodoForm;
