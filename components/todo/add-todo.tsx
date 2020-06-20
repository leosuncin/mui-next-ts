import { Button, Grid, TextField } from '@material-ui/core';
import { createTodoSchema as validationSchema } from 'libs/validation';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';

const propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
const TodoForm: React.FC<PropTypes.InferProps<typeof propTypes>> = props => {
  const { handleSubmit, register, errors, formState, reset } = useForm({
    validationSchema,
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
        name="text"
        variant="outlined"
        fullWidth
        error={!!errors.text}
        helperText={errors.text?.message}
        inputRef={register}
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
