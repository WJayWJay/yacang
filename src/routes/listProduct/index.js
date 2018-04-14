import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { WhiteSpace, Tabs, Flex, Menu, Icon, ListView } from 'antd-mobile';
import Layout from '../../components/layout';
import queryString from 'query-string';
import Spinner from '../../components/Spinner';

import styles from './index.less';


const select1 = [
  {
    value: '1',
    label: '倒序',
  }, {
    value: '2',
    label: '顺序',
  },
];

function deepCopy(arr1) {
  var arr = [];
  if(Array.isArray(arr1)) {
    for(var i= 0; i < arr1.length; i++) {
      if(typeof arr1[i] === 'object') {
        arr[i] = deepCopy(arr1[i]);
      } else {
        arr[i] = arr1[i];
      }
    }
    return arr;
  } else if(!arr1) {
    return arr1;
  } else if(Object.prototype.toString.call(arr1) === '[object Object]') {
    arr = {};
    for(var i in arr1) {
      if(arr1.hasOwnProperty(i)) {
        if(typeof arr1[i] === 'object') {
          arr[i] = deepCopy(arr1[i]);
        } else {
          arr[i] = arr1[i];
        }
      }
    }
    return arr;
  } else {
    arr = arr1;
  }
  return arr;
}

const NUM_ROWS = 10;
let pageIndex = 0;
function genData(data) {
  let dataBlob = [];

  dataBlob = deepCopy(data);

  return dataBlob;
}

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}

// eslint-disable-next-line
const testImg = location.protocol + '//' + location.host + '/' + 'logo.png';

class ListProduct extends React.Component {


  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1.productNo !== row2.productNo,
    });
    const winHeight = window.innerHeight;
    let tabHeight = winHeight - 45 -43.5 - 10;

    this.state = {
      dataSource,
      showed: false,
      isShowed: false,
      data: [],
      // listHeight: tabHeight - 38 + 24 + 50 + 'px',
      listHeight: tabHeight + 'px',
      tabHeigh: tabHeight,
      hasMore: true,
      page: 1,
      isInited: false,
      initData: '',
      currentTab: 0,
    }
    this.initCatId = '';
  }

  componentDidMount() {
    const { dispatch, history } = this.props;
    const { page } = this.state;
    this.rData = [];
    dispatch({
      type: 'product/fetchCategory',
      payload: {}
    });

    const location = history.location || this.props.location;
    const search = location && location.search;
    if(search) {
      let searchParams = queryString.parse(search);
      this.initCatId = searchParams && searchParams.cid;
    }
    // dispatch({ type: 'product/fetch', payload: {page: page} });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'product/updateState',
      payload: {currentCat: ''}
    });
    this.isInited = false;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps !== this.props) {
      if(nextProps.list) {
        // this.rData = this.rData.concat(genData(nextProps.list));
        this.rData = genData(nextProps.list);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData),
          isLoading: false,
          hasMore: !!nextProps.hasMore
        });
      }

      if(Array.isArray(nextProps.category) && nextProps.category.length> 0 && !this.isInited) {
        let tab = nextProps.category[0];
        this.setState({
          isInited: true,
          currentTab: 0
        });
        this.isInited = true;
        this.fetchData(this.initCatId || tab.categoryNo);
      }
    }
  }
  fetchData = (cid) => {
    const { hasMore, currentCat } = this.props;
    const isSameCat = cid === currentCat;
    if(!cid || (isSameCat && hasMore === false)) return;
    this.props.dispatch({ type: 'product/fetch', payload: {page: this.state.page, categoryNo: cid } });
  }
  toDetail = (obj) => {
    this.props.history.push(`/goodsDetail/${obj.productNo}`);
  }

  row = (rowData, sectionID, rowID) => {
    const obj = rowData;
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
          <img className={styles.productImg} style={{ height: '108px',width: '108px', marginRight: '15px' }} src={obj.imageUrl || testImg} alt={obj.productName} />
          {/* <div className={styles.productImg}></div> */}
          <Flex direction="column" style={{flex:1, lineHeight: 1, width: '100%' }}>
            {/* <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
            <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span>¥</div> */}
            <Flex style={{ flex: 1, width: '100%' }} align={'flex-start'}>
              <h4 style={{color: '#57493F'}}>{obj.productName}</h4>
            </Flex>
            <Flex style={{ flex: 1, width: '100%' }}>
              <Flex justify='start' style={{flex: 1}}>
              {obj.stat === 'S0N' ? <span style={{color: 'red'}}>非卖品</span>: obj.salePrice || ''}
              </Flex>
              <Flex justify='end' style={{flex: 2}}>{obj.address || ''}</Flex>
            </Flex>
            <Flex justify='end' style={{ flex: 1, width: '100%' }}>
              <Flex justify='start' style={{flex: 2}}>发布时间:{obj.pullOnDate || ''}</Flex>
              <Flex justify='end' style={{flex: 1}}>人气数:{obj.viewTimes || 0}</Flex>
            </Flex>
          </Flex>
        </div>

      </div>
    );
  };

  renderContent = tab => {
    const { tabHeigh } = this.state;
    const { hasMore } = this.props;
    const row = (rowData, sectionID, rowID) => {
      return this.row(rowData, sectionID, rowID);
    }
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
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
            {hasMore ? this.state.isLoading ? '加载中...' : '加载完成' : '没有更多了...'}
          </div>)}
          renderBodyComponent={() => <MyBody />}
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

  tabChange = (tab, index) => {
    // dispatch({ type: 'product/fetch', payload: {page: currentPage, categoryNo: tab.id } });
    console.log('tttttt', tab)
    
    
    // this.setState({isShowed: false, currentTab: index});
    // this.fetchData(tab.id);
  }


  onTabClick = (model, index) => {
    const { category, currentCat } = this.props;

    // console.log(model, 'mmmm')
    this.fetchData(model && model.id);
    // let childrenTab = [];
    // if(category && category.length) {
    //   category.forEach(item => {
    //     if(model.id === item.categoryNo) {
    //       childrenTab = item.children || [];
    //       return;
    //     }
    //   })
    // }
    // if(childrenTab.length) {
    //   childrenTab = childrenTab.map(item => {
    //     return {
    //       label: item.categoryName,
    //       value: item.categoryNo
    //     }
    //   })
    //   this.setState({initData: childrenTab, selectedValue: currentCat});
    // }
    
    // if(this.tabsRef && index === this.tabsRef.props.initialPage) {
    //   this.showOrHide();
    // }
  }

  showOrHide = () => {
    this.setState({isShowed: !this.state.isShowed});
  }

  onEndReached = (event) => {
    this.fetchData(this.props.currentCat);
  }

  onSelectClick = (item) => {
    const { showed } = this.state;
    if(showed === item.id) {
      this.setState({
        showed: false
      });
    } else {
      this.setState({
        showed: item.id
      });
    }

  }

  renderSelect(item) {
    const menuEl = (
      <Menu
        className="single-foo-menu"
        data={select1}
        value={['1']}
        level={1}
        onChange={this.onChange}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    return menuEl;
  }

  onSelectChange = (item) => {
    // console.log(item, 'iiii');
    const cid = Array.isArray(item) ? item[0]: item;
    this.setState({selectedValue: cid})
    this.fetchData(cid);
    this.showOrHide();
  }

  render() {
    const {  isShowed } = this.state;
    const { category } = this.props;

    let tabs = [
    ];
    
    let initIndex = 0;
    let title = '商品列表';
    let myInitIndex = 0;
    if(category.length > 0) {
      let currentCat = this.props.currentCat;
      category.forEach((item, index) => {
        // tabs.push({
        //   id: item.categoryNo,
        //   title: item.categoryName
        // });
        
        if( currentCat && currentCat === item.categoryNo) {
          initIndex = index;
        } else if(item.children && Array.isArray(item.children)) {
          item.children.forEach((i, iindex) => {
            if(currentCat && i.categoryNo === currentCat) {
              initIndex = index;
            }
          })
        }
      });
      console.log(category, initIndex)
      tabs = category[initIndex].children.map((item, i) => {
        if(item.categoryNo === currentCat) {
          myInitIndex = i;
        }
        return {
          id: item.categoryNo,
          title: item.categoryName
        }
      });
      title = category[initIndex].categoryName;
    }
    // let isWechat = /micromessenger/i.test(window.navigator.userAgent.toLowerCase());
    // const menuEl = (<div style={{position: 'fixed', zIndex: '100', top: isWechat ? '44px':'89px', width: '100%'}}>
    //   <Menu
    //     className="single-foo-menu"
    //     data={this.state.initData}
    //     value={[this.state.selectedValue]}
    //     level={1}
    //     onChange={this.onSelectChange}
    //     height={document.documentElement.clientHeight * 0.6}
    //   />
    // </div>);
    
    return (
      <Layout title={title || '商品列表'}>
        <Spinner loading={this.props.loading} />
        <div className={styles.normal}>
          <div className={styles.content}>
            {/* {isShowed && this.state.initData ? menuEl: null} */}
            {/* <div className={styles.selectContainer}>
              <Flex className={styles.flexListSelect}>
                {selectLists.map((item) => (
                  <Flex justify="center" onClick={this.onSelectClick.bind(this, item)} key={item.id} className={styles.flexList}>
                    {item.title}{ showed === item.id? <Icon type='up' />:<Icon type='down' /> }
                  </Flex>
                ))}
              </Flex>
              { showed ? this.renderSelect(showed): null}
            </div> */}
            {tabs.length && this.props.currentCat ? <Tabs
              ref={i => this.tabsRef = i}
              swipeable={false}
              initialPage={myInitIndex}
              onTabClick={this.onTabClick}
              onChange={this.tabChange}
              tabs={tabs}>
              {this.renderContent}
            </Tabs>: null}

            {/* <div className={styles.listView}>
              {this.renderContent()}
            </div> */}
            <WhiteSpace />
          </div>
        </div>
      </Layout>
    );
  }
}

ListProduct.propTypes = {
  category: PropTypes.array
};

function mapStateToProps(state) {
  // console.log(state)
  const { list,hasMore,category,currentCat } = state.product;
  // console.log(list, currentCat, hasMore)
  let lists = list || [];
  return {
    list: lists,
    category, 
    currentCat, 
    loading: state.loading.global || false, 
    hasMore: hasMore
  }
}

export default connect(mapStateToProps)(ListProduct);
