import React from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { WhiteSpace } from 'antd-mobile';

import Layout from '../../components/layout';
import Swiper from '../../components/swiper';

import styles from './index.less';

class About extends React.Component {
  state = {
    hasError: false,
    value: '',
  }
  
  render() {
    let content = '广东雅藏文化博物馆有限公司是一家集古董鉴定、古董展览、古玩艺术品，字画、玉器、瓷器等各类产品的综合性平台，企业规模100人以上，公司主要以藏品的价值评估、展览、交易、买家推荐会为经营重点，不定期举行全国鉴宝活动，每年定期举办马来西亚、法国、德国、美国、香港春季、广州秋季等大型艺术品交流等活动。'+
    '公司内设大型高品位艺术收藏品展览中心，分为陶瓷区、玉器区、名人字画区、杂项区 等，汇集来自全球各地收藏名家的众多艺术珍品及最具收藏潜质的古玩艺术品，是目前华东地区、欧洲地区、东南地区高端艺术收藏品行业颇具知名的古玩艺术品鉴定平台之一。 公司经过多年的累积，不仅拥有丰富的客户资源，也拥有专业的营销策划团队，为广大藏家的历代珍品进行专业的全方位立体式广告宣传和营销策划包装。通过不定期的举办大型交流鉴宝会、大型艺术品会等为广大收藏爱好者提供优质、专业、便捷的鉴定服务。'+
    '为了迎合市场需求，广东宝宝文化博物馆有限公司推出陶瓷、玉器、近现代书画、古籍善本、珠宝翡翠、印章、邮品钱币、文房四宝、竹木牙雕、金铜佛像、等专业性很强的推荐会活动。满足不同藏品的在市场上正常运作。'

    return (
      <Layout title={'关于雅藏'}>
        <div className={styles.normal}>
          <Swiper />        
          <WhiteSpace />

          <div className={styles.content}>
            {content}
          </div>
        </div>
      </Layout>
    );
  }
}

About.propTypes = {
};

export default connect()(About);
