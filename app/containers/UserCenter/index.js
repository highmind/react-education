import React, { ReactDOM,Component } from 'react'
import {Button} from '../../components';
import qs from 'qs';
import Axios from 'axios'; //引入axios处理ajax
import md5 from 'md5';  // 引入md5加密密码
import './index.css';
//用户中心
class UserCenter extends Component{
    constructor(props){
        super(props);
        this.state = {
          userData : []
        }
        this.props.actions.navBarSet("个人中心")
    }


    componentDidMount(){
      let loginToken = localStorage.getItem('loginToken');
      if(loginToken == null){ //如果获取不到缓存的token
        // 跳转到登录页
        this.props.router.push('/user');
      }else{ //请求数据
        let self = this;
        let uId = localStorage.getItem('uId');
        console.log(uId);
        console.log(loginToken);
        Axios.post('/getval_2017', qs.stringify({
          Action:'getUserInfo',
          acode : loginToken,
          Uid : uId
          })).then(function(res){
            console.log(res.data);
            self.setState({
              userData : res.data
            })
        })
      }
    }

    exit(){//删除缓存token和用户名，跳转到登录页
        localStorage.removeItem('uId');
        localStorage.removeItem('loginToken');
        this.props.router.push('/user');

    }

    componentDidUpdate(prevProps) {


    }

    componentWillUnmount () {

    }


    render(){
        let userData = this.state.userData;
        return(
            <div className="main-con">
                用户个人中心详情列表
                <p>姓名：{userData.Nicename}</p>
                <p>性别：{userData.Sex}</p>
                <p>积分：{userData.Jifen}</p>
                <img src={userData.Pic} alt=""/>
                <Button type="warning" clsName="login-btn" clickEvent={this.exit.bind(this)}>
                    注销
                </Button>
            </div>
        )
    }

}


export default  UserCenter
