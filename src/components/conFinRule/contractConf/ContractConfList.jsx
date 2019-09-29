import React from 'react';
import { Select,Card,Form,Button,Collapse } from 'antd';
import ContractConfListTable from './ContractConfListTable';
import '../../../style/table.less';
import SupFunderCodeConditionAuth from '../../forms/common/SupFunderCodeConditionAuth';
import {selectUtils} from '../../../SelectUtils.jsx';
import { handleQueryListOk } from '../../../Common.jsx';
import {contractConf} from "@/api";
const FormItem = Form.Item;
const Panel = Collapse.Panel;

class ContractConfList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            List: [],
        };
        this.ContractConfListTable = React.createRef()
    }

    componentWillMount() {
        this.queryContractConfList({});

        this.setState({
            pOrgType:'ALL'
        });
    }

    componentWillReceiveProps(nextProps) {

    }

    queryContractConfList(str) {

        var thi = this;
        contractConf.list(str).then(function (response) {
            thi.ContractConfListTable.current.clearRowId()
            thi.setState({
                List: response,
            });
            handleQueryListOk(response)

        }).catch(function (error) {
            //sysErrorInfo(error)
        });
    }

    OnRefOrgCode = (ref) => {
        this.supFunderConditionAuth = ref;
    }


    handleFilterSubmit = ()=>{
        var jsonStr = {
            "status" : this.state.status,
            "conType" : this.state.conType,
            "funderCode": this.supFunderConditionAuth.state.funderCode,
            "supCode" : this.supFunderConditionAuth.state.supCode,
            "mainConCode" : this.supFunderConditionAuth.state.mainConCode,
            "funderConCode" : this.supFunderConditionAuth.state.funderConCode,
        }
        console.log("---------json-------",jsonStr);
        this.queryContractConfList(jsonStr);
    }

    handleStatus = (value) => {
        this.setState({status: value});
    }

    handleConType = (value) => {
        this.setState({conType: value});
    }




    reset = ()=>{
        this.setState({
            status:undefined,
            conType:undefined,
        });
        this.supFunderConditionAuth.reset();
    }

    render() {
        return (
            <div className="gutter-example">
                <Card title="合同配置维护" bordered={false}>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel header="查询条件" key="1">
                            <Form layout="inline" className="ant-advanced-search-form" >
                                <FormItem label={'状态：'}>
                                    <Select style={{ width: 120 }} placeholder="请选择" onChange={this.handleStatus} value={this.state.status} >
                                        {selectUtils('ruleStatus')}
                                    </Select>
                                </FormItem>
                                <FormItem label={'合同类型：'}>
                                    <Select style={{ width: 150 }} placeholder="请选择" onChange={this.handleConType} value={this.state.conType} >
                                        {selectUtils('conType')}
                                    </Select>
                                </FormItem>

                                <SupFunderCodeConditionAuth onRef={this.OnRefOrgCode} parent={this} />

                                <FormItem>
                                    <Button type="primary" onClick={this.handleFilterSubmit}>查询</Button>
                                    <Button onClick={this.reset}>重置</Button>
                                </FormItem>
                            </Form>
                        </Panel>
                    </Collapse>
                    <br />
                    <ContractConfListTable List={this.state.List} parent={this} ref={this.ContractConfListTable} />

                </Card>
            </div>
        );
    }
}

export default ContractConfList;