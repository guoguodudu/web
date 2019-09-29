import React from 'react';
import { legalInfo } from "@/api";
import { Modal,Button,Input,Row,Col } from 'antd';
import {checkNull,successInfo,errorInfo,checkIsNull} from '../../../Common.jsx';

class EditLegal extends React.Component {

    state = {
        visiable: false,
    };

    componentWillMount() {
        console.log("------EditLegal------componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------EditLegal.componentWillReceiveProps----***-----------",nextProps);

        if(nextProps.visiable){
            console.log("nextProps.record"+nextProps.record)
            this.setState({
                parent:nextProps.parent,
                visiable:nextProps.visiable,
                legalCompName: nextProps.record.legalCompName,
                legalCompSname: nextProps.record.legalCompSname,
                legalCode: nextProps.record.legalCode,
                accName: nextProps.record.accName,
                accBank: nextProps.record.accBank,
                accNo: nextProps.record.accNo,
                id: nextProps.record.id
            });
        }
    }

    handleOk = async() => {
        console.log("------EditLegal----submit---提交数据到后台---state--------------",this.state);
        if(checkNull(this.state.legalCompName,'主体法人单位名称')){
            return;
        }
        if(checkNull(this.state.legalCompSname,'主体法人单位简称')){
            return;
        }
        if(checkNull(this.state.legalCode,'主体法人代码')){
            return;
        }
        if(checkNull(this.state.accName,'主体账户-户名')){
            return;
        }
        if(checkNull(this.state.accBank,'主体账户-开户行')){
            return;
        }
        if(checkNull(this.state.accNo,'主体账户-账号')){
            return;
        }

        let data = {
			"legalCompName": this.state.legalCompName,
            "legalCompSname": this.state.legalCompSname,
            "legalCode": this.state.legalCode,
            "accName": this.state.accName,
            "accBank": this.state.accBank,
            "accNo": this.state.accNo,
            "modifyId":this.state.modifyId,
            "id": this.state.id
        };
        
        let result = await legalInfo.update(data)
            .catch(function (error) {//防止报错
            console.log(error)
        });
        console.log("result *** ", result);
        if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.result === 1){
            successInfo("修改成功");
            this.setState({ loading: false, visiable: false });
            this.state.parent.setState({editLegalVisiable:false})
            this.state.parent.state.parent.handleFilterSubmit();
            // TODO 要把当前页面查询条件清空
        }else{
            errorInfo("修改失败，请联系系统管理员")
        }
    }

    handleCancel = () => {
		this.setState({ visiable: false });
		this.props.parent.setState({editLegalVisiable:false})
    };

    handleLegalCompName = (e) => {
        this.setState({legalCompName: e.target.value});
    }

    handleLegalCompSname = (e) => {
        this.setState({legalCompSname: e.target.value});
    }

    handleLegalCode = (e) => {
        this.setState({legalCode: e.target.value});
    }

    handleAccName = (e) => {
        this.setState({accName: e.target.value});
    }

    handleAccBank = (e) => {
        this.setState({accBank: e.target.value});
    }

    handleAccNo = (e) => {
        this.setState({accNo: e.target.value});
    }

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visiable}
                        title="编辑核心企业主体信息"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                                提交
                            </Button>,
                        ]}
                        >
                    <Row>
                        <Col span={12}>
                        <br />
                            <Row>
                                <Col span={10}>主体法人单位名称： </Col>
                                <Col span={14}>
                                    <Input id="legalCompName" style={{width:'160px'}} value={this.state.legalCompName} onChange={this.handleLegalCompName} />                                   
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>主体法人单位简称： </Col>
                                <Col span={14}>
                                    <Input id="legalCompSname" style={{width:'160px'}} value={this.state.legalCompSname} onChange={this.handleLegalCompSname} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10} >主体法人代码： </Col>
                                <Col span={14}>
                                    <Input id="legalCode" style={{width:'160px'}} value={this.state.legalCode} onChange={this.handleLegalCode} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>主体账户-户名： </Col>
                                <Col span={14}>
                                    <Input id="accName" style={{width:'160px'}} value={this.state.accName} onChange={this.handleAccName} />
                                </Col>
                            </Row>

                            <br />

                        </Col>
                        <Col span={12}>
                            <br />
                            <Row>
                                <Col span={8}>主体账户-开户行： </Col>
                                <Col span={16}>
                                    <Input id="accBank" style={{width:'160px'}} value={this.state.accBank} onChange={this.handleAccBank} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>主体账户-账号： </Col>
                                <Col span={16}>
                                    <Input id="accNo" style={{width:'160px'}} value={this.state.accNo} onChange={this.handleAccNo} />
                                </Col>
                            </Row>
                            <br />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }

}
export default EditLegal;