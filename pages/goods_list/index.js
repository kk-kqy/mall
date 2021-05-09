import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"

Page({
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
     {
      id:1,
      value:'销量',
      isActive:false
      },
    {
      id:2,
      value:'价格',
      isActive:false
    }
  ],
  goodsList:[]
  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams});
    const total = res.data.message.total;
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    this.setData({
      goodsList:[...this.data.goodsList,...res.data.message.goods]
    }) 
    wx.stopPullDownRefresh();
  },
  

   // 标题点击事件 从子组件传递过来
   handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据！'
      });
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  onPullDownRefresh(){
    //1.重置数组
    this.setData({
      goodsList:[]
    })
    //2.重置页码
    this.QueryParams.pagenum=1;
    //3.重新发送请求
    this.getGoodsList();
  }
})