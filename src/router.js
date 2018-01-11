import React from 'react';
// import { Router, Route, Switch, Redirect, IndexRoute } from 'dva/router';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';
// import App from './app';


function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    // models: () => [
    //   import('./models/users'),
    // ],
    component: () => import('./routes/home/IndexPage')
  })
  const ProductPage = dynamic({
    app,
    component: () => import('./routes/product/index')
  })
  const CheckCode = dynamic({
    app,
    component: () => import('./routes/checkcode/index')
  })

  return (
    <Router history={history}>
      <Switch>
        {/* <Redirect from="/" to="/home" /> */}
        <Route path="/home" exact component={IndexPage} />
        <Route path="/product" exact component={ProductPage} />
        <Route path="/checkcode" exact component={CheckCode} />
        {/* <Route path="/show">
          <IndexRoute component={ListPage} />
          <Route path=":page" component={ListPage} />
        </Route> */}
      </Switch>
    </Router>
  );
}

export default RouterConfig;
