import React from 'react'
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
import LocalBarIcon from '@material-ui/icons/LocalBar';

import Chip from '@material-ui/core/Chip';



import Button from 'components/CustomButtons/Button.js'

export default function CategoryFragment({category}) {

    let genre;
    switch(category) {
      case "Music": 
        genre = (
            <MusicNoteIcon />
        )
        break;
      case "Arts/Culture": 
        genre = (
            <BrushIcon />
        )
        break;
    case "Business": 
        genre = (
            <DomainIcon />
        )
        break;
    case "Comedy": 
        genre = (
            <MicNoneIcon />
        )
        break;
    case "Education": 
        genre = (
            <SchoolIcon />
        )
        break;
    case "Food/Drink": 
        genre = (
            <FastfoodIcon />
        )
        break;
    case "Games": 
        genre = (
            <SportsEsportsIcon />
        )
        break;
    case "Movies/Theater": 
        genre = (<TheatersIcon />) 
        
        break;
    case "Night Life": 
        genre = (
            <LocalBarIcon /> 
        )
        break;
    case "Party": 
        genre = (
            <WhatshotIcon /> 
        )
        break;
    case "Politics": 
        genre = (
            <HowToRegIcon /> 
        )
        break;
    case "Seasonal": 
        genre = (
            <AcUnitIcon />
        )
        break;
    case "Sports": 
        genre = (
            <SportsBasketballIcon /> 
        )
        break;
    }

    return (
        <Chip icon={genre} label={category} color='default'/>
    )
}