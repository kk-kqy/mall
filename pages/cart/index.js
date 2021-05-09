import regeneratorRuntime from '../../lib/runtime/runtime';
import {getSetting,chooseAddress,openSetting,showModal,showToast} from '../../utils/asyncWx'
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart')||[];
    //const allChecked = cart.length?cart.every(v => v.checked):false;
    this.setData({
      address
    })
    this.setCart(cart);   
  },
  async handleChooseAddress(){
    try{
    //1.获取权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    if(scopeAddress===false){
      await openSetting();
    };
    let address = await chooseAddress();
    address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
    wx.setStorageSync('address', address);
    }catch(err){
      console.log(err);
    }
  },
  handleItemChange(e){
    //1.获取被修改商品的id
    const goods_id = e.currentTarget.dataset.id;
    //2.获取购物车数组
    let {cart} = this.data;
    //3.找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id);
    //4.选中状态取反
    cart[index].checked=!cart[index].checked;
    //5.把购物车数据重新设置
    this.setCart(cart);
  }, 
   //设置购物车状态
   setCart(cart){
    let allChecked=true;
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allChecked=false;
      }
    })
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart',cart);
   },
   handleItemAllcheck(){
     let {cart,allChecked} = this.data;
     allChecked = !allChecked;
     cart.forEach(v=>v.checked=allChecked);
     this.setCart(cart);
   },
   async handleItemNumEdit(e){
    const {operation,id} = e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id===id);

    if(cart[index].num===1&&operation===-1){
      const res = await showModal({content:"您是否要删除？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
   },
   async handlePay(){
     const {address,totalNum} = this.data;
     if(!address.userName){
      await showToast({title:"您还没有选择收货地址！"})
      return;
     }
     if(totalNum===0){
      await showToast({title:"您还没有选择商品！"})
      return; 
     }
     wx.navigateTo({
       url: '/pages/pay/index'
     })
   }
})