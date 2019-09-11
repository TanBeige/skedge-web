import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    margin: 10,
    minWidth: 325,
    maxWidth: 3475,
    borderRadius: 10
  },
  media: {
    height: 140,
  },
  distance: {
    float: 'right'
  }
});

const MediaCard = (props) => {

  const classes = useStyles();
  const bioMaxLength = 70;

  let eventBio = props.event.description;

  if(eventBio === "" || !eventBio) {
    eventBio = <i>There is no bio.</i>
  }
  else if(eventBio.length > bioMaxLength) {
      eventBio = eventBio.substring(0, bioMaxLength);
      eventBio += "..."
  }
    

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.event.cover_pic}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.event.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {eventBio}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          {props.event.category}
        </Button>
        <Button className={classes.distance} size="small" color="primary" >
          0.x miles away
        </Button>
      </CardActions>
    </Card>
  );
}

export default MediaCard;