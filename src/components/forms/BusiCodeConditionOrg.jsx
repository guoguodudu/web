import React from 'react';
import { Select,Form } from 'antd';
import axios from 'axios';
import '../../style/table.less';
import {selectUtils} from '../../SelectUtils.jsx';
import {sysErrorInfo} from '../../Common.jsx';


const FormItem = Form.Item;

class BusiCodeConditionOrg extends React.Component {

    state = {
        List: [],
    };

    componentWillMount() {
        console.log("---BusiCodeConditionOrg....componentWillMount-----");
        this.setState({
            orgType:'请选择',
            busiGroupFalg: true,
            busiCompFalg: true,
            busiSiteFalg: true,
            busiGroupCode: '请选择',
            busiCompCode: '请选择',
            busiSiteCode: '请选择',
            busiGroupCodeList:[],
            busiCompCodeList:[],
            busiSiteCodeList:[]
        });
    }

    componentDidMount(){
        console.log("-------------BusiCodeConditionOrg.componentDidMount----------------");
        this.props.onRef(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("-------------BusiCodeConditionOrg.componentWillReceiveProps----------------");

    }

    initBusiGroupCodeOption() {
        var thi = this;
        var busiGroupCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',
        {
            "orgType": this.state.orgType==='请选择' ? undefined : this.state.orgType
        }).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                busiGroupCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
            }
            thi.setState({
                busiGroupCodeList: busiGroupCodeList,
                busiGroupFalg: response.data.List.length===0 ? true : false,

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

    handleBusiGroupCodeOption = (value) => {
        console.log("value ====   69  ===="+value);
        console.log("orgType=============",this.state.orgType)
        this.setState({
            busiGroupCode: value,
        });
        // eslint-disable-next-line
        this.state.busiGroupCode = value;

        if(this.state.orgType !== 'FUNDER'){
            this.initBusiCompCodeOption();
        }
    }

    initBusiCompCodeOption() {
        var thi = this;
        var busiCompCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',
        {
            "orgType": this.state.orgType==='请选择' ? undefined : this.state.orgType,
            "orgGroupCode": this.state.busiGroupCode==='请选择' ? undefined : this.state.busiGroupCode
        }).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    busiCompCodeList.push(<Select.Option key={response.data.List[i].code}>{response.data.List[i].shortname}</Select.Option>);
                }
            }
            thi.setState({
                busiCompCodeList: busiCompCodeList,
                busiCompFalg: response.data.List.length===0 ? true : false,
                busiCompCode: '请选择',
                busiSiteCode: '请选择',
                busiSiteCodeList:[]

            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleBusiCompCodeOption = (value) => {
        console.log("value===="+value);
        this.setState({
            busiCompCode: value,
        });
        // eslint-disable-next-line
        this.state.busiCompCode = value;
        this.initBusiSiteCodeOption();
    }

    initBusiSiteCodeOption() {
        var thi = this;
        var busiSiteCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgProfileList',{
            "orgType": this.state.orgType==='请选择' ? undefined : this.state.orgType,
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
                busiSiteFalg: response.data.List.length===0 ? true : false,

                busiSiteCode: '请选择',

            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleBusiSiteCodeOption = (value) => {
        console.log("value===="+value);
        this.setState({
            busiSiteCode: value,
        });
    }

    handleOrgTypeOption = (value) => {
        console.log("handleOrgTypeOption",value);
        this.setState({
            orgType: value,
        });
        // eslint-disable-next-line
        this.state.orgType = value;
        console.log("handleOrgTypeOption.this.state.orgType",this.state);
        this.initBusiGroupCodeOption();
    }

    reset = ()=>{
        console.log("=============reset()===============")
        this.setState({
            orgType:'请选择',
            busiGroupFalg: true,
            busiCompFalg: true,
            busiSiteFalg: true,
            busiGroupCode: '请选择',
            busiCompCode: '请选择',
            busiSiteCode: '请选择',
            busiGroupCodeList:[],
            busiCompCodeList:[],
            busiSiteCodeList:[]
        });
    }

    render() {
        console.log("BusiCodeConditionOrg--------render----list",this.state.List);
        return (
            <span>
                <FormItem label={'机构类型：'}>
                    <Select style={{ width: 160 }} onChange={this.handleOrgTypeOption} value={this.state.orgType} >
                    {selectUtils('serviceOrgType')}
                    </Select>
                </FormItem>
                <FormItem label={'机构集团信息：'}>
                    <Select style={{ width: 160 }} onChange={this.handleBusiGroupCodeOption} value={this.state.busiGroupCode} disabled={this.state.busiGroupFalg}>
                                        {this.state.busiGroupCodeList}
                    </Select>
                </FormItem>
                <FormItem label={'机构公司信息：'}>
                    <Select style={{ width: 160 }} onChange={this.handleBusiCompCodeOption} value={this.state.busiCompCode} disabled={this.state.busiCompFalg} >
                                        {this.state.busiCompCodeList}
                    </Select>
                </FormItem>
                <FormItem label={'机构网点信息：'}>
                    <Select style={{ width: 160 }} onChange={this.handleBusiSiteCodeOption} value={this.state.busiSiteCode} disabled={this.state.busiSiteFalg} >
                                        {this.state.busiSiteCodeList}
                    </Select>
                </FormItem>
            </span>

        );
    }
}

export default BusiCodeConditionOrg;