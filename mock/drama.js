import { parse } from 'url';

let avatars = [
  'http://pic.qqtn.com/file/2013/2013-5/2013051515113135806.png',
  'http://p1.qq181.com/cms/120505/2012050514351394677.jpg',
  'http://5b0988e595225.cdn.sohucs.com/images/20171210/e93b4d48395e430db0b5997129dad36f.jpeg',
  'https://img2.woyaogexing.com/2018/07/23/178fd160abe342219e1856108a1ee792!400x400.jpeg',
  'https://img2.woyaogexing.com/2018/05/17/52af928d77b6d8d2!400x400_big.jpg',

  'https://img2.woyaogexing.com/2018/01/30/dcde5633ac623443!400x400_big.jpg',
  'https://img2.woyaogexing.com/2018/01/26/28a9042b28804b86!400x400_big.jpg',
  'https://img2.woyaogexing.com/2018/01/08/5ce712d9d946ac2b!400x400_big.jpg',
  'https://img2.woyaogexing.com/2017/11/15/1992ed9abeb89950!400x400_big.jpg',
  'https://img2.woyaogexing.com/2017/08/31/08e28a5ea671a3c5!400x400_big.jpg',

  'https://img2.woyaogexing.com/2017/07/03/31d9ef8f6948129f!400x400_big.jpg',
  'https://img2.woyaogexing.com/2018/07/30/b2773d0e982efa66!400x400_big.jpg',
  'https://img2.woyaogexing.com/2018/07/14/a8ec866f0e0d4bafbf2c789eb013efae!400x400.jpeg',
  'https://img2.woyaogexing.com/2018/03/23/c886e62e83cc4ade!400x400_big.jpg',
  'https://img2.woyaogexing.com/2017/12/27/4009698e5e0a9963!400x400_big.jpg',
  'https://img.woyaogexing.com/2016/11/16/fda1a73244f18c02!200x200.jpg'
]

const users = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
  'Layui',
  'JavaScript',
];

let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  let uv = Math.floor(Math.random() * 200);
  tableListDataSource.push({
    _id: `DRAMA${i}`,
    title: titles[i % 10],
    weight : 100,
    state : Math.round(Math.random()) ,
    status : Math.round(Math.random()),
    user_id : {
      name :users[i % 10],
      avatar : avatars[i % 16]
    },
    book_id :{
      _id :'bookEAJJSHF',
      name :'电视剧'
    },
    category_id :[
      {
        _id :'category_idshenmo',
        name :'神魔'
      },
      {
        _id :'category_idgedou',
        name :'格斗'
      },
      {
        _id :'category_idzhiyu',
        name :'治愈'
      }
    ],
    description :'这是一段描述',
    uv : {
        "total" : Math.floor(Math.random() * 3000 + 1000),
        "month" : uv + 500 ,
        "week" : uv + 200 ,
        "day" : uv
    },
    count : {
        "collect" : Math.floor(Math.random() * 200),
        "comment" : Math.floor(Math.random() * 200)
    },
  });
}

export function query(req, res, u) {

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize || res.req.body.size) {
    pageSize = params.pageSize * 1 || res.req.body.size;
  }
  
  const result = {
    success :true,
    data : {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        size: pageSize,
        current: parseInt(params.page, 10) || parseInt(res.req.body.page) || 1,
      },
    }
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function search(req, res, u) {

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = [...tableListDataSource].concat([...tableListDataSource]);

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize || res.req.body.size) {
    pageSize = params.pageSize * 1 || res.req.body.size;
  }
  
  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      size: pageSize,
      current: parseInt(params.page, 10) || parseInt(res.req.body.page) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function getData(req, res, u) {
  let uv = Math.floor(Math.random() * 200);
  const result = {
    success : true,
    data: {
      _id: `DRAMA${uv}XKU${Math.floor(Math.random() * 10000)}`,
      title: 'NEW DRAMA',
      weight : 100,
      state : Math.round(Math.random()) ,
      msg : '可能是失败了',
      status : res.req.body.status || Math.round(Math.random()),
      user_id : {
        name :'斗鱼第一主播',
        avatar : avatars[0]
      },
      book_id :{
        _id :'bookEAJJSHF',
        name :'电视剧'
      },
      category_id :[
        {
          _id :'category_idshenmo',
          name :'神魔'
        },
        {
          _id :'category_idgedou',
          name :'格斗'
        },
        {
          _id :'category_idzhiyu',
          name :'治愈'
        }
      ],
      description :'这是一段描述',
      uv : {
          "total" : Math.floor(Math.random() * 3000 + 1000),
          "month" : uv + 500 ,
          "week" : uv + 200 ,
          "day" : uv
      },
      count : {
          "collect" : Math.floor(Math.random() * 200),
          "comment" : Math.floor(Math.random() * 200)
      },
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }

}




export default {
  query,
  getData
};
