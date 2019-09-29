import React from 'react';
import { repayAccountLog } from "@/api";
import { Modal,Button,Input,Row,Col,Select } from 'antd';
import {checkNull,successInfo, initSupCode,errorInfo,checkIsNull} from '../../../Common.jsx';

class EditRepayAntLog extends React.Component {

    state = {
        visiable: false,
    };

    componentWillMount() {
        console.log("------EditRepayAntLog------componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------EditRepayAntLog.componentWillReceiveProps----***-----------",nextProps);

        if(nextProps.visiable){
            console.log("nextProps.record"+nextProps.record)
            this.setState({
                parent:nextProps.parent,
                visiable:nextProps.visiable,
                supCode: nextProps.record.supCode,
                repayAccName: nextProps.record.repayAccName,
                repayAccBank: nextProps.record.repayAccBank,
                repayAccNo: nextProps.record.repayAccNo,
                remarks: nextProps.record.remarks,
                id: nextProps.record.id
            });
            let supInfo = initSupCode();
            this.setState({
                subCodeList: supInfo,
            });
        }
    }

    handleOk = async() => {
        console.log("------EditRepayAntLog----submit---提交数据到后台---state--------------",this.state);
        if(checkNull(this.state.supCode,'供应商简称')){
            return;
        }
        if(checkNull(this.state.repayAccName,'回款款账户-户名')){
            return;
        }
        if(checkNull(this.state.repayAccBank,'回款账户-开户行')){
            return;
        }
        if(checkNull(this.state.repayAccNo,'回款账户-账号')){
            return;
        }
        if(checkNull(this.state.remarks,'修改原因')){
            return;
        }

        let data = {
            "supCode": this.state.supCode,
            "repayAccName": this.state.repayAccName,
            "repayAccBank": this.state.repayAccBank,
            "repayAccNo": this.state.repayAccNo,
            "remarks": this.state.remarks,
            "id": this.state.id

        };

        let result = await repayAccountLog.update(data)
            .catch(function (error) {//防止报错
            console.log(error)
        });

        if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.result === 1){
            successInfo("新增成功");
            this.setState({ loading: false, visiable: false });
            this.state.parent.setState({editRepayAccountLogVisiable:false})
            this.state.parent.state.parent.handleFilterSubmit();
            // TODO 要把当前页面查询条件清空
        }else{
            errorInfo("新增失败，请联系系统管理员")
        }
    }

    handleCancel = () => {
		this.setState({ visiable: false });
		this.props.parent.setState({editRepayAccountLogVisiable:false})
    };

    handleSubCode = (value) => {
        this.setState({supCode: value});
    }

    handleRepayAccName = (e) => {
        this.setState({repayAccName: e.target.value});
    }

    handleRepayAccBank = (e) => {
        this.setState({repayAccBank: e.target.value});
    }

    handleRepayAccNo = (e) => {
        this.setState({repayAccNo: e.target.value});
    }

    handleRemarks = (e) => {
        this.setState({remarks: e.target.value});
    }

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visiable}
                        title="编辑融资业务回款账户"
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
                                <Col span={8}>供应商简称： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 160 }} onChange={this.handleSubCode} value={this.state.supCode} >
                                        {this.state.subCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8} >回款款账户-户名： </Col>
                                <Col span={16}>
                                    <Input id="repayAccName" style={{width:'160px'}} value={this.state.repayAccName} onChange={this.handleRepayAccName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>回款账户-开户行： </Col>
                                <Col span={16}>
                                    <Input id="repayAccBank" style={{width:'160px'}} value={this.state.repayAccBank} onChange={this.handleRepayAccBank} />
                                </Col>
                            </Row>

                            <br />

                        </Col>
                        <Col span={12}>
                            <br />
                            <Row>
                                <Col span={8}>回款账户-账号： </Col>
                                <Col span={16}>
                                    <Input id="repayAccNo" style={{width:'160px'}} value={this.state.repayAccNo} onChange={this.handleRepayAccNo} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>修改原因： </Col>
                                <Col span={16}>
                                    <Input.TextArea style={{width:'160px'}} onChange={this.handleRemarks} value={this.state.remarks} rows="4" />
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
export default EditRepayAntLog;