import React from 'react';
import {Modal, Button, Row, Col} from 'antd';
// import { checkIsNull, checkMap, _mapToJson} from '../../../Common.jsx';
// import { errorInfo, successInfo} from "../../../Common";
import { contractConf,financeApl } from "@/api";
import {checkIsNull, errorInfo, successInfo} from "../../../Common";

class FinApl extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
        stateMap: new Map(),
        fileListMap: new Map(),
        record: {},
        aplRecord: {}
    };

    componentWillMount() {
    }

    componentDidMount() {

    }

    async componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------FinApl----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visible){
            // 查询对应的【业务合同编号】,业务合同为供应商和一级资金方之间的合同
            // 确认申请后，更新以下字段：【业务合同编号】【融资金额】【融资比率】【融资利率】，【资金合同编号】【资金方代码】
            let record = nextProps.record;
            let result = await this.queryList({supCode:record.supCode, status:'ACTIVE'})
            console.log("查询结果",result);
            if(checkIsNull(result)){
                errorInfo("发起申请失败，未查询到该供应商的【业务合同】和【资金合同】")
                return;
            }else{
                let funderList = result.filter(function(value) {return value.conType === 'FUNDER'});//  资金合同
                let mainList = result.filter(function(value) {return value.conType === 'MAIN'});//  业务合同
                console.log(funderList,mainList);
                if(mainList.length === 0){
                    errorInfo("发起申请失败，未查询到该供应商的【业务合同】")
                    return;
                }else if(funderList.length === 0){
                    errorInfo("发起申请失败，未查询到该供应商的【资金合同】")
                    return;
                }if(mainList.length > 1){
                    errorInfo("发起申请失败，查询到该供应商的多条【业务合同】")
                    return;
                }else if(funderList.length > 1){
                    errorInfo("发起申请失败，查询到该供应商的多条【资金合同】")
                    return;
                }

                let aplRecord = {
                    id : record.id,
                    intRate : funderList[0].intRate, //融资利率
                    intRatio: funderList[0].intRatio, //融资比率
                    financeAmt: record.accReceiveAmt * record.intRatio, //融资金额
                    mainConCode: mainList[0].mainConCode, //业务合同编号
                    funderConCode: funderList[0].funderConCode, //资金合同编号
                    funderCode: funderList[0].funderCode,//资金方代码
                    funderSname: funderList[0].funderSname, //资金方简称

                    //  TODO 【确认融资申请】的时候，会签署【融资合同】，确定【融资合同编号】
                    financeConCode:  'JZ00001' // 融资合同编号
                }

                this.setState({
                    visible:nextProps.visible,
                    parent:nextProps.parent,
                    record:record,
                    aplRecord : aplRecord,
                });
            }
        }
    }

    queryList(data) {
        return contractConf.list(data)
            .catch(function(error) {})//防止异常
            .finally(() => {});
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.parent.setState({finAplVisible:false})
    };

    handleOk = async() => {
        //提交以下字段到和申请状态到FINANCE_APL
        //融资利率
        //融资比率
        //融资金额
        //业务合同编号
        //资金合同编号
        //资金方代码
        //融资合同编号
        let result = await financeApl.update({...this.state.aplRecord,status: 'APLD'})
            .catch(function (error) {//防止报错
                console.log(error)
            });
        if(!checkIsNull(result) && !checkIsNull(result.data) && result.data.retCode === 2){
            successInfo("【发起融资申请】成功");
            this.setState({ loading: false, visible: false });
            this.props.parent.setState({finAplVisible:false})
            this.state.parent.query(this.state.parent.state.queryArgsCache);
        }else{
            errorInfo("【发起融资申请】失败，请联系系统管理员")
        }

    }

    render() {
        console.log("render FinApl-----state",this.state);
        return (
            <div className="gutter-example">
                <Modal
                    destroyOnClose
                    width="900px"
                    visible={this.state.visible}
                    title="确认融资申请信息"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                            确定申请
                        </Button>,
                    ]}
                >
                    <Row>
                        <Col span={12}>
                            <Row>
                                <Col span={10}>应收帐款编号： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.accReceiveCode}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>应收帐款总金额： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.accReceiveAmt}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>供应商简称： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.supCodeName}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>被派遣法人单位： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.dispatchCorpUnit}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>资金方简称： </Col>{/*一级资金合同取得*/}
                                <Col style={{color:"blue"}} span={14}>{this.state.aplRecord.funderSname}</Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={10}>融资金额： </Col>{/*一级资金合同取得的融资比率计算*/}
                                <Col style={{color:"blue"}} span={14}>{this.state.aplRecord.financeAmt}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>融资利率： </Col>{/*一级资金合同取得*/}
                                <Col style={{color:"blue"}} span={14}>{this.state.aplRecord.intRatio}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>融资起日： </Col>{/*上传应收帐款明细的时候输入*/}
                                <Col style={{color:"blue"}} span={14}>{this.state.record.financeDate}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>预计还款日： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.repayExpcDate}</Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={10}>劳务派遣费用标准： </Col>
                                <Col style={{color:"blue"}} span={14}>{this.state.record.disCostStandard}</Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default FinApl;