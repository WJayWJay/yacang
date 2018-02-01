import React from 'react';

// import { Router, Route, Switch, Redirect, IndexRoute } from 'dva/router';
import { Router, Route, Switch, Redirect, withRouter } from 'dva/router';
import dynamic from 'dva/dynamic';
// import App from './app';


function RouterConfig({ history, app }) {
  const IndexPage = dynamic({
    app,
    models: () => [
      import('./models/home'),
    ],
    component: () => import('./routes/home/index')
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
    models: () => [
      import('./models/card')
    ],
    component: () => import('./routes/addBankCard/index')
  });
  const addCredit = dynamic({
    app,
    models: () => [
      import('./models/card')
    ],
    component: () => import('./routes/addCredit/index')
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
        <Route path="/addCredit" exact component={addCredit} />
        <Route path="/about" exact component={About} />
        <Route path="/goodsDetail/:id" exact component={dynamic({ app,
          models: () => [
            import('./models/goodsDetail'),
          ],
          component: () => import('./routes/goodsDetail/index')
        })} />
        <Route path="/cardDetail" exact component={dynamic({ app,
          component: () => import('./routes/cardDetail/index')
        })} />
        <Route path="/cardCenter" exact component={dynamic({ app,
          component: () => import('./routes/cardCenter/index')
        })} />
        <Route path="/userInfo" exact component={dynamic({ app,
          component: () => import('./routes/userInfo/index')
        })} />
        <Route path="/register" exact component={dynamic({ app,
          models: () => [
            import('./models/register'),
          ],
          component: () => import('./routes/register/index')
        })} />
        <Route path="/forget" exact component={dynamic({ app,
          component: () => import('./routes/forget/index')
        })} />
        <Route path="/forget2" exact component={dynamic({ app,
          component: () => import('./routes/forget2/index')
        })} />
        <Route path="/revisePass" exact component={dynamic({ app,
          component: () => import('./routes/revisePass/index')
        })} />
        <Route path="/login" exact component={withRouter( dynamic({ app,
          component: () => import('./routes/login/index')
        }))} />
        <Route path="/myself" exact component={dynamic({ app,
          component: () => import('./routes/myself/index')
        })} />
        <Route path="/productList" exact component={dynamic({ app,
          models: () => [
            import('./models/product'),
          ],
          component: () => import('./routes/listProduct/index')
        })} />
        <Route path="/share" exact component={dynamic({ app,
          component: () => import('./routes/share/index')
        })} />
        <Route path="/manager" exact component={dynamic({ app,
          component: () => import('./routes/manager/index')
        })} />
        <Route path="/reposit" exact component={dynamic({ app,
          component: () => import('./routes/reposit/index')
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
