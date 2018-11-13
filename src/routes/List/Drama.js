import React, { Component ,Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from 'components/StandardTables';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
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
  Badge,
  Popconfirm,
  notification,
  Modal,
  Divider,
  Drawer,
  Timeline
} from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
const { TextArea } = Input;

const LmtShowForm = Form.create()(props => {
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
            <Avatar shape="square" size={64} src={data.user_id.avatar} />
          </Col>
          <Col md={18} sm={24}>
            <p>剧本编号：{ data._id }</p>
            <p>剧本标题：{ data.title }</p>
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
              <Option value={0} disabled={data.status === 0}>展示</Option>
              <Option value={1} disabled={data.status === 1}>限制展示</Option>
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



@connect(({ drama , global = {},user , category , book , loading ,log }) => ({
  currentAdmin :user.currentAdmin,
  drama,
  category,
  book,
  log,
  loading: loading.models.drama,
  logloading :loading.models.log
}))
@Form.create()
export default class SearchList extends Component {
  
  state = {
    expandForm: false,        // 控制查询控件的展开
    formValues: {},           // 查询表单的数据
    status,                   // 当前操作状态
    lmtModalVisible :false,    // 管理状态 model 显示
    currentDrama : {},        // 当前操作的剧本
    logDrawerVisible :false    // 日志Drawer显示
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'drama/fetch',
    });
    dispatch({
      type: 'category/fetch',
    });
    dispatch({
      type: 'book/fetch',
    });
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    const { status } = this.state;
    if(status == 'lmtshow'){
      const { drama : { e_data } ,loading } = nextProps;
      if(!loading){
        if(e_data.success){
          this.setState({ currentDrama :{} ,lmtModalVisible:false ,status :null })
          let d_status ;
          switch(e_data.data.status){
            case 0 :
              d_status = '允许查看'
            break
            case 1 :
              d_status = '限制查看'
            break
            default :
              d_status = '未知'
            break;
          }
          notification['success']({
            message: '操作成功',
            description: <span>{ d_status }<span style={{color:'#FF5722',fontWeight:'bold'}}>&nbsp;{e_data.data.title}</span>剧本&nbsp;</span>,
          });
        }else{
          notification['error']({
            message: '操作失败',
            description: <span>原因可能是：<span style={{color:'#FF5722'}}>{e_data.msg}</span></span>,
          });
        }
      }
    }
      
      
     
     if(status == 'logshow'){
      const { log : {data} ,logloading } = nextProps;
      if(!logloading){
        if(data && !data.success){
          notification['error']({
            message: '查看失败',
            description: <span>原因可能是：<span style={{color:'#FF5722'}}>日志无数据</span></span>,
          });
        }else{
          this.setState({ status :null });
        }
      }
    }
  }

  renderSimpleForm() {
    const { book , form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="剧本名称">
              {getFieldDecorator('search')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="剧本类型">
              {getFieldDecorator('books')(
                <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                  {
                    book.data.list.map((item) => {
                       return (<Option key={`book${item._id}`} value={item._id}>{ item.name }</Option>)
                    })
                  }
                </Select>
               )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { book ,category , form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="剧本名称">
              {getFieldDecorator('search')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="剧本类型">
              {getFieldDecorator('books')(
                <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                  {
                    book.data.list.map((item) => {
                       return (<Option key={`book${item._id}`} value={item._id}>{ item.name }</Option>)
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="管理状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option key={`status1`} value={0}>允许</Option>
                  <Option key={`status2`} value={1}>禁止</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="剧情类型">
              {getFieldDecorator('categorys')(
                <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                  {
                    category.data.list.map((item) => {
                       return (<Option key={`category${item._id}`} value={item._id}>{ item.name }</Option>)
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="排序">
              {getFieldDecorator('sort')(
                <Select placeholder="排序均为倒叙" style={{ width: '100%' }}>
                  <Select.OptGroup label="时间">
                    <Option key={`sortCREATEAT`} value={'create_at'}>创建时间</Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="数量">
                    <Option key={`sortCOLLECT`} value={'count.collect'}>收藏数</Option>
                    <Option key={`sortCOMMENT`} value={'count.comment'}>评论数</Option>
                  </Select.OptGroup>
                  <Select.OptGroup label="浏览数">
                    <Option key={`sortUVDAY`} value={'uv.day'}>日</Option>
                    <Option key={`sortUVWEEK`} value={'uv.week'}>周</Option>
                    <Option key={`sortUVMONTH`} value={'uv.month'}>月</Option>
                    <Option key={`sortUVTOTAL`} value={'uv.total'}>总</Option>
                  </Select.OptGroup>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if(fieldsValue.date && fieldsValue.date.length > 1){
        fieldsValue = Object.assign(fieldsValue, {
          timeBegin :fieldsValue.date[0],
          timeEnd :fieldsValue.date[1],
          date:undefined
        });
      }
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'drama/search',
        payload: values,
      });
    });
  };

  expandedRowRender = record => {
    return (
      <div>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom:10 }}>
          <Col md={6} sm={24}>
            <span><Avatar style={{ backgroundColor: '#87d068' }} src={record.user_id.avatar} shape="square" icon="user" />&nbsp;&nbsp;{ record.user_id.name }</span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom:10 }}>
          <Col md={6} sm={24}>
            <span>剧本名称：{record.title}</span>
          </Col>
          <Col md={6} sm={24}>
            <span>剧本状态：{
              record.state == 0 ? <span style={{ color :'#38b03f' ,fontWeight :'bold' }}>连载</span> : <span style={{ color :'#EA2000' ,fontWeight :'bold' }}>完结</span>
            }</span>
          </Col>
          <Col md={6} sm={24}>
            <span>权重：{record.weight}</span>
          </Col>
          <Col md={6} sm={24}>
            <span>管理状态：{record.status}</span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom:10 }}>
          <Col md={6} sm={24}>
            <span>剧本类型：<span key={record.book_id._id} style={{ color :'#8590a6' }}>{ record.book_id.name }&nbsp;</span></span>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ margin: 0 }}>剧情类型：{ 
              record.category_id.map((item)=>{
                return (<span key={item._id} style={{ color :'#8590a6' }}>{ item.name }&nbsp;</span>)
              })
            }</div>
          </Col>
          <Col md={6} sm={24}>
            <span>收藏数：&nbsp;<span style={{ color :'#EA2000' ,fontWeight :'bold' }}><Icon type="star" />&nbsp;{ record.count.collect }</span></span>
          </Col>
          <Col md={6} sm={24}>
            <span>评论数：&nbsp;<span style={{ color :'#EA2000' ,fontWeight :'bold' }}><Icon type="wechat" />&nbsp;{ record.count.comment }</span></span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin:10 }}>
          <Col md={6} sm={24}>
            <span>浏览数(日)：{record.uv.day}</span>
          </Col>
          <Col md={6} sm={24}>
            <span>浏览数(周)：{record.uv.week}&nbsp;<span style={{ color :'#38b03f' ,fontWeight :'bold' }}><Icon type="arrow-up" />{record.uv.day}</span></span>
          </Col>
          <Col md={6} sm={24}>
            <span>浏览数(月)：{record.uv.month}&nbsp;<span style={{ color :'#38b03f' ,fontWeight :'bold' }}><Icon type="arrow-up" />{record.uv.week}</span></span>
          </Col>
          <Col md={6} sm={24}>
            <span>浏览数(总)：{record.uv.total}&nbsp;<span style={{ color :'#38b03f' ,fontWeight :'bold' }}><Icon type="arrow-up" />{record.uv.month}</span></span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ margin:0 }}>
          <Col md={6} sm={24}>
            <span>创建时间：{moment(record.create_at).format('LL')}</span>
          </Col>
        </Row>
      </div>
    )
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'drama/fetch',
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {

    const { dispatch } = this.props;
    let { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    if(formValues.search || formValues.books || formValues.categorys || formValues.status || formValues.timeBegin && formValues.timeEnd ){
        if(formValues.date && formValues.date.length > 1){
          formValues = Object.assign(formValues, {
            timeBegin :formValues.date[0],
            timeEnd :formValues.date[1],
            date:undefined
          });
        }
        dispatch({
          type: 'drama/search',
          payload: {
            page: pagination.current,
            size: pagination.pageSize,
            ...formValues
          },
        });
    }else{
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        ...filters,
      };
      
  
      dispatch({
        type: 'drama/fetch',
        payload: params,
      });
    }
  };

  handleLmtCancel = flag => {
    this.setState({ lmtModalVisible :!!flag })
  }
  handleLmtshow = (formValues,data) =>{
    const { dispatch , currentAdmin } = this.props;
    if(data._id && currentAdmin._id){
      this.setState({ status : 'lmtshow' })
      dispatch({
        type: 'drama/lmtshow',
        payload: { 
          body : {
            id : data._id ,
            status :formValues.status,
            logContent :formValues.logContent,
            message :formValues.message,
            userid : data.user_id._id            
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

  handleLogOk = (opid) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'log/fetch',
      payload: { opid ,type:'drama' },
    });
    this.setState({ logDrawerVisible :true ,status :'logshow' })
  }

  logDrawerRender = () => {
    const { log : { data } ,logloading } = this.props;
    const { logDrawerVisible } = this.state;
    if(data && data.success && !logloading){
      return (
        <Drawer 
          title="日志"
          width={520}
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


  render() {
    const {
      drama: { data },
      loading,
      logloading
    } = this.props;
    const columns = [
      {
        title: '剧本名称',
        dataIndex: 'title',
      },
      {
        title: '作者',
        dataIndex: 'user_id',
        render: (user_id, record) => (
          <span><Avatar style={{ backgroundColor: '#87d068' }} src={user_id ? user_id.avatar : ''} shape="square" icon="user" />&nbsp;&nbsp;{ user_id ? user_id.name :'???' }</span>
        )
      },
      {
        title: '浏览数',
        children : [
          { title : '日' ,dataIndex :'uv.day' ,align :'center' ,sorter: (a, b) => a.uv.day - b.uv.day }
          ,{ title : '周' ,dataIndex :'uv.week' ,align :'center' ,sorter: (a, b) => a.uv.week - b.uv.week}
          ,{ title : '月' ,dataIndex :'uv.month' ,align :'center' ,sorter: (a, b) => a.uv.month - b.uv.month}
          ,{ title : '总' ,dataIndex :'uv.total' ,align :'center' ,sorter: (a, b) => a.uv.total - b.uv.total}
        ]
      },
      {
        title: '信息数',
        children : [
          { title : '收藏' ,dataIndex :'count.collect' ,align :'center' ,sorter: (a, b) => a.count.collect - b.count.collect }
          ,{ title : '评论' ,dataIndex :'count.comment' ,align :'center' ,sorter: (a, b) => a.count.comment - b.count.comment } 
        ]
      },
      {
        title: '状态',
        dataIndex :'status',
        align :'center',
        render: (text, record) => (
          text == 0 ? <span style={{ color:'#52c41a' ,fontWeight :'bold' }}><Badge status="success" />允许</span>: <span style={{ color:'#f5222d' ,fontWeight :'bold' }}><Badge status="error" />禁止</span>
        )
      },
      {
        title: '操作',
        align :'center',
        render: (record,index) => (
          <Fragment>
            <Button style={{ color:'#1890ff',border:'none' ,backgroundColor:'transparent' }} size="small"  loading={logloading} onClick={() => { this.handleLogOk(record._id) }}>日志</Button>
            <Divider type="vertical" />
            <Button style={{ color:'#1890ff',border:'none' ,backgroundColor:'transparent' }} size="small"  onClick={() => { 
              this.setState({currentDrama : record })
              this.handleLmtCancel(true) 
            }}>展示管理</Button>
          </Fragment>
          
        ),
      },
    ];

    const { lmtModalVisible ,currentDrama } = this.state;
    const LmtShowParentMethods = {
      handleOK: this.handleLmtshow,
      handleModalVisible: this.handleLmtCancel,
      modalVisible :lmtModalVisible,
      loading,
      data :currentDrama
    };
    return (
      <PageHeaderLayout title="查询剧本">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
        <LmtShowForm {...LmtShowParentMethods} />
        { this.logDrawerRender() }
      </PageHeaderLayout>
    );
  }
}
