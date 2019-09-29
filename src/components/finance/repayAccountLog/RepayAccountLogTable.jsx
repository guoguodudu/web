/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { repayAccountLog } from "@/api";
import { Modal, Button,Table,Tooltip } from 'antd';
import AddRepayAntLog from './AddRepayAntLog';
import EditRepayAntLog from './EditRepayAntLog';
import CopyRepayAntLog from './CopyRepayAntLog';
import ReadRepayAntLog from './ReadRepayAntLog';
import {selectList} from '../../../mapper.js';
import { onClickRow, setRowClassName,checkIsNull,errorInfo,successInfo,renderTextColumns,checkButtPermission} from '../../../Common.jsx';

const confirm = Modal.confirm;

class RepayAccountLogTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '供应商简称',
			align: 'center',
            dataIndex: 'supCode',
            width: 200,
            render: (text, index) => renderTextColumns(this.state.data, index, 'supCode', text),
        }, {
            title: '回款款账户-户名',
			dataIndex: 'repayAccName',
			align: 'center',
            width: 150,
            render: (text, index) => renderTextColumns(this.state.data, index, 'repayAccName', text),
        }, {
            title: '回款账户-开户行',
			align: 'center',
            dataIndex: 'repayAccBank',
            width: 150,
            render: (text, index) => renderTextColumns(this.state.data, index, 'repayAccBank', text),
        }, {
            title: '回款账户-账号',
            dataIndex: 'repayAccNo',
			align: 'center',
            width: 150,
            render: (text, index) => renderTextColumns(this.state.data, index, 'repayAccNo', text),
        }, {
            title: '修改原因',
			align: 'center',
            dataIndex: 'remarks',
            width: 150,
            render: (text, index) => renderTextColumns(this.state.data, index, 'remarks', text),
        }, {
            title: '状态',
            dataIndex: 'status',
			width: 150,
			align: 'center',
            render: (text, index) => renderTextColumns(this.state.data, index, 'status', text),
        }, {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            render: (text, record) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                        {
                                text === '草稿' ?
                                    <span>
                                    <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                    <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRepayAccountLog(record['id'],'ACTIVE')} /></Tooltip>
                                    <Tooltip title="删除"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#B00',title:'删除' }} icon="delete" onClick={() => this.deleteRepayAccountLog(record['id'])} /></Tooltip>
                                    <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRepayAccountLog(record['id'])} /></Tooltip>
                                    </span>
                                    : text === '激活' ?
                                        <span>
                                        <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.activeRepayAccountLog(record['id'],'INACTIVE')} /></Tooltip>
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRepayAccountLog(record['id'])} /></Tooltip>
                                        </span>
                                        :
                                        <span>
                                        <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['id'])} /></Tooltip>
                                        <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRepayAccountLog(record['id'],'ACTIVE')} /></Tooltip>
                                        <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent', color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRepayAccountLog(record['id'])} /></Tooltip>
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
        console.log("******************************",nextProps.List.length)
        var dataShow = [];
        if(nextProps.List !== undefined){
            for(var i=0; i<nextProps.List.length; i++){
                var element = {
                    key: nextProps.List[i].id,
                    id: {
                        value: nextProps.List[i].id,
                    },
                    supCode: {
                        value: nextProps.List[i].supCode,
                    },
                    repayAccName: {
                        value: nextProps.List[i].repayAccName,
                    },
                    repayAccBank: {
                        value: nextProps.List[i].repayAccBank,
                    },
                    repayAccNo: {
                        value: nextProps.List[i].repayAccNo,
                    },
                    remarks: {
                        value: nextProps.List[i].remarks,
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
            addRepayAccountLogVisiable: false,
            editRepayAccountLogVisiable: false,
            copyRepayAccountLogVisiable: false,
            readRepayAccountLogVisiable: false,
        });
    }

    renderColumns(data, index, key, text) {
        return text;
    }

    addRepayAccountLog() {//显示子组件——新增路由规则
        this.setState({
            addRepayAccountLogVisiable: true,
            editRepayAccountLogVisiable: false,
            copyRepayAccountLogVisiable: false,
            readRepayAccountLogVisiable: false,
        });
    }

    edit3 = (x) => {//给子组件传值
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
            editRepayAccountLogVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            addRepayAccountLogVisiable: false,
            copyRepayAccountLogVisiable: false,
            readRepayAccountLogVisiable: false,
        });
    }

    activeRepayAccountLog = (x, ActiveStatus) => {
        var str = selectList('ruleStatus',ActiveStatus);
        const modal = confirm({
            title: '提示信息',
            content: '您确定要'+str+'该规则吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk: async ()=> {
                let result = await repayAccountLog.update({id:x, status: ActiveStatus})
                    .catch(function (error) {//防止报错
                        console.log(error)
                });
                if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.result === 1){
                    successInfo(str+"成功");
                    this.state.parent.handleFilterSubmit();// TODO 要把当前页面查询条件清空
                }else{
                    errorInfo(str+"失败，请联系系统管理员")
                }
                modal.destroy();
            },
            onCancel() {
                //取消
            },
        });
    }

    copyRepayAccountLog = (x) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要复制该记录吗？',
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
                    type:'edit',
                    record: record,
                    copyRepayAccountLogVisiable: true,
                    addRepayAccountLogVisiable: false,
                    readRepayAccountLogVisiable: false,
                    editRepayAccountLogVisiable: false,
                });
            },
            onCancel() {
                //取消
            },
        });
    }

    deleteRepayAccountLog = (x) => {
        const modal = confirm({
            title: '提示信息',
            content: '您确定要删除该记录吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk: async ()=> {
                let result = await repayAccountLog.delete({id:x})
                    .catch(function (error) {//防止报错
                        console.log(error)
                });
                console.log("result,",result)
                if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.result === 1){
                    successInfo("删除成功");
                    this.state.parent.handleFilterSubmit();// TODO 要把当前页面查询条件清空
                }else{
                    errorInfo("删除失败，请联系系统管理员")
                }
                modal.destroy();
            },
            onCancel() {
                //取消
            },
        });
    }

    //双击事件部分
    doubleClick = (record, index, event) => {
        this.setState({
            readRepayAccountLogVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            copyRepayAccountLogVisiable: false,
            addRepayAccountLogVisiable: false,
            editRepayAccountLogVisiable: false,
            record:record,
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
        const {loading} = this.props;
        const pageId = this.props.parent.props.location.pathname;
        return (
            <div>
                <Button type="primary" style={{display : checkButtPermission(pageId,'addButt') }} icon="plus" onClick={() => this.addRepayAccountLog()} >新增</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: "max-content",y: 400 }}
					loading={loading}
					onRow={(record, rowIndex) => {
                        return {
                            onClick:(event) =>this.onClickRow(event, record, rowIndex), // click row
							onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row 
                        };
                    }}
                    rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <AddRepayAntLog visiable={this.state.addRepayAccountLogVisiable} parent={this} />
                <EditRepayAntLog record={this.state.record} visiable={this.state.editRepayAccountLogVisiable} parent={this} />
                <CopyRepayAntLog record={this.state.record} visiable={this.state.copyRepayAccountLogVisiable} parent={this} />
                <ReadRepayAntLog record={this.state.record} visiable={this.state.readRepayAccountLogVisiable} parent={this} />
            </div>
        );
    }
}

export default RepayAccountLogTable;