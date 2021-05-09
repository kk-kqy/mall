import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js"
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'体验问题',
        isActive:true
      },
     {
      id:1,
      value:'商品、商家投诉',
      isActive:false
      }
  ],
  chooseImgs:[],
  textVal:""
  },
  UpLoadImgs:[],
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
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
  },
  handleRemoveImg(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImgs} = this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  handleFormSubmit(){
    const {textVal,chooseImgs} = this.data;
    if(!textVal.trim()){
      wx.showToast({
        title: '输入不合法！',
        icon: 'none',
        mask: true
      });
      return;
    }
    //显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    //判断有没有需要上传的图片数组
    if(chooseImgs.length!=0){
    //合法，上传图片到专门处理图片的服务器 返回图片外网的链接
    chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        //图片上传到哪里
        url: 'https://images.ac.cn/Home/Index/UploadAction/',
        //被上传的文件的路径
        filePath: v,
        //被上传的文件名字
        name: "file",
        //顺带的文本信息
        formData: {},
        success: (result)=>{
          console.log(result);
          let url = JSON.parse(result.data);
          this.UpLoadImgs.push(url);

          if(i===chooseImgs.length-1){

            wx.hideLoading();
            console.log("把文本的内容和外网的图片数组 提交到后台");
            //提交成功后重置页面
            this.setData({
              textVal:"",
              chooseImgs:[]
            })
            //返回上一个页面
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
    })
    }else{
      wx.hideLoading();
      console.log("只是提交了普通文本！");
      //返回上一个页面
      wx.navigateBack({
        delta: 1
      });
    }
    
    
  }
})