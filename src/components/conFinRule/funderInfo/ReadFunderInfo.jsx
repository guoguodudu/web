import React from 'react';
import { Modal,Button,Input,Row,Col } from 'antd';

class ReadFunderInfo extends React.Component {
    
    state = {
        
    };
    

    componentWillMount() {
        console.log("----------ReadFunderInfo.componentWillMount---------------");
        // eslint-disable-next-line
        this.setState({

            loading3: false,
            visible3: this.props.visiable,
        });
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------ReadFunderInfo.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
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
                type:'查看资金方',
            });      
        }
    }

    handleCancel3 = () => {
        this.setState({ 
            visible3: false,
		});
		this.props.parent.setState({readVisiable:false});
    };


    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'800px'}
                        visible={this.props.visiable}

                        title={this.state.type}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                        ]}
                        >
                    <Row>
                        <Col span={10}>
                        <br />
                            <Row>
                                <Col span={8} style={{color:'red'}}>* 资金方代码： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.funderCode} disabled={this.state.funderCode} />
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>资金方全称： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.funderName} onChange={this.handleVendorName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>资金方简称： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.funderShortName} onChange={this.handleScoreMax} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>注册地址： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.regisAddress} onChange={this.handleScoreMin} />
                                </Col>
                            </Row>

                        </Col>
                        <Col span={2} />
                        <Col span={10}>
                            <br />
                            <Row>
                                <Col span={8}>联系人： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.contact} onChange={this.handleLevel} />
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>规则描述： </Col><Col span={16}><Input.TextArea style={{width:'200px'}} onChange={this.handleDescription} value={this.state.remarks} rows="6" /></Col></Row>

                        </Col>
                        <Col span={2} />
                    </Row>

                    </Modal>
            </div>
        );
    }
}
export default ReadFunderInfo;