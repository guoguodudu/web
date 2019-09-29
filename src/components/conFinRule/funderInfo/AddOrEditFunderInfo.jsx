import React from 'react';
import { Modal,Button,Input,Row,Col } from 'antd';
import {sysErrorInfo,successInfo } from '../../../Common.jsx';
import {funderInfo} from "../../../api";
import {checkNull, checkNumNull, checkPhone, validateEmail, warningInfo} from "../../../Common";

class AddOrEditFunderInfo extends React.Component {

    state = {

    };


    componentWillMount() {
        console.log("----------AddOrEditRateConfRule.componentWillMount---------------");
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
        })
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
                    id:undefined,
                    funderCode:undefined,
                    funderName:undefined,
                    funderShortName:undefined,
                    regisAddress:undefined,
                    contact:undefined,
                    contactMobile:undefined,
                    contactEmail:undefined,
                    contactAddress:undefined,
                    url:'add',
                });

            } else if(nextProps.parent.state.type ==='edit'){

                console.log("nextProps.record"+nextProps.record)
                this.setState({
                    id:nextProps.record.id,
                    funderCode:nextProps.record.funderCode,
                    funderName:nextProps.record.funderName,
                    funderShortName:nextProps.record.funderShortName,
                    regisAddress:nextProps.record.regisAddress,
                    contact:nextProps.record.contact,
                    contactMobile:nextProps.record.contactMobile,
                    contactEmail:nextProps.record.contactEmail,
                    contactAddress:nextProps.record.contactAddress,
                    url:'update',
                    vendorCodeDisa:true,
                    type:'编辑资金方',
                });

            } else if(nextProps.parent.state.type === 'copy'){

                this.setState({
                    id:undefined,
                    funderCode:nextProps.record.funderCode,
                    funderName:nextProps.record.funderName,
                    funderShortName:nextProps.record.funderShortName,
                    regisAddress:nextProps.record.regisAddress,
                    contact:nextProps.record.contact,
                    contactMobile:nextProps.record.contactMobile,
                    contactEmail:nextProps.record.contactEmail,
                    contactAddress:nextProps.record.contactAddress,
                    url:'add',
                    type:'复制资金方',
                });

            }
        }
    }

    handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);

        var jsonStr = { "id":this.state.id,
        "funderCode":this.state.funderCode,
        "funderName":this.state.funderName,
        "funderShortName":this.state.funderShortName,
        "regisAddress":this.state.regisAddress,
        "contact":this.state.contact,
        "contactMobile": this.state.contactMobile,
        "contactEmail":this.state.contactEmail,
        "contactAddress":this.state.contactAddress,

    };
    var thi = this;
        if(checkNull(this.state.funderCode,"资金方代码")){
            return;
        }
        if(checkNull(this.state.funderName,"资金方全称")){
            return;
        }
        if(checkNull(this.state.funderShortName,"资金方简称")){
            return;
        }
        if(checkNull(this.state.regisAddress,"注册地址")){
            return;
        }
        if(checkNull(this.state.contact,"联系人")){
            return;
        }
        if(checkNull(this.state.contactMobile,"联系电话")){
            return;
        }
        if(!checkPhone(this.state.contactMobile)){
            warningInfo("手机格式不正确");
            return;
        }

        if(checkNull(this.state.contactEmail,"联系邮箱")){
            return;
        }

        if(!validateEmail(this.state.contactEmail)){
            warningInfo("邮箱格式不正确");
            return;
        }
        if(checkNull(this.state.contactAddress,"联系地址")){
            return;
        }


    console.log("json",jsonStr);
    if(this.state.url === "add")
    {
        funderInfo.add(jsonStr).then(
        function (response) {
            console.log('200--',response)
            if(response.data.result === 1){
                successInfo(response.data.retMsg);
				thi.setState({ visible3: false, loading3: false });
				thi.props.parent.setState({addOrEditVisiable:false})
                thi.state.parent.state.parent.handleFilterSubmit();
            }
       }).catch(function (error) {
        sysErrorInfo(error);
       });
    }else {
        if(checkNumNull(this.state.id,"id不能为空")){
            return;
        }
        funderInfo.update(jsonStr).then(

            function (response) {
                console.log('200--',response)
                if(response.data.result === 1){
                    successInfo(response.data.retMsg);
                    thi.setState({ visible3: false, loading3: false });
                    thi.props.parent.setState({addOrEditVisiable:false})
                    thi.state.parent.state.parent.handleFilterSubmit();
                }
            }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    };


    handleCancel3 = () => {
        this.setState({
            visible3: false,
		});
		this.props.parent.setState({addOrEditVisiable:false})
    };

    handlefunderCode = (e) => {
        this.setState({ funderCode: e.target.value});
    }

    handlefunderName = (e) => {
        this.setState({ funderName: e.target.value});
    }

    handlefunderShortName = (e) => {
        this.setState({ funderShortName: e.target.value});
    }

    handleregisAddress = (e) => {
        this.setState({ regisAddress: e.target.value});
    }

    handlecontact = (e) => {
        this.setState({ contact: e.target.value});
    }

    handlecontactMobile = (e) => {
        this.setState({ contactMobile: e.target.value});
    }
    handlecontactEmail = (e) => {
        this.setState({ contactEmail: e.target.value});
    }
    handlecontactAddress = (e) => {
        this.setState({ contactAddress: e.target.value});
    }



    render() {
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
                                <Col span={8} >资金方代码： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.funderCode} onChange={this.handlefunderCode} disabled={this.state.url==="update"} />
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>资金方全称： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.funderName} onChange={this.handlefunderName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>资金方简称： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.funderShortName} onChange={this.handlefunderShortName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>注册地址： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.regisAddress} onChange={this.handleregisAddress} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>联系人： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.contact} onChange={this.handlecontact} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={2} />
                        <Col span={10}>

                            <br />
                            <Row>
                                <Col span={8}>联系电话： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.contactMobile} onChange={this.handlecontactMobile} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>联系邮箱： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.contactEmail} onChange={this.handlecontactEmail} />
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>联系地址： </Col><Col span={16}><Input.TextArea style={{width:'200px'}} onChange={this.handlecontactAddress} value={this.state.contactAddress} rows="6" /></Col></Row>

                        </Col>
                        <br />

                        <Col span={2} />
                    </Row>

                    </Modal>
            </div>
        );
    }
}

export default AddOrEditFunderInfo;