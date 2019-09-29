import React from 'react';
import { Modal,Button,Input,Row,Col,Select } from 'antd';
import {selectPageList,selectPageUtils,selectButtonUtils , selectGroupUtils} from '../../../SelectUtils.jsx';
import {selectButtonList} from '../../../routes/config.js';
import {sysErrorInfo,errorInfo,successInfo,checkNull,warningInfo } from '../../../Common.jsx';

import axios from 'axios';
class AddOrEditPermission extends React.Component {

    state = {

    };


    componentWillMount() {
        console.log("----------AddOrEditRateConfRule.componentWillMount---------------");
        // eslint-disable-next-line
        this.state = {

            loading3: false,
            visible3: this.props.visiable,
        }
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------AddOrEditRateConfRule.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,

            });
            if(nextProps.parent.state.type ==='add'){

                this.setState({
                    permId:undefined,
                    permName:undefined,
                    pageCode:undefined,
                    pageName:undefined,
                    buttCode:undefined,
                    buttName:undefined,
                    pageSort:undefined,
                    groupId:undefined,
                    status:"ACTIVE",
                    createId:localStorage.getItem('userName'),
                    url:'/permiapi/addPermission',
                    pageCodeFalg:false,
					buttCodeFalg:false,
					pageSortFalg:false,
                    type:'新增权限',
                });

            } else if(nextProps.parent.state.type ==='edit'){
                this.setState({

                    permId:nextProps.record.permId,
                    permName:nextProps.record.permName,
                    pageCode:nextProps.record.pageCode,
                    pageName:nextProps.record.pageName,
                    buttCode:nextProps.record.buttCode,
                    buttName:nextProps.record.buttName,
                    pageSort:nextProps.record.pageSort,
                    groupId:nextProps.record.groupId,
                    modifyId:localStorage.getItem('userName'),
                    url:'/permiapi/updatePermission',
                    type:'编辑权限',
                    pageCodeFalg:true,
					buttCodeFalg:true,
					pageSortFalg:false,
                });
            }

        }

    }


    handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);
        if(checkNull(this.state.pageCode,'页面名称')){
            return;
        }
        if(checkNull(this.state.groupId,'分组名称')){
            return;
		}
		var pageSort = this.state.pageSort;
        if(checkNull(pageSort,'排序')){
            return;
		}
		if(pageSort[0]!==this.state.groupId){
			warningInfo("排序第一个字符与分组id不匹配");
			return;
		}
		
        var jsonStr ;
        if(this.state.url==='/permiapi/addPermission'){
            jsonStr = {
                "permName":this.state.permName,
                "pageCode": this.state.pageCode,
                "pageName": this.state.pageName,
                "buttCode": this.state.buttCode,
                "buttName": this.state.buttName,
                "groupId" : this.state.groupId,
                "pageSort": this.state.pageSort,
                "status":this.state.status,
                "createId": this.state.createId,
            };
        } else if(this.state.url==='/permiapi/updatePermission'){
            jsonStr = {
                "permId":this.state.permId,
                "groupId" : this.state.groupId,
                "pageSort": this.state.pageSort,
                "modifyId": this.state.modifyId,
            };
        }


    console.log("handleOk3---jsonStr--",jsonStr);
    var thi = this;
    axios.post(localStorage.getItem('IP_PORT_BACKEND')+this.state.url,
        jsonStr).then(
        function (response) {
            console.log('200--',response)
            if(response.data.STATUS === "200"){
                successInfo("操作成功");
                thi.setState({ visible3: false, loading3: false });
				thi.state.parent.state.parent.handleFilterSubmit();
				thi.props.parent.setState({addOrEditPermiVisiable:false})				
            }else{
                errorInfo(response.data.CONTENT);
            }
    }).catch(function (error) {
        sysErrorInfo(error);
    });

    };


    handleCancel3 = () => {
		this.props.parent.setState({addOrEditPermiVisiable:false})
        this.setState({
            visible3: false,
        });
    };



    handlePermName = (e) => {
        this.setState({ permName: e.target.value });
    }

    handlePageCode = (value) => {
        this.setState({
            pageCode: value,
            pageName: selectPageList(value),
            permName: selectPageList(value),
            buttCode: undefined
        });
    }

    handleButtCode = (value) => {
        this.setState({
            buttCode: value,
            buttName: selectButtonList('buttonId', this.state.pageCode, value),
            permName: selectPageList(this.state.pageCode)+'-'+selectButtonList('buttonId', this.state.pageCode, value)
        });
    }

    handleGroupId = (value) => {
        this.setState({
			groupId: value,
			pageSort: value
		});
		if(this.state.buttCode){
			this.setState({
				pageSort: value+'00',
				pageSortFalg: true,
			});
		}
    }

    handlePageSort = (e) => {
        //检查数字范围，并存储groupMap
        this.setState({ pageSort: e.target.value});
    }

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'300px'}
                        visible={this.state.visible3}
                        title={this.state.type}
                        onOk={this.handleOk3}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading3} onClick={this.handleOk3}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row>
                        <Col span={20}>
                            <br />
                            <Row>
                                <Col span={8}>权限名称： </Col>
                                <Col span={14}>
                                    <Input style={{width:'180px'}} value={this.state.permName} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>页面名称： </Col>
                                <Col span={14}>
                                    <Select value={this.state.pageCode} onChange={this.handlePageCode} disabled={this.state.pageCodeFalg} style={{ width: 180 }} >
                                    {selectPageUtils()}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>按键名称： </Col>
                                <Col span={14}>
                                    <Select value={this.state.buttCode} onChange={this.handleButtCode} disabled={this.state.buttCodeFalg} style={{ width: 180 }} >
                                        {selectButtonUtils(this.state.pageCode)}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>分组编号： </Col>
                                <Col span={14}>
                                    <Select value={this.state.groupId} onSelect={this.handleGroupId} style={{ width: 180 }} >
                                        {selectGroupUtils()}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>排序： </Col>
                                <Col span={14}>
                                <Input style={{width:'180px'}} value={this.state.pageSort} onChange={this.handlePageSort} disabled={this.state.pageSortFalg} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={4} />

                    </Row>

                    </Modal>
            </div>
        );
    }
}

export default AddOrEditPermission;