import React from 'react';
import {Input,Row,Col } from 'antd';
// import moment from 'moment';
 import axios from 'axios';
// import {selectList} from '../../../mapper.js';
// import {selectUtils} from '../../../SelectUtils.jsx';
import {checkEmpty,checkNull, sysErrorInfo,errorInfo} from '../../../Common.jsx';

class OrgConfSpan extends React.Component {

    state = {

    };


    componentWillMount() {
        console.log("-17-----OrgConfSpan---componentWillMount---------------",this.props);
    }

    componentDidMount(){
        console.log("-21------------OrgConfSpan.componentDidMount----------------",this.props);
        this.props.onRef(this);
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("-26-----OrgConfSpan----componentWillReceiveProps---------------",nextProps);
        this.setState({
            parent:nextProps.parent,

        });
    }

    handleCode = (e) => {
        this.setState({ code: e.target.value});
    }

    inputOnBlur = (e) => {
        console.log("---38-------------inputOnBlur------this.props-----",this.props);
        var orgType = this.props.parent.state.orgType;
        if(checkNull(orgType,'机构类型')){
            return;
        }
        if(checkEmpty(e.target.value)){
            return;
        }

        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/queryOrgByCode',
        {
            "orgType":orgType,
            "orgGroupCode":e.target.value
        }
        ).then(function (response) {
            console.log('response-2',response);
            if(response.data.STATUS === '200'){
                if(response.data.COUNT===1){
                    var profile = JSON.parse(response.data.List[0].profile);
                    thi.setState({
                        codename: profile.codename,
                        shortname: profile.shortname,
                        email: profile.email,
                        phone: profile.phone,
                        accno: profile.accno,
                        accname: profile.accname,
                        bankname: profile.bankname,
                        branchname: profile.branchname,
                        codenameDisa: true,
                        shortnameDisa: true,
                        emailDisa: true,
                        phoneDisa: true,
                        accnoDisa: true,
                        accnameDisa: true,
                        bankDisa: true,
                        branchDisa: true,

                    });
                } else {
                    thi.setState({
                        codename: '',
                        shortname: '',
                        email: '',
                        phone: '',
                        accno: '',
                        accname: '',
                        bankname: '',
                        branchname: '',
                        codenameDisa: false,
                        shortnameDisa: false,
                        emailDisa: false,
                        phoneDisa: false,
                        accnoDisa: false,
                        accnameDisa: false,
                        bankDisa: false,
                        branchDisa: false,
                    });
                }

            } else {
                errorInfo(response.data.CONTENT);
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
        this.props.parent.setState({groupCode:e.target.value});

    }

    handleCodename = (e) => {
        this.setState({ codename: e.target.value});
    }

    handleShortname = (e) => {
        this.setState({ shortname: e.target.value});
    }

    handleEmail = (e) => {
        this.setState({ email: e.target.value});
    }

    handlePhone = (e) => {
        this.setState({ phone: e.target.value});
    }

    handleAccno = (e) => {
        this.setState({ accno: e.target.value});
    }

    handleAccname = (e) => {
        this.setState({ accname: e.target.value});
    }

    handleBankname = (e) => {
        this.setState({ bankname: e.target.value});
    }

    handleBranchname = (e) => {
        this.setState({ branchname: e.target.value});
    }

    render(){
        console.log("------OrgConfSpan----render---start-----------",this.state);
        return (
                <div className="gutter-example">
                    <Row>
                        <Col span={1} />
                        <Col span={10}>
                            <br />
                            <Row>
                                <Col span={8}>集团代码： </Col>
                                <Col span={16}><Input size="default" value={this.state.code} onChange={this.handleCode} onBlur={this.inputOnBlur} disabled={this.state.groupDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>集团名称： </Col>
                                <Col span={16}><Input size="default" value={this.state.codename} onChange={this.handleCodename} disabled={this.state.codenameDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>集团简称： </Col>
                                <Col span={16}><Input size="default" value={this.state.shortname} onChange={this.handleShortname} disabled={this.state.shortnameDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>邮箱： </Col>
                                <Col span={16}><Input size="default" value={this.state.email} onChange={this.handleEmail} disabled={this.state.emailDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>联系号码： </Col>
                                <Col span={16}><Input size="default" value={this.state.phone} onChange={this.handlePhone} disabled={this.state.phoneDisa} /></Col>
                            </Row>

                        </Col>
                        <Col span={3} />
                        <Col span={10}>
                            <br />
                            <Row>
                                <Col span={8}>收款账户： </Col>
                                <Col span={16}><Input size="default" value={this.state.accno} onChange={this.handleAccno} disabled={this.state.accnoDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收款账户名： </Col>
                                <Col span={16}><Input size="default" value={this.state.accname} onChange={this.handleAccname} disabled={this.state.accnameDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收款银行： </Col>
                                <Col span={16}><Input size="default" value={this.state.bankname} onChange={this.handleBankname} disabled={this.state.bankDisa} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>收款支行： </Col>
                                <Col span={16}><Input size="default" value={this.state.branchname} onChange={this.handleBranchname} disabled={this.state.branchDisa} /></Col>
                            </Row>


                        </Col>
                    </Row>
                </div>
        );
    };
}
export default OrgConfSpan;