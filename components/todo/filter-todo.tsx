import { Button, ButtonGroup, Paper, Typography } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

export enum filterTodoBy {
  all,
  completed,
  active,
}
const propTypes = {
  all: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired,
  active: PropTypes.number.isRequired,
  filter: PropTypes.oneOf(Object.keys(filterTodoBy)),
  onChangeFilter: PropTypes.func.isRequired,
  onClearCompleted: PropTypes.func.isRequired,
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'middle',
      padding: theme.spacing(),
      margin: theme.spacing(2, 0),
    },
    typography: {
      margin: 'auto 0',
    },
  }),
);
const FilterTodo: React.FC<PropTypes.InferProps<typeof propTypes>> = props => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography className={classes.typography}>
        {props.active} items left
      </Typography>
      <ButtonGroup>
        <Button
          variant="outlined"
          size="small"
          color={
            filterTodoBy[props.filter] === filterTodoBy.all
              ? 'primary'
              : 'default'
          }
          disableElevation
          onClick={() => props.onChangeFilter('all')}
        >
          All ({props.all})
        </Button>
        <Button
          variant="outlined"
          size="small"
          color={
            filterTodoBy[props.filter] === filterTodoBy.active
              ? 'primary'
              : 'default'
          }
          disableElevation
          onClick={() => props.onChangeFilter('active')}
        >
          Active ({props.active})
        </Button>
        <Button
          variant="outlined"
          size="small"
          color={
            filterTodoBy[props.filter] === filterTodoBy.completed
              ? 'primary'
              : 'default'
          }
          disableElevation
          onClick={() => props.onChangeFilter('completed')}
        >
          Completed ({props.completed})
        </Button>
      </ButtonGroup>
      {props.completed ? (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          disableElevation
          onClick={props.onClearCompleted}
        >
          Clear completed
        </Button>
      ) : null}
    </Paper>
  );
};
FilterTodo.propTypes = propTypes;
FilterTodo.defaultProps = {
  filter: 'all',
};

export default FilterTodo;
