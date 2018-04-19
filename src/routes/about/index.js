import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { WhiteSpace } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';
import logo from '../../assets/share/logo.png';

import styles from './index.less';

class About extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  
  render() {
    let content = ''
    
    
    return (
      <Layout title={'关于汇藏'}>
        <div className={styles.normal}>
          {/* <Swiper />         */}
          <WhiteSpace />

          <div className={styles.content}>
            <div style={{textAlign:'center'}}>
            <img style={{ width: '100px', height: '100px'}} src={logo} alt={'logo'} />
            </div>
            <p>
              滙藏”是国家文物局辖下专门从事文物收藏工作的专业团体“中国收藏家协会”（英文名称：China Association of Collectors，缩写：CAC；民政部批准登记（社证字4187号））官方授权批准成立的线上文化交流平台。平台主要社会责任是推动文化交流互鉴,加强对外文化交流合作，助推中华优秀传统文化的传播。
            </p>
            <p>
            “滙藏”包含的主要功能有藏品鉴赏、文化培训、艺术品交流。藏品鉴赏功能主要包含海外、国内、私人收藏艺术品在线展览。文化培训功能进行中华传统文化在线传播，专家讲座培训，专业知识学习。艺术品交流功能提供个人藏品在线交流社区，组织线下交流聚会，可流通艺术品在线交易。
            </p>
            <p>
              由于CAC的特殊性（国家官方团体，不允许商业化运营），“滙藏”移动平台由广州智众联公司承担运营工作
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}

About.propTypes = {
};

export default connect()(About);
