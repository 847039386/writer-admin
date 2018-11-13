import { parse } from 'url';

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

let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    _id: `fake-list-${i}`,
    key :`fake-list-${i}`,
    name: users[i % 8],
    presentation :'开啥玩笑，我可是真正的小可爱',
    drama_count : 32,
    fans_count : 123,
    avatar:avatars[i % 16],
    status :Math.floor(Math.random() * 10) == 1 ? 0 : 1
  });
}

export function getAuthors(req, res, u) {
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
  if (params.size) {
    pageSize = params.size * 1;
  }

  const result = {
    success:true,
    data :{
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

export function getAuthor(req, res, u) {
  console.log(res.req.body.status)
  const result = {
    data: {
       _id: `AUTHORID`,
       name :users[Math.floor(Math.random() * 10)],
       avatar :avatars[Math.floor(Math.random() * 10)],
       presentation :'开啥玩笑，我可是真正的小可爱',
       status : res.req.body.status || Math.round(Math.random())
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }

}


export default {
    getAuthors,
    getAuthor
};
