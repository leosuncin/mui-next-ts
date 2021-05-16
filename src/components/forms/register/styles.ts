import { makeStyles } from '@material-ui/core';

export default makeStyles(theme => ({
  root: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loader: {
    display: 'block',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));
