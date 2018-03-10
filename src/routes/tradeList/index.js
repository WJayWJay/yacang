import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Flex, List, Toast, Modal, ListView, Tabs, Badge, WhiteSpace } from 'antd-mobile';

import PropTypes from 'prop-types';

import { deepCopy } from '../../functions';

import Layout from '../../components/layout';
// import Button from '../../components/button';
import Spinner from '../../components/Spinner';

import styles from './index.less';

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

function genData(data) {
  let dataBlob = [];

  dataBlob = deepCopy(data);

  return dataBlob;
}

class Index extends React.Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {
        // console.log(row1, row2, '9999')
        return row1.orderNo !== row2.orderNo;
      },
    });
    const winHeight = window.innerHeight;
    let tabHeight = winHeight -43.5 - 10;

    this.rData = [];

    this.state = {
      dataSource,
      showed: false,
      data: [],
      listHeight: tabHeight + 'px',
      tabHeigh: tabHeight,
      hasMore: true,
      page: 1,
      pageCount: 10
    }  
  }

  
  componentDidMount() {
    const {page, pageCount} = this.state;
    // this.props.dispatch({
    //   type: 'trade/orderList',
    //   payload: {currentPage: page}
    // });
    this.fetchData();
  }

  fetchData = () => {
    const {page, pageCount} = this.state;
    console.log(page)
    const { hasMore, isLoading } = this.props;
    if(!hasMore || isLoading) return;
    this.props.dispatch({
      type: 'trade/orderList',
      payload: {currentPage: page, type: 'DRAWCASH'}
    });
    this.setState({
      page: page+1
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps !== this.props) {
      if(nextProps.orderList.length) {
        // this.rData = genData(nextProps.orderList);
        // console.log('llllogggg', nextProps)
        this.rData = genData(nextProps.orderList);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData),
        });
      }
    }
  }

  toDetail = (obj) => {
    const { dispatch } = this.props;
    
    dispatch(routerRedux.push({
      pathname: `/orderDetail/${obj.orderNo}`
    }));
  }

  row = (rowData, sectionID, rowID) => {
    const obj = rowData;
    if(!obj) {
      return <div>暂无内容</div>
    }
    // console.log(obj)
    // const stat = {
    //   'FAIL': '支付失败',
    //   'UNCONFIRMED': '已受理',
    //   'SUCCESS': '支付成功',
    // };
    const statColors = {
      '支付失败': '#FF4343',
      '已受理': '#3D67F7',
      '支付成功': '#8A8A9D',
    };
    return (
      <div onClick={() => this.toDetail(obj)} key={rowID} style={{ padding: '0 15px' }}>
        {/* <div
          style={{
            lineHeight: '50px',
            color: '#888',
            fontSize: 18,
            borderBottom: '1px solid #F6F6F6',
          }}
        >{obj.title}</div> */}

        <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
          <Flex style={{flex:1, lineHeight: 1, width: '100%' }}>
            <Flex  direction="column" style={{ flex: 1 }} align='start'>
              <Flex style={{ flex: 1, paddingBottom: '10px' }}>
              {obj.payBankName || ''}
              </Flex>
              <Flex style={{ flex: 1 }}>
              {obj.payTime || ''}              
              </Flex>
            </Flex>
            <Flex direction="column" align='end' style={{ flex: 1, width: '100%' }}>
              <Flex justify='end' style={{flex: 1,  paddingBottom: '10px', fontSize: '18px', color: '#FF4343'}}>
              {obj.payMoney}
              </Flex>
              <Flex justify='end' style={{flex: 1, fontSize: '14px', color: statColors[obj.orderStat]}}>
              {obj.orderStat || ''}              
              </Flex>
            </Flex>
          </Flex>
        </div>

      </div>
    );
  };


  renderList = () => {
    const { hasMore, orderList } = this.props;
    const { tabHeigh } = this.state;
    const row = (rowData, sectionID, rowID) => {
      // console.log(rowData, sectionID, rowID, 'ssss')
      return this.row(rowData, sectionID, rowID);
    }
    
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{ 
          // display: 'none',
          backgroundColor: '#F5F5F9',
          // height: 1,
          // borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    return (
      <div className={styles.tab} style={{ height: tabHeigh + 'px' }}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderHeader={() => <span></span>}
          renderFooter={() => (<div style={{ padding: 10, textAlign: 'center' }}>
            {hasMore ? this.props.isLoading ? '加载中...' : '加载完成' : '没有更多了...'}
          </div>)}
          renderBodyComponent={()=> <MyBody />}
          renderRow={row}
          renderSeparator={separator}
          className={styles.amList}
          style={{
            height: this.state.listHeight,
            overflow: 'auto',
            width: '100%',
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={30}
        />
      </div>
    );
  }

  onEndReached = (e) => {
    console.log('to end')
    this.fetchData();
  }


  renderListAnother = () => {
    return <div>暂无内容</div>
  }

  renderSelf = () => {
    const tabs = [
      { title: <Badge text={''}>提现</Badge> },
      { title: <Badge text={''}>还款</Badge> },
    ];
    
    return (<Layout title={'交易记录'}>
      <Spinner loading={this.props.loading} />
      <div className={styles.content}>
        <Tabs tabs={tabs}
          initialPage={0}
          onChange={(tab, index) => { console.log('onChange', index, tab); }}
          onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
            {this.renderList()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
            {this.renderListAnother()}
          </div>
        </Tabs>
    </div>
    </Layout>);
  }

  toLink = (link) => {
    if(link) {
      this.props.dispatch(routerRedux.push({
        pathname: link
      }))
    }
  }
  

  toTabLink = (link) => {
    this.props.history.push(link);
  }

  render() {
    return (<div>
      {this.renderSelf()}
    </div>);
  }
}

Index.propTypes = {
  tradeInfo: PropTypes.object
};


function mapStateToProps( state ) {
  // console.log(state)
  const { isLogin } = state.user
  // console.log(state)
  let list = state.trade.tradeList.orderList;
  
  list = Array.isArray(list) ? list : [];
  return {
    isLogin,
    loading: state.loading.global || false,
    hasMore:  state.trade.tradeList.hasMore,
    isLoading:  state.trade.tradeList.isLoading,
    randomTime:  state.trade.randomTime,
    orderList: list
  }
}
export default connect( mapStateToProps )(Index);
