import React from 'react';
import { updateFile, supInfo } from "@/api";
import {Modal, Button, Collapse, Row, Col, Input, DatePicker, Upload, message} from 'antd';
import {checkIsNull, _jsonToMap, checkMapOneError, _mapToJson, successInfo, errorInfo} from "../../../Common";
import moment from 'moment';
import {PRE_FILE} from "../../../api/path";
import {checkList} from "./Check";

const confirm = Modal.confirm;
const { Panel } = Collapse;
const dateFormat = 'YYYY-MM-DD';

class CopySup extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
        stateMap: new Map(),
        fileListMap: new Map(),
        stateMapInit: new Map(),
    };

    componentWillMount() {
        console.log("------CopySup----componentWillMount---------------");
    }

    componentDidMount() {
        console.log("------CopySup----componentDidMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------CopySup----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.setState({
                visible: nextProps.visiable,
                parent: nextProps.parent,
                stateMap: _jsonToMap(nextProps.record),
                stateMapInit: _jsonToMap(nextProps.record),
                fileListMap: new Map(),
            });
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.parent.setState({CopySupVisible:false})
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
            this.state.stateMap.set(id, locInfo);
            this.state.fileListMap.set(id, info.fileList);

            this.state.stateMap.set(id.substring(0,id.length-2), locInfo);

        }else{
            this.state.stateMap.set(id, undefined);
            this.state.fileListMap.set(id, []);
            //删除当前文件或上传失败，恢复最开始的文件
            this.state.stateMap.set(id.substring(0,id.length-2), this.state.stateMapInit.get(id.substring(0,id.length-2)));
        }
        this.setState({ stateMap: this.state.stateMap, fileListMap: this.state.fileListMap});
    }

    preview = (fileInfo) => {
        console.log('fileInfo',fileInfo);
        let rstInfo = JSON.parse(fileInfo);
        let fileType = (rstInfo.name.substring(rstInfo.name.lastIndexOf(".")+1));
        window.open(PRE_FILE + fileType + "/"+ rstInfo.fid);
    }

    //  阻止upload组件自动提交
    beforeUpload(file){
        return false;
    }

    handleOk = async() => {
        let checkResult = checkMapOneError(this.state.stateMap, checkList)
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
            const modal = confirm({
                title: '提示信息',
                content: '您确定要提交吗？',
                okText: '确定',
                okType: 'primary',
                cancelText: '取消',
                onOk: async ()=> {
                    this.state.stateMap.set('id', undefined);
                    let obj = _mapToJson(this.state.stateMap);
                    let result = await supInfo.add(obj)
                        .catch(function (error) {//防止报错
                            console.log(error)
                        });
                    if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.retCode === 3){
                        successInfo("新增成功");
                        this.setState({ loading: false, visible: false });
                        this.props.parent.setState({CopySupVisible:false})
                        this.state.parent.state.parent.handleFilterSubmit();
                        // TODO 要把当前页面查询条件清空
                    }else{
                        errorInfo("新增失败，请联系系统管理员")
                    }
                    modal.destroy();
                },
                onCancel() {
                    //取消
                },
            });
        }
    }

    checkSupCode = async() => {
        let supCode = this.state.stateMap.get('supCode');
        let checkRst = await this.state.parent.state.parent.queryListForSupCode({supCode: supCode});
        if(!checkIsNull(checkRst) && checkRst.length > 0){
            message.error("当前【供应商代码】已存在，请重新设定", 5);
        }
    }
    
    render() {
        return (
            <div className="gutter-example">
                <Modal
                    destroyOnClose
                    width="1300px"
                    visible={this.state.visible}
                    title="复制供应商信息"
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
                                    <Row>
                                        <Col span={10}>成立日期： </Col>
                                        <Col span={14}>
                                            <DatePicker style={{width:'200px'}}
                                                        onChange={this.initTimeValue.bind(this, "estabDate")}
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
                                            <Button onClick={() => this.preview(this.state.stateMap.get('ldLicAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"ldLicAddUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('ldLicAddUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('ldLicAddUp'))} style={{ width: '95px' }}> 替换</Button>
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
                                                        onChange={this.initTimeValue.bind(this, "ldLicEndDate")}
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
                                            <Button onClick={() => this.preview(this.state.stateMap.get('busiLicAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"busiLicAddUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('busiLicAddUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('busiLicAddUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>劳务派遣服务协议文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('serviceConAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"serviceConAddUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('serviceConAddUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('serviceConAddUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>

                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>人力资源服务证： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('hrLicAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"hrLicAddUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('hrLicAddUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('hrLicAddUp'))} style={{ width: '95px' }}> 替换</Button>
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
                                                        onChange={this.initTimeValue.bind(this, "hrLicEndDate")}
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
                                            <Button onClick={() => this.preview(this.state.stateMap.get('accFlowRec'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"accFlowRecUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('accFlowRecUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('accFlowRecUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>公司章程文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('comPolAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"comPolAddUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('comPolAddUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('comPolAddUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={8}>
                                    <Row>
                                        <Col span={10}>法定代表人征信报告文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('legalCreditReport'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"legalCreditReportUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('legalCreditReportUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('legalCreditReportUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>股东会决议文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('holdersDecAdd'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"holdersDecAddUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('holdersDecAddUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('holdersDecAddUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>企业征信报告文件： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('corpCreditReport'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"corpCreditReportUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('corpCreditReportUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('corpCreditReportUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人身份证国徽面： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('legalIdFront'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"legalIdFrontUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('legalIdFrontUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('legalIdFrontUp'))} style={{ width: '95px' }}> 替换</Button>
                                            </Upload>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col span={10}>法定代表人身份证头像面： </Col>
                                        <Col span={14}>
                                            <Button onClick={() => this.preview(this.state.stateMap.get('legalIdBack'))} style={{ width: '95px', marginRight: '10px' }}> 预览</Button>
                                            <Upload onChange={this.uploadFile.bind(this,"legalIdBackUp")}
                                                    beforeUpload={this.beforeUpload}
                                                    fileList={this.state.fileListMap.get('legalIdBackUp')}
                                            >
                                                <Button disabled={!checkIsNull(this.state.stateMap.get('legalIdBackUp'))} style={{ width: '95px' }}> 替换</Button>
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

export default CopySup;