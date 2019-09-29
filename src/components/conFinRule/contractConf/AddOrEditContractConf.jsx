import React from 'react';
import { Modal,Button,Input,Row,Col,DatePicker,Select,InputNumber } from 'antd';
import {selectUtils} from '../../../SelectUtils.jsx';
import {successInfo,checkIsNum, checkNull,initSupCode,initFunderCode,warningInfo,checkNumNull } from '../../../Common.jsx';
import moment from 'moment';
import {contractConf} from "@/api";

const dateFormat = 'YYYY-MM-DD';

class AddOrEditContractConf extends React.Component {

    state = {

    };


    componentWillMount() {
        this.setState({
            loading3: false,
            visible3: this.props.visiable,
        })
        this.canAjax = true;
        this.initFunderCodeOption();
        this.initSupCodeOption();
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("AddOrEditContractConf------componentWillReceiveProps-")
        if(nextProps.visiable){
            this.setState({
                parent:nextProps.parent,
                visible3: nextProps.visiable,
                record:nextProps.record
            });
            if(nextProps.parent.state.type ==='add'){

                this.setState({
                    id:undefined,
                    supCode:undefined,
                    funderCode:undefined,
                    conType:undefined,
                    mainConCode:undefined,
                    funderConCode:undefined,
                    creditPlace:undefined,
                    creditAmount:undefined,
                    creditPeriodType:undefined,
                    creditStartDate:undefined,
                    creditEndDate:undefined,
                    creditTriger:undefined,
                    creditEffDate:undefined,
                    creditExpDate:undefined,
                    creditStartDateStr:undefined,
                    creditEndDateStr:undefined,
                    creditEffDateStr:undefined,
                    creditExpDateStr:undefined,
                    creditPeriod:undefined,
                    isCycle:undefined,
                    intRate:undefined,
                    intRatio:undefined,
                    intScale:undefined,
                    intRoundRule:undefined,
                    repayType:undefined,
                    dayCountBasis:undefined,
                    feeName:undefined,
                    feeRate:undefined,
                    feeType:undefined,
                    status:"DRAFT",
                    disaByStatus:false,
                    isDelete:'0',
                    url:'add',
                    type:'新增合同配置',
                });

            } else if(nextProps.parent.state.type ==='edit'){
                var disaByStatus = nextProps.record.status==='DRAFT'? false : true;
                
                this.setState({

                    id:nextProps.record.id,
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
                    creditStartDateStr:nextProps.record.creditStartDate,
                    creditEndDateStr:nextProps.record.creditEndDate,
                    creditEffDateStr:nextProps.record.creditEffDate,
                    creditExpDateStr:nextProps.record.creditExpDate,
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
                    status:nextProps.record.status,
                    disaByStatus:disaByStatus,
                    isDelete:nextProps.record.isDelete,
                    url:'edit',
                    type:'编辑合同配置',
                });
                if(!disaByStatus){
                    this.initMainConCode(nextProps.record.supCode);
                }
            } else if(nextProps.parent.state.type === 'copy'){

                this.setState({
                    id:undefined,
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
                    creditStartDateStr:nextProps.record.creditStartDate,
                    creditEndDateStr:nextProps.record.creditEndDate,
                    creditEffDateStr:nextProps.record.creditEffDate,
                    creditExpDateStr:nextProps.record.creditExpDate,
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
                    disaByStatus:false,
                    status:"DRAFT",
                    isDelete:'0',
                    url:'add',
                    type:'复制合同配置',
                });
                this.initMainConCode(nextProps.record.supCode);
            }
            
        }
        console.log("this.state",this.state);
    }

    initFunderCodeOption() {

        var funderCodeList = initFunderCode();
        console.log("funderCodeList",funderCodeList)
        this.setState({
            funderCodeList:funderCodeList,
        });
    }

    initSupCodeOption() {

        var supCodeList = initSupCode();
        console.log("supCodeList",supCodeList)
        this.setState({
            supCodeList:supCodeList,
        });
    }

    initMainConCode(){
        var mainConCodeList = [];
        contractConf.list({
            supCode:this.state.supCode
        }).then(function (response) {
            for (var i = 0; i < response.length; i++) {
                if(response[i] !== null){
                    mainConCodeList.push(<Select.Option key={response[i].mainConCode} >{response[i].mainConCode}</Select.Option>);
                }
            }
        }).catch(function (error) {
        });
        this.setState({
            mainConCodeList:mainConCodeList,
            
        });
    }
    handleSupCode = (value) => {
        this.setState({ 
            supCode: value,
            mainConCode:undefined
        });
    }
    handleFunderCode = (value) => {
        this.setState({ funderCode: value });
    }
    handleConType = (value) => {
        if((!this.state.disaByStatus)){
            if(value==='FUNDER'){
                if(checkNull(this.state.supCode,'供应商')){
                    return;
                }
                this.initMainConCode();
            }else{
                this.setState({ 
                    funderConCode:undefined,
                });
            }
            this.setState({ conType: value, mainConCode:undefined });
        }
        
        
        
    }
    handleMainConCode = (e) => {
        this.setState({mainConCode:e.target.value});
    }
    handleMainCon = (value) => {
        this.setState({mainConCode:value});
    }
    handleFunderConCode = (e) => {
        this.setState({funderConCode:e.target.value});
    }
    handleCreditPlace = (value) => {
        this.setState({ creditPlace: value });
        
    }
    handleCreditAmount = (value) => {
        this.setState({creditAmount:value});
    }
    handleCreditPeriodType = (value) => {
        this.setState({ creditPeriodType: value });
    }
    handleCreditStartDate = (value, dateString) => {
        this.setState({ creditStartDate: value ,creditStartDateStr: dateString});
    }
    handleCreditEndDate = (value, dateString) => {
        this.setState({ creditEndDate: value ,creditEndDateStr: dateString});
    }
    handleCreditTriger = (value) => {
        this.setState({ creditTriger: value });
    }
    handleCreditEffDate = (value, dateString) => {
        this.setState({ creditEffDate: value ,creditEffDateStr: dateString});
    }
    handleCreditExpDate = (value, dateString) => {
        this.setState({ creditExpDate: value ,creditExpDateStr: dateString});
    }
    handleCreditPeriod = (value) => {
        this.setState({creditPeriod:value});
    }
    handleIsCycle = (value) => {
        this.setState({ isCycle: value });
    }
    handleIntRate = (value) => {
        this.setState({intRate:value});
    }
    handleIntRatio = (value) => {
        this.setState({intRatio:value});
    }
    handleIntScale = (value) => {
        this.setState({ intScale: value });
    }
    handleIntRoundRule = (value) => {
        this.setState({ intRoundRule: value });
    }
    handleRepayType = (value) => {
        this.setState({ repayType: value });
    }
    handleDayCountBasis = (value) => {
        this.setState({ dayCountBasis: value });
    }
    handleFeeName = (e) => {
        this.setState({feeName:e.target.value});
    }
    handleFeeRate = (value) => {
        this.setState({feeRate:value});
    }
    handleFeeType = (value) => {
        this.setState({ feeType: value });
    }

    handleOk3 = () => {
        console.log("handleOk3---this.state--",this.state);

        if(checkNull(this.state.supCode,'供应商')){
            return;
        }

        if(checkNull(this.state.funderCode,'资金方')){
            return;
        }

        if(checkNull(this.state.conType,'合同类型')){
            return;
        }
        if(checkNull(this.state.mainConCode,'业务合同编号')){
            return;
        }

        if(this.state.conType==='FUNDER' && checkNull(this.state.funderConCode,'资金合同编号')){
            return;
        }
        if(this.state.parent.state.type==='copy'){
            if(this.state.conType==='FUNDER'){
                if(this.state.record.mainConCode === this.state.mainConCode) {
                    warningInfo("业务合同编号不能重复,请修改后提交！");
                    return;
                }
                if(this.state.record.funderConCode === this.state.funderConCode) {
                    warningInfo("资金合同编号不能重复,请修改后提交！");
                    return;
                }
            }else{
                if(this.state.record.mainConCode === this.state.mainConCode) {
                    warningInfo("业务合同编号不能重复,请修改后提交！");
                    return;
                }
            }
            
        }
        if(checkNull(this.state.creditPlace,'授信地')){
            return;
        }
        if(checkNumNull(this.state.creditAmount,'授信金额')){
            return;
        }

        if(checkNull(this.state.creditPeriodType,'授信期间类型')){
            return;
        }
        if(checkNull(this.state.isCycle,'循环')){
            return;
        }
        if(checkNull(this.state.creditStartDateStr,'授信起日')){
            return;
        }
        if(checkNull(this.state.creditEndDateStr,'授信止日')){
            return;
        }
        if(checkNull(this.state.creditTriger,'授信期间触发条件')){
            return;
        }
        if(checkNull(this.state.creditEffDateStr,'授信生效日期')){
            return;
        }
        if(checkNull(this.state.creditExpDateStr,'授信失效日期')){
            return;
        }
        if(this.state.creditStartDateStr !== undefined && this.state.creditStartDateStr !== "" &&
            this.state.creditEndDateStr !== undefined && this.state.creditEndDateStr !== ""){
            if(this.state.creditEndDateStr <= this.state.creditStartDateStr){
                warningInfo("规则【授信止日】必须大于【授信起日】！");
                return;
            }
        }
        if(this.state.creditEffDateStr !== undefined && this.state.creditEffDateStr !== "" &&
            this.state.creditExpDateStr !== undefined && this.state.creditExpDateStr !== ""){
            if(this.state.creditExpDateStr <= this.state.creditEffDateStr){
                warningInfo("规则【授信失效日期】必须大于【授信生效日期】！");
                return;
            }
        }
        if(!checkIsNum(this.state.creditPeriod)){
            warningInfo("授信期限必须为整数")
            return;
        }
        if(checkNumNull(this.state.intRatio,'融资比率')){
            return;
        }
        if(checkNumNull(this.state.intRate,'利率')){
            return;
        }
        if(checkNull(''+this.state.intScale,'小数点位数')){
            return;
        }
        if(checkNull(''+this.state.intRoundRule,'进位规则')){
            return;
        }
        if(checkNull(this.state.repayType,'还款方式')){
            return;
        }
        if(checkNull(''+this.state.dayCountBasis,'计息基础')){
            return;
        }
        if (this.canAjax) {
            this.canAjax = false;
        }else {
            return false;
        }
        var jsonStr = {
            "id":this.state.id,
            "supCode":this.state.supCode,
            "funderCode":this.state.funderCode,
            "conType":this.state.conType,
            "mainConCode":this.state.mainConCode,
            "funderConCode":this.state.funderConCode,
            "creditPlace":this.state.creditPlace,
            "creditAmount":this.state.creditAmount,
            "creditPeriodType":this.state.creditPeriodType,
            "creditStartDate":this.state.creditStartDateStr,
            "creditEndDate":this.state.creditEndDateStr,
            "creditTriger":this.state.creditTriger,
            "creditEffDate":this.state.creditEffDateStr,
            "creditExpDate":this.state.creditExpDateStr,
            "creditPeriod":this.state.creditPeriod,
            "isCycle":this.state.isCycle,
            "intRate":this.state.intRate,
            "intRatio":this.state.intRatio,
            "intScale":this.state.intScale,
            "intRoundRule":this.state.intRoundRule,
            "repayType":this.state.repayType,
            "dayCountBasis":this.state.dayCountBasis,
            "feeName":this.state.feeName,
            "feeRate":this.state.feeRate,
            "feeType":this.state.feeType,
            "status":this.state.status,
            "isDelete":this.state.isDelete,
        };

        var thi = this;
        
        var url;
        if(this.state.url==='add'){
            url=contractConf.add
        }else{
            url=contractConf.update
        }
        console.log("json",jsonStr);
        console.log("url",url);
        url(jsonStr).then(
            function (response) {
                
                    successInfo("操作成功");
                    thi.setState({ visible3: false, loading3: false });
                    thi.props.hideAllModal();
                    thi.state.parent.state.parent.handleFilterSubmit();
                
                
            }).catch(function (error) {}).finally(() => {
                setTimeout(()=>{
                    this.canAjax = true;
                },2000)
        });

    };


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
                        <Button key="submit" type="primary" size="large" loading={this.state.loading3} onClick={this.handleOk3}>
                            提交
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={7}>
                            <br />
                            <Row>
                                <Col span={8}>供应商： </Col>
                                <Col span={16}>
                                    <Select value={this.state.supCode} style={{ width: 200 }} onChange={this.handleSupCode} disabled={this.state.disaByStatus} >
                                        {this.state.supCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>资金方： </Col>
                                <Col span={16}>
                                    <Select value={this.state.funderCode} style={{ width: 200 }} onChange={this.handleFunderCode} disabled={this.state.disaByStatus} >
                                        {this.state.funderCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>合同类型： </Col>
                                <Col span={16}>
                                    <Select value={this.state.conType} style={{ width: 200 }} onChange={this.handleConType} disabled={this.state.disaByStatus} >
                                        {selectUtils('conType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br style={{display : this.state.conType==='MAIN'?'':'none' }} />
                            <Row style={{display : this.state.conType==='MAIN'?'':'none' }} >
                                <Col span={8}>业务合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{width:'200px'}} value={this.state.mainConCode} onChange={this.handleMainConCode} disabled={this.state.disaByStatus} />
                                </Col>
                            </Row>
                            <br style={{display : this.state.conType==='FUNDER'?'':'none' }} />
                            <Row style={{display : this.state.conType==='FUNDER'?'':'none' }}>
                                <Col span={8}>资金合同编号： </Col>
                                <Col span={16}>
                                    <Input style={{width:'200px'}} value={this.state.funderConCode} onChange={this.handleFunderConCode} disabled={this.state.disaByStatus} />
                                </Col>
                            </Row>
                            <br style={{display : this.state.conType==='FUNDER'?'':'none' }} />
                            <Row style={{display : this.state.conType==='FUNDER'?'':'none' }} >
                                <Col span={8}>业务合同编号： </Col>
                                <Col span={16}>
                                    <Select value={this.state.mainConCode} style={{ width: 200 }} onChange={this.handleMainCon} disabled={this.state.disaByStatus} >
                                        {this.state.mainConCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信地： </Col>
                                <Col span={16}>
                                    <Select value={this.state.creditPlace} style={{ width: 200 }} onChange={this.handleCreditPlace} >
                                        {selectUtils('creditPlace')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信金额： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} style={{width:'200px'}} value={this.state.creditAmount} onChange={this.handleCreditAmount} />
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
                                    <Select value={this.state.creditPeriodType} style={{ width: 200 }} onChange={this.handleCreditPeriodType} >
                                        {selectUtils('creditPeriodType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信起日： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} onChange={this.handleCreditStartDate} value={this.state.creditStartDate == null ? undefined : moment(this.state.creditStartDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信止日： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} onChange={this.handleCreditEndDate} value={this.state.creditEndDate == null ? undefined : moment(this.state.creditEndDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信期间触发条件： </Col>
                                <Col span={16}>
                                    <Select value={this.state.creditTriger} style={{ width: 200 }} onChange={this.handleCreditTriger} >
                                        {selectUtils('creditTriger')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信生效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} onChange={this.handleCreditEffDate} value={this.state.creditEffDate == null ? undefined : moment(this.state.creditEffDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信失效日期： </Col>
                                <Col span={16}>
                                    <DatePicker style={{width:'200px'}} onChange={this.handleCreditExpDate} value={this.state.creditExpDate == null ? undefined : moment(this.state.creditExpDate, dateFormat)} format="YYYY-MM-DD" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>授信期限： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={36} style={{width:'200px'}} value={this.state.creditPeriod} onChange={this.handleCreditPeriod} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>融资比率： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={1} style={{width:'200px'}} value={this.state.intRatio} onChange={this.handleIntRatio} />
                                </Col>
                            </Row>

                        </Col>
                        <Col span={1} />
                        <Col span={7}>
                            <br />
                            <Row>
                                <Col span={8}>利率： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={1} style={{width:'200px'}} value={this.state.intRate} onChange={this.handleIntRate} />
                                </Col>
                            </Row>

                            <br />
                            <Row>
                                <Col span={8}>小数点位数： </Col>
                                <Col span={16}>
                                    <Select value={this.state.intScale} style={{ width: 200 }} onChange={this.handleIntScale} >
                                        {selectUtils('decimalScale')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>进位规则： </Col>
                                <Col span={16}>
                                    <Select value={this.state.intRoundRule} style={{ width: 200 }} onChange={this.handleIntRoundRule} >
                                        {selectUtils('roundRule')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>还款方式： </Col>
                                <Col span={16}>
                                    <Select value={this.state.repayType} style={{ width: 200 }} onChange={this.handleRepayType} >
                                        {selectUtils('repayType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>计息基础： </Col>
                                <Col span={16}>
                                    <Select value={this.state.dayCountBasis} style={{ width: 200 }} onChange={this.handleDayCountBasis} >
                                        {selectUtils('dayOfYear')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>费用名： </Col>
                                <Col span={16}>
                                    <Input style={{width:'200px'}} value={this.state.feeName} onChange={this.handleFeeName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>费率： </Col>
                                <Col span={16}>
                                    <InputNumber min={0} max={1} style={{width:'200px'}} value={this.state.feeRate} onChange={this.handleFeeRate} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收费方式： </Col>
                                <Col span={16}>
                                    <Select value={this.state.feeType} style={{ width: 200 }} onChange={this.handleFeeType} >
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

export default AddOrEditContractConf;