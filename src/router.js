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

  const AddBankCard = dynamic({
    app,
    component: () => import('./routes/addBankCard/index')
  });
  const About = dynamic({
    app,
    component: () => import('./routes/about/index')
  });

  return (
    <Router history={history}>
      <Switch>
        {/* <Redirect from="/" to="/home" /> */}
        <Route path="/" exact component={IndexPage} />
        <Route path="/home" exact component={IndexPage} />
        <Route path="/product" exact component={ProductPage} />
        <Route path="/checkcode" exact component={CheckCode} />
        <Route path="/addBankCard" exact component={AddBankCard} />
        <Route path="/about" exact component={About} />
        <Route path="/goodsDetail" exact component={dynamic({ app,
          component: () => import('./routes/goodsDetail/index')
        })} />
        <Route path="/cardDetail" exact component={dynamic({ app,
          component: () => import('./routes/cardDetail/index')
        })} />
        <Route path="/cardCenter" exact component={dynamic({ app,
          component: () => import('./routes/cardCenter/index')
        })} />
        {/* <Route path="/show">
          <IndexRoute component={ListPage} />
          <Route path=":page" component={ListPage} />
        </Route> */}
      </Switch>
    </Router>
  );
}

export default RouterConfig;
