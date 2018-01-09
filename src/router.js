import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';



function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/home/IndexPage')
  })
  const ProductPage = dynamic({
    app,
    component: () => import('./routes/product/index')
  })

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/product" exact component={ProductPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
