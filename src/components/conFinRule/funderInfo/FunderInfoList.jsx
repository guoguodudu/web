import React from 'react';
import { Select,Card,Form,Button,Input } from 'antd';
import FunderInfoListTable from './FunderInfoListTable';
import axios from 'axios';
import '../../../style/table.less';
import { handleQueryListOk, sysErrorInfo } from '../../../Common.jsx';

const FormItem = Form.Item;

class FunderInfoList extends React.Component {

    state = {
        List: [],
    };

    componentWillMount() {
        this.queryOcrConfList({});
      //  this.initVendorCode();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            statusOption:'请选择',
            vendorCode:'请选择',
        });

    }

    queryOcrConfList(str) {

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/funder/list',
            str
            ).then(function (response) {

            console.log('200--',response)
                if(response.data.result === 1){
					const List = response.data.retObj;
                    thi.setState({
                        List
					});
					handleQueryListOk(List)
                } else {
                    sysErrorInfo()
                }

        }).catch(function (error) {
            sysErrorInfo(error)
        });
    }

    initVendorCode() {
        var thi = this;
        var vendorCodeList = [];
        axios.post(localStorage.getItem('ip_port_acc_core')+'/ocrapi/queryOcrConfList',
        {}).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    vendorCodeList.push(<Select.Option key={response.data.List[i].vendorCode}>{response.data.List[i].vendorName}</Select.Option>);
                }
            }
            thi.setState({
                vendorCodeList: vendorCodeList,
                vendorCodeDisa: vendorCodeList.length===0 ? true : false,
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }


    handleFilterSubmit = ()=>{
        var jsonStr = {
            "funderCode" : this.state.funderCode==='请选择'? undefined : this.state.funderCode,
            "funderName" : this.state.funderName==='请选择'? undefined : this.state.funderName,
            "funderShortName" : this.state.funderShortName==='请选择'? undefined : this.state.funderShortName,
        }
        this.queryOcrConfList(jsonStr);
    }

    handlefunderCode = (e) => {
        this.setState({ funderCode: e.target.value});
    }

    handlefunderName = (e) => {
        this.setState({ funderName: e.target.value});
    }

    handlefunderShortName = (e) => {
        this.setState({ funderShortName: e.target.value});
    }

    reset = ()=>{
        this.setState({
            funderCode:undefined,
            funderName:undefined,
            funderShortName:undefined
        });
    }

    render() {
        return (
            <div className="gutter-example">
                <Card title="资金方信息" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'资金方代码：'}>
                            <Input style={{ width: 200 }} value={this.state.funderCode} onChange={this.handlefunderCode} placeholder="请输入资金方代码" />
                        </FormItem>
                        <FormItem label={'资金方全称：'}>
                            <Input style={{ width: 200 }} value={this.state.funderName} onChange={this.handlefunderName} placeholder="请输入资金方全称" />
                        </FormItem>
                        <FormItem label={'资金方简称：'}>
                            <Input style={{ width: 200 }} value={this.state.funderShortName} onChange={this.handlefunderShortName} placeholder="请输入资金方简称" />
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <FunderInfoListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default FunderInfoList;