import React from 'react';
import { Select,Card,Form,Button } from 'antd';
import OrgSignListTable from './OrgSignListTable';
import axios from 'axios';
import '../../../style/table.less';
import {selectUtils} from '../../../SelectUtils.jsx';
import {sysErrorInfo} from '../../../Common.jsx';
import {handleQueryListOk} from "../../../Common";

const FormItem = Form.Item;

class OrgSignList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			List: [],
		};
		this.OrgSignListTableRef = React.createRef()
	}
    

    componentWillMount() {
        this.queryOrgSignList({});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            statusOption:'请选择',
            signChannel:'请选择',
        });
    }
    queryOrgSignList(str) {

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgsign/list',
            str
            ).then(function (response) {

            if(response.data.result === 1){
                const List = response.data.retObj;
                thi.setState({
                    List
                });
                thi.OrgSignListTableRef.current.clearRowId()
                handleQueryListOk(List)
            } else {
                sysErrorInfo()
            }

        }).catch(function (error) {
            sysErrorInfo(error)
        });
    }


    handleFilterSubmit = ()=>{
        var jsonStr = {
            "signChannel" : this.state.signChannel==='请选择'? undefined : this.state.signChannel,
            "status": this.state.statusOption==='请选择'? undefined : this.state.statusOption,
        }
        console.log("---------json-------",jsonStr);
        this.queryOrgSignList(jsonStr);
    }

    handleStatusOption = (value) => {
        this.setState({statusOption: value});
    }

    handleSignChannel = (value) => {
        this.setState({signChannel: value});
    }

    reset = ()=>{
        this.setState({
            statusOption:'请选择',
            signChannel:'请选择',
        });
    }

    render() {
        console.log("render----list",this.state.List);
        return (
            <div className="gutter-example">
                <Card title="机构签章认证" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'状态：'}>
                            <Select style={{ width: 120 }} onChange={this.handleStatusOption} value={this.state.statusOption} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <FormItem label={'签章渠道：'}>
                            <Select style={{ width: 170 }} onChange={this.handleSignChannel} value={this.state.signChannel} >
                                {selectUtils('signChannel')}
                            </Select>
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <OrgSignListTable List={this.state.List} parent={this} ref={this.OrgSignListTableRef} />
                </Card>
            </div>
        );
    }
}

export default OrgSignList;