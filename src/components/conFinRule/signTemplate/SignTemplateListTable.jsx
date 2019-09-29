import React from 'react';
import { Modal, Button,Table,Tooltip,} from 'antd';
import {selectList} from '../../../mapper.js';
import {
onClickRow, setRowClassName,
successInfo, errorInfo,sysErrorInfo,checkButtPermission} from '../../../Common.jsx';
import AddOrEditSignTemplate from './AddOrEditSignTemplate';
import {signTemplate} from "@/api";
const confirm = Modal.confirm;

class SignTemplateListTable extends React.Component {

    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '模板ID',
            dataIndex: 'tempId',
			width: 150,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'tempId', text),
        },
        {
            title: '模板使用类型',
            dataIndex: 'tempKind',
			width: 150,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'tempKind', text),
        },
        {
            title: '模板名称',
            dataIndex: 'tempName',
			width: 320,
			align:'center',
            render: (text, record, index) => this.renderColumns(record, index, 'tempName', text),
        }, {
            title: '模板存放地址',
            dataIndex: 'tempPath',
			width: 600,
			align:'center',
            render: (text, record, index) => this.renderColumns(record, index, 'tempPath', text),
        }, {
            title: '文件类型',
            dataIndex: 'fileType',
			width: 200,
			align:'center',
            render: (text, record, index) => this.renderColumns(record, index, 'fileType', text),
        }, {
            title: '是否含还款计划',
            dataIndex: 'dpFalg',
			width: 150,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'dpFalg', text),
        },{
            title: '还款计划期数',
            dataIndex: 'insTerm',
			width: 150,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'insTerm', text),
        }, {
            title: '金融服务商是否签署',
            dataIndex: 'fserviceSign',
			width: 200,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'fserviceSign', text),
        }, {
            title: '金融服务商签章关键字',
            dataIndex: 'fserviceSignKey',
			width: 200,
			align:'center',
            render: (text, record,index) => this.renderColumns(record, index, 'fserviceSignKey', text),
        }, {
            title: '付款人签章关键字',
            dataIndex: 'debtorSignKey',
			width: 200,
			align:'center',
            render: (text, index) => this.renderColumns(this.state.data, index, 'debtorSignKey', text),
        }, {
            title: '资金方签章关键字',
            dataIndex: 'funderSignKey',
			width: 200,
			align:'center',
            render: (text, record,index) => this.renderColumns(record, index, 'funderSignKey', text),
        }, {
            title: '参数个数',
            dataIndex: 'parmNum',
			width: 150,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'parmNum', text),
        }, {
            title: '描述',
            dataIndex: 'remarks',
			width: 150,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'remarks', text),
        }, {
            title: '状态',
            dataIndex: 'status',
			width: 100,
			align:'center',
            render: (text,record, index) => this.renderColumns(record, index, 'status', text),
        }, {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
			width: 160,
            render: (text, record,index) => {
                return (
                    <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                        {
                        text === '草稿'?
                            <span>
                            <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['key'])} /></Tooltip>
                            <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['key'],'激活','ACTIVE')} /></Tooltip>
                            </span>
                            : text === '激活' ?
                                <span>
                                <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit"onClick={() => this.edit3(record['key'])} /></Tooltip>
                                <Tooltip title="禁用"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'禁用' }} icon="arrow-down" onClick={() => this.activeRule(record['key'],'禁用','INACTIVE')} /></Tooltip>
                                <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['key'])} /></Tooltip>
                                </span>
                                :
                                <span>
                                <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['key'])} /></Tooltip>
                                <Tooltip title="激活"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'激活' }} icon="arrow-up" onClick={() => this.activeRule(record['key'],'激活','ACTIVE')} /></Tooltip>
                                <Tooltip title="复制"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'复制' }} icon="copy" onClick={() => this.copyRule(record['key'])} /></Tooltip>
                                </span>
                        }
                    </div>
                );
            },
        }];
        // eslint-disable-next-line
        this.state = {
            data: [],
            addSignTemplateVisiable: false,
            copySignTemplateVisiable: false,
            readSignTemplateVisiable: false,
            editSignTemplateVisiable: false,
        };
		this.setRowClassName = setRowClassName.bind(this);
		this.onClickRow = onClickRow.bind(this);
		this.hideAllModal = this.hideAllModal.bind(this);
        //上传
    }


    componentWillReceiveProps(nextProps) {
        var dataShow = [];
        if(nextProps.record !== undefined){
            for(var i=0; i<nextProps.record.length; i++){
                var element = {
                    key: nextProps.record[i].id,
                    id: {
                        value: nextProps.record[i].id,
                    },
                    tempId: {
                        value: nextProps.record[i].tempId,
                    },
                    tempKind: {
                        value: selectList('tempKind',nextProps.record[i].tempKind),
                    },
                    tempName: {
                        value: nextProps.record[i].tempName,
                    },
                    tempPath: {
                        value: nextProps.record[i].tempPath,
                    },
                    fileType: {
                        value: nextProps.record[i].fileType,
                    },
                    dpFalg: {
                        value: selectList('ActiveStatus',nextProps.record[i].dpFalg),
                    },
                    fserviceSign: {
                        value: nextProps.record[i].fserviceSign,
                    },
                    fserviceSignKey: {
                        value: nextProps.record[i].fserviceSignKey,
                    },
                    debtorSignKey: {
                        value: nextProps.record[i].debtorSignKey,
					},
					funderSignKey: {
                        value: nextProps.record[i].funderSignKey,
                    },
                    parmNum: {
                        value: nextProps.record[i].parmNum,
                    },
                    remarks: {
                        value: nextProps.record[i].remarks,
                    },
                    status: {
                        value: selectList('ruleStatus',nextProps.record[i].status),
                    },
                    operation: {
                        value: selectList('ruleStatus',nextProps.record[i].status),
                        key: nextProps.record[i].id,
                    },
                };
                dataShow.push(element);
            }
        }

        this.setState ({
            addSignTemplateVisiable: false,
            copySignTemplateVisiable: false,
            readSignTemplateVisiable: false,
            editSignTemplateVisiable: false,
            parent:nextProps.parent,
            dataAll:nextProps.record,
            data: dataShow,
            record:nextProps.record,
        });
    }

    renderColumns(data, index, key, text) {
            return text;
    }

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }

        this.setState({
            type:'edit',
            record: record,
            editSignTemplateVisiable: true,//编辑的组件变成可见状态
            addSignTemplateVisiable: false,
            copySignTemplateVisiable: false,
            readSignTemplateVisiable: false,
        });
    }

    addSignTemplateConf() {//显示子组件——新增路由规则
        this.setState({
            addSignTemplateVisiable: true,//新增的组件变成可见状态
            editSignTemplateVisiable: false,
            copySignTemplateVisiable: false,
            readSignTemplateVisiable: false,
        });
    }

     //双击事件部分
    doubleClick = (record, index, event) => {
        this.setState({
            readSignTemplateVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            editSignTemplateVisiable: false,
            copySignTemplateVisiable: false,
            addSignTemplateVisiable: false,
            record:record,
        });
        event.stopPropagation(); //尝试阻止默认事件，失败
    };

    activeRule = (x,Str, ActiveStatus) => {
        var thi = this;
        confirm({
            title: '提示信息',
            content: '您确定要'+Str+'该数据吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
				
                signTemplate.updateStatus({
                        "id": x,
                        "status" : ActiveStatus,
                    }).then(
                        function (response) {
                            if(response.data.result === 1){
                                successInfo(response.data.retMsg);
                                thi.setState({
                                    addSignTemplateVisiable:false,
                                    editSignTemplateVisiable:false,
                                    copySignTemplateVisiable:false,
                                    readSignTemplateVisiable:false,
                                });
                                thi.state.parent.handleFilterSubmit();
                            } else {
                                errorInfo(Str+"失败");
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
                    type:'copy',
                    record: record,
                    copySignTemplateVisiable: true,
                    addSignTemplateVisiable: false,
                    editSignTemplateVisiable: false,
                    readSignTemplateVisiable: false,
                });
            },
            onCancel() {
                //取消
            },
        });
    }
	hideAllModal(){
		this.setState({
			editSignTemplateVisiable:false,
			addSignTemplateVisiable:false,
			readSignTemplateVisiable:false,
			copySignTemplateVisiable:false,
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
        
        const pageId = this.props.parent.props.location.pathname;
		
        return (

            <div>
                <div style={{display : checkButtPermission(pageId,'editButt') }}>
                    <Button type="primary" icon="plus" onClick={() => this.addSignTemplateConf()} >新增模板</Button>
                </div>
                <br />

                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 'max-content', y: 400 }} 
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex), 
							onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record)}
																/>
                <AddOrEditSignTemplate record={this.state.record}
                    editSignTemplateVisiable={this.state.editSignTemplateVisiable}
                    addSignTemplateVisiable={this.state.addSignTemplateVisiable}
                    copySignTemplateVisiable={this.state.copySignTemplateVisiable}
                    parent={this}
                />
                {/* <ReadSignTemplate record={this.state.record} readSignTemplateVisiable={this.state.readSignTemplateVisiable} parent={this} />  */}
            </div>
        );
    }
}

export default SignTemplateListTable;