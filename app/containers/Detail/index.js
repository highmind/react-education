import React, { Component } from 'react'
import Axios from 'axios'; //引入axios处理ajax
import qs from 'qs';
import {Loading, Button} from '../../components';
// 只使用一个组件
// import Button from 'antd-mobile/lib/button'
// import 'antd-mobile/lib/button/style/index.css'
// import {Button} from 'antd-mobile';// 整个引入
import './index.css';
class Detail extends Component{
    constructor(props){
        super(props);
        this.state = {
            data : {},
            actor: [],
            loading : true
        }
    }

    getData(kc_id, kc_types){
        let self = this;
        // let url = 'http://mockdata/detail';

        Axios.post('/getval_2017', qs.stringify({
          Action:'GetCourseInfo',
          Kc_types : kc_types,
          kc_id : kc_id
          })).then(function(res){
            console.log(res.data)
            self.setState({
                data : res.data,
                // actor: filmData.actors,
                loading : false
            })
            self.props.actions.navBarSet('中仕学社')
          })

        window.scrollTo(0, 0);
    }

    componentDidMount(){
      //接收router多个参数
      console.log(this.props.location.query);
        // 初始化数据
        let kc_id = this.props.location.query.id;
        let kc_types = this.props.location.query.kc_types;
        console.log(kc_types);
        console.log(kc_id);
        this.getData(kc_id, kc_types);
    }

    getActor(data){
       let tmpStr = '';
       data.map(function(dData, index){
         if(index == 0){
           tmpStr += ' ' + dData.name;
         }
         else{
           tmpStr += ' / ' + dData.name;
         }
       })
       return tmpStr;
    }

    render(){
        const data = this.state.data;
        const detailHeadstyle = {backgroundImage: `url(${data.kc_img})`};
        return(
            <div className="detail-wrap">
                <Loading active={this.state.loading} />
                <div className={this.state.loading ? "con-hide" : "con-show"}>
                    <div className="detail-con">

                        <div className="detail-head">
                          <div className="img-filter" style={detailHeadstyle}></div>
                          <div className="detail-h-l">
                            <img width="100%" src={data.kc_img} alt=""/>
                          </div>
                          <div className="detail-h-r">
                            <p className="detail-title">{data.kc_title}</p>
                            <p>{data.intro}</p>
                            <p className="detail-score">{data.kc_money}分</p>
                            <p>{data.teacher}/{data.keshi}课时</p>
                          </div>
                        </div>
                        <div className="pay-btn-wrap">
                          <Button clsName="pay-btn">
                            立即购买
                          </Button>
                        </div>
                        <div className="detail-main">
                          <p>
                            <span>教师：</span>
                            {data.teacher}
                          </p>
                          <p>{data.kc_info}</p>
                        </div>

                    </div>
                </div>
            </div>

        )
    }

}
export default  Detail;
