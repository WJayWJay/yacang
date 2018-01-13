import React from 'react';
import { Button } from 'antd-mobile';
import styles from './button.less';


const myButton = (props) => {
  let cl = props.className
  let selfClass = [styles.button];
  selfClass = Array.isArray( cl )? selfClass.concat(cl): cl? selfClass.concat([cl]): selfClass;
  return (
    <Button {...props} className={selfClass}>{props.children}</Button>
  );
};

myButton.propTypes = {

};

export default myButton;
