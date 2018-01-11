import React from 'react';
import { connect } from 'dva';
import Layout from './components/layout';

function App(props) {

  return (
    <Layout>
      {/* { props.children } */}
    </Layout>
  )
}

App.propTypes = {

}

export default connect()(App)
