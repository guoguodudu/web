import React from 'react';
import { Modal,Button,Input,Row,Col,Select,Icon } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {sysErrorInfo,errorInfo,warningInfo,successInfo,checkNull } from '../../../Common.jsx';

import axios from 'axios';

class AddOrEditSignConConf extends React.Component {

    state = {

    };


    componentWillMount() {
        console.log("----------AddOrEditSignConConf.componentWillMount---------------");
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
        })
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------AddOrEditSignConConf.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.initTempId();
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
            });
            if(nextProps.parent.state.type ==='add'){

                this.setState({
                    id:undefined,
                    orgConSn:undefined,
                    tempId:undefined,
                    tempType:undefined,
                    status:"DRAFT",
                    createId:localStorage.getItem('userName'),
                    modifyId:undefined,
                    url:'/sccapi/addSignConConf',
                    type:'新增配置',
                    checkConSn1: false,
                    checkConSn2: false


                });

            } else if(nextProps.parent.state.type ==='edit'){

                this.setState({

                    id:nextProps.record.id,
                    orgConSn:nextProps.record.orgConSn,
                    tempId:nextProps.record.tempId,
                    tempType:nextProps.record.tempType,
                    status:nextProps.record.status,
                    createId:undefined,
                    modifyId:localStorage.getItem('userName'),
                    url:'/sccapi/updateSignConConf',
                    type:'编辑配置',
                    checkConSn1: true,
                    checkConSn2: false
                });
            }
        }
    }
    initTempId() {
        console.log(" ---- initTempId ---- ");
        var thi = this;
        var tempList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/signtemplateapi/queryTempList',
        {}).then(function (response) {
            for (var i = 0; i < response.data.List.length; i++) {
                if(response.data.List[i] != null){
                    tempList.push(<Select.Option key={response.data.List[i].tempId}>{response.data.List[i].tempId+"-"+response.data.List[i].tempName}</Select.Option>);
                }
            }
            thi.setState({
                tempList: tempList,
                allList:response.data.List
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

	handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);

        if(checkNull(this.state.orgConSn,'机构合同编号')){
            return;
        }
        if(!this.state.checkConSn1 || this.state.checkConSn2){
            warningInfo("机构合同编号不正确！");
            return;
        }

        if(checkNull(this.state.tempId,'模板编号')){
            return;
        }

        var jsonStr = {
            "id":this.state.id,
            "orgConSn":this.state.orgConSn,
            "tempId":this.state.tempId,
            "tempType":this.state.tempType,
            "status":this.state.status,
            "createId": this.state.createId,
            "modifyId": this.state.modifyId,
        };
        var thi = this;
        console.log("json",jsonStr);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+this.state.url,
            jsonStr).then(
            function (response) {
                console.log('200--',response)
                if(response.data.STATUS === "200"){
                    successInfo("操作成功");
					thi.setState({ visible3: false, loading3: false });
					thi.props.hideAllModal();
                    thi.state.parent.state.parent.handleFilterSubmit();
                } else if(response.data.STATUS === "201" || response.data.STATUS === "202"){
                    errorInfo(response.data.CONTENT);
                    console.log("response.data.CONTENT",response.data.CONTENT);
                } else {
                    sysErrorInfo();
                    console.log("response.data.CONTENT",response.data.CONTENT);
                }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    };


    handleCancel3 = () => {
        this.setState({
            visible3: false,
		});
		this.props.hideAllModal()		
    };

    handleOrgConSn = (e) => {
        console.log(e.target.value);
        this.setState({ orgConSn: e.target.value});
    }

    handleTempId = (value) => {
        console.log("--148--" ,value);
        for(var i = 0; i< this.state.allList.length; i++){
            if(this.state.allList[i].tempId === value){
                console.log("--151--",this.state.allList[i]);
                this.setState({
                    tempId: value,
                    tempType: this.state.allList[i].fileType
                });
            }
        }
    }

    initOrgConOption(value) {
        this.setState({
            checkConSn1: false,
            checkConSn2: false
        });
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/orgconapi/queryCurtimeOrgConConfList',{
            "orgConSn": value,
        }).then(function (response) {
            console.log("---470---response--",response);
            if(response.data.STATUS === '200'){
                if(response.data.COUNT===1){
                    thi.setState({
                        checkConSn1: true,
                        checkConSn2: false
                    });
                } else {
                    thi.setState({
                        checkConSn1: false,
                        checkConSn2: true
                    });
                }

            } else {
                thi.setState({
                    checkConSn1: false,
                    checkConSn2: true
                });
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });

    }

    inputBlur = (e) => {
        this.initOrgConOption(e.target.value);
    }

    render() {
        console.log("----------show name----------",this.state.type);
        return (
            <div className="gutter-example">
                        <Modal
                        width={'500px'}
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
                        <Col span={1} />
                        <Col span={21}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 机构合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 240 }} value={this.state.orgConSn} onChange={this.handleOrgConSn} onBlur={this.inputBlur} placeholder="请输入合同编号" />
                                    <span style={{display:this.state.checkConSn1?'':'none'}}><Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                    <span style={{display:this.state.checkConSn2?'':'none'}}><Icon type="close-circle" theme="twoTone" twoToneColor="#52c41a" /></span>
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>模板编号： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 240 }} onChange={this.handleTempId} value={this.state.tempId} >
                                        {this.state.tempList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>模板类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.tempType} style={{ width: 240 }} disabled >
                                        {selectUtils('confileType')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={2} />
                    </Row>

                    </Modal>
            </div>
        );
    }
}

export default AddOrEditSignConConf;