import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import ProductCategories from './modules/views/ProductCategories';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';

const Index = (props) => {
  
  return (
    <React.Fragment>
      <ProductHero {...props}/>
      <ProductCategories />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
