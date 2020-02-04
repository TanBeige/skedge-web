const HASURA_GRAPHQL_ENGINE_HOSTNAME = "skedge-web.herokuapp.com";

const scheme = proto => {
  return window.location.protocol === "https:" ? `${proto}s` : proto;
};

export const GRAPHQL_URL = `${scheme(
  "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;
export const REALTIME_GRAPHQL_URL = `${scheme(
  "ws"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1/graphql`;

export const authClientId = "RH47tlmwwW28QH44WrohPJ1YyjAAEEbd";
export const authDomain = "skedge.auth0.com";

//export const webUrl = `https://secret-journey-62331.herokuapp.com`;
//export const webUrl = 'http://192.168.0.5:3000'
//export const webUrl = `http://localhost:3000`;
//export const callbackUrl = `${webUrl}/callback`;
//export const backendUrl = 'http://localhost:9000';
//export const backendUrl = `https://secret-journey-62331.herokuapp.com`;
export const skedgeLocations = [
  {
    city: "Tallahassee",
    state: "Florida"
  }
]

export const categoryList = [
  "Any",
  "Arts/Culture",
  "Business",
  "Comedy",
  "Education",
  "Food/Drink",
  "Games",
  "Movies/Theater",
  "Music",
  "Night Life",
  "Party",
  "Politics",
  "Seasonal",
  "Sports",
  "Miscellaneous"
]

export const states = [ 
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Islands",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
]