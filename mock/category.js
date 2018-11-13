import { parse } from 'url';

const names = [
  '短片',
  '传记',
  '纪录片',
  '歌舞',
  '鬼怪',
  '西部',
  '动画',
  '治愈',
  '格斗',
  '热血',
  '宫斗',
];

let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    _id: `CATEGORY${i}`,
    key :`CATEGORY${i}`,
    name: names[i%11],
    create_at : Date.now()
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
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    success :true,
    data : {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        size: pageSize,
        current: parseInt(params.page, 10) || 1,
      }
    }
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function removeByID(req, res, u){
    const result = {
       success : Math.floor(Math.random() * 2 + 1) == 1 ? false : true,       // 用来测试成功或者失败
       msg :'未知错误',     // 测试，只有在success为false情况下显示
       data : {
         _id  : res.req.body.id,
         name : `(删)剧情类型${Math.floor(Math.random() * 200)}`
       }
    }
    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
}

export function updateByID(req, res, u){
  const result = {
     success : Math.floor(Math.random() * 2 + 1) == 1 ? false : true,       // 用来测试成功或者失败
     msg :'未知错误',     // 测试，只有在success为false情况下显示
     data : {
       _id  : res.req.body.id,
       name : `(改)剧情类型${Math.floor(Math.random() * 200)}`
     }
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function create(req, res, u){
  const result = {
    success : Math.floor(Math.random() * 2 + 1) == 1 ? false : true,       // 用来测试成功或者失败
    msg :'未知错误',     // 测试，只有在success为false情况下显示
    data : {
      _id  : `CATEGORY${Math.floor(Math.random() * 1000)}`,
      name : `(增)剧情类型${Math.floor(Math.random() * 200)}`
    }
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}



export default {
    query,
    removeByID,
    updateByID,
    create
};
