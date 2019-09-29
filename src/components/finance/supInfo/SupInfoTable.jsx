import React from 'react';
import { supInfo } from "@/api";
import { Modal, Button,Table,Tooltip } from 'antd';
import AddSup from './AddSup';
import EditSup from './EditSup';
import ReadSup from './ReadSup';
import CopySup from './CopySup';
import {selectList} from '../../../mapper.js';
import {
    onClickRow,
    setRowClassName,
    errorInfo,
    successInfo,
    checkButtPermission
} from '../../../Common.jsx';
import {PRE_FILE} from "../../../api/path";

import { checkIsNull, renderTextColumns} from "../../../Common";

const confirm = Modal.confirm;

class SupInfoTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '流水号',
            dataIndex: 'id',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'id', text),
        },{
            title: '供应商全称',
            dataIndex: 'supName',
            align: 'center',
            width: 250,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'supName', text),
        },
        {
            title: '供应商简称',
            dataIndex: 'supShortName',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'supShortName', text),
        },
        {
            title: '供应商代码',
            dataIndex: 'supCode',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'supCode', text),
        },
        {
            title: '供应商状态',
            dataIndex: 'supStatus',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'supStatus', text),
        },
        {
            title: '法定代表人',
            dataIndex: 'legalRepresent',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'legalRepresent', text),
        },
        {
            title: '实际控制人',
            dataIndex: 'actlController',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'actlController', text),
        },
        {
            title: '统一社会信用代码',
            dataIndex: 'unitCreditCode',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'unitCreditCode', text),
        },
        {
            title: '成立日期',
            dataIndex: 'estabDate',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'estabDate', text),
        },
        {
            title: '注册资本',
            dataIndex: 'regisCapital',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'regisCapital', text),
        },
        {
            title: '注册地址',
            dataIndex: 'regisAddress',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'regisAddress', text),
        },
        {
            title: '联系人姓名',
            dataIndex: 'contact',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'contact', text),
        },
        {
            title: '联系电话',
            dataIndex: 'contactMobile',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'contactMobile', text),
        },
        {
            title: '联系邮箱',
            dataIndex: 'contactEmail',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'contactEmail', text),
        },
        {
            title: '联系地址',
            dataIndex: 'contactAddress',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'contactAddress', text),
        },
        {
            title: '纳税人识别号',
            dataIndex: 'taxpayerId',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'taxpayerId', text),
        },
        {
            title: '劳务派遣许可证文件',
            dataIndex: 'ldLicAdd',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '劳务派遣许可编号',
            dataIndex: 'ldLicNo',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'ldLicNo', text),
        },
        {
            title: '劳派许可证有效期起期',
            dataIndex: 'ldLicStartDate',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'ldLicStartDate', text),
        },
        {
            title: '劳派许可证有效期止期',
            dataIndex: 'ldLicEndDate',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'ldLicEndDate', text),
        },
        {
            title: '人力资源服务证地址',
            dataIndex: 'hrLicAdd',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '人力资源服务许可编号',
            dataIndex: 'hrLicNo',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'hrLicNo', text),
        },
        {
            title: '人资许可证有效期起期',
            dataIndex: 'hrLicStartDate',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'hrLicStartDate', text),
        },
        {
            title: '人资许可证有效期止期',
            dataIndex: 'hrLicEndDate',
            align: 'center',
            width: 150,
            render: (text, record, index) => renderTextColumns(this.state.data, index, 'hrLicEndDate', text),
        },
        {
            title: '营业执照文件',
            dataIndex: 'busiLicAdd',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '公司章程文件',
            dataIndex: 'comPolAdd',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '股东会决议文件',
            dataIndex: 'holdersDecAdd',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '法定代表人身份证国徽面',
            dataIndex: 'legalIdFront',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '法定代表人身份证头像面',
            dataIndex: 'legalIdBack',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '企业征信报告文件',
            dataIndex: 'corpCreditReport',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '法定代表人征信报告文件',
            dataIndex: 'legalCreditReport',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '近6个月主账户流水文件',
            dataIndex: 'accFlowRec',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '劳务派遣服务协议文件',
            dataIndex: 'serviceConAdd',
            align: 'center',
            width: 150,
            render: (text) => {return (this.getUrl(text))},
            //render: (text, record, index) => renderTooltipText(text,18),
        },
        {
            title: '操作',
            dataIndex: 'operation',
            width: 160,
            fixed: 'right',
            render: (text, record, index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editSup') }} >
                        {
                            text === '激活' ?
                            <span>
                            <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit(record['id'])} /></Tooltip>
                            <Tooltip title="禁用"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.inactive(record['id'])} /></Tooltip>
                            <Tooltip title="复制"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copy(record['id'])} /></Tooltip>
                            </span>
                                :
                                text === '禁用' ?
                                <span>
                                <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit(record['id'])} /></Tooltip>
                                <Tooltip title="激活"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.active(record['id'])} /></Tooltip>
                                <Tooltip title="复制"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copy(record['id'])} /></Tooltip>
                                </span>
                                :
                                <span>
                                <Tooltip title="编辑"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit(record['id'])} /></Tooltip>
                                <Tooltip title="激活"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.active(record['id'])} /></Tooltip>
                                <Tooltip title="删除"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'删除' }} icon="delete"onClick={() => this.delete(record['id'])} /></Tooltip>
                                <Tooltip title="复制"><Button type="" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copy(record['id'])} /></Tooltip>
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
        var dataShow = [];
        if(nextProps.List !== undefined){
            for(var i=0; i<nextProps.List.length; i++){
                var element = {
                    key: nextProps.List[i].id,
                    id: {value: nextProps.List[i].id},
                    supName: {value: nextProps.List[i].supName},
                    supShortName: {value: nextProps.List[i].supShortName},
                    supCode: {value: nextProps.List[i].supCode},
                    supStatus: {value: selectList('ruleStatus',nextProps.List[i].supStatus)},
                    legalRepresent: {value: nextProps.List[i].legalRepresent},
                    actlController: {value: nextProps.List[i].actlController},
                    unitCreditCode: {value: nextProps.List[i].unitCreditCode},
                    estabDate: {value: nextProps.List[i].estabDate},
                    regisCapital: {value: nextProps.List[i].regisCapital},
                    regisAddress: {value: nextProps.List[i].regisAddress},
                    contact: {value: nextProps.List[i].contact},
                    contactMobile: {value: nextProps.List[i].contactMobile},
                    contactEmail: {value: nextProps.List[i].contactEmail},
                    contactAddress: {value: nextProps.List[i].contactAddress},
                    taxpayerId: {value: nextProps.List[i].taxpayerId},
                    ldLicAdd: {value: nextProps.List[i].ldLicAdd},
                    ldLicNo: {value: nextProps.List[i].ldLicNo},
                    ldLicStartDate: {value: nextProps.List[i].ldLicStartDate},
                    ldLicEndDate: {value: nextProps.List[i].ldLicEndDate},
                    hrLicAdd: {value: nextProps.List[i].hrLicAdd},
                    hrLicNo: {value: nextProps.List[i].hrLicNo},
                    hrLicStartDate: {value: nextProps.List[i].hrLicStartDate},
                    hrLicEndDate: {value: nextProps.List[i].hrLicEndDate},
                    busiLicAdd: {value: nextProps.List[i].busiLicAdd},
                    comPolAdd: {value: nextProps.List[i].comPolAdd},
                    holdersDecAdd: {value: nextProps.List[i].holdersDecAdd},
                    legalIdFront: {value: nextProps.List[i].legalIdFront},
                    legalIdBack: {value: nextProps.List[i].legalIdBack},
                    corpCreditReport: {value: nextProps.List[i].corpCreditReport},
                    legalCreditReport: {value: nextProps.List[i].legalCreditReport},
                    accFlowRec: {value: nextProps.List[i].accFlowRec},
                    serviceConAdd: {value: nextProps.List[i].serviceConAdd},
                    operation: {value: selectList('ruleStatus',nextProps.List[i].supStatus)},
                    // operation: {
                    //     value: selectList('ruleStatus',nextProps.List[i].supStatus),
                    //     key: nextProps.List[i].id,
                    // },
                };
                dataShow.push(element);
            }
        }
        this.setState({
            parent:nextProps.parent,
            dataAll:nextProps.List,
            data: dataShow,
            EditSupVisible:false,
            AddSupVisible:false,
            ReadSupVisible: false,
            CopySupVisible: false,
        });
    }

    getUrl = (text) => {
        let rstInfo = JSON.parse(text);
        let fileType = (rstInfo.name.substring(rstInfo.name.lastIndexOf(".")+1));
        return (
            <a style={{color:"dodgerblue",textDecoration:"underline"}}
               target="view_window"
               href={PRE_FILE + fileType + "/"+ rstInfo.fid}>
                预览
            </a>
        );
    }

    add() {//显示子组件
        this.setState({
            AddSupVisible: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            EditSupVisible: false,
            ReadSupVisible: false,
            CopySupVisible: false,
        });
    }

    delete = (x) => {
        const modal = confirm({
            title: '提示信息',
            content: '您确定要删除吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk: async ()=> {
                let result = await supInfo.delete({id:x})
                    .catch(function (error) {//防止报错
                        console.log(error)
                    });
                if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.retCode === 4){
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

    edit = (x) => {//给子组件传值
        let record;
        for(let i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record----edit------",record);
        this.setState({
            record: record,
            EditSupVisible: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            AddSupVisible: false,
            ReadSupVisible: false,
            CopySupVisible: false,
        });
    }

    copy = (x) => {//给子组件传值
        let record;
        for(let i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }
        console.log("record----copy------",record);
        this.setState({
            record: record,
            EditSupVisible: false,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            AddSupVisible: false,
            ReadSupVisible: false,
            CopySupVisible: true,
        });
    }

    active = (x) => {
        const modal = confirm({
            title: '提示信息',
            content: '您确定要激活吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk: async ()=> {
                let result = await supInfo.update({id:x, supStatus: 'ACTIVE'})
                    .catch(function (error) {//防止报错
                        console.log(error)
                    });
                if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.retCode === 2){
                    successInfo("激活成功");
                    this.state.parent.handleFilterSubmit();// TODO 要把当前页面查询条件清空
                }else{
                    errorInfo("激活失败，请联系系统管理员")
                }
                modal.destroy();
            },
            onCancel() {
                //取消
            },
        });
    }

    inactive = (x) => {
        const modal = confirm({
            title: '提示信息',
            content: '您确定要禁用吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk: async ()=> {
                let result = await supInfo.update({id:x, supStatus: 'INACTIVE'})
                    .catch(function (error) {//防止报错
                        console.log(error)
                    })
                if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.retCode === 2){
                    successInfo("禁用成功");
                    this.state.parent.handleFilterSubmit();// TODO 要把当前页面查询条件清空
                }else{
                    errorInfo("禁用失败，请联系系统管理员")
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
            ReadSupVisible:true,
            EditSupVisible: false,
            AddSupVisible: false,
            CopySupVisible: false,
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
        const {loading} = this.props
        const pageId = this.props.parent.props.location.pathname;
        return (
            <div>
                <Button type="primary" style={{display : checkButtPermission(pageId,'addSup') }} icon="plus" onClick={() => this.add()} >新增供应商</Button>
                <br /><br />
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: "max-content",y: 400 }}
					loading={loading}
					onRow={(record, rowIndex) => {
                        return {
                            onClick:(event) =>this.onClickRow(event, record, rowIndex,null,'id'),
                            onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
                        };
                    }}
                    rowClassName={(record)=>this.setRowClassName(record,null,'id')}
				/>
                <AddSup visiable={this.state.AddSupVisible} parent={this} />
                <EditSup record={this.state.record} visiable={this.state.EditSupVisible} parent={this} />
                <ReadSup record={this.state.record} visiable={this.state.ReadSupVisible} parent={this} />
                <CopySup record={this.state.record} visiable={this.state.CopySupVisible} parent={this} />

            </div>
        );
    }
}

export default SupInfoTable;