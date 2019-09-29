/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddUser from './AddUser';
import EditUser from './EditUser';
import {selectList} from '../../../mapper.js';
import {renderTooltipText, onClickRow, setRowClassName,
	sysErrorInfo,errorInfo,successInfo,checkButtPermission,renderTextColumns} from '../../../Common.jsx';

import axios from 'axios';

const confirm = Modal.confirm;

class UserListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        // eslint-disable-next-line 
        this.columns = [
        {
        //     title: '用户流水号',
        //     dataIndex: 'userId',
        //     width: 150,
        //     render: (text, record, index) => renderTextColumns(this.state.data, index, 'userId', text),
        // }, {
            title: '用户名',
            dataIndex: 'userName',
			align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'userName', text),
        }, {
            title: '用户中文名',
			align: 'center',
            dataIndex: 'nickName',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'nickName', text),
        }, {
            title: '机构类型',
			align: 'center',
            dataIndex: 'orgType',
            width: 130,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgType', text),
        }, {
            title: '机构集团',
			align: 'center',
            dataIndex: 'orgGroupSname',
            width: 130,
            render: (text, record, index) => renderTooltipText( text, 7),
        },, {
            title: '邮箱',
            dataIndex: 'email',
			align: 'center',
            width: 300,
            render: (text, record, index) => renderTooltipText(text, 30),
        }, {
            title: '电话',
            dataIndex: 'phone',
			align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'phone', text),
        }, {
            title: '状态',
			align: 'center',
            dataIndex: 'status',
            width: 100,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: 160,
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                        {
                            text === '激活' ?
                            <span>
                            <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['userId'])} /></Tooltip>
                            <Tooltip title="禁用"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['userId'])} /></Tooltip>
                            </span>
                            :
                            <span>
                            <Tooltip title="激活"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['userId'])} /></Tooltip>
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
                    key: nextProps.List[i].userId,
                    userId: {
                        value: nextProps.List[i].userId,
                    },
                    userName: {
                        value: nextProps.List[i].userName,
                    },
                    nickName: {
                        value: nextProps.List[i].nickName,
                    },
                    orgType: {
                        value: selectList('serviceOrgType',nextProps.List[i].orgType),
                    },
                    orgGroupCode: {
                        value: nextProps.List[i].orgGroupCode,
                    },
                    orgGroupSname: {
                        value: nextProps.List[i].orgGroupSname,
                    },
                    orgCompCode: {
                        value: nextProps.List[i].orgCompCode,
                    },
                    orgCompSname: {
                        value: nextProps.List[i].orgCompSname,
                    },
                    email: {
                        value: nextProps.List[i].email,
                    },
                    phone: {
                        value: nextProps.List[i].phone,
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                    },
                    operation: {
                        value: selectList('ruleStatus',nextProps.List[i].status),
                        key: nextProps.List[i].userId,
                    },
                };
                dataShow.push(element);
            }
        }
        this.setState({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow,
            editUserVisible:false,
            addUserVisible:false,
        });
    }

    renderColumns(data, index, key, text) {

            return text;
    }

    addRouterRule() {//显示子组件
        console.log("11111------addRouterRule");
        this.setState({
            addUserVisible: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            editUserVisible: false
        });
        console.log("2222-----addRouterRule  this.state",this.state);
    }

    edit3 = (x) => {//给子组件传值
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].userId === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record----------",record);
        this.setState({
            record: record,
            editUserVisible: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            addUserVisible: false,
        });
    }

    activeRule = (x) => {

        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要激活该用户吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/userapi/updateUser',{
                        "userId": x,
                        "status" : "ACTIVE",
                        "modifyId":localStorage.getItem('userName')
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("用户激活成功");
                                thi.state.parent.queryUserList();
                            } else {
                                errorInfo('激活用户失败');
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
            content: '您确定要禁用该用户吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/userapi/updateUser',{
                        "userId": x,
                        "status" : "INACTIVE",
                        "modifyId":localStorage.getItem('userName')
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("用户禁用成功");
                                console.log('thi.state',thi.state);
                                thi.state.parent.queryUserList();
							} else {
                                errorInfo('用户禁用失败');
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
        const { data } = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;
        const {loading} = this.props
        const pageId = this.props.parent.props.location.pathname;
        return (
            <div>
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增用户</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: "max-content",y: 400 }}
					loading={loading}
					onRow={(record, rowIndex) => {
                        return {
                            onClick:(event) =>this.onClickRow(event, record, rowIndex,null,'userId'), 
                        };
                    }}
                    rowClassName={(record)=>this.setRowClassName(record,null,'userId')}
																/>
                <AddUser visiable={this.state.addUserVisible} parent={this} />
                <EditUser record={this.state.record} visiable={this.state.editUserVisible} parent={this} />
            </div>
        );
    }
}

export default UserListTable;