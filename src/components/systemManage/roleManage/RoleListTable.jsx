import React from 'react';
import { Modal, Input, Form, Button,Table,Tooltip } from 'antd';
import AddRole from './AddRole';
import EditRole from './EditRole';
import {selectList} from '../../../mapper.js';
import {search, onClickRow, setRowClassName,sysErrorInfo,successInfo,checkButtPermission,renderTextColumns} from '../../../Common.jsx';


import axios from 'axios';

const confirm = Modal.confirm;

class RoleListTable extends React.Component {//角色列表
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [{
            title: '角色名称',
			align: 'center',
            dataIndex: 'roleName',
            width: '200px',
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'roleName', text),
        }, {
            title: '机构类型',
			align: 'center',
            dataIndex: 'orgType',
            width: '200px',
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgType', text),
        }, {
            title: '部门',
			align: 'center',
            dataIndex: 'depName',
            width: '200px',
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'depName', text),
        }, {
            title: '状态',
            dataIndex: 'status',
			align: 'center',
            width: '200px',
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
			dataIndex: 'operation',
            width: '200px',			
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                        {
							text === '激活' ?
                                    <span>
                                    <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['roleId'])} /></Tooltip>
                                    <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['roleId'])} /></Tooltip>
                                    </span>
                                    :
                                    <span>
                                    <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['roleId'])} /></Tooltip>
                                    <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['roleId'])} /></Tooltip>
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
		this.search = search.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        console.log("--------nextProps----",nextProps.List);
        var dataShow = [];
        if(nextProps.List !== undefined){
            for(var i=0; i<nextProps.List.length; i++){
                var element = {
                    key: nextProps.List[i].roleId,
                    roleId: {
                        value: nextProps.List[i].roleId,
                    },
                    roleName: {
                        value: nextProps.List[i].roleName,
                    },
                    orgType: {
                        value: selectList('serviceOrgType',nextProps.List[i].orgType),
                    },
                    orgGroupCode: {
                        value: nextProps.List[i].orgGroupCode,
                    },
                    orgCompCode: {
                        value: nextProps.List[i].orgCompCode,
                    },
                    orgSiteCode: {
                        value: nextProps.List[i].orgSiteCode,
                    },
                    depName: {
                        value: nextProps.List[i].depName,
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                    },
                    operation: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                        key: nextProps.List[i].roleId,
                    },
                };
                dataShow.push(element);
            }
        }
        this.setState ({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow,
            addRoleVisible:false,
            editRoleVisible: false,
        });
    }

    renderColumns(data, index, key, text) {
            return text;
    }

    edit3 = (value) => {//给子组件传值---并且显示子组件，编辑路由规则
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].roleId === value){
                record = this.state.dataAll[i];
            }
        }
        console.log("record----------",record);
        this.setState({
            record: record,
            editRoleVisible: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            addRoleVisible: false,
        });
    }

    addRole() {//显示子组件——新增路由规则
        console.log("addRole");
        this.setState({
            editRoleVisible: false,
            addRoleVisible: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示

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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/roleapi/updateRole',{
                        "roleId": value,
                        "status" : "ACTIVE",
                        "modifyId": localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则激活成功");
                                thi.state.parent.queryRoleList();
                            } else {
                                sysErrorInfo("规则激活失败");
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/roleapi/updateRole',{
                        "roleId": value,
                        "status" : "INACTIVE",
                        "modifyId": localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("规则禁用成功");
                                console.log('thi.state',thi.state);
                                thi.state.parent.queryRoleList();
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

    render() {
        const { data,sname } = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
		}).filter(ite=>{
			return sname?(Object.values(ite).join() ).includes(sname):true});
		// .map(remapItem=>{
		// 	remapItem.id = remapItem.roleId;
		// 	return remapItem
		// });
		
        const columns = this.columns;
        
        const pageId = this.props.parent.props.location.pathname;
        return (
            <div>
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRole()} >新增角色</Button>
                <br /><br />
				<Form layout="inline" style={{marginBottom:"10px"}}>
					<Form.Item label="筛选:">
						<Input placeholder="角色名称 | 机构类型 | 部门 | 状态" style={{width:'300px'}} onChange={this.search} allowClear />
					</Form.Item>
				</Form>
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ y: 400, x:"max-content" }} 
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex, 'rowId','roleId' ), 
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record, 'rowId', 'roleId')}
																/>
                <AddRole visiable={this.state.addRoleVisible} parent={this} />
                <EditRole record={this.state.record} visiable={this.state.editRoleVisible} parent={this} />
            </div>
        );
    }
}

export default RoleListTable;