import React from 'react';
import { Select,Card,Form,Button } from 'antd';
import OrgConfRuleListTable from './OrgConfRuleListTable';
import axios from 'axios';
import '../../../style/table.less';
import BusiCodeConditionOrg from '../../forms/BusiCodeConditionOrg.jsx';
import {selectUtils} from '../../../SelectUtils.jsx';
import {handleQueryListOk,messageError} from '../../../Common.jsx';

const FormItem = Form.Item;

class OrgConfRuleList extends React.Component {

    state = {
        List: [],
    };

    // componentDidMount

    componentWillMount() {

        this.queryOrgConfRuleList({}); //初始化机构信息表

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            statusOption:'请选择',
        });
        //if (nextProps === this.props){return false}
        // this.queryOrgConfRuleList({}); //初始化机构信息表
    }

    queryOrgConfRuleList(str) {

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgList',
            str
            ).then(function (response) {
                console.log("response.data.List",response);
                if(response.data.STATUS==='200'){
					const {data:{List}} = response
                    thi.setState({
                        List
					});
					handleQueryListOk(List)
                }else{
					messageError()
				}
        }).catch(function (error) {
			messageError()            
        });
    }

    OnRefBusiCode = (ref) => {
        this.busiCodeCondition = ref;
    }


    handleFilterSubmit = ()=>{
        var status = this.state.statusOption;
        var orgType = this.busiCodeCondition.state.orgType;
        var busiGroupCode = this.busiCodeCondition.state.busiGroupCode;
        var busiCompCode = this.busiCodeCondition.state.busiCompCode;
        var busiSiteCode = this.busiCodeCondition.state.busiSiteCode;


        var jsonStr = {
            "status" : status === '请选择' ? undefined : status ,
            "orgType" : orgType === '请选择' ? undefined : orgType ,
            "orgGroupCode" : busiGroupCode === '请选择' ? undefined : busiGroupCode ,
            "orgCompCode" : busiCompCode === '请选择' ? undefined : busiCompCode ,
            "orgSiteCode" : busiSiteCode === '请选择' ? undefined : busiSiteCode ,
        }
        console.log("---------json-------",jsonStr);
        this.queryOrgConfRuleList(jsonStr);
    }

    handleChangeStatusOption = (value) => {
        this.setState({statusOption: value});
    }

    reset = ()=>{
        this.setState({statusOption:'请选择'});
        this.busiCodeCondition.reset();
    }

    render() {
        console.log("render----list",this.state.List);
        return (
            <div className="gutter-example">
                <Card title="机构信息" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'状态：'}>
                            <Select style={{ width: 120 }} onChange={this.handleChangeStatusOption} value={this.state.statusOption} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <BusiCodeConditionOrg onRef={this.OnRefBusiCode} parent={this} />
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <OrgConfRuleListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default OrgConfRuleList;