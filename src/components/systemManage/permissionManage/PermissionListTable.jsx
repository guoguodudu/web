/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrEditPermission from './AddOrEditPermission';
import {selectList} from '../../../mapper.js';
import {sysErrorInfo,errorInfo,successInfo,checkButtPermission,renderTextColumns,
	onClickRow, setRowClassName,} from '../../../Common.jsx';
import {selectGroupList} from '../../../SelectUtils.jsx';

import axios from 'axios';

const confirm = Modal.confirm;

class PermissionListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
        //     title: '权限号',
        //     dataIndex: 'id',
        //     width: '5%',
        //     render: (text, record, index) => renderTextColumns(this.state.data, index, 'id', text),
        // }, {
            title: '权限名称',
			dataIndex: 'permName',
			align: 'center',
            width: 200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'permName', text),
        }, {
            title: '页面名称',
            dataIndex: 'pageName',
			align: 'center',
            width: 200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'pageName', text),
        }, {
            title: '按键名称',
            dataIndex: 'buttName',
			align: 'center',
            width: 200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'buttName', text),
        }, {
            title: '分组名称',
            dataIndex: 'groupId',
			align: 'center',
            width: 200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'groupId', text),
        }, {
            title: '排序',
            dataIndex: 'pageSort',
			align: 'center',
            width:200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'pageSort', text),
        }, {
            title: '状态',
            dataIndex: 'status',
			align: 'center',
            width:200,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
            dataIndex: 'operation',
            width:200,
            render: (text, record, index) => {
                console.log("record--------",record);
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                        {
                            text === '激活' ?
                            <span>
                            <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                            <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['id'])} /></Tooltip>
                            </span>
                            :
                            <span>
                            <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                            <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
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
		this.setRowClassName = setRowClassName.bind(this)
		this.onClickRow = onClickRow.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        console.log("--------nextProps----",nextProps.List);
        var dataShow = [];
        if(nextProps.List !== undefined){
            for(var i=0; i<nextProps.List.length; i++){
                var element = {
                    key: nextProps.List[i].permId,
                    id: {
                        value: nextProps.List[i].permId,
                    },
                    permName: {
                        value: nextProps.List[i].permName,
                    },
                    pageName: {
                        value: nextProps.List[i].pageName,
                    },
                    buttName: {
                        value: nextProps.List[i].buttName,
                    },
                    groupId: {
                        value: selectGroupList(nextProps.List[i].groupId),
                    },
                    pageSort: {
                        value: nextProps.List[i].pageSort,
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                    },
                    createId: {
                        value: nextProps.List[i].createId,
                    },
                    operation: {
                        value:  selectList('ruleStatus',nextProps.List[i].status),
                        key: nextProps.List[i].permId,
                    },
                };
                dataShow.push(element);
            }
        }

        this.setState({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow,
            addOrEditPermiVisiable: false,
        });
    }

    renderColumns(data, index, key, text) {

            return text;
    }

    addRouterRule() {//显示子组件——新增路由规则
        this.setState({
            type:'add',
            record: undefined,
            addOrEditPermiVisiable: true,
        });
    }

    activeRule = (value) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要激活该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/permiapi/updatePermission',{
                        "permId": value,
                        "status" : "ACTIVE",
                        "modifyId": localStorage.getItem('userName'),
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

    inactiveRule = (value) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要禁用该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/permiapi/updatePermission',{
                        "permId": value,
                        "status" : "INACTIVE",
                        "modifyId": localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则禁用成功");
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

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则
        console.log("edit3 = (x)",x);
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].permId === x){
                record = this.state.dataAll[i];
            }
        }
        this.setState({
            type:'edit',
            record: record,
            addOrEditPermiVisiable: true,
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
		const hasButPreDisplay = checkButtPermission(pageId,'editButt')
        return (
            <div>
                <Button type="primary" style={{display : hasButPreDisplay }} icon="plus" onClick={() => this.addRouterRule()} >新增权限</Button>
                <br style={{display : hasButPreDisplay }} /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: "max-content",y: 400 }} onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex), // click row							
						};
					}}
                    rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <AddOrEditPermission record={this.state.record} visiable={this.state.addOrEditPermiVisiable} parent={this} />
            </div>
        );
    }
}

export default PermissionListTable;