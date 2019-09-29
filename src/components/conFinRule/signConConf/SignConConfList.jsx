import React from 'react';
import { Select,Card,Form,Button,Input } from 'antd';
import SignConConfListTable from './SignConConfListTable';
import axios from 'axios';
import '../../../style/table.less';
import {selectUtils} from '../../../SelectUtils.jsx';
import { handleQueryListOk, sysErrorInfo} from '../../../Common.jsx';

const FormItem = Form.Item;

class SignConConfList extends React.Component {

    state = {
        List: [],
    };

    componentWillMount() {
        this.querySignConConfList({});
        this.initTempId();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            statusOption:undefined,
            orgConSn:undefined,
            tempId:undefined,
        });
        //this.querySignConConfList({});
    }
    initTempId() {
        console.log(" ---- initTempId ---- ");
        var thi = this;
        var tempList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/signtemplateapi/queryTempList',
        {}).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    tempList.push(<Select.Option key={response.data.List[i].tempId}>{response.data.List[i].tempName}</Select.Option>);
                }
            }
            thi.setState({
                tempList: tempList
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }
    querySignConConfList(str) {

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/sccapi/querySignConConfList',
            str
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
					const {data:{List}} = response
                    thi.setState({
                        List
					});
					handleQueryListOk(List)
                } else {
                    sysErrorInfo()
                    console.log("error:",response.data.CONTENT);
                }

        }).catch(function (error) {
            sysErrorInfo(error)
        });
    }


    handleFilterSubmit = ()=>{
        var jsonStr = {
            "orgConSn" : this.state.orgConSn,
            "tempId" : this.state.tempId,
            "status": this.state.statusOption,
        }
        console.log("---------json-------",jsonStr);
        this.querySignConConfList(jsonStr);
    }

    handleStatusOption = (value) => {
        this.setState({statusOption: value});
    }

    handleOrgConSn = (e) => {
        this.setState({orgConSn: e.target.value});
    }

    handleTempId = (value) => {
        this.setState({tempId: value});
    }

    reset = ()=>{
        this.setState({
            statusOption:undefined,
            orgConSn:undefined,
            tempId:undefined,
        });
    }

    render() {
        console.log("render----list",this.state.List);
        return (
            <div className="gutter-example">
                <Card title="签章模板启用配置" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'状态：'}>
                            <Select style={{ width: 120 }} placeholder="请选择" onChange={this.handleStatusOption} value={this.state.statusOption} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <FormItem label={'机构合同编号：'}>
                            <Input style={{ width: 200 }} value={this.state.orgConSn} onChange={this.handleOrgConSn} placeholder="请输入合同编号" />
                        </FormItem>
                        <FormItem label={'模板名称：'}>
                            <Select style={{ width: 170 }} placeholder="请选择" onChange={this.handleTempId} value={this.state.tempId} >
                                {this.state.tempList}
                            </Select>
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <SignConConfListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default SignConConfList;