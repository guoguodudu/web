/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrEditOrgRateConf from './AddOrEditOrgRateConf';
// import ReadOrgRateConf from './ReadOrgRateConf';
import {sysErrorInfo,errorInfo,successInfo,checkButtPermission,
	onClickRow, setRowClassName,renderTextColumns, renderTooltipText} from '../../../Common.jsx';
import {selectList} from '../../../mapper.js';

import axios from 'axios';

const confirm = Modal.confirm;

class OrgRateConfListTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
			align: 'center',
			title: '机构合同类型',
            dataIndex: 'orgConType',
            width: 160,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgConType', text),
        }, {
			align: 'center',
			title: '商户集团',
            dataIndex: 'busiGroupCode',
            width: 160,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'busiGroupCode', text),
        }, {
			align: 'center',
			title: '商户公司',
            dataIndex: 'busiCompCode',
            width: 160,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'busiCompCode', text),
        }, {
			align: 'center',
			title: '商户网点',
            dataIndex: 'busiSiteCode',
            width: 160,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'busiSiteCode', text),
        }, {
			align: 'center',
			title: '资金方',
            dataIndex: 'funderCode',
            width: 160,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'funderCode', text),
        }, {
			align: 'center',
			title: '机构合同编号',
            dataIndex: 'orgConSn',
            width: 180,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgConSn', text),
        }, {
			align: 'center',
			title: '分期总期数',
            dataIndex: 'insTotTerm',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'insTotTerm', text),
        }, {
			align: 'center',
			title: '服务费比率',
            dataIndex: 'serviceRate',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'serviceRate', text),
        }, {
			align: 'center',
			title: '贷款利率',
            dataIndex: 'loanRate',
            width: 100,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'loanRate', text),
        }, {
			align: 'center',
			title: '备用金比率',
            dataIndex: 'depositRate',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'depositRate', text),
        }, {
			align: 'center',
			title: '备用金进位规则',
            dataIndex: 'depRoundRule',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'depRoundRule', text),
        }, {
			align: 'center',
			title: '备用金小数位',
            dataIndex: 'depScale',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'depScale', text),
        },{
			align: 'center',
			title: '收买比率',
            dataIndex: 'boRate',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'boRate', text),
        }, {
			align: 'center',
			title: '收买金额进位规则',
            dataIndex: 'boRoundRule',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'boRoundRule', text),
        }, {
			align: 'center',
			title: '收买金额小数位',
            dataIndex: 'boScale',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'boScale', text),
        }, {
			align: 'center',
			title: '金额计算规则',
            dataIndex: 'amtCalRule',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'amtCalRule', text),
        }, {
			align: 'center',
			title: '金额调整规则',
            dataIndex: 'adjustRule',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'adjustRule', text),
        }, {
			align: 'center',
			title: '本金进位规则',
            dataIndex: 'prnRoundRule',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'prnRoundRule', text),
        }, {
			align: 'center',
			title: '本金小数位',
            dataIndex: 'prnScale',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'prnScale', text),
        }, {
			align: 'center',
			title: '计息规则',
            dataIndex: 'intCalRule',
            width: 100,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'intCalRule', text),
        }, {
			align: 'center',
			title: '计息起始日',
            dataIndex: 'intCalSdate',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'intCalSdate', text),
        }, {
			align: 'center',
			title: '计息基数',
            dataIndex: 'intCalBase',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'intCalBase', text),
        }, {
			align: 'center',
			title: '全年计息天数',
            dataIndex: 'dayOfYear',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'dayOfYear', text),
        }, {
			align: 'center',
			title: '计息进位规则',
            dataIndex: 'intRoundRule',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'intRoundRule', text),
        }, {
			align: 'center',
			title: '计息小数位数',
            dataIndex: 'intScale',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'intScale', text),
        }, {
			align: 'center',
			title: '规则说明',
            dataIndex: 'remarks',
            width: 200,
            render: (text, record, index) => renderTooltipText(text, 10),
        }, {
			align: 'center',
			title: '生效日期',
            dataIndex: 'effectiveDatetime',
            width: 200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'effectiveDatetime', text),
        }, {
			align: 'center',
			title: '失效日期',
            dataIndex: 'expireDatetime',
            width: 200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'expireDatetime', text),
        }, {
			align: 'center',
			title: '状态',
            dataIndex: 'status',
            width: 100,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'status', text),
        }, {
				align: 'center',
				title: '服务费小数位',
				dataIndex: 'serviceScale',
				width: 140,
				render: (text, record, index) => renderTextColumns(this.state.data, index, 'serviceScale', text),
		}, {
				align: 'center',
				title: '服务费进位规则',
				dataIndex: 'serviceRoundRule',
				width: 180,
				render: (text, record, index) => renderTextColumns(this.state.data, index, 'serviceRoundRule', text),
		}, {
            title: '操作',
            dataIndex: 'operation',
            width: 160,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }}>
                        {
                                text === '草稿' ?
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
		this.setRowClassName = setRowClassName.bind(this);
		this.onClickRow = onClickRow.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log("--------nextProps----",nextProps.List);
        var dataShow = [];
        if(nextProps.List !== undefined){
            for(var i=0; i<nextProps.List.length; i++){
                var element = {
                    key: nextProps.List[i].rate_id,
                    id: {
                        value: nextProps.List[i].rate_id,
                    },
                    orgConType: {
                        value: selectList('orgConType',nextProps.List[i].orgConType),
                    },
                    busiGroupCode: {
                        value: nextProps.List[i].busiGroupCode,
                    },
                    busiCompCode: {
                        value: nextProps.List[i].busiCompCode,
                    },
                    busiSiteCode: {
                        value: nextProps.List[i].busiSiteCode,
                    },
                    funderCode: {
                        value: nextProps.List[i].funderCode,
                    },
                    orgConSn: {
                        value: nextProps.List[i].orgConSn,
                    },
                    insTotTerm: {
                        value: nextProps.List[i].insTotTerm,
                    },
                    serviceRate: {
                        value: nextProps.List[i].serviceRate,
                    },
                    loanRate: {
                        value: nextProps.List[i].loanRate,
                    },
                    depositRate: {
                        value: nextProps.List[i].depositRate,
                    },
                    depRoundRule: {
                        value: selectList('roundRule',''+nextProps.List[i].depRoundRule),
                    },
                    depScale: {
                        value: nextProps.List[i].depScale,
                    },
                    boRate: {
                        value: nextProps.List[i].boRate,
                    },
                    boRoundRule: {
                        value: selectList('roundRule',''+nextProps.List[i].boRoundRule),
                    },
                    boScale: {
                        value: nextProps.List[i].boScale,
                    },
                    amtCalRule: {
                        value: selectList('amtCalRule',nextProps.List[i].amtCalRule),
                    },
                    adjustRule: {
                        value: selectList('amtAdjustRule',nextProps.List[i].adjustRule),
                    },
                    prnRoundRule: {
                        value: selectList('roundRule',''+nextProps.List[i].prnRoundRule),
                    },
                    prnScale: {
                        value: nextProps.List[i].prnScale,
                    },
                    // 当值为null时，无法map。增加(''+)后可解决无法显示或显示为'null'的问题
                    intCalRule: {
                        value: selectList('intCalRule',''+nextProps.List[i].intCalRule),
                    },
                    intCalSdate: {
                        value: selectList('intCalStartdate',''+nextProps.List[i].intCalSdate),
                    },
                    intCalBase: {
                        value: selectList('intCalBase',''+nextProps.List[i].intCalBase),
                    },
                    dayOfYear: {
                        value: selectList('dayOfYear',''+nextProps.List[i].dayOfYear),
                    },
                    intRoundRule: {
                        value: selectList('roundRule',''+nextProps.List[i].intRoundRule),
                    },
                    intScale: {
                        value: selectList('decimalScale',''+nextProps.List[i].intScale),
                    },
                    remarks: {
                        value: nextProps.List[i].remarks,
                    },
                    effectiveDatetime: {
                        value: nextProps.List[i].conEffectiveDatetime,
                    },
                    expireDatetime: {
                        value: nextProps.List[i].conExpireDatetime,
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].rateStatus),
                    },
                    conStatus: {
                        value: selectList('ruleStatus',nextProps.List[i].conStatus),
                    },
                    createId: {
                        value: nextProps.List[i].createId,
                    },
                    operation: {
                        value: selectList('ruleStatus',nextProps.List[i].rateStatus),
                        key: nextProps.List[i].rate_id,
                    },
					serviceScale: {
						value: selectList('decimalScale',''+nextProps.List[i].serviceScale),
					},
					serviceRoundRule: {
						value: selectList('roundRule',''+nextProps.List[i].serviceRoundRule),
					}
                };
                dataShow.push(element);
            }
        }
        this.setState({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow,
            addOrEditOrgRateVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readOrgRateVisiable:false
        });
    }

    renderColumns(data, index, key, text) {
            return text;
    }

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则
        console.log("edit3 = (x)",x);
        console.log("edit3 = (x) this.state",this.state)
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].rate_id === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record",record);
        this.setState({
            type:'edit',
            record: record,
            addOrEditOrgRateVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readOrgRateVisiable:false
        });
    }

    addRouterRule() {//显示子组件——新增路由规则
        console.log("11111------addRouterRule");
        this.setState({
            addOrEditOrgRateVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readOrgRateVisiable:false,
            record:undefined,
            type:'add',
        });
        console.log("2222-----addRouterRule  this.state",this.state);
    }

    //双击事件部分
    doubleClick = (record, index, event) => {
		console.log( record)
		console.log( index)

        this.setState({
            type:'edit',
            addOrEditOrgRateVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readOrgRateVisiable:true,
            record:record,
        });
        event.stopPropagation(); //尝试阻止默认事件，失败
    };

    activeRule = (x) => {
        console.log("--x--",x);
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要激活该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgrateapi/updateOrgRateConf',{
                        "id": x,
                        "status" : "ACTIVE",
                        "modifyId":localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则激活成功");
                                thi.state.parent.handleFilterSubmit();
                            } else {
                                errorInfo('激活服务规则失败');
                            }
                    }).catch(function (error) {
                        sysErrorInfo(error);
                    });
            },
            onCancel() {
                //取消
            },
        });
    }

    deleteRule = (x) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要删除该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgrateapi/deleteOrgRateConf',{
                        "id": x,
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则删除成功");
                                thi.state.parent.handleFilterSubmit();
                            } else {
                                errorInfo('激活服务删除失败');
                            }
                    }).catch(function (error) {
                        sysErrorInfo(error);
                    });
            },
            onCancel() {
                //取消
            },
        });
    }

    inactiveRule = (x) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要禁用该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgrateapi/updateOrgRateConf',{
                        "id": x,
                        "status" : "INACTIVE",
                        "modifyId":localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则禁用成功");
                                console.log('thi.state',thi.state);
                                thi.state.parent.handleFilterSubmit();
                             } else {
                                errorInfo('激活服务规则失败');
                            }
                    }).catch(function (error) {
                        sysErrorInfo(error);
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
                    if(thi.state.dataAll[i].rate_id === x){
                        record = thi.state.dataAll[i];
                    }
                }
                thi.setState({
                    addOrEditOrgRateVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
                    readOrgRateVisiable:false,
                    record:record,
                    type:'copy',
                });
            },
            onCancel() {
                //取消
            },
        });
    }

    render() {
        const { readOrgRateVisiable,data } = this.state;
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
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增费率规则</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 'max-content',y: 400 }}
					onRow={(record, rowIndex) => {
					return {
						onClick:(event) =>this.onClickRow(event, record, rowIndex), 
						onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
					};
				}}
				rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <AddOrEditOrgRateConf record={this.state.record} visiable={this.state.addOrEditOrgRateVisiable||readOrgRateVisiable} readOrgRateVisiable={readOrgRateVisiable} parent={this} />
                {/* <ReadOrgRateConf record={this.state.record} visiable={this.state.readOrgRateVisiable} parent={this} /> */}
            </div>
        );
    }
}

export default OrgRateConfListTable;