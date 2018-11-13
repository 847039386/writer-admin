import moment from 'moment';

// mock data
const visitData = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: '电影',
    y: 4544,
  },
  {
    x: '电视剧',
    y: 3321,
  },
  {
    x: '网络大电影',
    y: 3113,
  },
  {
    x: '小品',
    y: 2341,
  }
];

const salesTypeDataOnline = [
  {
    x: '电影',
    y: 244,
  },
  {
    x: '电视剧',
    y: 321,
  },
  {
    x: '网络大电影',
    y: 311,
  },
  {
    x: '小品',
    y: 41,
  }
];

const salesTypeDataOffline = [
  {
    x: '电影',
    y: 99,
  },
  {
    x: '电视剧',
    y: 188,
  },
  {
    x: '网络大电影',
    y: 344,
  },
  {
    x: '小品',
    y: 255,
  }
];

const offlineData = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `门店${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

//
const radarData = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach(item => {
  Object.keys(item).forEach(key => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});


const categoryCount = [
  {"id": "5a40adf79ca2d93f1445a61c","x": "都市","y": 100},
  {"id": "5a40adff9ca2d93f1445a61d","x": "战争","y": 2000},
  {"id": "5a40ae0a9ca2d93f1445a61e","x": "校园","y": 564},
  {"id": "5a4b3540733e6e12d4debe19","x": "纯情","y": 798},
  {"id": "5a4b3544733e6e12d4debe1b","x": "乡村","y": 320},
  { "id": "5a4b3546733e6e12d4debe1c","x": "摇滚","y": 959},
  {"id": "5a4b3548733e6e12d4debe1d","x": "宗教","y": 752},
  { "id": "5a4b354b733e6e12d4debe1e","x": "工程","y": 2698 },
  { "id": "5a4b3550733e6e12d4debe20","x": "内斗", "y" : 970},
  { "id": "5a4b3557733e6e12d4debe22","x": "热血","y": 476 }
]

const BookCount = [
  {"id": "5a40ade49ca2d93f1445a61a","x": "电影","y": 125},
  {"id": "5a40adea9ca2d93f1445a61b","x": "电视剧","y": 378},
  {"id": "5a4ad11e1894180c74494006","x": "网络大电影","y": 920},
  {"id": "5a4ad11e1894180c74494007","x": "小品","y": 458},
]

const ctDramaCount = [
  {"id": "5a40ade49ca2d93f1445a62a","x": "6-13","y": 125},
  {"id": "5a40adea9ca2d93f1445a62b","x": "6-14","y": 378},
  {"id": "5a4ad11e1894180c74494026","x": "6-15","y": 920},
  {"id": "5a4ad11e1894180c74494027","x": "6-16","y": 458},
]

const api_chart = { count:3000 ,categoryCount ,BookCount ,ctDramaCount ,yesterdayCount :380 ,totalUv :6980  }

export const getFakeChartData = {
  api_chart,
  visitData2,
  salesData,
  searchData,
  offlineData,
  offlineChartData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
};

export default {
  getFakeChartData,
};
