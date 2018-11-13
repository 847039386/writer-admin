import React, { Component } from 'react';
import { connect } from 'dva';
import StandardTable from 'components/StandardTables';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import moment from 'moment';
import {
  Menu,
  Dropdown,
  Icon,
  Avatar,
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  Tag,
  Drawer,
  message,
  Modal,
  notification,
  Badge,
  Timeline
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;

const LmtLoginForm = Form.create()(props => {
  const { modalVisible ,form ,loading ,handleOK ,handleModalVisible ,data } = props;
  if(data._id){
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        if(!loading){
          handleOK(fieldsValue,data);
        }
      });
    };
    return (
      <Modal
        centered
        title="管理状态"
        visible={modalVisible}
        confirmLoading={loading}
        onOk={okHandle}
        onCancel={() => handleModalVisible() }
        destroyOnClose
      >
        <Row style={{ padding:"10px 30px" }}>
          <Col md={6} sm={24}>
            <Avatar shape="square" size={64} src={data.avatar} />
          </Col>
          <Col md={18} sm={24}>
            <p>用户编号：{ data._id }</p>
            <p>用户昵称：{ data.name }</p>
          </Col>
      </Row>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="管理状态：">
          {form.getFieldDecorator('status', {
            rules: [
              { required: true, message: '值不能为空!' },
              { validator :(rule, value, callback) => {
                const { getFieldValue } = form
                if(getFieldValue('status') == data.status){
                  callback('当前管理状态与数据库中相同，不能修改')
                }
                callback()
              }}
          ],
            initialValue :data.status
          })(
            <Select style={{ width : '100%' }} >
              <Option value={0} disabled={data.status === 0}>允许登陆</Option>
              <Option value={1} disabled={data.status === 1}>限制登陆</Option>
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="备注日志：">
          {form.getFieldDecorator('logContent', {
            rules: [{ required: true, message: '值不能为空!' }],
          })(<TextArea placeholder="日志信息方便查询操作内容。" autosize={{ minRows: 1, maxRows: 6 }} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="发送信息：" >
          {form.getFieldDecorator('message', {
          })(<TextArea placeholder="如需要给用户发送信息，请输入，否则留空即可。" autosize={{ minRows: 1, maxRows: 6 }} />)}
        </FormItem>
        
      </Modal>
    );
  }else{
    return (<span></span>)
  }
});

const SendMessage = Form.create()(props => {
  const { modalVisible ,form ,loading ,handleOK ,handleModalVisible ,data } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(!loading){
        handleOK(fieldsValue,data);
      }
    });
  };
  return (
    <Modal
      centered
      title="发送消息"
      visible={modalVisible}
      confirmLoading={loading}
      onOk={okHandle}
      onCancel={() => handleModalVisible() }
      destroyOnClose
    >
      <Row style={{ padding:"10px 30px" }}>
          <Col md={6} sm={24}>
            <Avatar shape="square" size={64} src={data.avatar} />
          </Col>
          <Col md={18} sm={24}>
            <p>用户编号：{ data._id }</p>
            <p>用户昵称：{ data.name }</p>
          </Col>
      </Row>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} label="消息内容">
        {form.getFieldDecorator('content', {
          rules: [{ required: true, message: '值不能为空!' }],
        })(<TextArea autosize={{ minRows: 1, maxRows: 6 }} placeholder="请输入消息" />)}
      </FormItem>
    </Modal>
  );
});


const ConstraintLogin = Form.create()(props => {
  const { form ,loading ,handleOK ,handleCancel ,details } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleOK(fieldsValue,details);
    });
  };
  return (
    <div style={{ minWidth :96,marginLeft: -8,borderRadius:4,boxShadow:'0 2px 8px rgba(0, 0, 0, 0.15)' }}>
        <div style={{ padding:'4px 0' }}>
          {form.getFieldDecorator('status',{
            initialValue :details.status
          })(
            <Radio.Group size='small' >
                <Radio style={{ padding:'5px 12px' }} value={0}>可登录</Radio><br/>
                <Radio style={{ padding:'5px 12px' }} value={1}>限制登陆</Radio>
            </Radio.Group>
          )}
        </div>
        <div style={{ padding: '7px 8px',border :'1px solid #e8e8e8' ,overflow:'hidden' ,background:'#f6f6f6' }}>
          <a onClick={okHandle} style={{ float: 'left' ,color: '#1890ff' }} >确定</a>
          <a onClick={() => { handleCancel() }} style={{ float: 'right' ,color: '#1890ff' }} >取消</a>
        </div>
    </div>
  );
});



@connect(({ author , message ,user , loading ,log }) => ({
  currentAdmin :user.currentAdmin,
  author,
  message,
  log,
  loading: loading.effects['author/fetch'],
  authorLoading :loading.effects['author/details'],
  msgLoading :loading.models.message,
  logloading :loading.models.log
}))

@Form.create()
export default class SearchList extends Component {
  
  state = {
    drawerVisible :false,                 // 用户drawer控制
    expandForm: false,                    // 控制查询展开
    messageVisible :false,    //发消息model控制

    status : null,            // 当前状态
    formValues :{},           // 查询用户表单

    lmtModalVisible :false,   // 限制登陆model控制
    currentAuthor : {},        // 当前操作的用户

    logDrawerVisible :false    // 日志Drawer显示
  };

  componentWillReceiveProps(nextProps){
    const { message : { e_data } ,msgLoading ,loading } = nextProps; 
    const { status } = this.state;
    if( status == 'sendMessage' ){
      this.setState({ status : null })
      if(e_data.success){
        this.setState({ messageVisible :false ,currentAuthor:{} })
        notification['success']({
          message: '发送信件成功',
        });
      }else{
        notification['error']({
          message: '发送信件失败',
        });
      }
    }else if(status == 'constraintLogin'){
      this.setState({ status : null ,constraintVisible :false ,currentAuthor:{} })
    }
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'author/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      size: pagination.pageSize,
    };

    dispatch({
      type: 'author/fetch',
      payload: params,
    });
  };

  messageHandleCancel = flag => {
    this.setState({ messageVisible :!!flag })
  }


  handleLmtCancel = flag => {
    this.setState({ lmtModalVisible :!!flag })
  }
  handleLmtLogin = (formValues,data) =>{
    const { dispatch , currentAdmin } = this.props;
    if(data._id && currentAdmin._id){
      this.setState({ status : 'constraintLogin' })
      dispatch({
        type: 'author/constraintLogin',
        payload: { 
          body : {
            id : data._id ,
            status :formValues.status,
            logContent :formValues.logContent,
            message :formValues.message
          },
          headers :{ 
            authorization : currentAdmin.jwt_token,
            aud : currentAdmin._id
          }
        },
      });
    }else{
      notification['error']({
        message: '操作失败',
        description: <span>原因可能是：未知操作</span>,
      });
    }
  }


  handleSendMessage = ( fieldsValue ,data) => {
    this.setState({ status : 'sendMessage' });
    const { dispatch ,currentAdmin } = this.props;
    const { currentAuthor } = this.state;
    const { content } = fieldsValue;
    dispatch({
      type: 'message/create',
      payload: { 
        body : {
          uid : data._id ,
          content :content,
        },
        headers :{ 
          authorization : currentAdmin.jwt_token,
          aud : currentAdmin._id
        }
      },
    });
  }

  onDrawerClose = () =>{
    this.setState({ drawerVisible: false });
  }

  showDrawer = (record) => {
    const { dispatch } = this.props;
    this.setState({
        drawerVisible: true,
        currentAuthor : record._id
    });
    dispatch({
      type: 'author/details',
      payload :{ id : record._id }
    });
  };


  renderAdvancedForm() {
    const { book ,category , form ,loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户编号">
              {getFieldDecorator('uid')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户昵称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="管理状态">
              {getFieldDecorator('status',{
                initialValue :'all'
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key={`STATUSALL`} value={'all'}>全部</Option>
                  <Option key={`0`} value={0}>允许登陆</Option>
                  <Option key={`1`} value={1}>禁止登陆</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
            <Button loading={loading} style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'author/fetch',
    });
  };
  
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      if(!isNaN(values.status) || values.uid || values.name){
        dispatch({
          type: 'author/search',
          payload: values,
        });
      }else{
        dispatch({
          type: 'author/fetch',
          payload: values,
        });
      }
    });
  };


  renderUserInfo = () => {
    const { drawerVisible ,constraintVisible } = this.state;
    let hide;
    const {
      author :{ details },
      authorLoading,
      logloading
    } = this.props;
    if(!authorLoading && details._id){
      return (
        <Drawer
        title={<span><Avatar style={{ backgroundColor: '#87d068' }} src={details.avatar ? details.avatar : ''} shape="square" icon="user" />&nbsp;&nbsp;{ details.name ? details.name : '' }</span>}
        width={720}
        closable={false}
        onClose={this.onDrawerClose}
        visible={this.state.drawerVisible}
        destroyOnClose
      > 
        <div>
          <p style={{ color: '#8590a6' }}>用户ID：{details._id}</p>
          <p style={{ color: '#8590a6' }}>用户签名：{details.presentation}</p>
          <p style={{ color: '#8590a6' }}>限制状态：{
            details.status == 0 ? <span style={{ color:'#52c41a' ,fontWeight :'bold' }}><Badge status="success" />可登陆</span>: <span style={{ color:'#f5222d' ,fontWeight :'bold' }}><Badge status="error" />限制登陆</span>
          }</p>
        </div>
        <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button loading={logloading} style={{ marginRight: 8 }} onClick={() => { 
              this.handleLogOk(details._id)
             }} type="primary"><Icon type="file" theme="outlined" />&nbsp;日志</Button>
            <Button style={{ marginRight: 8 }} onClick={() => { 
              this.setState({ currentAuthor : details})
              this.handleLmtCancel(true)
             }} type="primary"><Icon type="key" theme="outlined" />&nbsp;状态管理</Button>
            <Button onClick={() => { 
              this.setState({ currentAuthor : details})
              this.messageHandleCancel(true) 
             }} type="primary"><Icon type="wechat" />&nbsp;发消息</Button>
          </div>
          {this.logDrawerRender()}
      </Drawer>
      )
    }else{
      return (<span></span>)
    }
  }

  logDrawerRender = () => {
    const { log : { data } ,logloading } = this.props;
    const { logDrawerVisible } = this.state;
    if(data && data.success && !logloading){
      return (
        <Drawer 
          title="日志"
          width={520}
          closable={false}
          visible={logDrawerVisible}
          onClose={()=>{this.setState({logDrawerVisible:false})}}
          destroyOnClose
        >
          <Timeline >
            {data.data.log.map((element ,index) => {
              return (
              <Timeline.Item
               dot={<Avatar icon="user" style={{ backgroundColor: '#87d068' }} src={element.adminid ? element.adminid.avatar : ''} />}
               key={`Logkey${index}`}
              >
                <div style={{ padding :'0 10px' ,color :'#8590a6'}}>
                  <p>管理员：{element.adminid ? element.adminid.name : '未知'}</p>
                  <p>提交时间：{moment(element.create_at).format('LL')}</p>
                  <p>备注：{element.content}</p>
                </div>
              </Timeline.Item>)
            })}
            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>日志创建于：{moment(data.data.create_at).format('LL')}</Timeline.Item>
          </Timeline>
           
        </Drawer>
      )
    }else{
      return (<span></span>)
    }
  }

  handleLogOk = (opid) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'log/fetch',
      payload: { opid ,type :'user' },
    });
    this.setState({ logDrawerVisible :true ,status :'logshow' })
  }


  render() {
    const {
      author: { data },
      loading,
      authorLoading,
      msgLoading
    } = this.props;

    const menu = (
      <Menu>
        <Menu.Item>
          <a><Icon type="delete" />&nbsp;删除</a>
        </Menu.Item>
      </Menu>
    );

    const columns = [
        {
            title: '作者',
            dataIndex: 'name',
            render: (author, record) => (<span><Avatar style={{ backgroundColor: '#87d068' }} src={record.avatar} shape="square" icon="user" />&nbsp;&nbsp;{ author }</span>)
        },
        {
          title: '限制状态',
          dataIndex: 'status',
          render: (author, record) => {
            if(record.status == 0){
              return <span style={{ color:'#52c41a' ,fontWeight :'bold' }}><Badge status="success" />可登陆</span> 
            }else{
              return <span style={{ color:'#f5222d' ,fontWeight :'bold' }}><Badge status="error" />限制登陆</span>
            }
          }
        },
        {
            title: '操作',
            render: (record) => (<Button loading={authorLoading} style={{ color:'#1890ff',border:'none' }} size="small" onClick={() => { this.showDrawer(record) }}>管理</Button>),
        },
    ];

    const { messageVisible ,currentAuthor ,lmtModalVisible } = this.state;

    const messageParentMethods = {
      handleOK: this.handleSendMessage,
      handleModalVisible: this.messageHandleCancel,
      loading :msgLoading,
      modalVisible :messageVisible,
      data :currentAuthor,
    };

    const LmtLoginParentMethods = {
      handleOK: this.handleLmtLogin,
      handleModalVisible: this.handleLmtCancel,
      modalVisible :lmtModalVisible,
      loading,
      data :currentAuthor
    };

    return (
      <PageHeaderLayout title="作者管理">
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
          <div className={styles.tableList}>
            <StandardTable
              size="middle"
              rowKey={'_id'}
              expandedRowRender={this.expandedRowRender}
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
              bordered
            />
          </div>
        </Card>
        {this.renderUserInfo()}
        <SendMessage {...messageParentMethods}  />
        <LmtLoginForm {...LmtLoginParentMethods} />
      </PageHeaderLayout>
    );
  }
}
