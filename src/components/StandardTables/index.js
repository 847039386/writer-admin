import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';


class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
  }

  componentWillReceiveProps(nextProps) {

  }


  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };


  render() {
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      size,
      bordered,
      expandedRowRender,
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <Fragment>
                当前第<a style={{ fontWeight: 600 }}>&nbsp;{ paginationProps.current }&nbsp;</a>页 ,共<a style={{ fontWeight: 600 }}>&nbsp;{ paginationProps.total }&nbsp;</a>条数据&nbsp;&nbsp;
              </Fragment>
            }
            type="info"
            showIcon
          />
        </div>
        <Table
          size={size}
          loading={loading}
          rowKey={rowKey || 'key'}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          expandedRowRender={expandedRowRender}
          bordered={bordered}
        />
      </div>
    );
  }
}

export default StandardTable;
