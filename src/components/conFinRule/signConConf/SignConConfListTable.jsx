/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrEditSignConConf from './AddOrEditSignConConf';
import ReadSignConConf from './ReadSignConConf';
import {
	onClickRow, setRowClassName,sysErrorInfo,errorInfo,
	successInfo,checkButtPermission } from '../../../Common.jsx';
import {selectList} from '../../../mapper.js';

import axios from 'axios';

const confirm = Modal.confirm;

class SignConConfListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '机构合同编号',
			dataIndex: 'orgConSn',
			align: 'center',
            width: 190,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'orgConSn', text),
        }, {
            title: '模板编号',
			dataIndex: 'tempId',
			align: 'center',
            width: 150,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tempId', text),
        }, {
            title: '模板名称',
			dataIndex: 'tempName',
			align: 'center',
            width: 250,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tempName', text),
        }, {
            title: '模板类型',
			dataIndex: 'tempType',
			align: 'center',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'tempType', text),
        }, {
            title: '状态',
			dataIndex: 'status',
			align: 'center',
            width: 100,
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
			dataIndex: 'operation',
            width: 150,
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
                                    </span>
                                    : text === '激活' ?
                                        <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
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
		this.setRowClassName = setRowClassName.bind(this);
		this.onClickRow = onClickRow.bind(this);
		this.hideAllModal = this.hideAllModal.bind(this)
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
                    orgConSn: {
                        value: nextProps.List[i].orgConSn,
                    },
                    tempId: {
                        value: nextProps.List[i].tempId,
                    },
                    tempName: {
                        value: nextProps.List[i].tempName,
                    },
                    tempType: {
                        value: selectList('confileType',nextProps.List[i].tempType),
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                    },
                    createId: {
                        value: nextProps.List[i].createId,
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
    // doubleClick = (record, index, event) => {

    //     this.setState({
    //         addOrEditVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
    //         readVisiable:true,
    //         record:record,
    //     });
    //     event.stopPropagation(); //尝试阻止默认事件，失败

    // };

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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/sccapi/updateSignConConf',{
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/sccapi/deleteSignConConf',{
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/sccapi/updateSignConConf',{
                        "id": x,
                        "status" : "INACTIVE",
                        "modifyId":localStorage.getItem('userName'),
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
	hideAllModal(){
		this.setState({
			addOrEditVisiable:false,
			readVisiable:false,
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
							// onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
        const pageId = this.props.parent.props.location.pathname;
        return (
            <div>
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增配置规则</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{x:'max-content', y: 400 }} 
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex), 
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record)}
																/>					
                <AddOrEditSignConConf record={this.state.record} visiable={this.state.addOrEditVisiable} parent={this} hideAllModal={this.hideAllModal} />
                <ReadSignConConf record={this.state.record} visiable={this.state.readVisiable} parent={this} hideAllModal={this.hideAllModal} />
            </div>
        );
    }
}

export default SignConConfListTable;