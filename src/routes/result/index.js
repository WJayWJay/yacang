import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Flex, Result, Toast } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import Constant from './../../constant';

import styles from './index.less';

import logo from '../../assets/login-logo.png';

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
  }
  
  
  render() {
    const myImg = src => <img src={src} style={{width: '60px', height: '60px'}} className="spe am-icon " alt="" />;
    return (
      <Layout title={'处理成功！'}>
        <div className={styles.normal}>   
          <div className={styles.content}> 
            
            <Flex direction="column" className={styles.result} align="center" justify="center">
              <Result
                img={myImg(logo)}
                title="处理成功!"
                message={<div></div>}
              />

              <Flex className={styles.linkList} direction="column">
                <Link className={styles.link} to={'/myself'} >回到个人中心</Link>
                <Link className={styles.link} to={'/home'} >回到首页</Link>
              </Flex>  
            </Flex>
            
            <Flex className={styles.copyright} direction="column">
              <Flex.Item>
                {Constant.company}
              </Flex.Item>
              <Flex.Item>
                {Constant.copyright}
              </Flex.Item>
            </Flex>
          </div>
        </div>
      </Layout>
    );
  }
}

Index.propTypes = {
};
function mapStateToProps( state ) {
  // console.log(state)
  return {
    
  }
}
export default connect( mapStateToProps )(Index);
