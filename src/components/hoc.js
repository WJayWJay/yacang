import React from 'react';
import Layout from './layout';

const Hoc = ( WrapperComponent ) => {
  return (<Layout {...this.props}>
    <WrapperComponent {...this.props} />
  </Layout>);
};



export default Hoc;
