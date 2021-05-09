import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'全部',
        isActive:true
      },
     {
      id:1,
      value:'待付款',
      isActive:false
      },
    {
      id:2,
      value:'待发货',
      isActive:false
    },
    {
      id:3,
      value:'退款/退货',
      isActive:false
    }
  ],
  },
  onShow(options){
    // const token = wx.getStorageSync('token');
    // if(!token){
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   });
    //   return;
    // }

  //1.获取当前的小程序的页面栈-数组 长度最大是10页面
  let pages = getCurrentPages();
  let currentPage = pages[pages.length-1];
  const {type} = currentPage.options;
  //激活选中页面标题 当type=1时index=0
  this.changeTitleByIndex(type-1);

  this.getOrders(type);
  },
  async getOrders(type){
    const res = await request({url:"/my/orders/all",data:{type}});
    console.log(res);
  },
  changeTitleByIndex(index){
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
     // 1 获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);

    this.getOrders(index+1);
  }
})