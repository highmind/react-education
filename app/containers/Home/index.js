import React, { Component } from 'react'
import {Card, Slider, Loading, Button} from '../../components';
import {Link} from 'react-router';
import qs from 'qs';
import Axios from 'axios';
import './index.css';

class Home extends Component{
    constructor(props){
        super(props);
        this.ignoreLastFetch = false;
        this.state = {
          videoCourse : [],   //视频推荐课程
          audioCourse : [],   //音频推荐课程
          slider : [],     //轮播图数据
          sliderId : 0,    //轮播图组件id
          loading : true   //loading参数
        }
        this.props.actions.navBarSet("中仕学社");
    }

    getData(){
        //数据返回之前，重新设置state,因为不同路由使用的一个组件，
        // 切换时，需要重置状态
        this.setState({
          loading : true   //loading参数
        })

        // 如果要用 application/x-www-form-urlencoded 格式发送数据，数据必须是 URLSearchParams 类型，或者字符串参数 a=1&b=2 格式。



        let self = this;
        let searchData = qs.stringify({
          Action : 'GetSlides'
        });

        //测试webpack反向代理，完整接口数据http://api.chinaplat.com/getval_2017
        // 获取轮播图
        Axios.post('/getval_2017', searchData)
        .then(function (response) {
          console.log(response.data)
          self.setState({
              slider : response.data.Slides.slice(0,5),
              sliderId : '1',
          })
        })
        .catch(function (response) {
          console.log(response);
        });

        // 获推荐视频课程列表
        Axios.post('/getval_2017', qs.stringify({
          Action: 'GetTJCourseList',
          Types : '0'
        }))
        .then(function (response) {
          console.log(response.data)
          self.setState({
              videoCourse : response.data.Course,
              loading : false
          })

        })
        .catch(function (response) {
          console.log(response);
        });

        // 获取推荐音频课程列表
        Axios.post('/getval_2017', qs.stringify({
          Action: 'GetTJCourseList',
          Types : '1'
        }))
        .then(function (response) {
          console.log(response.data)
          self.setState({
              audioCourse : response.data.Course,
              loading : false
          })

        })
        .catch(function (response) {
          console.log(response);
        });


    }

    savePosition() {
        console.log('...savePosition...');
        let scrollTop = document.body.scrollTop;//获取滚动条高度
        let path = this.props.location.pathname;//获取当前的pathname
        let positionData = {"scrollTop" : scrollTop, "path" : this.props.location.pathname};//redux中要存储的数据
        this.props.actions.setScroll(positionData);//通过action设置位置信息
    }

    // 设置滚动条位置
    setPosition(){
        console.log('...setPosition...');
        console.log(this.props.position);
        let posData = this.props.position;//获取store中的滚动条位置信息
        let len = posData.length;         //获取信息数组长度，用于获取最新的位置信息
        // let savePos = 0;                  //初始位置为0
        // let savePath = '';                //初始pathname为空
        // if(len != 0 ){                    //当位置信息数组不为空的时候，设置位置和pathname
        let  savePos = posData[len - 1].position.scrollTop;
        let  savePath = posData[len - 1].position.path;
        console.log(savePos);
        console.log(savePath)
        // }

        let path = this.props.location.pathname; //获取当前pathname
        if(path == savePath){                    //当store中路径和当前路径一致时，
             window.scrollTo(0, savePos);           //设置滚动条位置到 相应位置
             let positionData = {"scrollTop" : 0, "path" : this.props.location.pathname};
             //this.props.setScroll(positionData);    //设置store中当前path为0，解决导航栏目切换时，滚动条位置
         }
        else{    //否则滚动到顶部
           window.scrollTo(0, 0);
        }

    }

    componentDidMount(){
        console.log('--------Containers/Home---componentDidMount--------');
        this.getData();
    }

    componentWillUnmount () {
        // 上面步骤四，在组件移除前忽略正在进行中的请求
        this.ignoreLastFetch = true
        this.savePosition()
    }

    getFilmList(data){
      let nodes = data.map(function(dData){
        let cardFLNode = <div>
          <h4 className="card-title">{dData.title}</h4>
          <p className="card-text">
            需{dData.money}积分
          </p>
        </div>;
        let cardFRNode = <span className="card-score">{dData.keshi}课时</span>;
        return(
          <Link key={dData.kc_id} to={{pathname:'/film',query:{id:dData.kc_id,kc_types:1}}}>
            <Card
              key={dData.kc_id}
              data={dData}
              cardFooterLeft={cardFLNode}
              cardFooterRight={cardFRNode}
            />
          </Link>
        )
      })

      return (
        <div className="film-list">
          {nodes}
        </div>
      )

    }

    getCommingFilmList(data){
      let nodes = data.map(function(dData){
        let cardFLNode = <h4 className="card-title2">{dData.title}</h4>;
        let cardFRNode = <span className="card-time">{dData.money}积分</span>;
        return(
          <Link key={dData.kc_id} to={{ pathname: '/film',query:{id:dData.kc_id,kc_types:0}}}>
            <Card
              key={dData.kc_id}
              data={dData}
              cardFooterLeft={cardFLNode}
              cardFooterRight={cardFRNode}
            />
          </Link>
        )
      })

      return (
        <div className="film-list">
          {nodes}
        </div>
      )

    }

    render(){
        return(
            <div className="main-con">
                <Loading active={this.state.loading} />
                <div className={this.state.loading ? "con-hide" : "con-show"}>
                    <Slider id={this.state.sliderId} data={this.state.slider} />
                    {this.getFilmList(this.state.audioCourse)}
                    <Link to="/filmlist/playing">
                      <Button type="ghost" clsName="home-more">更多视频课程</Button>
                    </Link>
                    {this.getCommingFilmList(this.state.videoCourse)}
                    <Link to="/filmlist/coming">
                      <Button type="ghost" clsName="home-more">更多音频课程</Button>
                    </Link>
                </div>
            </div>
        )
    }

}

export default  Home
