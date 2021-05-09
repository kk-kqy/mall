import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index"
Page({
  data: {
    leftMenuList:[],
    rightContent:[],
    currentIndex:0,
    scrollTop:0
  },
  Cates:[],
  onLoad: function (options) {
    //获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    //判断本地存储数据是否为空
    if(!Cates){//本地存储为空时重新发送请求
      this.getCates();
    }else{
      //有旧的数据，判断是否过期
      if(Date.now()-Cates.time>1000*300){
        this.getCates();
      }else{
      //获取本地存储之中数据
      this.Cates = Cates.data;
      let leftMenuList = this.Cates.map(v => v.cat_name);
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
      }
    }
  },
  async getCates() {
    // request(
    //   {
    //     url:"/categories"
    // })
    // .then(res => {
    //   this.Cates = res.data.message;
    //   // 把接口数据传入到本地存储中
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    //使用ES7的async await发送请求
    const res = await request({url:"/categories"});
    this.Cates = res.data.message;
    // 把接口数据传入到本地存储中
    wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    const rightContent = this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})