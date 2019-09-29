import React from 'react';
import { updateFile, supInfo } from "@/api";
import {Modal, Button, Row, Col, Collapse, Icon, Input, Upload, DatePicker, message} from 'antd';
import { checkIsNull, checkMapOneError, _mapToJson} from '../../../Common.jsx';
import {checkList} from "./Check";
import { errorInfo, successInfo} from "../../../Common";

const { Panel } = Collapse;
class AddSup extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
        stateMap: new Map(),
        fileListMap: new Map(),
    };

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------AddSup----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.setState({
                visible:nextProps.visiable,
                parent:nextProps.parent,
                //初始化页面状态
                stateMap: new Map(),
                fileListMap: new Map(),
            });
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.parent.setState({AddSupVisible:false})
    };

    initValue = (e) => {
        this.state.stateMap.set(e.target.id,e.target.value);
        this.setState({ stateMap: this.state.stateMap});
    }

    initTimeValue = (id, value, dateString) => {
        this.state.stateMap.set(id,value);
        this.state.stateMap.set(id + 'Str',dateString);
        this.setState({ stateMap: this.state.stateMap});
    }

    uploadFile = async(id, info) => {//  上传文件到文件服务器
        let result = await updateFile.up(info)
            .catch(function (error) {//防止报错
                console.log(error)
            });
        if(!checkIsNull(result)){
            let locInfo = result.retObj;
            //this.state.stateMap.set(id, locInfo.substring(1,locInfo.length-1));//地址json字符串去除首尾空格
            this.state.stateMap.set(id, locInfo);
            this.state.fileListMap.set(id, info.fileList);
        }else{
            this.state.stateMap.set(id, undefined);
            this.state.fileListMap.set(id, []);
        }
        this.setState({ stateMap: this.state.stateMap, fileListMap: this.state.fileListMap});

    }

    //  阻止upload组件自动提交
    beforeUpload(file){
        return false;
    }

    checkSupCode = async() => {
        let supCode = this.state.stateMap.get('supCode');
        let checkRst = await this.state.parent.state.parent.queryListForSupCode({supCode: supCode});
        if(!checkIsNull(checkRst) && checkRst.length > 0){
            message.error("当前【供应商代码】已存在，请重新设定", 5);
        }
    }

    handleOk = async() => {
        let checkResult = checkMapOneError(this.state.stateMap, checkList);
        if(checkResult){ // 所有校验通过
            let supCode = this.state.stateMap.get('supCode');
            let checkRst = await this.state.parent.state.parent.queryListForSupCode({supCode: supCode});
            if(!checkIsNull(checkRst) && checkRst.length > 0){
                message.error("当前【供应商代码】已存在，请重新设定", 5);
                return;
            }
            if(this.state.stateMap.get('ldLicStartDate') >= this.state.stateMap.get('ldLicEndDate')){
                message.error("【劳派许可证有效期起期】应小于【劳派许可证有效期止期】", 5);
                return;
            }
            if(this.state.stateMap.get('hrLicStartDate') >= this.state.stateMap.get('hrLicEndDate')){
                message.error("【人资许可证有效期起期】应小于【人资许可证有效期止期】", 5);
                return;
            }
            let obj = _mapToJson(this.state.stateMap);
            let result = await supInfo.add(obj)
                .catch(function (error) {//防止报错
                console.log(error)
            });
            if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.retCode === 3){
                successInfo("新增成功");
                this.setState({ loading: false, visible: false });
                this.props.parent.setState({AddSupVisible:false})
                this.state.parent.state.parent.handleFilterSubmit();
                // TODO 要把当前页面查询条件清空
            }else{
                errorInfo("新增失败，请联系系统管理员")
            }
        }
    }

    render() {
        console.log("render AddSup-----state",this.state);
        return (
            <div className="gutter-example">
                <Modal
                    destroyOnClose
                    width="1300px"
                    visible={this.state.visible}
                    title="新增供应商信息"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                            提交
                        </Button>,
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
                                                   onBlur={this.checkSupCode}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
{/*                                    <Row>
                                        <Col span={10}>成立日期： </Col>
                                        <Col span={14}>
                                            <Input id="estabDate"
                                                   style={{ width: '200px' }}
                                                   size="default"
                                                   value={this.state.stateMap.get('estabDate')}
                                                   onChange={this.initValue}
                                            />
                                        </Col>
                                    </Row>*/}
                                    <Row>
                                        <Col span={10}>成立日期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        onChange={this.initTimeValue.bind(this, "estabDate")}
                                                        value={this.state.stateMap.get('estabDate') == null ?
                                                            undefined
                                                            :
                                                            this.state.stateMap.get('estabDate')}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                                   onChange={this.initValue}
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
                                            <Upload onChange={this.uploadFile.bind(this,"ldLicAdd")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('ldLicAdd')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('ldLicAdd'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
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
                                                   onChange={this.initValue}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳派许可证有效期起期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        onChange={this.initTimeValue.bind(this, "ldLicStartDate")}
                                                        value={this.state.stateMap.get('ldLicStartDate') == null ?
                                                            undefined
                                                            :
                                                            this.state.stateMap.get('ldLicStartDate')}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳派许可证有效期止期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        onChange={this.initTimeValue.bind(this, "ldLicEndDate")}
                                                        value={this.state.stateMap.get('ldLicEndDate') == null ?
                                                            undefined
                                                            :
                                                            this.state.stateMap.get('ldLicEndDate')}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>营业执照文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"busiLicAdd")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('busiLicAdd')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('busiLicAdd'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳务派遣服务协议文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"serviceConAdd")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('serviceConAdd')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('serviceConAdd'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>

                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>人力资源服务证： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"hrLicAdd")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('hrLicAdd')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('hrLicAdd'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
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
                                                   onChange={this.initValue}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>人资许可证有效期起期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        onChange={this.initTimeValue.bind(this, "hrLicStartDate")}
                                                        value={this.state.stateMap.get('hrLicStartDate') == null ?
                                                            undefined
                                                            :
                                                            this.state.stateMap.get('hrLicStartDate')}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>人资许可证有效期止期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        onChange={this.initTimeValue.bind(this, "hrLicEndDate")}
                                                        value={this.state.stateMap.get('hrLicEndDate') == null ?
                                                            undefined
                                                            :
                                                            this.state.stateMap.get('hrLicEndDate')}
                                                        showTime="true" format="YYYY-MM-DD"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>近6个月主账户流水文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"accFlowRec")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('accFlowRec')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('accFlowRec'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>公司章程文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"comPolAdd")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('comPolAdd')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('comPolAdd'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>法定代表人征信报告文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"legalCreditReport")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('legalCreditReport')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('legalCreditReport'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>股东会决议文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"holdersDecAdd")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('holdersDecAdd')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('holdersDecAdd'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>企业征信报告文件： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"corpCreditReport")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('corpCreditReport')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('corpCreditReport'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人身份证国徽面： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"legalIdFront")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('legalIdFront')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('legalIdFront'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人身份证头像面： </Col>
                                        <Col span={14}>
                                            <Upload onChange={this.uploadFile.bind(this,"legalIdBack")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('legalIdBack')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('legalIdBack'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                            </Upload>
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

export default AddSup;