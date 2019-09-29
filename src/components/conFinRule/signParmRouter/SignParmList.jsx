import React from 'react';
import { Select,Card,Form,Button } from 'antd';
import { handleQueryListOk, sysErrorInfo} from '../../../Common.jsx';
import '../../../style/table.less';
import SignParmListTable from './SignParmListTable';
import {signTemplate, signParm} from "@/api";

const FormItem = Form.Item;

class SignParmList extends React.Component {

    componentWillMount() {
        this.setState({
            
        });
        this.querySignParmList({}); //初始化
        this.initTempId();
   }

   componentWillReceiveProps(nextProps) {
        
        this.querySignParmList({}); //初始化
        this.initTempId();
    }

    initTempId() {
        console.log(" ---- initTempId ---- ");
        var thi = this;
        var tempList = [];
        signTemplate.queryTempId({}).then(function (response) {
            for (var i = 0; i < response.length; i++) {
                if(response[i] != null){
                    tempList.push(<Select.Option key={response[i].tempId}>{response[i].tempName}</Select.Option>);
                }
            }
            thi.setState({
                tempList: tempList
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    querySignParmList(str) {
        console.log("querySignParmList --- ",str);
        var thi = this;
        signParm.list(str).then(function (response) {
            thi.setState({
                List: response,
            });
			handleQueryListOk(response)
			
        }).catch(function (error) {
            sysErrorInfo(error)            
        });
    }

    handleFilterSubmit = ()=>{
        var jsonStr = {
            "tempId" : this.state.tempId,
        }
        this.querySignParmList(jsonStr);
    }

    handleTempId = (value) => {
        this.setState({tempId: value});
    }

     //重置
     reset = ()=>{
        this.setState({
            tempId:undefined,
        });
    }

    render() {
        return (
            <div className="gutter-example">
                <Card title="签章模板参数配置" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'模板：'}>
                            <Select style={{ width: 170 }} placeholder="请选择" onChange={this.handleTempId} value={this.state && this.state.tempId } >
                                {this.state.tempList}
                            </Select>
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <SignParmListTable record={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }

}

export default SignParmList;