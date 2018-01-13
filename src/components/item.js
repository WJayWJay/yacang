import React from 'react';
import { Flex } from 'antd-mobile';
import PropTypes from 'prop-types';
import styles from './item.less';


const SelfItem = (props) => {
  let cl = props.className
  let selfClass = [styles.item];
  selfClass = Array.isArray( cl )? selfClass.concat(cl): cl? selfClass.concat([cl]): selfClass;
  
  let style = props.style;
  let selfStyle = {flex: props.flex? props.flex: 1}
  selfStyle = style? Object.assign({}, selfStyle, style): selfStyle;
  return (
    <Flex.Item {...props} className={selfClass} style={selfStyle} >{props.children}</Flex.Item>
  );
};

SelfItem.propTypes = {
  flex: PropTypes.number,
  className: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object
  ])
};

export default SelfItem;
