import React from 'react';
import { Modal,Button,Input,Row,Col } from 'antd';

class ReadLegal extends React.Component {

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
                legalCompName: nextProps.record.legalCompName,
                legalCompSname: nextProps.record.legalCompSname,
                legalCode: nextProps.record.legalCode,
                accName: nextProps.record.accName,
                accBank: nextProps.record.accBank,
                accNo: nextProps.record.accNo,
            });           
        }
    }

    handleCancel = () => {
		this.setState({ visiable: false });
		this.props.parent.setState({readLegalVisiable:false})
    };

    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.state.visiable}
                        title="核心企业主体信息"
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
export default ReadLegal;