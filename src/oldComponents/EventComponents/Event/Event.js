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
    let eventBio = props.event.bio;
    if(props.event.bio.length > bioMaxLength) {
        eventBio = eventBio.substring(0, bioMaxLength);
        eventBio += "..."
    }
    else if(eventBio === "") {
        eventBio = <i>There is no bio.</i>
    }

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={props.event.imgSrc}
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






/*
import React, { Component } from 'react';

require('./Event.scss')


class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const bioMaxLength = 70;
        let eventBio = this.props.event.bio;
        if(this.props.event.bio.length > bioMaxLength) {
            eventBio = eventBio.substring(0, bioMaxLength);
            eventBio += "..."
        }
        else if(eventBio === "") {
            eventBio = <i>There is no bio.</i>
        }
        return ( 
            <div className="Event">
                <div className="image-container">
                    <img src={this.props.event.imgSrc} alt=''/>
                </div>
                <p className='event-name'>{this.props.event.name}</p>
                <div className="event-information">
                    <p className='event-bio'>{eventBio}</p>
                    <div className="event-bottom">
                        <a href='/filler' className='category'>{this.props.event.category}</a>
                        <p className='distance'>0.x miles away</p>
                    </div>
                </div>
            </div>

        );
    }
}
 
export default Event;*/