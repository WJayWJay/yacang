import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { WhiteSpace, WingBlank, Tabs, Flex, Menu, Icon, ListView } from 'antd-mobile';
import Layout from '../../components/layout'

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

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Meet hotel',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'McDonald\'s invites you',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Eat the week',
    des: '不是所有的兼职汪都需要风吹日晒',
  },
];

const testImg = 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png';

class ListProduct extends React.Component {


  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    const winHeight = window.innerHeight;
    let tabHeight = winHeight - 45 -43.5 -10;
    this.state = {
      dataSource,
      showed: false,
      data: [],
      listHeight: tabHeight - 38 + 24 + 'px',
      tabHeigh: tabHeight,
      hasMore: true,
      page: 1
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    this.rData = [];
    
    dispatch({
      type: 'product/fetchCategory',
      payload: {}
    });
    // dispatch({ type: 'product/fetch', payload: {page: page} });
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
      if(nextProps.category && Array.isArray(nextProps.category) && nextProps.category> 0 && !nextProps.currentCat) {
        let tab = nextProps.category[0];
        this.props.dispatch({ type: 'product/fetch', payload: {page: this.state.page, categoryNo: tab.id } });
      }
    }
  }

  toDetail = (obj) => {
    this.props.history.push(`/goodsDetail/${obj.productNo}`);
  }

  row = (rowData, sectionID, rowID) => {
    // console.log( '****' ,rowData, '****')
    // console.log(sectionID, rowID, 'tttttttt');

    // console.log(rowData)
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
            <Flex style={{ flex: 1 }}>
              {obj.productName}
            </Flex>
            <Flex style={{ flex: 1, width: '100%' }}>
            <img style={{ height: '22px', width: '22px', marginRight: '4px' }} src={obj.imageUrl || testImg} alt="" /> {'大大的大'}
            </Flex>
            <Flex justify='end' style={{ flex: 1, width: '100%' }}>
              <Flex justify='start' style={{flex: 1}}>¥{obj.salePrice}</Flex>
              <Flex justify='end' style={{flex: 1}}>厦门</Flex>
            </Flex>
          </Flex>
        </div>
        
      </div>
    );
  };

  renderContent = tab => {
    const { hasMore, tabHeigh } = this.state;
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
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {hasMore ? this.state.isLoading ? '加载中...' : '加载完成' : '没有更多了...'}
          </div>)}
          renderBodyComponent={() => <MyBody />}
          renderRow={row}
          renderSeparator={separator}
          className="am-list"
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
    const { dispatch } = this.props;
    const { page } = this.state;
    console.log(tab, index)

    let currentPage = 1;
    dispatch({ type: 'product/fetch', payload: {page: currentPage, categoryNo: tab.id } });
    this.setState({
      page: 1,
    })
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (!this.state.hasMore) {
      return;
    }
    console.log('reach end', event);

    // this.setState({ isLoading: true });
    // this.rData = this.rData.concat(genData(data));
    // setTimeout(() => {
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(this.rData),
    //     isLoading: false,
    //   });
    // }, 1000);
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

  render() {
    const { showed } = this.state;
    const { category } = this.props;

    let tabs = [
    ];
    if(category.length > 0) {
      category.forEach(item => {
        tabs.push({
          id: item.categoryNo,
          title: item.categoryName
        })
      })
    }

    const selectLists = [
      {title: '排序', id: 'sort'},
      {title: '分类', id: 'classes'},
      {title: '区域', id: 'area'},
      {title: '筛选', id: 'diff'},
    ];

    return (
      <Layout title={'商品列表'}>
        <div className={styles.normal}>
          <div className={styles.content}>
            <div className={styles.selectContainer}>
              <Flex className={styles.flexListSelect}>
                {selectLists.map((item) => (
                  <Flex justify="center" onClick={this.onSelectClick.bind(this, item)} key={item.id} className={styles.flexList}>
                    {item.title}{ showed === item.id? <Icon type='up' />:<Icon type='down' /> }
                  </Flex>
                ))}
              </Flex>
              { showed ? this.renderSelect(showed): null}
            </div>
            <Tabs 
              onChange={this.tabChange}
              tabs={tabs}>
              {this.renderContent}
            </Tabs>

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
  console.log(category)
  return {
    list,hasMore,category, currentCat
  }
}

export default connect(mapStateToProps)(ListProduct);
