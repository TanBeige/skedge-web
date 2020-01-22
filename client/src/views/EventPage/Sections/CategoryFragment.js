import React from 'react'
import FormatAlignLeft from "@material-ui/icons/FormatAlignLeft";
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import BrushIcon from '@material-ui/icons/Brush';
import DomainIcon from '@material-ui/icons/Domain';
import SchoolIcon from '@material-ui/icons/School';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import TheatersIcon from '@material-ui/icons/Theaters';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import MicNoneIcon from '@material-ui/icons/MicNone';

import Button from 'components/CustomButtons/Button.js'

export default function CategoryFragment({category}) {

    let genre = ""
    switch(category) {
      case "Music": 
        genre = (
          <Button color="rose"  round>
            <MusicNoteIcon /> {category}
          </Button>
        )
        break;
      case "Arts/Culture": 
        genre = (
          <Button color="rose"  round>
            <BrushIcon /> {category}
          </Button>
        )
        break;
    case "Business": 
        genre = (
          <Button color="rose"  round>
            <DomainIcon /> {category}
          </Button>
        )
        break;
    case "Comedy": 
        genre = (
          <Button color="rose"  round>
            <MicNoneIcon /> {category}
          </Button>
        )
        break;
    case "Education": 
        genre = (
          <Button color="rose"  round>
            <SchoolIcon /> {category}
          </Button>
        )
        break;
    case "Food/Drink": 
        genre = (
          <Button color="rose"  round>
            <FastfoodIcon /> {category}
          </Button>
        )
        break;
    case "Games": 
        genre = (
          <Button color="rose"  round>
            <SportsEsportsIcon /> {category}
          </Button>
        )
        break;
    case "Movies/Theater": 
        genre = (
          <Button color="rose"  round>
            <TheatersIcon /> {category}
          </Button>
        )
        break;
    case "Night Life": 
        genre = (
          <Button color="rose"  round>
            <TheatersIcon /> {category}
          </Button>
        )
        break;
    case "Party": 
        genre = (
          <Button color="rose"  round>
            <WhatshotIcon /> {category}
          </Button>
        )
        break;
    case "Politics": 
        genre = (
          <Button color="rose"  round>
            <HowToRegIcon /> {category}
          </Button>
        )
        break;
    case "Seasonal": 
        genre = (
          <Button color="rose"  round>
            <AcUnitIcon /> {category}
          </Button>
        )
        break;
    case "Sports": 
        genre = (
          <Button color="rose"  round>
            <SportsBasketballIcon /> {category}
          </Button>
        )
        break;
    }

    return (
        <div styyle={{position: 'absolute', right: 0, top: 30}}>
            {genre}
        </div>
    )
}