import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Divider from '@material-ui/core/Divider';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { UserWithoutPassword as User } from '@app/types';

import styles from './styles';

export type UserCardProps = User & WithStyles<typeof styles>;

function UserCard(props: UserCardProps) {
  return (
    <Card className={props.classes.card}>
      <CardMedia
        image={props.picture}
        title={props.username}
        className={props.classes.media}
      />
      <CardContent>
        <Typography variant="h5" component="h1">
          {props.firstName + ' ' + props.lastName}
        </Typography>
        <Divider />
        <Typography variant="body2" component="p" color="textSecondary">
          {props.bio}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(UserCard);
