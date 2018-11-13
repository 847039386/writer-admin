import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, List, Avatar } from 'antd';

import { Pie ,yuan ,Bar ,MiniArea  } from 'components/Charts';
import EditableLinkGroup from 'components/EditableLinkGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NumberInfo from 'components/NumberInfo';

import styles from './Workplace.less';


const Yuan = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{ __html: yuan(children) }} /* eslint-disable-line react/no-danger */
  />
);

const links = [
  {
    title: '剧本管理',
    href: '/list/drama',
  },
  {
    title: '用户管理',
    href: '/list/author',
  },
  {
    title: '剧本类型管理',
    href: '/list/book',
  },
  {
    title: '剧情类型管理',
    href: '/list/category',
  },
];

@connect(({  user ,chart ,loading }) => ({
  currentAdmin :user.currentAdmin,
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Workplace extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    
  }

  render() {
    const { currentAdmin ,chart :{ api_chart } ,loading  } = this.props;

    let BookCount = [];
    let categoryCount = [];
    let ctDramaCount = [] ;
    let totalCount = 0;
    let yesterdayCount = 0;
    let totalUv = 0;

    if(!loading && api_chart){
      BookCount = api_chart.BookCount || [];
      categoryCount = api_chart.categoryCount || [];
      ctDramaCount = api_chart.ctDramaCount || [] ;
      totalCount = api_chart.count || 0;
      yesterdayCount = api_chart.yesterdayCount || 0;
      totalUv = api_chart.totalUv || 0;
    }


    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src={ currentAdmin.avatar }
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>早安，{ currentAdmin.name }，祝你开心每一天！</div>
          <div>今天也要元气满满的呦！</div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>昨日新增剧本</p>
          <p>{ yesterdayCount }</p>
        </div>
        <div className={styles.statItem}>
          <p>剧本总UV</p>
          <p>{ totalUv }</p>
        </div>
        <div className={styles.statItem}>
          <p>总剧本</p>
          <p>{ totalCount }</p>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout loading={loading} content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="剧本类型占比"
              loading={ loading }
              style={{ marginBottom: 24 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
              className={styles.salesCard}
              bodyStyle={{ padding: 24 }}
            >
              <Pie
                hasLegend
                subTitle="总剧本"
                total={() => <Yuan>{BookCount.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
                data={BookCount}
                valueFormat={value => <Yuan>{value}</Yuan>}
                height={248}
                lineWidth={1}
              />
            </Card>
          </Col>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={ loading }
              title="剧本创建量"
              style={{ marginBottom: 24 }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
              className={styles.salesCard}
              bodyStyle={{ padding: 24 }}
            >
              <Bar
                height={248}
                title="最近30天"
                data={ctDramaCount}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
              <Card
                loading={ loading }
                title="剧情类型占比"
                style={{ marginBottom: 24 }}
                bordered={false}
                bodyStyle={{ padding: 0 }}
                className={styles.salesCard}
                bodyStyle={{ padding: 24 }}
              >
              {
                categoryCount.map((data) => {
                  return(
                    <Col xl={4} lg={6} md={8} sm={8} xs={24} key={data.id}>
                      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
                        <Col span={12}>
                          <NumberInfo
                            subTitle={data.x}
                            gap={2}
                            total={`${data.y}`}
                          />
                        </Col>
                        <Col span={12}>
                          <Pie percent={data.y/totalCount*100} total={`${Math.round(data.y/totalCount*100)}%`} height={64} />
                        </Col>
                      </Row>
                    </Col>
                  )
                })
              }
            </Card>
        </Row>
      </PageHeaderLayout>
    );
  }
}
