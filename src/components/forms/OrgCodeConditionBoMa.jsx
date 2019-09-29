import React from 'react';
import { Select,Form } from 'antd';
import axios from 'axios';
import '../../style/table.less';
import {sysErrorInfo} from '../../Common.jsx';

const FormItem = Form.Item;

class OrgCodeConditionBoMa extends React.Component {
    state = {

    };

    componentWillMount() {
        var roleList = localStorage.getItem('role');
        var cType = roleList.cType; //角色是商户还是资金方
        if(cType==='FUNDER'){
            this.setState({
                funderVisible: '',
                busiVisible: '',
            });
            this.initFunderCodeByRole(roleList);
            this.initBusiGroupCode();
        } else if(cType==='BUSI'){
            this.setState({
                funderVisible: 'none',
                busiVisible: '',
            });
            this.initBusiGroupCode();
        } else {
            this.setState({
                funderVisible: '',
                busiVisible: '',
            });
            this.initFunderCode();
            this.initBusiGroupCode();
        }


        this.setState({
            funderCode:'请选择',
            busiCompFalg: true,
            busiSiteFalg: true,
            busiGroupCode: '请选择',
            busiCompCode: '请选择',
            busiSiteCode: '请选择',
            funderCodeList:[],
            busiGroupCodeList:[],
            busiCompCodeList:[],
            busiSiteCodeList:[]
        });


    }

    // componentDidMount(){
    //     console.log("-------------OrgCodeCondition.componentDidMount-------35---------",this.props);
    //     this.props.onRef(this);
    // }

    componentWillReceiveProps(nextProps) {
        console.log("-------------OrgCodeCondition.componentWillReceiveProps----57------------",nextProps);
    }

    initFunderCode() {
        var thi = this;
        var funderCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',
        {
            "orgType": 'FUNDER'
        }).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    funderCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
                }
            }
            thi.setState({
                funderCodeList: funderCodeList
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }
    initFunderCodeByRole(list) {
        var lists = JSON.parse(list);
        var funderCodeList = [];
        lists.forEach( (item) => {
            funderCodeList.push(<Select.Option key={item['code']}>{item['shortname']}</Select.Option>);
        });
        this.setState({
            funderCodeList: funderCodeList
        });

    }

    initBusiGroupCode() {
        var thi = this;
        var busiGroupCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',
        {
            "orgType": 'BUSI'
        }).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    busiGroupCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
                }
            }
            thi.setState({
                busiGroupCodeList: busiGroupCodeList,
                busiGroupFalg: response.data.List[0]===null ? true : false,

                busiGroupCode: '请选择',
                busiCompCode: '请选择',
                busiSiteCode: '请选择',
                busiCompCodeList:[],
                busiSiteCodeList:[],
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    initBusiGroupCodeByCon() {
        var thi = this;
        var busiGroupCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',
        {
            "orgType": 'BUSI'
        }).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    busiGroupCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
                }
            }
            thi.setState({
                busiGroupCodeList: busiGroupCodeList,
                busiGroupFalg: response.data.List[0]===null ? true : false,

                busiGroupCode: '请选择',
                busiCompCode: '请选择',
                busiSiteCode: '请选择',
                busiCompCodeList:[],
                busiSiteCodeList:[]
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleBusiGroupCode = (value) => {
        console.log("value===="+value);
        this.setState({
            busiGroupCode: value,
        });
        // eslint-disable-next-line
        this.state.busiGroupCode = value;
        this.initBusiCompCode();
    }

    initBusiCompCode() {
        var thi = this;
        var busiCompCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',
        {
            "orgType": 'BUSI',
            "orgGroupCode": this.state.busiGroupCode==='请选择' ? undefined : this.state.busiGroupCode
        }).then(function (response) {
            console.log("-----105",response);
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    busiCompCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
                }
            }
            thi.setState({
                busiCompCodeList: busiCompCodeList,
                busiCompFalg: response.data.List[0]===null ? true : false,
                busiCompCode: '请选择',
                busiSiteCode: '请选择',
                busiSiteCodeList:[]

            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleBusiCompCode = (value) => {
        console.log("value===="+value);
        this.setState({
            busiCompCode: value,
        });
        // eslint-disable-next-line
        this.state.busiCompCode = value;
        this.initBusiSiteCode();
    }

    initBusiSiteCode() {
        var thi = this;
        var busiSiteCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',{
            "orgType": 'BUSI',
            "orgGroupCode": this.state.busiGroupCode==='请选择' ? undefined : this.state.busiGroupCode,
            "orgCompCode": this.state.busiCompCode==='请选择' ? undefined : this.state.busiCompCode
        }).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    busiSiteCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
                }
            }
            thi.setState({
                busiSiteCodeList: busiSiteCodeList,
                busiSiteFalg: response.data.List[0]===null ? true : false,
                busiSiteCode: '请选择',

            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleBusiSiteCode = (value) => {
        console.log("value===="+value);
        this.setState({
            busiSiteCode: value,
        });
    }

    handleFunder = (value) => {
        this.setState({
            funderCode: value,
        });

    }

    reset = ()=>{
        this.setState({
            funderCode:'请选择',
            busiCompFalg: true,
            busiSiteFalg: true,
            busiGroupCode: '请选择',
            busiCompCode: '请选择',
            busiSiteCode: '请选择',
        });
    }

    render() {
        return (
            <span>
                <span style={{display : this.state.funderVisible }} >
                <FormItem label={'资金方：'}>
                    <Select style={{ width: 160 }} onChange={this.handleFunder} value={this.state.funderCode} >
                        {this.state.funderCodeList}
                    </Select>
                </FormItem>
                </span>
                <span style={{display : this.state.busiVisible }} >
                <FormItem label={'商户集团信息：'}>
                    <Select style={{ width: 160 }} onChange={this.handleBusiGroupCode} value={this.state.busiGroupCode} disabled={this.state.busiGroupFalg}>
                        {this.state.busiGroupCodeList}
                    </Select>
                </FormItem>
                <FormItem label={'商户公司信息：'}>
                    <Select style={{ width: 160 }} onChange={this.handleBusiCompCode} value={this.state.busiCompCode} disabled={this.state.busiCompFalg} >
                        {this.state.busiCompCodeList}
                    </Select>
                </FormItem>
                <FormItem label={'商户网点信息：'}>
                    <Select style={{ width: 160 }} onChange={this.handleBusiSiteCode} value={this.state.busiSiteCode} disabled={this.state.busiSiteFalg} >
                        {this.state.busiSiteCodeList}
                    </Select>
                </FormItem>
                </span>
            </span>

        );
    }
}

export default OrgCodeConditionBoMa;