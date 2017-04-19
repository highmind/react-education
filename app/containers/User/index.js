import React, { ReactDOM,Component } from 'react'
import {Button} from '../../components';
import qs from 'qs';
import Axios from 'axios'; //引入axios处理ajax
import md5 from 'md5';  // 引入md5加密密码
import './index.css';
//用户登录
class User extends Component{
    constructor(props){
        super(props);
        this.state = {
        }
        this.props.actions.navBarSet("个人中心")
    }


    componentDidMount(){
      let loginToken = localStorage.getItem('loginToken');
      console.log(loginToken)
      if(loginToken == null){ //如果获取不到缓存的token
       console.log('token不存在')
        // 跳转到登录页
        this.props.router.push('/user');
      }else{//否则跳转到个人用户中心
        console.log('跳转到usercenter');
        this.props.router.push('/usercenter');
      }
    }

    componentDidUpdate(prevProps) {


    }

    componentWillUnmount () {

    }

    handleSubmit(){
      let username = this.refs.username.value.trim();
      let password = this.refs.password.value.trim();
      let userInfo = qs.stringify({
        "Action" : 'Login',
        "user" : username,
        "pwd" : md5(password),
        "ip" : '192.168.0.2'
      });
      console.log(userInfo);
      let self = this;
      // 请求远程真实接口数据，进行登录
      Axios.post('/getval_2017', userInfo)
      .then(function (response) {
        let data = response.data;
        // 登录失败提示
        if(typeof(data.errorCode) != 'undefined'){
          console.log(data.errorMessage);

        }else{ //登录成功跳转导航home组件
          console.log('登录成功');
          console.log(data.acode)
          localStorage.setItem('loginToken', data.acode);
          localStorage.setItem('uId', data.username);
          self.props.router.push('/home');
        }
      })
      .catch(function (response) {
        console.log(response);
      });


    }

    render(){
        return(
            <div className="main-con">
                <form>
                  <input ref="username" className="user-input user-name" placeholder="用户名" type="text"/>
                  <input ref="password" className="user-input user-pwd" placeholder="密码" type="password"/>
                  <Button type="warning" clsName="login-btn" clickEvent={this.handleSubmit.bind(this)}>
                      登录
                  </Button>
                </form>
            </div>
        )
    }

}


export default  User
