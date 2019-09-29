import React from 'react';
import { Modal,Button,Input,Row,Col } from 'antd';

class ReadSignParm extends React.Component {

    state = {
        visible: false,
    };


    componentWillMount() {
        console.log("------EditSignParm---18---componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------EditSignParm---22--nextProps--componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){ 
            
            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,
                tempId: nextProps.record.tempId,
                parmKey: nextProps.record.parmKey,
                parmValue: nextProps.record.parmValue,
                parmRemarks: nextProps.record.parmRemarks,

                id: nextProps.record.id
            });
            
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
		this.props.hideAllModal()
	};
    
    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'500px'}
                        visible={this.state.visible}
                        title="编辑签章模板参数值"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        ]}
                        >
                    <Row>
                        <Col span={24}>
                        <br />
                            <Row> 
                                <Col span={8} style={{color:'red'}}>* 模板ID： </Col>
                                <Col span={16}>
                                    <Input id="tempId" style={{width:'180px'}} size="default" value={this.state.tempId} disabled /> 
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8} style={{color:'red'}}>* 参数KEY： </Col>
                                <Col span={16}>
                                    <Input id="parmKey" style={{width:'180px'}} value={this.state.parmKey} disabled /> 
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8} style={{color:'red'}}>参数值字段： </Col>
                                <Col span={16}>
                                    <Input id="parmValue" style={{width:'180px'}} size="default" value={this.state.parmValue} disabled />
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8} style={{color:'red'}}>* 参数值字段说明： </Col>
                                <Col span={16}>
                                    <Input id="parmRemarks" style={{width:'180px'}} size="default" value={this.state.parmRemarks} disabled />
                                </Col>
                            </Row>
                        </Col>             
                    </Row>
        
                    </Modal>
            </div>
        );
    }
}

export default ReadSignParm;