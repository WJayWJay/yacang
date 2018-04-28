import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { WhiteSpace, Flex, Tabs } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';
import Button from '../../components/button';
import Item from '../../components/item';

import styles from './index.less';

const tabs = [
  { title: '商品简介' },
  { title: '规格参数' },
];

class GoodsDetail extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  
  render() {
    const { detail } = this.props;
    if(!detail.productNo) {
      return <h2></h2>;
    }
    const isNoSale = detail.stat === 'S0N';
    const imgUrls = detail.images && detail.images.map(item => ({url: item.imageUrl}));
    return (
      <Layout title={'商品详情'}>
        <div className={styles.normal}>
          <Swiper items={imgUrls} />
          <div className={styles.content}>
            <Flex direction="column"> 
              <Flex className={styles.maxWidth}>
                <div className={styles.title}>{ detail.productName || ''}</div>
              </Flex> 
              <Flex className={[styles.maxWidth, styles.price]}> 
                <Flex.Item justify={'start'}> 
                  <Flex.Item className={styles.currentPrice}> {detail.stat === 'S0N' ? '非卖品':'¥ ' + detail.marketPrice }</Flex.Item>
                </Flex.Item>
                <Flex.Item justify={'end'}>
                  <Flex justify={'end'} style={{'textAlign': 'right'}}>
                    {isNoSale ? null:<Flex.Item className={styles.originalPrice}><s> 原价：¥ {detail.referencePrice} </s></Flex.Item>}
                  </Flex>
                </Flex.Item>
              </Flex>
              <Flex justify={'center'} className={[styles.maxWidth, styles.additional]}> 
                {!isNoSale && <div className={styles.flexItem}>快递：{detail.expressPrice} </div>}
                <div className={styles.flexItem}> {!isNoSale && '库存：' + detail.storeCount} </div>
                <div className={styles.flexItem}>
                  <Flex justify={'end'} style={{'textAlign': 'right'}}>
                    <Flex.Item className={styles.originalPrice}> {detail.address} </Flex.Item>
                  </Flex>
                </div>
              </Flex>
            </Flex>
          </div>

          <WhiteSpace style={{height: '10px'}} />

          <div className={styles.contentDetail}>
            <Tabs tabs={tabs}
              initialPage={0}
              swipeable={false}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            >
              <div className={ styles.tabDesc }>
                {detail.descriptions}
              </div>
              <div className={styles.tabs}>
                <table border={'1'} cellSpacing="0" cellPadding="0" className={styles.variables}>
                <tbody>
                  {detail.unearthedAge ? <tr>
                    <td>藏品年代</td>
                    <td>{detail.unearthedAge || ''}</td>
                  </tr>: null}
                  {detail.productName ? <tr>
                    <td>品名</td>
                    <td>{detail.productName || ''}</td>
                  </tr>: null}
                  {detail.identifyCategory ? <tr>
                    <td>藏品类别</td>
                    <td>{detail.identifyCategory || ''}</td>
                  </tr>: null}
                  {detail.productSize ? <tr>
                    <td>工艺</td>
                    <td>{detail.productSize || ''}</td>
                  </tr>: null}
                  {detail.weight ? <tr>
                    <td>尺寸</td>
                    <td>{detail.weight || ''}</td>
                  </tr>: null}
                  </tbody>
                </table>
              </div>
            </Tabs>
          </div>

          <WhiteSpace style={{height: '50px'}} />
          {detail.stat === 'S0N' ?null:<div className={styles.bottom} >
            <Flex>
              <Item style={{flex: 1}} >
                <Button className={styles.noneBorder} style={{backgroundColor: '#FF9E51'}}>加入购物车</Button>
              </Item>
              <Item style={{flex: 2}} >
                <Button className={styles.noneBorder} style={{backgroundColor: '#F32828'}}>立即购买</Button>
              </Item>
            </Flex>
          </div>}
        </div>
      </Layout>
    );
  }
}

GoodsDetail.propTypes = {
};

function mapStateToProps(state) {
  const { detail, id } = state.goodsDetail;
  return {
    detail,
    id
  }
}

export default connect( mapStateToProps )(GoodsDetail);
