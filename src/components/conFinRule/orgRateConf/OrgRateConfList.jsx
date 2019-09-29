import React from 'react';
import { Select,Card,Form,Button, Input } from 'antd';
import OrgRateConfListTable from './OrgRateConfListTable';
import axios from 'axios';
import '../../../style/table.less';
import OrgCodeCondition from '../../forms/common/OrgCodeCondition';
import {selectUtils} from '../../../SelectUtils.jsx';
import {handleQueryListOk, removeNullValue ,sysErrorInfo} from '../../../Common.jsx';

const FormItem = Form.Item;

class OrgRateConfList extends React.Component {
    state = {
        List: [],
    };

    componentWillMount() {
        // this.queryOrgRateConfList({}); //初始化还款日规则表
        this.setState({
            pOrgType:'ALL',
		});
		this.changeOneState = this.changeOneState.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            statusOption:'请选择',
            orgConType:'请选择',
            orgConStatus:'请选择',
        });
    }

    queryOrgRateConfList(istr) {
		const str = removeNullValue (istr)
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgrateapi/queryOrgConRateConfList',
            str
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
                    thi.setState({
                        List: response.data.List
					});
					handleQueryListOk(response.data.List)
                } else {
                    sysErrorInfo()
                }
        }).catch(function (error) {
            sysErrorInfo(error)
        });
    }

    OnRefOrgCode = (ref) => {
        this.orgCodeCondition = ref;
    }

    handleFilterSubmit = ()=>{

        console.log("-----handleFilterSubmit-----status-",this.state.statusOption)
        var jsonStr = {
            "rateStatus" : this.state.statusOption==='请选择'? undefined : this.state.statusOption,
            "orgConType" : this.state.orgConType==='请选择'? undefined : this.state.orgConType,
            "funderCode": this.orgCodeCondition.state.funderCode==='请选择'? undefined : this.orgCodeCondition.state.funderCode,
            "busiGroupCode" : this.orgCodeCondition.state.busiGroupCode==='请选择'? undefined : this.orgCodeCondition.state.busiGroupCode,
            "busiCompCode" : this.orgCodeCondition.state.busiCompCode==='请选择'? undefined : this.orgCodeCondition.state.busiCompCode,
            "busiSiteCode" : this.orgCodeCondition.state.busiSiteCode==='请选择'? undefined : this.orgCodeCondition.state.busiSiteCode,
            "conStatus" : this.state.orgConStatus==='请选择'? undefined : this.state.orgConStatus,
            "orgConSn" : this.state.orgConSn==='请选择' || this.state.orgConSn===''? undefined : this.state.orgConSn,
        }
        console.log("---------json-------",jsonStr);
        this.queryOrgRateConfList(jsonStr);
    }

    handleChangeStatusOption = (value) => {
        this.setState({statusOption: value});
    }

    handleOrgConTypeOption = (value) => {
        this.setState({orgConType: value});
    }

    handleFunderCodeCode = (value) => {
        this.setState({funderCode: value});
    }

    handleOrgConStatus = (value) => {
        this.setState({orgConStatus: value});
    }

    reset = ()=>{
        this.setState({
            statusOption:'请选择',
            orgConType:'请选择',
            funderCode:'请选择',
			orgConStatus:'请选择',
			orgConSn: undefined,
        });
        this.orgCodeCondition.reset();
    }

	changeOneState (e){
		if(e){
			console.log(e)
			const {value: targetV,name} = e.target
			console.log(targetV)
			this.setState({
				[name]: targetV
			})
		}
	}
    render() {
		console.log("render----list",this.state.List);
		const { orgConSn } = this.state
        return (
            <div className="gutter-example">
                <Card title="机构合同费率维护" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
						<Form.Item label="机构合同编号">
							<Input
								placeholder="请输入"
								name="orgConSn"
								value={orgConSn}
								onChange={
									this.changeOneState
								}
							/>
						</Form.Item>
                        <FormItem label={'状态：'}>
                            <Select style={{ width: 120 }} onChange={this.handleChangeStatusOption} value={this.state.statusOption} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <FormItem label={'机构合同类型：'}>
                            <Select style={{ width: 120 }} onChange={this.handleOrgConTypeOption} value={this.state.orgConType} >
                                {selectUtils('orgConType')}
                            </Select>
                        </FormItem>
                        <OrgCodeCondition onRef={this.OnRefOrgCode} parent={this} />
                        <FormItem label={'合同状态：'}>
                            <Select style={{ width: 120 }} onChange={this.handleOrgConStatus} value={this.state.orgConStatus} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <FormItem>
                        <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <OrgRateConfListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default OrgRateConfList;