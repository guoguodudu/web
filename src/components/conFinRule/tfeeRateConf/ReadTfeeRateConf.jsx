import React from 'react';
import { Modal,Button,Input,Row,Col,DatePicker,Select } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';

import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ReadTfeeRateConf extends React.Component {
    
    state = {
        
    };
    

    componentWillMount() {
        console.log("----------ReadTfeeRateConf.componentWillMount---------------");
        // eslint-disable-next-line
        this.setState({

            loading3: false,
            visible3: this.props.visiable,
            groupMap: new Map(),
        });
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------ReadTfeeRateConf.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
            });
            var groupMap= new Map();
                           
            
            groupMap.set("insTotTerm",nextProps.record.insTotTerm);
            groupMap.set("tfeeCalRule",nextProps.record.tfeeCalRule);
            groupMap.set("tfeeCalValue",nextProps.record.tfeeCalValue);
            groupMap.set("tfeeScale",''+nextProps.record.tfeeScale);
            groupMap.set("tfeeRoundRule",''+nextProps.record.tfeeRoundRule);
            groupMap.set("tfeeReturnFlag",nextProps.record.tfeeReturnFlag);
            
            this.setState({
                
                id:nextProps.record.id,
                groupMap:groupMap,
                orgConSn:nextProps.record.orgConSn,
                orgConType:nextProps.record.orgConType,
                funderCode:nextProps.record.funderCode,
                busiGroupCode:nextProps.record.busiGroupCode,
                busiCompCode:nextProps.record.busiCompCode,
                busiSiteCode:nextProps.record.busiSiteCode,
                remarks:nextProps.record.remarks,
                effectiveDatetime:nextProps.record.effectiveDatetime,
                effectiveDatetimeStr:nextProps.record.effectiveDatetime,
                expireDatetime:nextProps.record.expireDatetime,
                expireDatetimeStr:nextProps.record.expireDatetime,
                status:nextProps.record.status,
                createId:nextProps.record.createId,
                type:'查看富金服费率规则',
                checkConSn1: false,
                checkConSn2: false
            });      
        }
    }

    handleCancel3 = () => {
        this.setState({ 
            visible3: false,
            groupMap:new Map(),
		});
		this.props.hideAllModal();
    };


    render() {
        return (
            <div className="gutter-example">
                        <Modal
                        width={'900px'}
                        visible={this.state.visible3}
                        title={this.state.type}
                        onOk={this.handleOk3}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                            
                        ]}
                        >
                    <Row>
                        <Col span={10}>
                        <br />
                            <Row> 
                                <Col span={8}>机构合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{ width: 200 }} value={this.state.orgConSn} />
                                </Col>
                            </Row>
                        <br />
                            <Row> 
                                <Col span={8}>机构合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.orgConType} style={{ width: 200 }} >
                                        {selectUtils('orgConType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCode} style={{ width: 200 }} >
                                    {//</Select></Select></Select>this.state.funderCodeList
                                    }
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>商户集团： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiGroupCode} style={{ width: 200 }} >
                                        {/* {this.state.busiGroupCodeList} */}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>商户公司： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiCompCode} style={{ width: 200 }} >
                                        {/* {this.state.busiCompCodeList} */}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>商户网点： </Col>
                                <Col span={16}>
                                    <Select value={this.state.busiSiteCode} style={{ width: 200 }} >
                                        {/* {this.state.busiSiteCodeList} */}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>生效日期： </Col><Col span={16}><DatePicker style={{width:'150px'}} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row>
                            <br />
                            <Row> <Col span={8}>失效日期： </Col><Col span={16}><DatePicker style={{width:'150px'}} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row>
                            
                            
                        </Col>
                        <Col span={2} />
                        <Col span={10}>   
                        <br />
                            <Row> 
                                <Col span={8}>分期总期数： </Col>
                                <Col span={16}><Input id="insTotTerm" style={{width:'200px'}} value={this.state.groupMap.get('insTotTerm')} /></Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>计算规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.groupMap.get('tfeeCalRule')} style={{ width: 200 }} >
                                        {selectUtils('calRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>费率数值： </Col>
                                <Col span={16}><Input id="tfeeCalValue" style={{width:'200px'}} value={this.state.groupMap.get('tfeeCalValue')} /></Col>
                            </Row>
							<div style={{ display : this.state.groupMap.get('tfeeCalRule') === '固定费用' ? 'none' : '' }} >
                            <br />
                            <Row> 
                                <Col span={8}>小数位： </Col>
                                <Col span={16}>
                                    <Select value={this.state.groupMap.get('tfeeScale')} style={{ width: 200 }} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> 
                                <Col span={8}>进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.groupMap.get('tfeeRoundRule')} style={{ width: 200 }} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
							</div>
                            <br />
                            <Row> 
                                <Col span={8}>退费标识： </Col>
                                <Col span={16}>
                                    <Select value={this.state.groupMap.get('tfeeReturnFlag')} style={{ width: 200 }} >
                                        {selectUtils('returnFlag')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row> <Col span={8}>规则描述： </Col><Col span={16}><Input.TextArea style={{width:'200px'}} value={this.state.remarks} rows="4" /></Col></Row>
                            
                        </Col>
                
                        
                    </Row>
        
                    </Modal>
            </div>
        );
    }
}

export default ReadTfeeRateConf;