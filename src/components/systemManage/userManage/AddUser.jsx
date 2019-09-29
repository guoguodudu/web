import React from 'react';
import { Modal,Button,Input,Row,Col,Transfer,Select,message } from 'antd';
import {successInfo,sysErrorInfo,errorInfo,checkPwd,ContentErrorInfo,initGroupCode,initCompCode,initSiteCode,checkIsEmail,warningInfo,checkNull } from '../../../Common.jsx';
import {selectUtils} from '../../../SelectUtils.jsx';

// import moment from 'moment';
import axios from 'axios';

class AddUser extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
    };

    componentWillMount() {
        console.log("------AddUser----componentWillMount---------------");
    }

    componentDidMount() {
        console.log("------AddUser----componentDidMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------AddUser----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.setState({
                visible:nextProps.visiable,
                parent:nextProps.parent,
                //初始化页面状态
                urName: undefined,
                pwd: undefined,
                nickName: undefined,
                email: undefined,
                phone: undefined,
                status: undefined,
                orgType: undefined,
                orgGroupCode: undefined,
                orgCompCode: undefined,
                orgSiteCode: undefined,
                groupFlag: true,
                siteFlag: true,
                compFlag: true,
            });
        }
    }

    handleOk3 = () => {
        console.log("AddUser----submit----this.state--------------",this.state);
        if(checkNull(this.state.urName,'用户名')){
            return ;
        }
        //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
		if(checkPwd(this.state.pwd)){
			return ;
		}
        if(checkNull(this.state.nickName,'用户中文名')){
            return ;
        }
        if(!checkIsEmail(this.state.email)){
            warningInfo("请输入正确的邮箱");
            return;
        }
        if(checkNull(this.state.phone,'电话')){
            return ;
        }
        if(checkNull(this.state.orgType,'机构类型')){
            return ;
        }
        if(checkNull(this.state.orgGroupCode,'机构集团')){
            return ;
        }
		var thi = this;
		const hide = message.loading('请稍等', 0);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/userapi/add',{
            "userName": this.state.urName,
            "password": this.state.pwd,
            "nickName": this.state.nickName,
            "email": this.state.email,
            "phone": this.state.phone,
            "status": "ACTIVE",
            "createId": localStorage.getItem('userName'),
            "roleIdList": this.state.targetKeys,
            "orgType": this.state.orgType,
            "orgGroupCode": this.state.orgGroupCode,
            "orgCompCode": this.state.orgCompCode,
            "orgSiteCode": this.state.orgSiteCode,
        }).then(
            function (response) {
                console.log('200--',response)
                if(response.data.STATUS === "200"){
                    successInfo("新增成功");
					thi.setState({ loading3: false, visible: false });
					thi.props.parent.setState({addUserVisible:false})
                    thi.state.parent.state.parent.queryUserList();
				} else if(response.data.STATUS === '201'){
					ContentErrorInfo(response.data.CONTENT);
				} else {
                    errorInfo("新增失败")
				}
        }).catch(function (error) {
            sysErrorInfo(error);
        }).finally(()=>{
			hide()
		});
    };

    handleCancel3 = () => {
		this.setState({ visible: false });
		this.props.parent.setState({addUserVisible:false})		
    };

    getMock = (value) => {
        const targetKeys = [];
        const mockData = [];
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/roleapi/query',
            {"status" : 'ACTIVE',"orgType" : value}
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
                    var rList = response.data.List;
                    console.log("AddUser---pageList",rList);
                    console.log("AddUser---List",response.data.List);
                    for (let i = 0; i < rList.length; i++) {
                    const pData = {
                        key: rList[i].roleId,
                        title: rList[i].roleName,
                    };
                    mockData.push(pData);
                    }
                    thi.setState({ mockData, targetKeys });
                } else {
                    errorInfo("角色信息查询失败")
                }
            }).catch(function (error) {
                sysErrorInfo(error)
            });
    }


    filterOption = (inputValue, option) => option.title.indexOf(inputValue) > -1

    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };
    handleUserName = (e) => {
        this.setState({ urName: e.target.value });
    }
    handlePassword = (e) => {
        this.setState({ pwd: e.target.value });
    }
    handleNickName = (e) => {
        this.setState({ nickName: e.target.value });
    }
    handleEmail = (e) => {
        this.setState({ email: e.target.value });
    }
    handlePhone = (e) => {
        this.setState({ phone: e.target.value });
    }

    handleOrgType = (value) => {
        this.setState({
            orgType: value,
            orgGroupCode: undefined,
            orgCompCode: undefined,
            orgSiteCode: undefined,
        });
        // eslint-disable-next-line
        this.initGroupCodeOption(value);
        this.getMock(value);
    }

    initGroupCodeOption(orgType) {
        var groupCodeList = initGroupCode(orgType);
        console.log("groupCodeList",groupCodeList);
        this.setState({
            groupCodeList: groupCodeList,
            groupFlag: false,
            compFlag: true,
            siteFlag: true,
        });
        console.log("groupCodeList",groupCodeList);
    }

    handleOrgGroupCode = (value) => {
        console.log("value===="+value);
        this.setState({
            orgGroupCode: value,
            orgCompCode: undefined,
            orgSiteCode: undefined,
        });
        //this.initCompCodeOption(this.state.orgType,value);
    }

    initCompCodeOption(orgType,orgGroup) {
        var compCodeList = initCompCode(orgType, orgGroup);
        this.setState({
            compCodeList: compCodeList,
            compFlag: orgType === "BUSI" ? false : true,
            siteFlag: true,
        });

    }

    handleOrgCompCode = (value) => {
        this.setState({
            orgCompCode: value,
            orgSiteCode: undefined,
        });
        this.initSiteCodeOption(this.state.orgType,this.state.orgGroupCode,value);
    }

    initSiteCodeOption(orgType,orgGroup,orgComp) {
        console.log("initBusiSiteCodeOption",this.state);
        var siteCodeList = initSiteCode(orgType,orgGroup,orgComp);
        this.setState({
            siteCodeList: siteCodeList,
            siteFlag: orgType === "BUSI" ? false : true,
        });

    }
    handleOrgSiteCode = (value) => {
        this.setState({
            orgSiteCode: value,
         });
    }

    render() {
        console.log("render adduser");
        console.log("this.state.groupFlag is: ", this.state.groupFlag);
        return (
            <div className="gutter-example">
                <Modal
                width="730px"
                visible={this.state.visible}
                title="新增用户"
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
                        <Col span={11}>
                            <Row>
                                <Col span={8}>用户名： </Col>
                                <Col span={16}><Input style={{ width: '200px' }} size="default" value={this.state.urName} onChange={this.handleUserName} /></Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>密码 ：</Col>
                                <Col span={16}>
                                    <Input style={{ width: '200px' }} size="default" value={this.state.pwd} onChange={this.handlePassword} type="password" />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>用户中文名： </Col>
                                <Col span={16}>
                                <Input style={{ width: '200px' }} size="default" value={this.state.nickName} onChange={this.handleNickName} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>邮箱： </Col>
                                <Col span={16}>
                                    <Input style={{ width: '200px' }} size="default" value={this.state.email} onChange={this.handleEmail} />
                                </Col>
                            </Row>
                            <br />

						</Col>
                        <Col span={2} />
                        <Col span={11}>
                            <Row>
                                <Col span={8}>电话： </Col>
                                <Col span={16}>
                                    <Input style={{ width: '200px' }} size="default" value={this.state.phone} onChange={this.handlePhone} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>机构类型： </Col>
                                <Col span={16}>
                                    <Select style={{ width: '200px' }} onChange={this.handleOrgType} value={this.state.orgType} >
                                        {selectUtils('serviceOrgType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>机构集团： </Col>
                                <Col span={16}>
                                    <Select style={{ width: '200px' }} onChange={this.handleOrgGroupCode} value={this.state.orgGroupCode} disabled={this.state.groupFlag}>
                                    {this.state.groupCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                        </Col>
                        <Col span={2} />
                    </Row>
                    <hr />
                    <br />
                    <Row>
                    <Col span={1} />
                    <Col span={23}>
                        <Transfer
                            listStyle={{
                                width: 290,
                                height: 290,
                            }}
                            titles={['未选择角色','已选择角色']}
                            dataSource={this.state.mockData}
                            showSearch
                            filterOption={this.filterOption}
                            targetKeys={this.state.targetKeys}
                            onChange={this.handleChange}
                            onSearch={this.handleSearch}
                            render={item => item.title}
                        />
                    </Col>

                    </Row>
                </Modal>
            </div>
        );
    }
}

export default AddUser;