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
    
    return (
      <Layout title={'商品详情'}>
        <div className={styles.normal}>
          <Swiper />
          <div className={styles.content}>
            <Flex direction="column"> 
              <Flex className={styles.maxWidth}>
                <div className={styles.title}>国家一级美术师 常炳华 粉彩生肖杯 极品精致 纯手绘手工胎</div>
              </Flex> 
              <Flex className={[styles.maxWidth, styles.price]}> 
                <Flex.Item justify={'start'}> 
                  <Flex.Item className={styles.currentPrice}> ¥ 19000.00 </Flex.Item>
                </Flex.Item>
                <Flex.Item justify={'end'}>
                  <Flex justify={'end'} style={{'textAlign': 'right'}}>
                    <Flex.Item className={styles.originalPrice}><s> 原价：¥ 24000.00 </s></Flex.Item>
                  </Flex>
                </Flex.Item>
              </Flex>
              <Flex justify={'center'} className={[styles.maxWidth, styles.additional]}> 
                <div className={styles.flexItem}> 快递：20:00 </div>
                <div className={styles.flexItem}> 库存：12 </div>
                <div className={styles.flexItem}>
                  <Flex justify={'end'} style={{'textAlign': 'right'}}>
                    <Flex.Item className={styles.originalPrice}> 附件泉州 </Flex.Item>
                  </Flex>
                </div>
              </Flex>
            </Flex>
          </div>

          <WhiteSpace style={{height: '10px'}} />

          <div className={styles.contentDetail}>
            <Tabs tabs={tabs}
              initialPage={0}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            >
              <div className={styles.tabs}>
                油彩陶瓷艺术馆旨在传承景德镇陶瓷传统文化，弘扬创新艺术理念，打造东西文化相结合的平台，团结一切艺术家，为景德镇千年瓷都
                的更加辉煌贡献力量。

                  独创的颜色釉油彩瓷画既有国画的深远意境，又有油画的质感，立体感，苍劲古朴，气韵生动，大气磅礴，获得了一次烧制成功的重大
                突破，添补了景德镇瓷绘画艺术的一项空白，成为景德镇陶瓷艺术的一大亮点。
              </div>
              <div className={styles.tabs}>
                Content of second tab
              </div>
            </Tabs>
          </div>

          <WhiteSpace style={{height: '100px'}} />
          <div className={styles.bottom} >
            <Flex>
              <Item style={{flex: 1}} >
                <Button className={styles.noneBorder} style={{backgroundColor: '#FF9E51'}}>加入购物车</Button>
              </Item>
              <Item style={{flex: 2}} >
                <Button className={styles.noneBorder} style={{backgroundColor: '#F32828'}}>立即购买</Button>
              </Item>
            </Flex>
          </div>
        </div>
      </Layout>
    );
  }
}

GoodsDetail.propTypes = {
};

export default connect()(GoodsDetail);
