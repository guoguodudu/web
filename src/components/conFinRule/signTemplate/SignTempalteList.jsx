import React from 'react';
import { Input, Select,Card,Form,Button } from 'antd';
import '../../../style/table.less';
import SignTemplateListTable from './SignTemplateListTable';
import {selectUtils} from '../../../SelectUtils.jsx';
import { handleQueryListOk, sysErrorInfo } from "../../../Common";
import {signTemplate} from "@/api";
const FormItem = Form.Item;

class SignTempalteList extends React.Component {

    componentWillMount() {
        this.querySignTemplateList({}); //初始化
        this.setState({
            status:undefined,
            fileType:undefined,
            tempId:undefined,
        });
   }

   componentWillReceiveProps(nextProps) {
        this.querySignTemplateList({}); //初始化
    }

    querySignTemplateList(str) {
        var thi = this;
        signTemplate.list(str).then(function (response) {
            thi.setState({
                List: response,
            });
            handleQueryListOk(response)
        }).catch(function (error) {
            console.log("error:",error);
			sysErrorInfo()
        });
    }

    handleFilterSubmit = ()=>{
        var jsonStr = {
            "status" : this.state.status,
            "fileType" : this.state.fileType,
            "tempId" : this.state.tempId,
        }
        this.querySignTemplateList(jsonStr);
    }

    handleStatus = (value) => {
        this.setState({status: value});
    }
    //文件类型
    handleFileType = (value) => {
        this.setState({
            fileType :value,
        });
    }

    //模板ID
    handleTempId = (e) => {
        this.setState({ tempId: e.target.value });
    }

     //重置
     reset = ()=>{
        this.setState({
            status:undefined,
            fileType:undefined,
            tempId:undefined,
        });
    }

    render() {
        return (
            <div className="gutter-example">
                <Card title="签章模板管理" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'状态：'}>
                            <Select style={{ width: 120 }} placeholder="请选择" onChange={this.handleStatus} value={this.state.status} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <FormItem label={'文件类型：'}>
                            <Select style={{ width: 120 }} placeholder="请选择" onChange={this.handleFileType} value={this.state.fileType} >
                                {selectUtils('signfileType')}
                            </Select>
                        </FormItem>
                        <FormItem label={'模板ID：'}>
                            <Input style={{ width: 120 }} value={this.state.tempId} onChange={this.handleTempId} />
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <SignTemplateListTable record={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }

}

export default SignTempalteList;