import React from 'react';
import { updateFile,financeApl } from "@/api";
import {Modal, Button, Row, Col,DatePicker,Upload,Icon} from 'antd';
import {successInfo,checkIsNull,errorInfo,checkNull} from '../../../Common.jsx';
import {PRE_FILE} from "../../../api/path";
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
class ConfirmBack extends React.Component {

    state = {
        record: {},
        showThisDetail:false,     
        fileListMap: new Map(),
        stateMap: new Map(), 
        stateMapInit: new Map(), 
    };

    componentWillMount() {
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------ConfirmBack----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visible){
            this.setState({
                visible:nextProps.visible,
                parent:nextProps.parent,
                //初始化页面状态
                stateMap: new Map(),
                fileListMap: new Map(),
    //----------------------------------------------------------------------------------------------
                record:nextProps.record,
                financingPrincipal: nextProps.record.accReceiveAmt * nextProps.record.intRatio, //融资本金 应收账款金额*融资比例
                accruedProfits: nextProps.record.accReceiveAmt*nextProps.record.intRatio*nextProps.record.intRate*
                                nextProps.record.financePeriod, //应付利息 融资本金*融资利率*融资期限
                repayDateStr:undefined,
                repayDate:undefined,
                actualFinancing:undefined,
                graceDay:undefined, // 宽限天数
                overDay:undefined, // 逾期天数
            });
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.parent.setState({confirmBackVisible:false})
    };

    // 实际还款日
    handleRepayDate = (value, dateString) => {
        this.setState({repayDate: value,repayDateStr: dateString});
        this.actualFinBlur(dateString);
        this.initGraceDay(dateString);
    }

    //实际融资期限
    actualFinBlur = (value) => {
        var financeDate = this.state.record.financeDate; //融资起日
        var aDate, oDate1, oDate2, iDays         
        aDate = value.split("-");     
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2002格式         
        aDate = financeDate.split("-")         
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])         
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24) //把相差的毫秒数转换为天数
        this.setState({
            actualFinancing: iDays + 1
        })
    }

    //宽限天数
    initGraceDay = (value) => {
        var expcDate = this.state.record.repayExpcDate; // 预计还款日
        var aDate, oDate1, oDate2, iDays         
        aDate = value.split("-"); //实际还款日     
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2002格式         
        aDate = expcDate.split("-") //预计还款日        
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])         
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24) //把相差的毫秒数转换为天数
        
        var graceDay,overdueDay;
        if(iDays > this.state.record.gracePeriod){
            graceDay = this.state.record.gracePeriod;
            overdueDay = iDays - this.state.record.gracePeriod;
        }else{
            graceDay = iDays;
            overdueDay = 0;
        }
        this.setState({
            graceDay:graceDay,
            overDay:overdueDay
        })
    }

    handleOk = async() => {
        if(checkNull(this.state.stateMap.get('ConfirmAddUp'),"请上传凭证")){
			return;
		}
        let data = {
            id : this.state.record.id,
        }
        let result = await financeApl.confirmBack(data)
            .catch(function (error) {//防止报错
                console.log(error)
            });
        if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.result === 1){
            successInfo("【回款】成功");
            this.setState({ loading: false, visible: false });
            this.props.parent.setState({confirmBackVisible:false})
            this.state.parent.query(this.state.parent.state.queryArgsCache);
        }else{
            errorInfo("【回款失败】失败，请联系系统管理员")
        }
    }

    preview = (fileInfo) => {
		console.log('fileInfo',fileInfo);
		if(checkNull(fileInfo,"凭证为空")){
			return;
		}
		let rstInfo = JSON.parse(fileInfo);
		let fileType = (rstInfo.name.substring(rstInfo.name.lastIndexOf(".")+1));
		window.open(PRE_FILE + fileType + "/"+ rstInfo.fid);
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

    render() {
        let {state:{showThisDetail,repayDate}} = this
        showThisDetail = !!repayDate
        console.log("render ConfirmBack-----state",this.state);
        return (
            <div className="gutter-example">
                <Modal
                    destroyOnClose
                    width="900px"
                    visible={this.state.visible}
                    title="确认已回款"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="primary" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                            同意
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={10}>供应商： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.supConCode}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>法人主体： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.legalCode}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>应收账款编号： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.accReceiveCode}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>融资本金： </Col> {/* 应收账款金额*融资比例 ACC_RECEIVE_AMT * INT_RATIO */}
                                <Col style={{color:"blue"}} span={14}>{this.state.financingPrincipal}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>融资起日： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.financeDate}</Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={10}>实际还款日： </Col>  {/* 确认还款日 */}
                                <Col style={{color:"blue"}} span={14}>
                                    <DatePicker style={{width:'160px'}} onChange={this.handleRepayDate} value={this.state.repayDate == null ? undefined : moment(this.state.repayDate, dateFormat)} showTime="true" format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>回款凭证上传： </Col>
                                <Col span={14}>
                                    <Upload onChange={this.uploadFile.bind(this,"ConfirmAddUp")}
                                        beforeUpload={this.beforeUpload}
                                        fileList={this.state.fileListMap.get('ConfirmAddUp')}
                                    >
                                        <Button disabled={!checkIsNull(this.state.stateMap.get('ConfirmAddUp'))} style={{ width: '200px' }}> <Icon type="upload" />上传</Button>
                                    </Upload>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>预览： </Col>
                                <Col span={14}>
                                    <Button onClick={() => this.preview(this.state.stateMap.get('ConfirmAddUp'))} style={{ width: '95px', marginRight: '10px' }}>
                                        预览
                                    </Button>
                                </Col>
                            </Row>
                            <br />
                           {showThisDetail&& <div>
                                <Row>
                                    <Col span={10}>实际融资期限： </Col> {/* 确认还款日 - 融资起日 + 1 */}
                                    <Col style={{color:"blue"}} span={14}>{this.state.actualFinancing}</Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col span={10}>应付利息： </Col>  {/* 融资本金*融资利率*实际融资期限 */}
                                    <Col style={{color:"blue"}} span={14}>{this.state.financingPrincipal*this.state.record.intRate*
                                                                           this.state.actualFinancing}</Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col span={10}>宽限天数： </Col>   {/* 超过“应收账款到期日”为宽限期 */}
                                    <Col style={{color:"blue"}} span={14}>{this.state.graceDay}</Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col span={10}>宽限期利息： </Col>  {/* 融资本金*宽限期天数*宽限期利率 */}
                                    <Col style={{color:"blue"}} span={14}>{this.state.record.graceRate}</Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col span={10}>逾期天数： </Col>  {/* 超过“应收账款到期日 + 宽限期” 为逾期 */}
                                    <Col style={{color:"blue"}} span={14}>{this.state.overDay}</Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col span={10}>逾期利息： </Col>  {/* 融资本金*逾期天数*逾期利率 */}
                                    <Col style={{color:"blue"}} span={14}>{this.state.record.overdueRate}</Col>
                                </Row>
                            
                            </div>

                        }
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default ConfirmBack;