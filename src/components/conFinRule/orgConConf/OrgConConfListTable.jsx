/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrgConConf from './AddOrgConConf';
import EditOrgConConf from './EditOrgConConf';
import CopyOrgConConf from './CopyOrgConConf';
import ReadOrgConConf from './ReadOrgConConf';
import {selectList} from '../../../mapper.js';
import {sysErrorInfo,errorInfo,ContentErrorInfo,successInfo,checkButtPermission,dateFormat,renderTextColumns,
	onClickRow, setRowClassName,renderTooltipText } from '../../../Common.jsx';

import axios from 'axios';

const confirm = Modal.confirm;

class OrgConConfListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '机构合同类型',
			dataIndex: 'orgConType',
			align: 'center',			
            width: 130,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgConType', text),
        }, {
            title: '机构合同编号',
			align: 'center',			
            dataIndex: 'orgConSn',
            width: 200,
            render: (text, record, index) => renderTooltipText(text,20),
        }, {
            title: '商户集团',
			align: 'center',			
            dataIndex: 'busiGroupCode',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'busiGroupCode', text),
        }, {
            title: '商户公司',
            dataIndex: 'busiCompCode',
			align: 'center',			
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'busiCompCode', text),
        }, {
            title: '商户网点',
            dataIndex: 'busiSiteCode',
			align: 'center',			
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'busiSiteCode', text),
        }, {
            title: '资金方',
            dataIndex: 'funderCode',
            width: 160,
			align: 'center',			
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'funderCode', text),
        }, {
            title: '资产类别',
            dataIndex: 'assetType',
			align: 'center',			
            width: 150,
            render: (text, record, index) => renderTooltipText(text, 6),
        }, {
            title: '合同说明',
            dataIndex: 'remarks',
			align: 'center',			
            width: 200,
            render: (text, record, index) => renderTooltipText( text, 12),
        }, {
            title: '生效日期',
			align: 'center',			
            dataIndex: 'effectiveDatetimeStr',
            width: 180,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'effectiveDatetimeStr', text),
        }, {
            title: '失效日期',
            dataIndex: 'expireDatetimeStr',
			align: 'center',			
            width: 180,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'expireDatetimeStr', text),
        }, {
            title: '状态',
            dataIndex: 'status',
			align: 'center',			
            width: 100,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: 160,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                        {
                                text === '草稿' ?
                                    <span>
                                    <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                    <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
                                    <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                                    <Tooltip title="删除"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#B00',title:'删除' }} icon="delete" onClick={() => this.deleteRule(record['id'])} /></Tooltip>
                                    </span>
                                    : text === '激活' ?
                                        <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['id'])} /></Tooltip>
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                                        </span>
                                        :
                                        <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
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
                    orgConType: {
                        value: selectList('orgConType',nextProps.List[i].orgConType),
                    },
                    orgConSn: {
                        value: nextProps.List[i].orgConSn,
                    },
                    busiGroupCode: {
                        value: nextProps.List[i].busiGroupSname,
                    },
                    busiCompCode: {
                        value: nextProps.List[i].busiCompSname,
                    },
                    busiSiteCode: {
                        value: nextProps.List[i].busiSiteSname,
                    },
                    funderCode: {
                        value: nextProps.List[i].funderSname,
                    },
                    assetType: {
                        value: selectList('assetType',nextProps.List[i].assetType),
                    },
                    remarks: {
                        value: nextProps.List[i].remarks,
                    },
                    effectiveDatetime: {
                        value: nextProps.List[i].effectiveDatetime,
                    },
                    effectiveDatetimeStr: {
                        value: dateFormat(nextProps.List[i].effectiveDatetime) ,
                    },
                    expireDatetime: {
                        value: nextProps.List[i].expireDatetime,
                    },
                    expireDatetimeStr: {
                        value: dateFormat(nextProps.List[i].expireDatetime) ,
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
            editOrgConConfVisiable: false,
            addOrgConVisiable: false,
            copyOrgConConfVisiable: false,
            ReadOrgConConfVisiable: false,

        });
    }

    renderColumns(data, index, key, text) {

            return text;
    }

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则
        console.log("edit3 = (x)",x)
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record",record);
        this.setState({
            type:'edit',
            record: record,
            editOrgConConfVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            addOrgConVisiable: false,
            copyOrgConConfVisiable: false,
            ReadOrgConConfVisiable: false,
        });

    }

    addRouterRule() {//显示子组件——新增路由规则
        this.setState({
            addOrgConVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            editOrgConConfVisiable: false,
            copyOrgConConfVisiable: false,
            ReadOrgConConfVisiable: false,
        });
        console.log("2222-----addRouterRule  this.state",this.state);
    }

    copyRule = (x) => {
        console.log("copyRule = (x)",x)
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        this.setState({
            type:'copy',
            record: record,
            editOrgConConfVisiable: false,
            ReadOrgConConfVisiable: false,
            addOrgConVisiable: false,
            copyOrgConConfVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
        });
    }

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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/updateOrgConConf',{
                        "id": record.id,
                        "busiGroupCode": record.busiGroupCode,
                        "busiCompCode": record.busiCompCode,
                        "busiSiteCode": record.busiSiteCode,
                        "orgConType": record.orgConType,
                        "funderCode": record.funderCode,
                        "effectiveDatetime": dateFormat(record.effectiveDatetime),
                        "expireDatetime": dateFormat(record.expireDatetime),
                        "status" : "ACTIVE",
                        "modifyId":localStorage.getItem('userName')
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则激活成功");
                                thi.state.parent.handleFilterSubmit();
                            } else if(response.data.STATUS === "201" || response.data.STATUS === "202" || response.data.STATUS === "203" ){
                                errorInfo(response.data.CONTENT);
                            } else {
                                sysErrorInfo();
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/deleteOrgConConf',{
                        "id": record.id,
                        "orgConSn": record.orgConSn
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则删除成功");
                                thi.state.parent.handleFilterSubmit();
                            } else if(response.data.STATUS === "201" || response.data.STATUS === "202" || response.data.STATUS === "203" ){
                                ContentErrorInfo(response.data.CONTENT);
                            } else {
                                errorInfo("删除规则失败");
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/updateOrgConConf',{
                        "id": x,
                        "status" : "INACTIVE",
                        "modifyId":localStorage.getItem('userName')
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

    //双击事件部分
    doubleClick = (record, index, event) => {
        var record1;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === record.id){
                record1 = this.state.dataAll[i];
            }
        }
        this.setState({
            ReadOrgConConfVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            addOrgConVisiable: false,
            editOrgConConfVisiable: false,
            copyOrgConConfVisiable: false,
            record:record1,
        });
        event.stopPropagation(); //尝试阻止默认事件，失败

    };

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
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增维护规则</Button>
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
                <AddOrgConConf visiable={this.state.addOrgConVisiable} parent={this} />
                <EditOrgConConf record={this.state.record} visiable={this.state.editOrgConConfVisiable} parent={this} />
                <CopyOrgConConf record={this.state.record} visiable={this.state.copyOrgConConfVisiable} parent={this} />
                <ReadOrgConConf record={this.state.record} visiable={this.state.ReadOrgConConfVisiable} parent={this} />

            </div>
        );
    }
}

export default OrgConConfListTable;