import React from 'react';
import { Select,Card,Form,Button,Input } from 'antd';
import OrgConConfListTable from './OrgConConfListTable';
import axios from 'axios';
import '../../../style/table.less';
import OrgCodeCondition from '../../forms/common/OrgCodeCondition';
import {selectUtils} from '../../../SelectUtils.jsx';
import {handleQueryListOk,removeNullValue ,removeAllSpace,sysErrorInfo, changeOneState} from '../../../Common.jsx';

const FormItem = Form.Item;

class OrgConConfList extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			List: [],
		};
		this.changeOneState = changeOneState.bind(this);
	}

    

    componentWillMount() {

        this.queryOrgConConfList({}); //初始化还款日规则表
        this.setState({
            pOrgType:'ALL',

        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            orgConType:'请选择',
            funderCode:'请选择',
            statusOption:'请选择',
            pOrgType:'ALL',
        });
        this.queryOrgConConfList({}); //初始化还款日规则表
    }

    queryOrgConConfList(istr) {
		const str = removeNullValue (istr)
        console.log("---------------queryOrgConConfList-str--------------35-----------",str);
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/queryOrgConConfList',
            str
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
					const {data:{List}} = response
                    thi.setState({
                        List: List
					});
					handleQueryListOk(List)					
                    return response.data;
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
        var jsonStr = {
            "status" : this.state.statusOption==='请选择'? undefined : this.state.statusOption,
            "orgConType" : this.state.orgConType==='请选择'? undefined : this.state.orgConType,
            "funderCode": this.orgCodeCondition.state.funderCode==='请选择'? undefined : this.orgCodeCondition.state.funderCode,
            "busiGroupCode" : this.orgCodeCondition.state.busiGroupCode==='请选择'? undefined : this.orgCodeCondition.state.busiGroupCode,
            "busiCompCode" : this.orgCodeCondition.state.busiCompCode==='请选择'? undefined : this.orgCodeCondition.state.busiCompCode,
            "busiSiteCode" : this.orgCodeCondition.state.busiSiteCode==='请选择'? undefined : this.orgCodeCondition.state.busiSiteCode,
            "orgConSn" :( this.state.orgConSn==='请选择'|| this.state.orgConSn === null ||!!removeAllSpace(this.state.orgConSn)===false)? undefined : this.state.orgConSn,
        }
        this.queryOrgConConfList(jsonStr);
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
			orgConSn: undefined
        });
        this.orgCodeCondition.reset();
    }

    render() {
		const {orgConSn} = this.state
        return (
            <div className="gutter-example">
                <Card title="合同维护规则" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
						<Form.Item label="机构合同编号">
							<Input
								placeholder="请输入"
								name="orgConSn"
								value={orgConSn}
								allowClear
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
                        <FormItem>
                        <Button icon="search" type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                        <Button icon="sync" onClick={this.reset}>重置</Button>
                        </FormItem>
                    </Form>
                    <br />
                    <OrgConConfListTable List={this.state.List} parent={this} />
                </Card>
            </div>
        );
    }
}

export default OrgConConfList;