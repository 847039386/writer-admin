import { parse } from 'url';

export function query(req, res, u){
    const result = {
        success : Math.floor(Math.random() * 10 + 1) == 1 ? false : true,       // 用来测试成功或者失败
        msg :'未知错误',     // 测试，只有在success为false情况下显示
        data : {
          _id : `LOGID${Math.floor(Math.random() * 1000)}`,
          opid  : `LOGOPID${Math.floor(Math.random() * 1000)}`,
          type :'abc',
          log :[
            {   
                adminid : {  _id:'ADMINAAA1231233', name:'小红' ,avatar :'https://img2.woyaogexing.com/2017/07/03/31d9ef8f6948129f!400x400_big.jpg' },
                content : '这是随便的一条日志',
                create_at : Date.now()
            },
            {   
                adminid : { _id:'ADMINAAA123123' ,name :'小明' ,avatar :'https://img2.woyaogexing.com/2018/07/30/b2773d0e982efa66!400x400_big.jpg'},
                content : '这是随便的一条日志',
                create_at : Date.now()
            },
            {   
              adminid : { _id:'ADMINAAA123123' ,name :'小飞' },
              content : '这是随便的一条日志',
              create_at : Date.now()
            },
            {   
              content : '这是随便的一条日志',
              create_at : Date.now()
            },
            {   
                adminid : {  _id:'ADMINAAA1231233', name:'笨蛋测试召唤兽' ,avatar :'https://img2.woyaogexing.com/2018/01/26/28a9042b28804b86!400x400_big.jpg' },
                content : '这是随便的一条日志',
                create_at : Date.now()
            },
            {   
                adminid : { _id:'ADMINAAA123123' ,name :'刀剑神域' ,avatar :'https://img2.woyaogexing.com/2017/08/31/08e28a5ea671a3c5!400x400_big.jpg'},
                content : '这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志这是随便的一条日志',
                create_at : Date.now()
            },
            {   
                adminid : {  _id:'ADMINAAA1231233', name:'七原罪' ,avatar :'https://img.woyaogexing.com/2016/11/16/fda1a73244f18c02!200x200.jpg' },
                content : '这是随便的一条日志',
                create_at : Date.now()
            },
            {   
                adminid : { _id:'ADMINAAA123123' ,name :'库克' ,avatar :'https://img2.woyaogexing.com/2018/03/23/c886e62e83cc4ade!400x400_big.jpg'},
                content : '这是随便的一条日志',
                create_at : Date.now()
            },
          ],
          create_at : Date.now()
        }
     }
     if (res && res.json) {
       res.json(result);
     } else {
       return result;
     }
}



export default {
    query
};
