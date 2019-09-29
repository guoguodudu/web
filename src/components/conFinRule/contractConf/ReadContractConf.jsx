import React from 'react';
import { Modal,Button,Input,Row,Col,DatePicker,Select,InputNumber } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';

import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

class ReadContractConf extends React.Component {
    
    state = {
        
    };
    

    componentWillMount() {
        console.log("----------ReadContractConf.componentWillMount---------------");
        // eslint-disable-next-line
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
        });
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("----------ReadContractConf.componentWillReceiveProps---------------",nextProps);

        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
                supCode:nextProps.record.supCode,
                    funderCode:nextProps.record.funderCode,
                    conType:nextProps.record.conType,
                    mainConCode:nextProps.record.mainConCode,
                    funderConCode:nextProps.record.funderConCode,
                    creditPlace:nextProps.record.creditPlace,
                    creditAmount:nextProps.record.creditAmount,
                    creditPeriodType:nextProps.record.creditPeriodType,
                    creditStartDate:nextProps.record.creditStartDate,
                    creditEndDate:nextProps.record.creditEndDate,
                    creditTriger:nextProps.record.creditTriger,
                    creditEffDate:nextProps.record.creditEffDate,
                    creditExpDate:nextProps.record.creditExpDate,
                    creditPeriod:nextProps.record.creditPeriod,
                    isCycle:nextProps.record.isCycle,
                    intRate:nextProps.record.intRate,
                    intRatio:nextProps.record.intRatio,
                    intScale:nextProps.record.intScale,
                    intRoundRule:''+nextProps.record.intRoundRule,
                    repayType:nextProps.record.repayType,
                    dayCountBasis:nextProps.record.dayCountBasis,
                    feeName:nextProps.record.feeName,
                    feeRate:nextProps.record.feeRate,
                    feeType:nextProps.record.feeType,
                    type:'查看合同配置',
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
        return (
            <div className="gutter-example">
                        <Modal
                        width={'1200px'}
                        visible={this.state.visible3}
                        title={this.state.type}
                        onOk={this.handleOk3}
                        onCancel={this.handleCancel3}
                        footer={[
                            <Button key="back" size="large" onClick={this.handleCancel3}>取消</Button>,
                        
                        ]}
                        >
                    <Row>
                        <Col span={7}>
                        <br />
                            <Row>
                                <Col span={8}>供应商： </Col>
                                <Col span={16}>
                                    <Select value={this.state.supCode} style={{ width: 200 }} >
                                        {this.state.supCodeList}
                                    </Select>
                                </Col>
                            </Row>
                        <br />
                            <Row>
                                <Col span={8}>资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCode} style={{ width: 200 }} >
                                        {this.state.funderCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.conType} style={{ width: 200 }} >
                                        {selectUtils('conType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>业务合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{width:'200px'}} value={this.state.mainConCode} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>资金合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{width:'200px'}} value={this.state.funderConCode} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信地： </Col>
                                <Col span={16}>
                                    <Select value={this.state.creditPlace} style={{ width: 200 }} >
                                        {selectUtils('creditPlace')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信金额： </Col>
                                <Col span={16}>
                                    <InputNumber style={{width:'200px'}} value={this.state.creditAmount} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>循环： </Col>
                                <Col span={16}>
                                    <Select value={this.state.isCycle} style={{ width: 200 }} onChange={this.handleIsCycle} >
                                        {selectUtils('ActiveStatus')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={7}>
                            <br />
                            <Row>
                                <Col span={8}>授信期间类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.creditPeriodType} style={{ width: 200 }} >
                                        {selectUtils('creditPeriodType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信起日： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} value={this.state.creditStartDate == null ? undefined : moment(this.state.creditStartDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信止日： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} value={this.state.creditEndDate == null ? undefined : moment(this.state.creditEndDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信期间触发条件： </Col>
                                <Col span={16}>
                                    <Select value={this.state.creditTriger} style={{ width: 200 }} >
                                        {selectUtils('creditTriger')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信生效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} value={this.state.creditEffDate == null ? undefined : moment(this.state.creditEffDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信失效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} value={this.state.creditExpDate == null ? undefined : moment(this.state.creditExpDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信期限： </Col>
                                <Col span={16}>
                                    <InputNumber style={{width:'200px'}} value={this.state.creditPeriod} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>融资比率： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={1} style={{width:'200px'}} value={this.state.intRatio} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={7}>
                            <br />
                            <Row>
                                <Col span={8}>利率： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={1} style={{width:'200px'}} value={this.state.intRate} />
                                </Col>
                            </Row>
                            
                            <br />
                            <Row>
                                <Col span={8}>小数点位数： </Col>
                                <Col span={16}>
                                    <Select value={this.state.intScale} style={{ width: 200 }} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.intRoundRule} style={{ width: 200 }} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>还款方式： </Col>
                                <Col span={16}>
                                    <Select value={this.state.repayType} style={{ width: 200 }} >
                                        {selectUtils('repayType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息基础： </Col>
                                <Col span={16}>
                                    <Select value={this.state.dayCountBasis} style={{ width: 200 }} >
                                        {selectUtils('dayOfYear')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>费用名： </Col>
                                <Col span={16}>
                                    <Input style={{width:'200px'}} value={this.state.feeName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>费率： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={1} style={{width:'200px'}} value={this.state.feeRate} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收费方式： </Col>
                                <Col span={16}>
                                    <Select value={this.state.feeType} style={{ width: 200 }} >
                                        {selectUtils('feeType')}
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </Modal>
            </div>
        );
    }
}
export default ReadContractConf;