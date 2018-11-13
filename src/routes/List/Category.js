import React, { Component ,Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from 'components/StandardTables';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import {
  Dropdown,
  Icon,
  Avatar,
  Card,
  Row,
  Col,
  Input,
  Button,
  Table,
  Tag,
  Modal,
  Divider,
  Form,
  Popconfirm,
  notification 
} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();


const UpdateForm = Form.create()(props => {
  const { modalVisible ,form ,loading ,handleOK ,currentName ,handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleOK(fieldsValue);
    });
  };
  return (
    <Modal
      centered
      title="修改剧情类型"
      visible={modalVisible}
      confirmLoading={loading}
      onOk={okHandle}
      onCancel={() => handleModalVisible() }
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前" style={{ marginBottom : 0 }}>
          { currentName }
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '值不能为空!' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

const CreateForm = Form.create()(props => {
  const { modalVisible ,form ,loading ,handleOK ,handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(!loading){
        handleOK(fieldsValue);
      }
    });
  };
  return (
    <Modal
      centered
      title="新增剧情类型"
      visible={modalVisible}
      confirmLoading={loading}
      onOk={okHandle}
      onCancel={() => handleModalVisible() }
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '值不能为空!' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});





@Form.create()
@connect(({ user , category , loading }) => ({
  currentAdmin :user.currentAdmin,
  category,
  loading: loading.models.category,
}))

export default class SearchList extends Component {
  
  state = {
    dataSource: { list : [] ,pagination:{ current : 1 ,size:10,total:0 } },
    status : null,
    up_visible :false,
    currentUpdateID : null,
    currentName :null,
    ct_visible :false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    const { status } = this.state;
    const { category : { data } } = nextProps;
    const { list } = data;
    let newList = list;
    if(status == 'delete'){
      this.setState({status : null});
      const { category : { e_data } } = nextProps;
      if(e_data.success){
        notification['success']({
          message: '删除成功',
          description: <span>删除<span style={{color:'#FF5722',fontWeight:'bold'}}>{e_data.data.name}</span><span style={{color:'#52c41a',fontWeight:'bold'}}>成功</span></span>,
        });
        newList = this.redata(newList,nextProps.category.e_data);
      }else{
        notification['error']({
          message: '删除失败',
          description: <span>原因可能是：<span style={{color:'#FF5722'}}>{e_data.msg}</span></span>,
        });
      }
    }else if(status == 'update'){
      this.setState({status : null });
      const { category : { e_data } } = nextProps;
      if(e_data.success){
        notification['success']({
          message: '修改成功',
          description: <span>修改<span style={{color:'#FF5722',fontWeight:'bold'}}>{e_data.data.name}</span><span style={{color:'#52c41a',fontWeight:'bold'}}>成功</span></span>,
        });
        newList = this.updata(newList,nextProps.category.e_data);
        this.setState({up_visible : false ,currentUpdateID: null ,currentName :null });
      }else{
        notification['error']({
          message: '修改失败',
          description: <span>原因可能是：<span style={{color:'#FF5722'}}>{e_data.msg}</span></span>,
        });
      }
    }else if(status == 'create'){
      this.setState({status : null });
      const { category : { e_data } } = nextProps;
      if(e_data.success){
        notification['success']({
          message: '创建成功',
          description: <span>创建<span style={{color:'#FF5722',fontWeight:'bold'}}>{e_data.data.name}</span><span style={{color:'#52c41a',fontWeight:'bold'}}>成功</span></span>,
        });
        newList = this.ctdata(newList,nextProps.category.e_data);
        this.setState({ct_visible : false ,currentUpdateID: null ,currentName :null });
      }else{
        notification['error']({
          message: '创建失败',
          description: <span>原因可能是：<span style={{color:'#FF5722'}}>{e_data.msg}</span></span>,
        });
      }
    }

    const newDataSource = Object.assign(data,{ list :newList });
    this.setState({ dataSource :newDataSource });

  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {

    const { dispatch } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'category/fetch',
      payload: params,
    });
    
  };



  updata = (array,data) => {
    return array.map((item) => {
      return item._id == data.data._id ?  data.data :item        
    })
  }

  redata = (array,data) => {
    return array.filter(item => {
      return item._id != data.data._id;
    });
  }

  ctdata = (array,data) => {
    array.unshift(data.data)
    return array
  }


  handleDelete = (record) => {
    const { dispatch ,currentAdmin } = this.props;
    this.setState({ status : 'delete' });
    dispatch({
      type: 'category/delete',
      payload: { 
        body : {
          id : record._id
        },
        headers :{ 
          authorization : currentAdmin.jwt_token,
          aud : currentAdmin._id
        }
      }
    });
  }

  onEditor = (record) => {
    this.setState({ up_visible :true , currentUpdateID :record._id ,currentName :record.name })
  }

  
  updateHandleCancel = flag => {
    this.setState({ up_visible :!!flag })
  }

  createHandleCancel = flag => {
    this.setState({ ct_visible :!!flag })
  }

  handleUpdate = (fieldsValue) => {
    const { dispatch ,currentAdmin } = this.props;
    const { currentUpdateID } = this.state;
    this.setState({ status : 'update' });
    dispatch({
      type: 'category/update',
      payload: { 
        body : {
          id : currentUpdateID,
          name :fieldsValue.name
        },
        headers :{ 
          authorization : currentAdmin.jwt_token,
          aud : currentAdmin._id
        }
      }
    });
  }

  handleCreate = (fieldsValue) => {
    const { dispatch ,currentAdmin } = this.props;
    this.setState({ status : 'create' });
    dispatch({
      type: 'category/create',
      payload: { 
        body : {
          name :fieldsValue.name
        },
        headers :{ 
          authorization : currentAdmin.jwt_token,
          aud : currentAdmin._id
        }
      }
    });
  }


  render() {

    let columns = [
        {
            title: '剧情类型',
            dataIndex: 'name',
            editable: true
        },
        {
            title: '创建时间',
            dataIndex: 'create_at',
            render: (createAt) => (<span>{ moment(createAt).format('LL')  }</span>)
        },
        {
            title: '操作',
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => { this.onEditor(record) }}>修改</a>
                    <Divider type="vertical" />
                    <Popconfirm title="是否删除该标签?" onConfirm={() => this.handleDelete(record) } okText="是" cancelText="否">
                      <a>删除</a>
                    </Popconfirm>
                </Fragment>
            ),
        },
    ];

    const {
      loading,
      form
    } = this.props;

    const { dataSource ,up_visible ,ct_visible } = this.state;
    const { getFieldDecorator } = form;

    const updateParentMethods = {
      handleOK: this.handleUpdate,
      handleModalVisible: this.updateHandleCancel,
      loading,
      currentName :this.state.currentName,
      modalVisible :up_visible
    };

    const createParentMethods = {
      handleOK: this.handleCreate,
      handleModalVisible: this.createHandleCancel,
      loading,
      modalVisible :ct_visible
    };

    return (
      <PageHeaderLayout title="剧情类型">
        <Card bordered={false}>
          <Button style={{ marginBottom :16 }} icon="plus" type="primary" onClick={() => this.createHandleCancel(true)}> 新建 </Button>
          <div className={styles.tableList}>
            <StandardTable
              size="middle"
              rowKey={'_id'}
              loading={loading}
              data={dataSource}
              columns={columns}
              onChange={this.handleStandardTableChange}
              bordered
            />
          </div>
        </Card>
        <UpdateForm {...updateParentMethods} />
        <CreateForm {...createParentMethods} />
      </PageHeaderLayout>
    );
  }
}
