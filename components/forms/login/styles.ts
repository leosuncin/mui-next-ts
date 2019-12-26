import { createStyles, makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    loaderContainer: {
      display: 'block',
      width: '100%',
      padding: theme.spacing(2),
      textAlign: 'center',
    },
  }),
);
