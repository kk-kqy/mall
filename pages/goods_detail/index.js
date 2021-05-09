import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
Page({
  data: {
    goodsObj:{},
    isCollect:false
  },
  GoodsInfo:{},
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);

  },
  //获取商品详情
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo = goodsObj.data.message;

    //1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')||[];
    //2.判断商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);

    this.setData({
      goodsObj:{
        pics:goodsObj.data.message.pics,
        goods_price:goodsObj.data.message.goods_price,
        goods_name:goodsObj.data.message.goods_name,
        goods_introduce:goodsObj.data.message.goods_introduce.replace("/\.webp/g",".jpg")
      },
      isCollect
    });
  },
  //轮播图放大预览
  handlePreviewImage(e){
    console.log(this.GoodsInfo.pics);
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  //点击加入购物车
  handleCartAdd(){
    let cart  = wx.getStorageSync("cart")||[];
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功！',
      icon: 'success',
      mask: true
    });
  },
  //点击 商品收藏图标
  handleCollect(){
    let isCollect = false;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')||[];
    //判断商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //当index！=-1表示 已经收藏过
    if(index!==-1){
    collect.splice(index,1);
    isCollect = false;
    wx.showToast({
      title:'取消收藏成功！',
      icon:'success',
      mask:true
    })
    }else{
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title:'收藏成功！',
        icon:'success',
        mask:true
      })
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    })

  }
})