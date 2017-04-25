import React, { Component } from 'react'
import Axios from 'axios'; //引入axios处理ajax
import {Animate} from 'react-move'; //引入react-move库处理动画
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
        const data1 = this.state.data;
        const detailHeadstyle = {backgroundImage: `url(${data1.kc_img})`};
        return(
            <div className="detail-wrap">
                <Loading active={this.state.loading} />
              <Animate default={{opacity : 0}}
                data={{opacity : `${this.state.loading ? 0 : 1}`}}
                duration={300} easing='easeIn'>

                {data => (

                <div style={{opacity: `${data.opacity}`}}>
                    <div className="detail-con">

                        <div className="detail-head">
                          <div className="img-filter" style={detailHeadstyle}></div>
                          <div className="detail-h-l">
                            <img width="100%" src={`${data1.kc_img}`} alt=""/>
                          </div>
                          <div className="detail-h-r">
                            <p className="detail-title">{data1.kc_title}</p>
                            <p>{data1.intro}</p>
                            <p className="detail-score">{data1.kc_money}分</p>
                            <p>{data1.teacher}/{data1.keshi}课时</p>
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
                            {data1.teacher}
                          </p>
                          <p>{data1.kc_info}</p>
                        </div>

                    </div>
                </div>
                )}
                </Animate>
            </div>

        )
    }

}
export default  Detail;
