/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip,message } from 'antd';
import AddOrEditContractConf from './AddOrEditContractConf';
import ReadContractConf from './ReadContractConf';
import {onClickRow, setRowClassName,successInfo,checkButtPermission } from '../../../Common.jsx';
import {selectList} from '../../../mapper.js';
import {contractConf} from "@/api";

const confirm = Modal.confirm;

class ContractConfListTable extends React.Component {
    constructor(props) {
        super(props);

        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
            {
                title: '供应商',
                dataIndex: 'supCode',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'supCode', text),
            }, {
                title: '资金方',
                dataIndex: 'funderCode',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'funderCode', text),
            }, {
                title: '合同类型',
                dataIndex: 'conType',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'conType', text),
            }, {
                title: '业务合同编号',
                dataIndex: 'mainConCode',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'mainConCode', text),
            }, {
                title: '资金合同编号',
                dataIndex: 'funderConCode',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'funderConCode', text),
            }, {
                title: '授信地',
                dataIndex: 'creditPlace',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditPlace', text),
            }, {
                title: '授信金额',
                dataIndex: 'creditAmount',
                align: 'center',
                width: 120,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditAmount', text),
            }, {
                title: '授信期间类型',
                dataIndex: 'creditPeriodType',
                align: 'center',
                width: 150,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditPeriodType', text),
            }, {
                title: '授信起日',
                dataIndex: 'creditStartDate',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditStartDate', text),
            }, {
                title: '授信止日',
                dataIndex: 'creditEndDate',
                align: 'center',
                width: 120,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditEndDate', text),
            },{
                title: '授信期间触发条件',
                dataIndex: 'creditTriger',
                align: 'center',
                width: 120,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditTriger', text),
            }, {
                title: '授信生效日期',
                dataIndex: 'creditEffDate',
                align: 'center',
                width: 150,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditEffDate', text),
            }, {
                title: '授信失效日期',
                dataIndex: 'creditExpDate',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditExpDate', text),
            }, {
                title: '授信期限',
                dataIndex: 'creditPeriod',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'creditPeriod', text),
            }, {
                title: '循环',
                dataIndex: 'isCycle',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'isCycle', text),
            }, {
                title: '利率',
                dataIndex: 'intRate',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'intRate', text),
            }, {
                title: '融资比率',
                dataIndex: 'intRatio',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'intRatio', text),
            }, {
                title: '小数点位数',
                dataIndex: 'intScale',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'intScale', text),
            }, {
                title: '进位规则',
                dataIndex: 'intRoundRule',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'intRoundRule', text),
            }, {
                title: '还款方式',
                dataIndex: 'repayType',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'repayType', text),
            }, {
                title: '计息基础',
                dataIndex: 'dayCountBasis',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'dayCountBasis', text),
            }, {
                title: '费用名',
                dataIndex: 'feeName',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'feeName', text),
            }, {
                title: '费率',
                dataIndex: 'feeRate',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'feeRate', text),
            }, {
                title: '收费方式',
                dataIndex: 'feeType',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'feeType', text),
            }, {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                width: 100,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'status', text),
            }, {
                title: '操作',
                dataIndex: 'operation',
                width: 160,
                fixed: 'right',
                render: (text, record, index) => {
                    return (
                        <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }}>
                            {
                                text === '草稿'?
                                    <span>
                                    <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                    <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
                                    <Tooltip title="删除"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#B00',title:'删除' }} icon="delete" onClick={() => this.deleteRule(record['id'])} /></Tooltip>
                                    <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                                    </span>
                                    : text === '激活' ?
                                    <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['id'])} /></Tooltip>
                                        {record.conStatus==='草稿'?
                                            <Tooltip title="删除"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#B00',title:'删除' }} icon="delete" onClick={() => this.deleteRule(record['id'])} /></Tooltip>
                                            :''}
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                                        </span>
                                    :
                                    <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
                                        {record.conStatus==='草稿'?
                                            <Tooltip title="删除"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#B00',title:'删除' }} icon="delete" onClick={() => this.deleteRule(record['id'])} /></Tooltip>
                                            :''}
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                                        </span>
                            }
                        </div>
                    );
                },
            }];
        // eslint-disable-next-line
        this.state = {
            data: [],
        };
        this.setRowClassName = setRowClassName.bind(this);
        this.onClickRow = onClickRow.bind(this);
        this.hideAllModal = this.hideAllModal.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        console.log("--------nextProps----",nextProps.List);
        var dataShow = [];
        if(nextProps.List !== undefined){
            for(var i=0; i<nextProps.List.length; i++){
                var element = {
                    key: nextProps.List[i].id,
                    id: {
                        value: nextProps.List[i].id,
                    },
                    supCode: {
                        value: nextProps.List[i].supSname,
                    },
                    funderCode: {
                        value: nextProps.List[i].funderSname,
                    },
                    conType: {
                        value: selectList('conType',nextProps.List[i].conType),
                    },
                    mainConCode: {
                        value: nextProps.List[i].mainConCode,
                    },
                    funderConCode: {
                        value: nextProps.List[i].funderConCode,
                    },
                    creditPlace: {
                        value: selectList('creditPlace',nextProps.List[i].creditPlace),
                    },
                    creditAmount: {
                        value: nextProps.List[i].creditAmount,
                    },
                    creditPeriodType: {
                        value: selectList('creditPeriodType',nextProps.List[i].creditPeriodType),
                    },
                    creditStartDate: {
                        value: nextProps.List[i].creditStartDate,
                    },
                    creditEndDate: {
                        value: nextProps.List[i].creditEndDate,
                    },
                    creditTriger: {
                        value: nextProps.List[i].creditTriger,
                    },
                    creditEffDate: {
                        value: nextProps.List[i].creditEffDate,
                    },
                    creditExpDate: {
                        value: nextProps.List[i].creditExpDate,
                    },
                    creditPeriod: {
                        value: nextProps.List[i].creditPeriod,
                    },
                    isCycle: {
                        value: selectList('ActiveStatus',nextProps.List[i].isCycle),
                    },
                    intRate: {
                        value: nextProps.List[i].intRate,
                    },
                    intRatio: {
                        value: nextProps.List[i].intRatio,
                    },
                    intScale: {
                        value: selectList('decimalScale',nextProps.List[i].intScale),
                    },
                    intRoundRule: {
                        value: selectList('roundRule',''+nextProps.List[i].intRoundRule),
                    },
                    repayType: {
                        value: selectList('repayType',nextProps.List[i].repayType),
                    },
                    dayCountBasis: {
                        value: nextProps.List[i].dayCountBasis,
                    },
                    feeName: {
                        value: nextProps.List[i].feeName,
                    },
                    feeRate: {
                        value: nextProps.List[i].feeRate,
                    },
                    feeType: {
                        value: selectList('feeType',nextProps.List[i].feeType),
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                    },
                    operation: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                        key: nextProps.List[i].id,
                    },
                };
                dataShow.push(element);
            }
        }
        this.setState({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow,
            addOrEditVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readVisiable:false
        });
    }

    renderColumns(data, index, key, text) {

        return text;
    }

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则

        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        this.setState({
            type:'edit',
            record: record,
            addOrEditVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readVisiable:false
        });

    }

    addRouterRule() {//显示子组件——新增路由规则
        this.setState({
            addOrEditVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readVisiable:false,
            record:undefined,
            type:'add',
        });
    }

    //双击事件部分
    doubleClick = (record, index, event) => {

        this.setState({
            addOrEditVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readVisiable:true,
            record:record,
        });
        event.stopPropagation(); //尝试阻止默认事件，失败

    };

    activeRule = (x) => {
        console.log("--x--",x);
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要激活该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                contractConf.update({
                    "id": x,
                    "status" : "ACTIVE",
                    "supCode": record.supCode,
                    "funderCode" : record.funderCode
                }).then(function (response) {
                    successInfo(response.data.retMsg);
                    thi.state.parent.handleFilterSubmit();
                }).catch(function (error) {
                    message.error('激活规则失败');
                    // sysErrorInfo(error);
                });
            },
            onCancel() {
                //取消
            },
        });
    }

    deleteRule = (x) => {
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要删除该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                contractConf.update({
                    "id": x,
                    "isDelete":"1",
                    "supCode": record.supCode,
                    "funderCode" : record.funderCode
                }).then(
                    function (response) {
                        console.log("response",response);
                        successInfo("删除成功");
                        thi.state.parent.handleFilterSubmit();
                    }).catch(function (error) {
                    console.log(error);
                    // sysErrorInfo(error);
                });
            },
            onCancel() {
                //取消
            },
        });
    }

    inactiveRule = (x) => {
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要禁用该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                contractConf.update({
                    "id": x,
                    "status" : "INACTIVE",
                    "supCode": record.supCode,
                    "funderCode" : record.funderCode
                }).then(function (response) {
                    console.log('response--',response)
                    successInfo(response.data.retMsg);
                    thi.state.parent.handleFilterSubmit();
                }).catch(function (error) {
                    //sysErrorInfo(error);
                });
            },
            onCancel() {
                //取消
            },
        });
    }

    copyRule = (x) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要复制该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                var record;
                for(var i = 0; i< thi.state.dataAll.length; i++){
                    if(thi.state.dataAll[i].id === x){
                        record = thi.state.dataAll[i];
                    }
                }
                thi.setState({
                    addOrEditVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
                    readVisiable:false,
                    record:record,
                    type:'copy',
                });
            },
            onCancel() {
                //取消
            },
        });
    }
    hideAllModal(){
        this.setState({
            addOrEditVisiable:false,
            readVisiable:false,
        })
    }
    clearRowId(){
        this.setState({
            rowId:123812903
        })
    }
    render() {
        const { data } = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;

        const pageId = this.props.parent.props.location.pathname;
        return (

            <div>
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增合同配置</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 'max-content', y: 400 }}
                       onRow={(record, rowIndex) => {
                           return {
                               onClick:(event) =>this.onClickRow(event, record, rowIndex),
                               onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
                           };
                       }}
                       rowClassName={(record)=>this.setRowClassName(record)}
                />
                <AddOrEditContractConf hideAllModal={this.hideAllModal} record={this.state.record} visiable={this.state.addOrEditVisiable} parent={this} />
                <ReadContractConf hideAllModal={this.hideAllModal} record={this.state.record} visiable={this.state.readVisiable} parent={this} />
            </div>
        );
    }
}

export default ContractConfListTable;