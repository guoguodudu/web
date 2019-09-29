import React from 'react';
import { Modal,Button,Input,Row,Col,Select } from 'antd';

class ReadRepayAntLog extends React.Component {

    state = {
        visible: false,
    };

    componentWillMount() {
        
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值        

        if(nextProps.visiable){
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
        }
    }

    handleCancel = () => {
		this.setState({ visiable: false });
		this.props.parent.setState({readRepayAccountLogVisiable:false})
    };

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visiable}
                        title="融资业务回款账户"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
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
export default ReadRepayAntLog;