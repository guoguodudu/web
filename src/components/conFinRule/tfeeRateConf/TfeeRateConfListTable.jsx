/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrEditTfeeRateConf from './AddOrEditTfeeRateConf';
import ReadTfeeRateConf from './ReadTfeeRateConf';
import {onClickRow, setRowClassName,sysErrorInfo,errorInfo,successInfo,checkButtPermission } from '../../../Common.jsx';
import {selectList} from '../../../mapper.js';

import axios from 'axios';

const confirm = Modal.confirm;

class TfeeRateConfListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '机构合同类型',
			dataIndex: 'orgConType',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'orgConType', text),
        }, {
            title: '商户集团',
			dataIndex: 'busiGroupCode',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'busiGroupCode', text),
        }, {
            title: '商户公司',
			dataIndex: 'busiCompCode',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'busiCompCode', text),
        }, {
            title: '商户网点',
			dataIndex: 'busiSiteCode',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'busiSiteCode', text),
        }, {
            title: '资金方',
			dataIndex: 'funderCode',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'funderCode', text),
        }, {
            title: '机构合同编号',
			dataIndex: 'orgConSn',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'orgConSn', text),
        }, {
            title: '分期总期数',
			dataIndex: 'insTotTerm',
			align: 'center',
            width: 120,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'insTotTerm', text),
        }, {
            title: '计算规则',
			dataIndex: 'tfeeCalRule',
			align: 'center',
            width: 150,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tfeeCalRule', text),
        }, {
            title: '费率数值',
			dataIndex: 'tfeeCalValue',
			align: 'center',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tfeeCalValue', text),
        }, {
            title: '小数位数',
			dataIndex: 'tfeeScale',
			align: 'center',
            width: 120,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tfeeScale', text),
        },{
            title: '进位规则',
			dataIndex: 'tfeeRoundRule',
			align: 'center',
            width: 120,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tfeeRoundRule', text),
        }, {
            title: '退费标识',
			dataIndex: 'tfeeReturnFlag',
			align: 'center',
            width: 150,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tfeeReturnFlag', text),
        }, {
            title: '规则说明',
			dataIndex: 'remarks',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'remarks', text),
        }, {
            title: '生效日期',
			dataIndex: 'effectiveDatetime',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'effectiveDatetime', text),
        }, {
            title: '失效日期',
			dataIndex: 'expireDatetime',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'expireDatetime', text),
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
                console.log("record--------",record);
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
                    key: nextProps.List[i].tfee_id,
                    id: {
                        value: nextProps.List[i].tfee_id,
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
                    tfeeCalRule: {
                        value: selectList('calRule',nextProps.List[i].tfeeCalRule),
                    },
                    tfeeCalValue: {
                        value: nextProps.List[i].tfeeCalValue,
                    },
                    tfeeScale: {
                        value: selectList('decimalScale',''+nextProps.List[i].tfeeScale),
                    },
                    tfeeRoundRule: {
                        value: selectList('roundRule',''+nextProps.List[i].tfeeRoundRule),
                    },
                    tfeeReturnFlag: {
                        value: nextProps.List[i].tfeeReturnFlag,
                    },
                    remarks: {
                        value: nextProps.List[i].remarks,
                    },
                    effectiveDatetime: {
                        value: nextProps.List[i].conf_effectiveDatetime,
                    },
                    expireDatetime: {
                        value: nextProps.List[i].conf_expireDatetime,
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].tfee_status),
                    },
                    conStatus: {
                        value: selectList('ruleStatus',nextProps.List[i].conStatus),
                    },
                    createId: {
                        value: nextProps.List[i].createId,
                    },
                    operation: {
                        value: selectList('ruleStatus',nextProps.List[i].tfee_status),
                        key: nextProps.List[i].tfee_id,
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
        console.log("edit3 = (x)",x);
        console.log("edit3 = (x) this.state",this.state)
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].tfee_id === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record",record);
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
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要激活该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/tfeerateapi/updateActive',{
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/tfeerateapi/deleteTfeeRateConf',{
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/tfeerateapi/updateActive',{
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
                    if(thi.state.dataAll[i].tfee_id === x){
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
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增费率规则</Button>
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
                <AddOrEditTfeeRateConf hideAllModal={this.hideAllModal} record={this.state.record} visiable={this.state.addOrEditVisiable} parent={this} />
                <ReadTfeeRateConf hideAllModal={this.hideAllModal} record={this.state.record} visiable={this.state.readVisiable} parent={this} />
            </div>
        );
    }
}

export default TfeeRateConfListTable;