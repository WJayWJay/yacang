import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Flex, ActionSheet, WhiteSpace, Toast } from 'antd-mobile';

import Layout from '../../components/layout';
import Button from '../../components/button';

import { isWeixin,shareToFriendsCircle, shareToFriends, shareToQQ } from '../../functions';

import styles from './index.less';

import logo from '../../assets/share/logo.png';

import ewmIcon from '../../assets/share/ewm.png';

class Index extends React.Component {

  intervId = 0;

  state = {
    hasError: false,
    phone: '',
  }
  dataList = [
    { url: 'umnHwvEgSyQtXlZjNJTt', title: '微信好友' },
    { url: 'cTTayShKtEIdQVEMuiWt', title: '生活圈' },
    { url: 'SxpunpETIwdxNjcJamwB', title: 'QQ' },
    // { url: 'OpHiXAcYzmPQHcdlLFrc', title: '发送给朋友' },
    // { url: 'wvEzCMiDZjthhAOcwTOu', title: '新浪微博' },
  ].map(obj => ({
    icon: <img src={`https://gw.alipayobjects.com/zos/rmsportal/${obj.url}.png`} alt={obj.title} style={{ width: 36 }} />,
    title: obj.title,
  }));


  componentDidMount() {
    // console.log(isWeixin())
    // if(isWeixin()) {
      
    // }
  }


  showShareActionSheetMulpitleLine = () => {
    const data = [[this.dataList[0], this.dataList[1], this.dataList[2]]];
    // ActionSheet.showShareActionSheetWithOptions({
    //   options: data,
    //   message: '分享到',
    // },
    // (buttonIndex, rowIndex) => {
    //   console.log(buttonIndex, rowIndex)
    //   if(!isWeixin()) return;
    //   console.log('is weixin');
    //   // this.setState({ clicked2: buttonIndex > -1 ? data[rowIndex][buttonIndex].title : 'cancel' });
    //   let link = location.protocol + '//' + location.host + location.pathname; //eslint-disable-line
    //   let title = '汇藏',
    //       desc = '汇聚国内外精品古藏',
    //       imgUrl =  link + 'logo.png'; 
    //   if(buttonIndex === 0) {
    //     console.log('share to freinds circle')
    //     shareToFriendsCircle(title, imgUrl, link);
    //   } else if (buttonIndex === 1) {
    //     shareToFriends(title, desc, imgUrl, link);
    //   } else if(buttonIndex === 2) {
    //     shareToQQ(title, desc, imgUrl, link);
    //   }
    // });
  }



  render() {
    const { info } = this.props;

    return (
      <Layout title={'分享汇藏'}>
      <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0,background: '#ffffff', marginTop:'45px', overflow: 'auto' }} >
        <div className={styles.normal}>
          <div className={styles.content}>
            <WhiteSpace style={{ height: '41px'}} />
            <Flex justify="center" className={styles.logo}>
              <img src={logo} alt="logo" style={{width: '96px', height: '96px'}} />
            </Flex>
            <WhiteSpace style={{ height: '10px'}} />
            <Flex justify="center" className={styles.version}>
              {/* <div>汇藏 APP V1.0</div> */}
            </Flex>
            <WhiteSpace style={{ height: '14px'}} />
            <Flex justify="center" className={styles.desc1}>
              <div>高端收藏品的集聚地</div>
            </Flex>
            <WhiteSpace />
            <Flex justify="center" className={styles.desc2}>
              <div>便捷交易，快速取现</div>
            </Flex>
            <WhiteSpace style={{ height: '34px'}} />
            <Flex justify="center" className={styles.logo}>
              <img src={ewmIcon} alt="logo" style={{width: '209px', height: '209px'}} />
            </Flex>
            <WhiteSpace style={{ height: '10px'}} />
            <Flex justify="center" className={styles.desc2}>
              {/* <div>扫码即可下载汇藏</div> */}
              <div>扫码即可关注汇藏</div>
            </Flex>
            <WhiteSpace style={{ height: '119px'}} />
          </div>
          <Flex className={styles.share}>
            {/* <Button onClick={this.showShareActionSheetMulpitleLine} className={styles.shareButton}>向朋友推荐汇藏</Button> */}
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
  const { isLogin, info } = state.user
  return {
    isLogin, info
  }
}
export default connect( mapStateToProps )(Index);
