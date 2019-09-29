import React from 'react';
import { Modal,Button,Input,Row,Col,Select } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';

class ReadSignConConf extends React.Component {
    
    state = {
        
    };
    

    componentWillMount() {
        console.log("----------ReadSignConConf.componentWillMount---------------");
        // eslint-disable-next-line
        this.setState({

            loading3: false,
            visible3: this.props.visiable,
        });
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------ReadSignConConf.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
          
            this.setState({
                parent:nextProps.parent,
                visible3:nextProps.visiable,
                orgConSn:nextProps.record.orgConSn,
                tempId:nextProps.record.tempId+"-"+nextProps.record.tempName,
                tempType:nextProps.record.tempType,
                type:'编辑配置',
            });      
        }
    }

    handleCancel3 = () => {
        this.setState({ 
            visible3: false,
		});
		this.props.hideAllModal();
    };


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
                        <Col span={2} />
                        <Col span={20}>
                        <br />
                            <Row> 
                                <Col span={8} style={{color:'red'}}>* 机构合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 250 }} value={this.state.orgConSn} />
                                </Col>
                            </Row>
                        <br />
                            <Row> 
                                <Col span={8}>模板编号： </Col>
                                <Col span={16}>
                                    <Select style={{ width: 250 }} value={this.state.tempId} >
                                        {this.state.tempList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>模板类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.tempType} style={{ width: 250 }} >
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

export default ReadSignConConf;