import React from 'react';
import {selectUtils} from '../../../SelectUtils.jsx';
import { Modal,Button,Input,Row,Select,Col,Transfer } from 'antd';
import {successInfo,isPoneAvailable,sysErrorInfo,errorInfo,checkNull,initGroupCode,checkIsEmail,warningInfo } from '../../../Common.jsx';
import axios from 'axios';

class EditUser extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
    };

    componentWillMount() {
        console.log("------EditUser----componentWillMount---------------");
    }

    componentDidMount() {
        console.log("------EditUser----componentDidMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------EditUser----componentWillReceiveProps---------------",nextProps);
        if(nextProps.visiable){
            this.queryRoleByUserId(nextProps.record.userId, nextProps.record.orgType);
            var initGroupCodeList = initGroupCode(nextProps.record.orgType);
            console.log("------EditUser-----initGroupCodeList", initGroupCodeList);
         /*   var initCompCodeList = initCompCode(nextProps.record.orgType,
                nextProps.record.orgGroupCode);
            console.log("------EditUser-----initCompCodeList", initCompCodeList);
            var initSiteCodeList = initSiteCode(nextProps.record.orgType,
                nextProps.record.orgGroupCode,
                nextProps.record.orgCompCode,
                );
            console.log("------EditUser-----initSiteCodeList", initSiteCodeList);*/
            this.setState({
                visible:nextProps.visiable,
                parent:nextProps.parent,
                //初始化页面状态
                userId:nextProps.record.userId,
                urName: nextProps.record.userName,
                pwd: nextProps.record.password,
                nickName: nextProps.record.nickName,
                email: nextProps.record.email,
                phone: nextProps.record.phone,
                createId: nextProps.record.createId,
                orgType: nextProps.record.orgType,
                orgGroupSname: nextProps.record.orgGroupSname,
                orgCompSname: nextProps.record.orgCompSname,
                orgSiteSname: nextProps.record.orgSiteSname,
                orgGroupCode: nextProps.record.orgGroupCode,
                orgCompCode: nextProps.record.orgCompCode,
                orgSiteCode: nextProps.record.orgSiteCode,
                compFlag: nextProps.record.orgGroupCode ? false : true,
                siteFlag: (nextProps.record.orgGroupCode && nextProps.record.orgCompCode) ? false : true,
                status: nextProps.record.status,
                groupCodeList: initGroupCodeList,
                //compCodeList: initCompCodeList,
               // siteCodeList: initSiteCodeList,
            });
        }
    }

    queryRoleByUserId(userId, orgType){
        var thi = this;
        console.log("userId-----",userId);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/urmapapi/queryUrMapList',{
            "userId": userId,
        }).then(
            function (response) {
                console.log('200---11-',response)
                if(response.data.STATUS === "200"){
                    thi.setState({roleIdList:response.data.List});
                    thi.getMock(orgType);
                } else {
                    errorInfo("查询失败");
                }
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    }

    handleOk3 = () => {
        console.log("EditUser----submit----this.state--------------",this.state);
        if(checkNull(this.state.nickName,'用户中文名')){
            return;
        }
        if(!checkIsEmail(this.state.email)){
            warningInfo("请输入正确的邮箱");
            return;
        }
        if(isPoneAvailable(this.state.phone,'电话')){
            return ;
        }
        if(checkNull(this.state.orgType,'机构类型')){
            return ;
        }
        if(checkNull(this.state.orgGroupCode,'机构集团')){
            return ;
        }

        var thi = this;

        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/userapi/updateUserUrMap',{
            "userId": this.state.userId,
            "nickName": this.state.nickName,
            "email": this.state.email,
            "phone": this.state.phone,
            "status": this.state.status,
            "createId": this.state.createId,
            "modifyId": localStorage.getItem('userName'),
            "roleIdList": this.state.targetKeys,
            "orgGroupCode": this.state.orgGroupCode,
            "orgCompCode": this.state.orgCompCode,
            "orgSiteCode": this.state.orgSiteCode,
        }).then(
            function (response) {
                console.log('200--',response)
                if(response.data.STATUS === "200"){
                    successInfo("编辑成功");
                    thi.setState({ loading3: false, visible: false });
					thi.props.parent.setState({editUserVisible:false})
					thi.state.parent.state.parent.queryUserList();
				} else {
                    errorInfo("编辑失败")
				}
        }).catch(function (error) {
            sysErrorInfo(error);
        });
    };

    handleCancel3 = () => {
		this.props.parent.setState({editUserVisible:false})
        this.setState({ visible: false });
    };

    getMock = (value) => {
        const targetKeys = [];
        const mockData = [];
        var thi = this;
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/roleapi/query',
            {"status" : 'ACTIVE', "orgType": value}
            ).then(function (response) {
                console.log("response",response);
                if(response.data.STATUS==='200'){
                    var rList = response.data.List;
                    var urList = thi.state.roleIdList;
                    console.log("EditUser---rList",rList);
                    console.log("EditUser---urList",urList);
                    for (let i = 0; i < rList.length; i++) {
                        const rData = {
                            key: rList[i].roleId,
                            title: rList[i].roleName,
                        };
                        for(let j=0;j<urList.length;j++){
                            var chosen = rList[i].roleId===urList[j].roleId ? true : false ;
                            console.log("chosen",chosen);
                            if (chosen) {
                                targetKeys.push(rData.key);
                            }
                        }
                        mockData.push(rData);
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
       // this.initCompCodeOption(this.state.orgType,value);
    }

  /*  initCompCodeOption(orgType,orgGroup) {
        //var compCodeList = initCompCode(orgType,orgGroup);
        this.setState({
            compCodeList: compCodeList,
            compFlag: orgType === "BUSI" ? false : true,
            siteFlag: true,
        });
    }*/

    handleOrgCompCode = (value) => {
        this.setState({
            orgCompCode: value,
            orgSiCode: undefined,
        });
       // this.initSiteCodeOption(this.state.orgType,this.state.orgGroupCode,value);
    }

  /*  initSiteCodeOption(orgType,orgGroup,orgComp) {
        console.log("initBusiSiteCodeOption",this.state);
        var siteCodeList = initSiteCode(orgType,orgGroup,orgComp);
        this.setState({
            siteCodeList: siteCodeList,
            siteFlag: orgType === "BUSI" ? false : true,
        });
    }*/

    handleOrgSiteCode = (value) => {
        this.setState({
            orgSiteCode: value,
         });
    }

    render() {
        return (
            <div className="gutter-example">
                <Modal
                width="730px"
                visible={this.state.visible}
                title="编辑用户"
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
                                    <Input style={{ width: '200px' }} size="default" value={this.state.pwd} onChange={this.handlePassword} type="password" disabled />
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
                                    <Select style={{ width: '200px' }} onChange={this.handleOrgType} value={this.state.orgType} disabled>
                                        {selectUtils('serviceOrgType')}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col span={8}>机构集团： </Col>
                                <Col span={16}>
                                    <Select style={{ width: '200px' }} onChange={this.handleOrgGroupCode} value={this.state.orgGroupCode} disabled>
                                    {this.state.groupCodeList}
                                    </Select>
                                </Col>
                            </Row>
                            <br />
                        </Col>
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

export default EditUser;