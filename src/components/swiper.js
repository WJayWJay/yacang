import React from 'react';
import BannerAnim, { Element } from 'rc-banner-anim';
import { Carousel } from 'antd-mobile';
// import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import 'rc-banner-anim/assets/index.css';

import styles from './swiper.less';

const BgElement = Element.BgElement;

const Swiper = (props) => {

  const items = props.items || [
    {
      url: 'https://os.alipayobjects.com/rmsportal/uaQVvDrCwryVlbb.jpg'
    },
    {
      url: 'https://os.alipayobjects.com/rmsportal/IhCNTqPpLeTNnwr.jpg'
    }
  ];
  if (items.length < 1) {
    return null;
  }
  let { height } = props;
  let elements = items.map((item, index) => (<Element
    prefixCls={styles.bannerUserElem}
    style={height ? { height: height } : {}}
    key={index}
    {...props}
  >
    <BgElement
      key="bg"
      className={styles.bg}
      style={{
        backgroundImage: 'url(' + item.url + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: height || null
      }}
    >{props.BackRound}</BgElement>
    <QueueAnim name="QueueAnim">
      <h3 key="h1">{item.title || ''}</h3>
      <p key="p">{item.text || ''}</p>
    </QueueAnim>
  </Element>));

  return <Carousel
    swiping={true}
    dragging={true}
    infinite={true}
    wrapAround={true}
    autoplay={true}
    style={{ backgroundColor: '#e2e2e2' }}
  >
    {items.map((item) => (<div key={item.url} className={styles.contain}>
      {item.title ? <h3>{item.title || ''}</h3> : null}
      <img src={item.url} alt={item.title} />
    </div>))}
  </Carousel>;

  // return (
  //   <div>
  //     {/* <BannerAnim type={'across'} className={styles.bannerUser} arrow={false}> */}
  //     <BannerAnim autoPlay={true} type={'across'} className={styles.bannerUser} style={height? {height: height}: {}} arrow={false } {...props}>
  //         {elements}
  //     </BannerAnim>
  //   </div>
  // );
};

Swiper.propTypes = {

};

export default Swiper;
