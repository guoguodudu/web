/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrEditFunderInfo from './AddOrEditFunderInfo';
import ReadFunderInfo from './ReadFunderInfo';
import {onClickRow, setRowClassName,sysErrorInfo,errorInfo,successInfo } from '../../../Common.jsx';

import axios from 'axios';
import {checkButtPermission} from "../../../Common";
import {selectList} from "../../../mapper";

const confirm = Modal.confirm;

class FunderInfoListTable extends React.Component {
    constructor(props) {
        super(props);
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
			title: '资金方代码',
			align: 'center',
            dataIndex: 'funderCode',
            width: 150,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'funderCode', text),
        }, {
            title: '资金方全称',
			align: 'center',
            dataIndex: 'funderName',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'funderName', text),
        }, {
            title: '资金方简称',
            dataIndex: 'funderShortName',
			align: 'center',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'funderShortName', text),
        }, {
            title: '注册地址',
			align: 'center',
            dataIndex: 'regisAddress',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'regisAddress', text),
        }, {
            title: '联系人',
            dataIndex: 'contact',
			align: 'center',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'contact', text),
        }, {
            title: '联系电话',
            dataIndex: 'contactMobile',
			align: 'center',
            width: 200,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'contactMobile', text),
        },
        {
                title: '联系邮箱',
                dataIndex: 'contactEmail',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'contactEmail', text),
         }, {
                title: '联系地址',
                dataIndex: 'contactAddress',
                align: 'center',
                width: 200,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'contactAddress', text),
         }, {
            title: '操作',
            dataIndex: 'operation',
            width: 160,
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editFunder') }} >
                {
                    text === '激活' ?
                        <span>
                            <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                            <Tooltip title="禁用"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.active(record)} /></Tooltip>
                            <Tooltip title="复制"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                            </span>
                        :
                        text === '禁用' ?
                            <span>
                                <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                <Tooltip title="激活"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.active(record)} /></Tooltip>
                                <Tooltip title="复制"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
                                </span>
                            :
                            <span>
                                <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                <Tooltip title="激活"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.active(record)} /></Tooltip>
                                <Tooltip title="删除"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'删除' }} icon="delete"onClick={() => this.deleteRule(record['id'])} /></Tooltip>
                                <Tooltip title="复制"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['id'])} /></Tooltip>
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

	componentDidMount(){
		this.setState({
			addOrEditVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readVisiable:false
		})
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
                    funderCode: {
                        value: nextProps.List[i].funderCode,
                    },
                    funderName: {
                        value: nextProps.List[i].funderName,
                    },
                    funderShortName: {
                        value: nextProps.List[i].funderShortName,
                    },
                    regisAddress: {
                        value: nextProps.List[i].regisAddress,
                    },
                    contact: {
                        value: nextProps.List[i].contact,
                    },
                    contactMobile: {
                        value: nextProps.List[i].contactMobile,
                    },
                    contactEmail: {
                        value: nextProps.List[i].contactEmail,
                    },
                    contactAddress: {
                        value: nextProps.List[i].contactAddress,
                    },
                    operation: {value: selectList('ruleStatus',nextProps.List[i].funderStatus)},
                    funderStatus: {
                        value: nextProps.List[i].funderStatus,
                    },
                };
                dataShow.push(element);
            }
        }
        this.setState({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow            
        });
    }

    renderColumns(data, index, key, text) {

            return text;
    }

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则
        console.log("edit3 = (x)",x);
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
		console.log('doubleClick')
        this.setState({
            addOrEditVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            readVisiable:true,
            record:record,
        },()=>{
			console.log(this.state)
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
                    axios.post(localStorage.getItem('ip_port_acc_core')+'/ocrapi/updateOcrConf',{
                        "id": x,
                        "status" : "ACTIVE",
                        "modifyId":localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.result === 1 ){
                                successInfo(response.data.retMsg);
                                thi.state.parent.handleFilterSubmit();
                            } else {
                                errorInfo(response.data.retMsg);
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
            content: '您确定要删除该资金方吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/funder/delete',{
                        "id": x,
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.result === 1 ){
                                successInfo(response.data.retMsg);
                                thi.state.parent.handleFilterSubmit();
                            } else {
                                errorInfo(response.data.retMsg);
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

    active = (x) => {

        var funderStatusName;
        var funderStatus;
        var thi = this;
        if(x.funderStatus === "ACTIVE"){
            funderStatusName='您确定要禁用吗？'
            funderStatus='INACTIVE'
        }
        if(x.funderStatus === "INACTIVE" || x.funderStatus === "DRAFT"){
            funderStatusName='您确定要激活吗？'
            funderStatus='ACTIVE'
        }
        confirm({
            title: '提示信息',
            content: funderStatusName,
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/funder/update',{
                    "id": x.id,
                    "funderStatus":funderStatus,
                }).then(
                    function (response) {
                        console.log('response--',response)
                        if(response.data.result === 1 ){
                            successInfo(response.data.retMsg);
                            thi.state.parent.handleFilterSubmit();
                        } else {
                            errorInfo(response.data.retMsg);
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
                    axios.post(localStorage.getItem('ip_port_acc_core')+'/ocrapi/updateOcrConf',{
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
                <Button type="primary" icon="plus" style={{display : checkButtPermission(pageId,'addFunder') }} onClick={() => this.addRouterRule()} >新增</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ y: 400 }} 
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex), 
							onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <AddOrEditFunderInfo record={this.state.record} visiable={this.state.addOrEditVisiable} parent={this} />
                <ReadFunderInfo record={this.state.record} visiable={this.state.readVisiable} parent={this} />
            </div>
        );
    }
}

export default FunderInfoListTable;