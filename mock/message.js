import { parse } from 'url';

export function create(req, res, u){
    const result = {
        success : Math.floor(Math.random() * 2 + 1) == 1 ? false : true,       // 用来测试成功或者失败
        msg :'未知错误',     // 测试，只有在success为false情况下显示
        data : {
          _id  : `NOTIFIES${Math.floor(Math.random() * 1000)}`,
          type : 3,
          targetType :'admin',
          action :'normal',
          user_id :res.req.body.uid,
          content :res.req.body.content
        }
     }
     if (res && res.json) {
       res.json(result);
     } else {
       return result;
     }
}



export default {
    create
};
