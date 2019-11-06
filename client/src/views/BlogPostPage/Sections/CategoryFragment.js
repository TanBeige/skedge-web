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
          <Button color="rose" size="lg" round>
            <MusicNoteIcon /> {category}
          </Button>
        )
        break;
      case "Arts/Culture": 
        genre = (
          <Button color="rose" size="lg" round>
            <BrushIcon /> {category}
          </Button>
        )
        break;
    case "Business": 
        genre = (
          <Button color="rose" size="lg" round>
            <DomainIcon /> {category}
          </Button>
        )
        break;
    case "Business": 
        genre = (
          <Button color="rose" size="lg" round>
            <MicNoneIcon /> {category}
          </Button>
        )
        break;
    case "Education": 
        genre = (
          <Button color="rose" size="lg" round>
            <SchoolIcon /> {category}
          </Button>
        )
        break;
    case "Food": 
        genre = (
          <Button color="rose" size="lg" round>
            <FastfoodIcon /> {category}
          </Button>
        )
        break;
    case "Games": 
        genre = (
          <Button color="rose" size="lg" round>
            <SportsEsportsIcon /> {category}
          </Button>
        )
        break;
    case "Movies/Theater": 
        genre = (
          <Button color="rose" size="lg" round>
            <TheatersIcon /> {category}
          </Button>
        )
        break;
    case "Party": 
        genre = (
          <Button color="rose" size="lg" round>
            <WhatshotIcon /> {category}
          </Button>
        )
        break;
    case "Politics": 
        genre = (
          <Button color="rose" size="lg" round>
            <HowToRegIcon /> {category}
          </Button>
        )
        break;
    case "Seasonal": 
        genre = (
          <Button color="rose" size="lg" round>
            <AcUnitIcon /> {category}
          </Button>
        )
        break;
    case "Sports": 
        genre = (
          <Button color="rose" size="lg" round>
            <SportsBasketballIcon /> {category}
          </Button>
        )
        break;
    }

    return (
        <div>
            {genre}
        </div>
    )
}