import React from 'react';
import { Modal, Button, Collapse, Row, Col, Input, DatePicker} from 'antd';
import { _jsonToMap} from "../../../Common";
import moment from 'moment';
import {PRE_FILE} from "../../../api/path";

const { Panel } = Collapse;
const dateFormat = 'YYYY-MM-DD';

class ReadSup extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
        stateMap: new Map(),
    };

    componentWillMount() {
        console.log("------ReadSup----componentWillMount---------------");
    }

    componentDidMount() {
        console.log("------ReadSup----componentDidMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------ReadSup----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.setState({
                visible: nextProps.visiable,
                parent: nextProps.parent,
                stateMap: _jsonToMap(nextProps.record),
            });
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.parent.setState({ReadSupVisible:false})
    };

    preview = (fileInfo) => {
        console.log('fileInfo',fileInfo);
        let rstInfo = JSON.parse(fileInfo);
        let fileType = (rstInfo.name.substring(rstInfo.name.lastIndexOf(".")+1));
        window.open(PRE_FILE + fileType + "/"+ rstInfo.fid);
    }

    render() {
        return (
            <div className="gutter-example">
                <Modal
                    destroyOnClose
                    width="1300px"
                    visible={this.state.visible}
                    title="查看供应商信息"
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                    ]}
                >

                    <Collapse className="blod-pannel-header" bordered={false} defaultActiveKey={['1']}>
                        <Panel header="企业基础信息" key="1">
                            <Row>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>供应商全称： </Col>
                                        <Col span={14}>
                                            <Input id="supName"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('supName')}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>供应商简称： </Col>
                                        <Col span={14}>
                                            <Input id="supShortName"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('supShortName')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>供应商代码： </Col>
                                        <Col span={14}>
                                            <Input id="supCode"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('supCode')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    {/*                                    <br />
                                    <Row>
                                        <Col span={10}>供应商状态： </Col>
                                        <Col span={14}>
                                            <Input id="supStatus"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('supStatus')}
                                                   
                                            />
                                        </Col>
                                    </Row>*/}
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人： </Col>
                                        <Col span={14}>
                                            <Input id="legalRepresent"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('legalRepresent')}

                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>实际控制人： </Col>
                                        <Col span={14}>
                                            <Input id="actlController"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('actlController')}

                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>统一社会信用代码： </Col>
                                        <Col span={14}>
                                            <Input id="unitCreditCode"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('unitCreditCode')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>成立日期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        value={this.state.stateMap.get('estabDate') == null ?
                                                            undefined
                                                            :
                                                            moment(this.state.stateMap.get('estabDate'), dateFormat)}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>注册资本： </Col>
                                        <Col span={14}>
                                            <Input id="regisCapital"
                                                   prefix="￥"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('regisCapital')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>注册地址： </Col>
                                        <Col span={14}>
                                            <Input id="regisAddress"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('regisAddress')}

                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>联系人姓名： </Col>
                                        <Col span={14}>
                                            <Input id="contact"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('contact')}

                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>联系电话： </Col>
                                        <Col span={14}>
                                            <Input id="contactMobile"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('contactMobile')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>联系邮箱： </Col>
                                        <Col span={14}>
                                            <Input id="contactEmail"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('contactEmail')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>联系地址： </Col>
                                        <Col span={14}>
                                            <Input id="contactAddress"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('contactAddress')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>纳税人识别号： </Col>
                                        <Col span={14}>
                                            <Input id="taxpayerId"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('taxpayerId')}

                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Panel>
                        <Panel header="企业资质信息" key="3">
                            <Row>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>劳务派遣许可证文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('ldLicAdd'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳务派遣许可编号： </Col>
                                        <Col span={14}>
                                            <Input id="ldLicNo"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('ldLicNo')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳派许可证有效期起期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        value={this.state.stateMap.get('ldLicStartDate') == null ?
                                                            undefined
                                                            :
                                                            moment(this.state.stateMap.get('ldLicStartDate'))}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳派许可证有效期止期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        value={this.state.stateMap.get('ldLicEndDate') == null ?
                                                            undefined
                                                            :
                                                            moment(this.state.stateMap.get('ldLicEndDate'))}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>营业执照文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('busiLicAdd'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳务派遣服务协议文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('serviceConAdd'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>

                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>人力资源服务证： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('hrLicAdd'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>人力资源服务许可编号： </Col>
                                        <Col span={14}>
                                            <Input id="hrLicNo"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('hrLicNo')}
                                                   
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>人资许可证有效期起期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        value={this.state.stateMap.get('hrLicStartDate') == null ?
                                                            undefined
                                                            :
                                                            moment(this.state.stateMap.get('hrLicStartDate'))}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>人资许可证有效期止期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        value={this.state.stateMap.get('hrLicEndDate') == null ?
                                                            undefined
                                                            :
                                                            moment(this.state.stateMap.get('hrLicEndDate'))}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>近6个月主账户流水文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('accFlowRec'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>公司章程文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('comPolAdd'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>法定代表人征信报告文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('legalCrReadReport'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>股东会决议文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('holdersDecAdd'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>企业征信报告文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('corpCrReadReport'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人身份证国徽面： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('legalIdFront'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人身份证头像面： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('legalIdBack'))} style={{ width: '200px', marginRight: '10px' }}> 预览</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Modal>
            </div>
        );
    }
}

export default ReadSup;