/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Modal, Button,Table,Tooltip } from 'antd';
import AddOrgConfRule from './AddOrgConfRule';
import EditOrgConfRule from './EditOrgConfRule';
import CopyOrgConfRule from './CopyOrgConfRule';
import {selectList} from '../../../mapper.js';
import axios from 'axios';
import {successInfo, sysErrorInfo,checkButtPermission,renderTextColumns,
	onClickRow, setRowClassName,
	renderTooltipText} from '../../../Common.jsx';

const confirm = Modal.confirm;

class OrgConfRuleListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '机构类型',
            dataIndex: 'orgType',
			align: 'center',
            width: 120,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgType', text),
        }, {
            title: '机构集团',
            dataIndex: 'orgGroupCode',
			align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgGroupCode', text),
        }, {
            title: '机构公司',
            dataIndex: 'orgCompCode',
			align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgCompCode', text),
        }, {
            title: '商户网点',
            dataIndex: 'orgSiteCode',
			align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'orgSiteCode', text),
        }, {
            title: '说明',
            dataIndex: 'remarks',
            width: 200,
			align: 'center',
            render: (text, record, index) => renderTooltipText( text, 15),
        }
        , {
            title: '状态',
            dataIndex: 'status',
			align: 'center',
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
                                text === '草稿' ?
                                    <span>
                                    <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                    <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
                                    <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'复制' }} icon="copy" onClick={() => this.copyOrg(record['id'])} /></Tooltip>
                                    <Tooltip title="删除"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#B00',title:'删除' }} icon="delete" onClick={() => this.deleteRule(record['id'])} /></Tooltip>
                                    </span>
                                    : text === '激活' ?
                                        <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'禁用' }} icon="arrow-down" onClick={() => this.inactiveRule(record['id'])} /></Tooltip>
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'复制' }} icon="copy" onClick={() => this.copyOrg(record['id'])} /></Tooltip>
                                        </span>
                                        :
                                        <span>
                                        <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'编辑' }} icon="edit" onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['id'])} /></Tooltip>
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c', title:'复制' }} icon="copy" onClick={() => this.copyOrg(record['id'])} /></Tooltip>
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
        console.log("--------OrgConfRuleListTable------nextProps----",nextProps.List);
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
                        value: nextProps.List[i].orgGroupCode === undefined ? '' :nextProps.List[i].orgGroupShortname,
                    },
                    orgCompCode: {
                        value: nextProps.List[i].orgCompCode === undefined ? '' : nextProps.List[i].orgCompShortname,
                    },
                    orgSiteCode: {
                        value: nextProps.List[i].orgSiteCode === undefined ? '' : nextProps.List[i].orgSiteShortname,
                    },
                    remarks: {
                        value: nextProps.List[i].remarks ,
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
            editOrgConfRuleVisiable: false,
            addOrgConfRuleVisiable: false,
            copyOrgConfRuleVisiable: false
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
            record: record,
            editOrgConfRuleVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            addOrgConfRuleVisiable: false,
            copyOrgConfRuleVisiable: false
        });

    }

    copyOrg = (x) => {
        console.log("copyOrg = (x)",x)
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record",record);
        this.setState({
            record: record,
            editOrgConfRuleVisiable: false,
            addOrgConfRuleVisiable: false,
            copyOrgConfRuleVisiable: true, //要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
        });
    }

    addRouterRule() {//显示子组件——新增
        console.log("addRouterRule");
        this.setState({
            editOrgConfRuleVisiable: false,
            copyOrgConfRuleVisiable: false,
            addOrgConfRuleVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
        });
    }

    activeRule = (x) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要激活该机构吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/updateOrgConf',{
                        "id": x,
                        "status" : "ACTIVE",
                        "modifyId": localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("机构激活成功");
                                thi.state.parent.handleFilterSubmit();
                            }else{
                                sysErrorInfo(response);
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
            content: '您确定要禁用该机构吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/updateOrgConf',{
                        "id": x,
                        "status" : "INACTIVE",
                        "modifyId": localStorage.getItem('userName'),
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("机构禁用成功");
                                console.log('thi.state',thi.state);
                                thi.state.parent.handleFilterSubmit();
                             }else{
                                sysErrorInfo(response);
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
            content: '您确定要删除该机构吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                    axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/deleteOrgConf',{
                        "id": x
                    }).then(
                        function (response) {
                            console.log('response--',response)
                            if(response.data.STATUS === "200"){
                                successInfo("机构删除成功");
                                thi.state.parent.handleFilterSubmit();
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

    clickRow = (record, index, event) => {
        let fileListData = record.orgGroupCode;
        console.log(fileListData);
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
                <Button type="primary" style={{display : checkButtPermission(pageId,'editButt') }} icon="plus" onClick={() => this.addRouterRule()} >新增机构信息</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: "max-content",y: 400 }} 
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex), 
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <AddOrgConfRule visiable={this.state.addOrgConfRuleVisiable} parent={this} />
                <EditOrgConfRule visiable={this.state.editOrgConfRuleVisiable} parent={this} record={this.state.record} />
                <CopyOrgConfRule visiable={this.state.copyOrgConfRuleVisiable} parent={this} record={this.state.record} />
                {/* <ReadOrgConfRule record={this.state.record} visiable={this.state.ReadOrgConfRule} parent={this} />  */}
            </div>
        );
    }
}

export default OrgConfRuleListTable;