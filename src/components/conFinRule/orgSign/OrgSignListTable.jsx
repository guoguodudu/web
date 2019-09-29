/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import CertifyOrgSign from './CertifyOrgSign';
import { onClickRow, setRowClassName,sysErrorInfo,errorInfo,
	successInfo,checkButtPermission } from '../../../Common.jsx';
import {selectList} from '../../../mapper.js';

import axios from 'axios';

const confirm = Modal.confirm;

class OrgSignListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '机构类型',
			dataIndex: 'orgType',
			align: 'center',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'orgType', text),
        }, {
            title: '机构名称',
			dataIndex: 'orgGroupCode',
			align: 'center',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'orgGroupCode', text),
        }, {
            title: '签章渠道',
			dataIndex: 'signChannel',
			align: 'center',
            width: '15%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'signChannel', text),
        }, {
            title: '签章ID',
			dataIndex: 'signId',
			align: 'center',
            width: '25%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'signId', text),
        }, {
            title: '状态',
			dataIndex: 'status',
			align: 'center',
            width: '10%',
            render: (text, record, index) => this.renderColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
			dataIndex: 'operation',
            width: '20%',
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }}>
                        {

                            text === '激活' ?
                                <span>
                                <Tooltip title="签署法大大"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['id'])} /></Tooltip>
                                </span>
                                :
                                <span>
                                <Tooltip title="签署法大大"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
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
                    orgType: {
                        value: selectList('serviceOrgType',nextProps.List[i].orgType),
                    },
                    orgGroupCode: {
                        value: nextProps.List[i].orgGroupCode,
                    },
                    signChannel: {
                        value: selectList('signChannel',nextProps.List[i].signChannel),
                    },
                    signId: {
                        value: nextProps.List[i].signId,
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
            signVisiable: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
        });
    }

    renderColumns(data, index, key, text) {

            return text;
    }

    addOrgSign() {//显示子组件——新增路由规则
        this.setState({
            signVisiable: true,
        });
    }

    activeRule = (x) => {
        console.log("--x--",x);
        confirm({
            title: '提示信息',
            content: '您确定要激活该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgsign/fadadaedit',{
                        "id": x
                    }).then(
                        function (response) {
                            if(response.data.result === 1){
                                successInfo(response.data.retMsg);
                            } else{
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
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgsign/updateOrgSign',{
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
			signVisiable:false
		})
	}
	clearRowId(){
		this.setState({rowId:123123123})
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
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addOrgSign()} >机构签章认证</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ y: 400 }}
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex),
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <CertifyOrgSign hideAllModal={this.hideAllModal} visiable={this.state.signVisiable} parent={this} />
            </div>
        );
    }
}

export default OrgSignListTable;