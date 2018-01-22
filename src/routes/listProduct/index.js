import React from 'react';
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

const NUM_ROWS = 20;

function genData(list) {
  const dataBlob = [];
  dataBlob[0] = list;
  // for (let i = 0; i < NUM_ROWS; i++) {
  //   const ii = (pIndex * NUM_ROWS) + i;
  //   dataBlob[`${ii}`] = `row - ${ii}`;
  // }
  return dataBlob;
}

class ListProduct extends React.Component {


  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      showed: false,
      data: [],
    }
  }

  componentDidMount() {
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
    this.rData = genData(data);
    console.log(this.rData)
    this.setState({
      data: this.state.dataSource.cloneWithRows( this.rData )
    });
  }

  row = (rowData, sectionID, rowID) => {
    console.log(rowData, sectionID, rowID, 'tttttttt');
    return <div>{rowData + sectionID + rowID}</div>;
    // let index = data.length - 1;
    // if (index < 0) {
    //   index = data.length - 1;
    // }
    // const obj = data[index--];
    // return (
    //   <div key={rowID} style={{ padding: '0 15px' }}>
    //     <div
    //       style={{
    //         lineHeight: '50px',
    //         color: '#888',
    //         fontSize: 18,
    //         borderBottom: '1px solid #F6F6F6',
    //       }}
    //     >{obj.title}</div>
    //     <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
    //       <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
    //       <div style={{ lineHeight: 1 }}>
    //         <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.des}</div>
    //         <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>{rowID}</span>¥</div>
    //       </div>
    //     </div>
    //   </div>
    // );
  };

  renderContent1 = tab => {
    return (
      <div className={styles.tab}>
          jjj
      </div>
    )
  }
  renderContent = tab => {

    const row = (rowData, sectionID, rowID) => {
      console.log(rowData, 'dddddd')
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
      <div className={styles.tab}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderHeader={() => <span>header</span>}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? 'Loading...' : 'Loaded'}
          </div>)}
          renderRow={row}
          renderSeparator={separator}
          className="am-list"
          pageSize={4}
          useBodyScrolÁl
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>
    );
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    // if (this.state.isLoading && !this.state.hasMore) {
    //   return;
    // }
    console.log('reach end', event);
    // this.setState({ isLoading: true });
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
    
    const tabs = [
      { title: '金永恒' },
      { title: '明秦' },
      { title: '邮币卡' },
      { title: '珍龙御石' },
      { title: '纪念币' },
    ];

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
            <Tabs tabs={tabs}>
              {this.renderContent1}
            </Tabs>
            
            <Flex>
            {this.renderContent()}
            </Flex>
            <WhiteSpace />
          </div>
        </div>
      </Layout>
    );
  }
}

ListProduct.propTypes = {
};

function mapStateToProps(state) {
  console.log(state)
  const { list } = state.product;
  return {
    list
  }
}

export default connect(mapStateToProps)(ListProduct);
