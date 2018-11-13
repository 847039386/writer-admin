import mockjs from 'mockjs';
import { getFakeChartData } from './mock/chart';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

/** 新增 */
import { query as getDramas ,getData as getDrama ,search as searchDramas } from './mock/drama';
import { query as getCategory ,removeByID as categoryRemoveByID ,updateByID as categoryUpdateByID ,create as categoryCreate } from './mock/category';
import { query as getBook ,removeByID as bookRemoveByID ,updateByID as bookUpdateByID ,create as bookCreate } from './mock/book';
import { getAuthors ,getAuthor } from './mock/author';
import { create as messageCreate } from './mock/message'
import { query as getLogs } from './mock/log'




// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },


  // 新增

  'GET /v1/drama/fd': getDramas,      // 获取剧本列表
  'POST /v1/drama/search': searchDramas,    // 根据搜索获取剧本列表
  'POST /v1/drama/lmtshow': getDrama,     // 限制展示

  'GET /v1/us/list': getAuthors,            // 获取用户列表
  'GET /v1/us/fdbi': getAuthor,             // 获取单个用户
  'POST /v1/us/constraintLogin': getAuthor,        // 修改用户的登陆状态
  'POST /v1/us/asearch': getAuthors,       // 查询符合的用户列表

  'GET /v1/category/fd': getCategory,             // 获取剧情类型
  'POST /v1/category/rm': categoryRemoveByID,     // 删除剧情类型
  'POST /v1/category/ut': categoryUpdateByID,     // 修改剧情类型   
  'POST /v1/category/ct': categoryCreate,         // 创建剧情类型
  
  'GET /v1/book/fd': getBook,                     // 创建剧本类型
  'POST /v1/book/rm': bookRemoveByID,             // 删除剧本类型
  'POST /v1/book/ut': bookUpdateByID,             // 修改剧本类型
  'POST /v1/book/ct': bookCreate,                 // 创建剧本类型

  'POST /v1/notify/adminPrivateLetter': messageCreate,       // 管理员给用户发送信息

  'GET /v1/log/fdopid': getLogs,                                   // 日志


  'GET /v1/api/fake_chart_data': getFakeChartData,




  'POST /v1/adm/lg' :  (req, res) => { 
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        success : true ,
        data : {
          _id :`ADMINID${1513932643431}`,
          name :'李济杉',
          email : '847039386@qq.com',
          authority: 'admin',
          avatar :'https://img2.woyaogexing.com/2017/08/31/08e28a5ea671a3c5!400x400_big.jpg',
          jwt_token :`ADMINID${1513932643431}`,
          exp_time :`${new Date(Date.now() + 1000 * 60 * 60 * 1)}`
        }
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        success : true ,
        data : {
          _id :`ADMINID${1513932643431}`,
          name :'小李济杉',
          email : '847039386@qq.com',
          authority: 'user',
          avatar :'https://img2.woyaogexing.com/2017/08/31/08e28a5ea671a3c5!400x400_big.jpg',
          jwt_token :`ADMINID${1513932643431}`,
          exp_time :`${new Date(Date.now() + 1000 * 60 * 60 * 1)}`
        }
      });
      return;
    }
    res.send({
      success : false ,
      data : {
        authority: 'guest'
      },
      msg :'用户不存在'

    });
  }

  




};

export default (noProxy ? {} : delay(proxy, 1000));




