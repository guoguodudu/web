import React from 'react';
import {Button,Table,Tooltip } from 'antd';
import {selectList} from '../../../mapper.js';
import {onClickRow, setRowClassName,checkButtPermission,contains,renderTextColumns} from '../../../Common.jsx';
import EditSignParm from './EditSignParm';
import ReadSignParm from './ReadSignParm';


class SignParmListTable extends React.Component {
    constructor(props) {
        super(props);
        
        const pageId = this.props.parent.props.location.pathname;
        this.columns = [
        {
            title: '模板ID',
			dataIndex: 'tempId',
			align: 'center',
            width: 350,
            render: (text,record, index) => renderTextColumns(record, index, 'tempId', text),
        }, {
            title: '参数KEY',
			dataIndex: 'parmKey',
			align: 'center',
            width: 120,
            render: (text, record, index) => renderTextColumns(record, index, 'parmKey', text),
        }, {
            title: '参数值字段',
			dataIndex: 'parmValue',
			align: 'center',
            width: 120,
            render: (text, record, index) => renderTextColumns(record, index, 'parmValue', text),
        }, {
            title: '参数值字段说明',
			dataIndex: 'parmRemarks',
			align: 'center',
            width: 200,
            render: (text, record, index) => renderTextColumns(record, index, 'parmRemarks', text),
        }, {
            title: '操作',
			dataIndex: 'operation',
            width: 160,
            render: (text, record,index) => {
                var txt = this.getColumns(record, index, 'parmKey', text).parmKey;

                if(contains(txt,'parame')){
                    return (
                        <div className="editable-Row-operations" style={{display : checkButtPermission(pageId,'editButt') }} >
                            {
                                <span>
                                    <Tooltip title="编辑"><Button type="primary" style={{height:'16px', border:'none', fontSize:'16px', background: 'transparent',color:'#08c',title:'编辑' }} icon="edit" onClick={() => this.edit3(record['key'])} /></Tooltip>
                                </span>
                            }
                        </div>
                    );
                }else{
                    return (
                        <div />
                    );
                }
            },
        }];
        // eslint-disable-next-line
        this.state = {
            data: [],
            readSignParmVisiable: false,
            editSignParmVisiable: false,
		};
		this.setRowClassName = setRowClassName.bind(this);
		this.onClickRow = onClickRow.bind(this);
		this.hideAllModal = this.hideAllModal.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        console.log("--------nextProps----",nextProps.record);
        var dataShow = [];
        if(nextProps.record !== undefined){
            for(var i=0; i<nextProps.record.length; i++){
                var element = {
                    key: nextProps.record[i].id,
                    id: {
                        value: nextProps.record[i].id,
                    },
                    tempId: {
                        value: nextProps.record[i].tempId +' : '+ nextProps.record[i].tempName,
                    },
                    parmKey: {
                        value: nextProps.record[i].parmKey,
                    },
                    parmValue: {
                        value: nextProps.record[i].parmValue,
                    },
                    parmRemarks: {
                        value: nextProps.record[i].parmRemarks,
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
            readSignParmVisiable: false,
            editSignParmVisiable: false,
            parent:nextProps.parent,
            dataAll:nextProps.record,
            data: dataShow,
            record:nextProps.record,
        });
    }

    renderColumns(data, index, key, text) {
            return text;
    }

    getColumns(data, index, key, text) {
        return data;
    }

    edit3 = (x) => {//给子组件传值---并且显示子组件，编辑路由规则
        console.log("record x",x);
        var record;
        for(var i = 0; i< this.state.dataAll.length; i++){
            if(this.state.dataAll[i].id === x){
                record = this.state.dataAll[i];
            }
        }

        this.setState({
            type:'edit',
            record: record,
            editSignParmVisiable: true,//编辑的组件变成可见状态
            readSignParmVisiable: false,
        });
    }

     //双击事件部分
     doubleClick = (record, index, event) => {
        this.setState({
            readSignParmVisiable: true,//要把其他组件设置为不可见，否则若有其他组件Visiable为true,setState的时候，其他组件也会展示
            editSignParmVisiable: false,
            record:record,
            type:'edit',
        });
        event.stopPropagation(); //尝试阻止默认事件，失败
    };

	hideAllModal(){
		this.setState({
			editSignParmVisiable: false,
			readSignParmVisiable: false
		})
	}
    render() {
        console.log(" table render",this.state);
        const { data } = this.state;
        const dataSource = data.map((item) => {
            const obj = {};
            Object.keys(item).forEach((key) => {
                obj[key] = key === 'key' ? item[key] : item[key].value;
            });
            return obj;
        });
        const columns = this.columns;

        return (

            <div>
                <Table bordered dataSource={dataSource} columns={columns} scroll={{ x: 900,y: 400 }}
					onRow={(record, rowIndex) => {
						return {
							onClick:(event) =>this.onClickRow(event, record, rowIndex), 
							onDoubleClick: (event)=>this.doubleClick(record, rowIndex, event) // double click row
						};
					}}
					rowClassName={(record)=>this.setRowClassName(record)}
																/>				
                <EditSignParm record={this.state.record} visiable={this.state.editSignParmVisiable} parent={this} hideAllModal={this.hideAllModal} />
                <ReadSignParm record={this.state.record} visiable={this.state.readSignParmVisiable} parent={this} hideAllModal={this.hideAllModal} />
            </div>
        );
    }
}

export default SignParmListTable;