import React from 'react';
import { Modal,Button,Input,Row,Col,Select } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {sysErrorInfo,ContentErrorInfo,successInfo,checkNull } from '../../../Common.jsx';

import axios from 'axios';
import {errorInfo} from "../../../Common";

class CertifyOrgSign extends React.Component {

    state = {

    };


    componentWillMount() {
        console.log("----------CertifyOrgSign.componentWillMount---------------");
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
        })
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------CertifyOrgSign.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
                orgType:undefined,
                orgGroupCode:undefined,
                email:undefined,
                phone:undefined,
                signChannel:undefined,
                corpId:undefined,
                status:"ACTIVE",
            });
        }
    }
    handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);

        if(checkNull(this.state.orgType,'机构类型')){
            return;
        }
        if(checkNull(this.state.orgCode,'机构名称')){
            return;
        }
        if(checkNull(this.state.signChannel,'签章渠道')){
            return;
        }
        var thi = this;

        var jsonStr = {
            "orgType":this.state.orgType,
            "email": this.state.email,
            "orgGroupCode": this.state.orgCode,
            "signChannel": this.state.orgCode,
            "mobile": this.state.phone,
            "id_card": this.state.corpId
        };
        console.log("json",jsonStr);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+"/orgsign/add",
            jsonStr).then(
            function (response) {
                console.log('200--',response)

                if(response.data.result === 1){
                    successInfo(response.data.retMsg);
                    thi.props.parent.setState({addOrEditVisiable:false})
                    thi.state.parent.state.parent.handleFilterSubmit();
                } else{
                    errorInfo(response.data.retMsg);
                }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    };

    addOrgSign(signId){
        var thi = this;
        var jsonStr = {
            "orgType":this.state.orgType,
            "orgGroupCode":this.state.orgGroupCode,
            "signChannel":this.state.signChannel,
            "signId":signId,
            "status":"ACTIVE",
            "createId": this.state.createId,
        };
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+"/orgsignapi/addOrgSign",
        jsonStr).then(
        function (response) {
            console.log('200--',response)
            if(response.data.STATUS === "200"){
                successInfo("操作成功");
				thi.setState({ visible3: false, loading3: false });
				thi.props.hideAllModal();				
                thi.state.parent.state.parent.handleFilterSubmit();
            } else if(response.data.STATUS === "201"){
                ContentErrorInfo(response.data.CONTENT);
                console.log("response.data.CONTENT",response.data.CONTENT);
            } else {
                sysErrorInfo();
                console.log("response.data.CONTENT",response.data.CONTENT);
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleCancel3 = () => {
        this.setState({
            visible3: false,
		});
		this.props.hideAllModal();		
    };

    handleOrgType = (value) => {
        this.setState({ orgType: value});
        this.initOrgGroupCodeOption(value);
    }
	
    handleOrgGroup = (value) => {
        console.log("value",value);
        for(var i = 0; i< this.state.oList.length; i++){
            if(this.state.oList[i].orgCode === value){
                this.setState({
                    orgCode: value,
                    orgGroupSname: this.state.oList[i].orgName,
                    email: this.state.oList[i].email,
                    phone: this.state.oList[i].mobile
                });
            }
        }
    }

    initOrgGroupCodeOption(value) {
        var thi = this;
        var groupCodeList = [];
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/funder/queryOrgProfileList',
        {
            "orgType": value
        }).then(function (response) {
            if(response.data.result === 1) {

                if (!!response.data.retObj) {
                    for (var i = 0; i < response.data.retObj.length; i++) {
                        if (response.data.retObj[i] !== null) {
                            groupCodeList.push(<Select.Option
                                key={response.data.retObj[i].orgCode}>{response.data.retObj[i].orgName}</Select.Option>);
                        }
                    }
                }
            }
            thi.setState({
                orgGroupCode: undefined,
                groupCodeList: groupCodeList,
                oList:response.data.retObj,
            });
        }).catch(function (error) {
            sysErrorInfo(error);
        });

    }

    handleSignChannel = (value) => {
        this.setState({ signChannel: value});
    }
    handleCorpId = (e) => {
        this.setState({ corpId: e.target.value});
    }

    render() {
        console.log("----------show name----------",this.state.type);
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
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
                        <Col span={10}>
                        <br />
                            <Row>
                                <Col span={8} >机构类型： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 150 }} onChange={this.handleOrgType} value={this.state.orgType} >
                                        {selectUtils('serviceOrgType')}
                                    </Select>
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>机构名称： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 150 }} onChange={this.handleOrgGroup} value={this.state.orgCode} >
                                        {this.state.groupCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>签章渠道： </Col>
                                <Col span={16}>
                                    <Select value={this.state.signChannel} style={{ width: 150 }} onChange={this.handleSignChannel} >
                                        {selectUtils('signChannel')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={2} />
                        <Col span={10}>
                        <br />
                            <Row>
                                <Col span={8} >电子邮箱： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 150 }} value={this.state.email} disabled />
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>手机号： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 150 }} value={this.state.phone} disabled />
                                </Col>
                            </Row>
                            <br />
                        </Col>
                        <Col span={2} />
                    </Row>

                    </Modal>
            </div>
        );
    }
}

export default CertifyOrgSign;