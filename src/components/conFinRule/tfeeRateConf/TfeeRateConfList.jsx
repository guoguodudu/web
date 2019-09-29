import React from 'react';
import { Select,Card,Form,Button } from 'antd';
import TfeeRateConfListTable from './TfeeRateConfListTable';
import axios from 'axios';
import '../../../style/table.less';
import OrgCodeCondition from '../../forms/common/OrgCodeCondition';
import {selectUtils} from '../../../SelectUtils.jsx';
import { handleQueryListOk, sysErrorInfo } from '../../../Common.jsx';

const FormItem = Form.Item;

class TfeeRateConfList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			List: [],
		};
		this.TfeeRateConfListTable = React.createRef()
	}
    

    componentWillMount() {
        this.queryTfeeRateConfList({});

        this.setState({
            pOrgType:'ALL',
			statusOption:'请选择',
			orgConType:'请选择',
			orgConStatus:'请选择',
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            statusOption:'请选择',
            orgConType:'请选择',
            orgConStatus:'请选择',
        });

    }

    queryTfeeRateConfList(str) {

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/tfeerateapi/queryTfeeRateConfList',
            str
            ).then(function (response) {
				thi.TfeeRateConfListTable.current.clearRowId()
                console.log("response",response);
                if(response.data.STATUS==='200'){
					const {data:{List}} = response
                    thi.setState({
                        List: response.data.List
					});
					handleQueryListOk(List)					
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
            "tfee_status" : this.state.statusOption==='请选择'? undefined : this.state.statusOption,
            "orgConType" : this.state.orgConType==='请选择'? undefined : this.state.orgConType,
            "funderCode": this.orgCodeCondition.state.funderCode==='请选择'? undefined : this.orgCodeCondition.state.funderCode,
            "busiGroupCode" : this.orgCodeCondition.state.busiGroupCode==='请选择'? undefined : this.orgCodeCondition.state.busiGroupCode,
            "busiCompCode" : this.orgCodeCondition.state.busiCompCode==='请选择'? undefined : this.orgCodeCondition.state.busiCompCode,
            "busiSiteCode" : this.orgCodeCondition.state.busiSiteCode==='请选择'? undefined : this.orgCodeCondition.state.busiSiteCode,
            "conStatus" : this.state.orgConStatus==='请选择'? undefined : this.state.orgConStatus,
        }
        console.log("---------json-------",jsonStr);
		this.queryTfeeRateConfList(jsonStr);		
    }

    handleChangeStatusOption = (value) => {
        this.setState({statusOption: value});
    }

    handleOrgConTypeOption = (value) => {
        this.setState({orgConType: value});
    }

    handleOrgConStatus = (value) => {
        this.setState({orgConStatus: value});
    }


    reset = ()=>{
        this.setState({
            statusOption:'请选择',
            orgConType:'请选择',
            orgConStatus:'请选择',
        });
		this.orgCodeCondition.reset();
    }

    render() {
        console.log("render----list",this.state.List);
        return (
            <div className="gutter-example">
                <Card title="富金服费率维护" bordered={false}>
                    <Form layout="inline" className="ant-advanced-search-form" >
                        <FormItem label={'状态：'}>
                            <Select style={{ width: 120 }} onChange={this.handleChangeStatusOption} value={this.state.statusOption} >
                                {selectUtils('ruleStatus')}
                            </Select>
                        </FormItem>
                        <FormItem label={'机构合同类型：'}>
                            <Select style={{ width: 150 }} onChange={this.handleOrgConTypeOption} value={this.state.orgConType} >
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
                    <TfeeRateConfListTable List={this.state.List} parent={this} ref={this.TfeeRateConfListTable} />
                </Card>
            </div>
        );
    }
}

export default TfeeRateConfList;