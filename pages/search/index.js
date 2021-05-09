import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
Page({
  data: {
    goods:[],
    isFocus:false,
    inpValue:""
  },
  TimeId:-1,
  handleInput(e){
    const {value} = e.detail;
    if(!value.trim()){
      this.setData({
        isFocus:false,
        goods:[]
      })
      return;
    }

    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);

  },

  async qsearch(query){
    const res = await request({url:"/goods/search",data:query});
    console.log(res.data.message.goods);
    this.setData({
      goods:res.data.message.goods
    })
    
  },
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
})