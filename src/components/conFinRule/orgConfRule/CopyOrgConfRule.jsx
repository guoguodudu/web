import React from 'react';
import { Modal, Button, Tabs, Select,Row, Col, Input } from 'antd';
import OrgConfSpan from './OrgConfSpan.jsx';
import OrgConfSpanComp from './OrgConfSpanComp.jsx';
import OrgConfSpanSite from './OrgConfSpanSite.jsx';
import {selectUtils} from '../../../SelectUtils.jsx';
import {checkEmpty, checkNull, isRealNum, checkIsEmail, successInfo, warningInfo, sysErrorInfo} from '../../../Common.jsx';

import axios from 'axios';


//不用做下拉框选择集团公司等信息，用复制代替

const TabPane = Tabs.TabPane;
class CopyOrgConfRule extends React.Component {

    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
          { title: '集团信息', content: <OrgConfSpan onRef={this.OnRefGroup} parent={this} key={'1'} />, key: '1'},
        ];
        // eslint-disable-next-line
        this.state = {
          activeKey: panes[0].key,
          panes,
          visibleAdd: '',
          titleAdd: '新增公司信息'
        };
    }

    state = {
        visible: false,
    };

    componentWillMount() {
        console.log("------CopyOrgConfRule---componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------CopyOrgConfRule----componentWillReceiveProps--------nextProps-------",nextProps);
        console.log("------CopyOrgConfRule----componentWillReceiveProps--------this-------",this);
        // 1:初始化界面：
        // 2:初始化【集团信息】【公司信息】【网点信息】界面：

        if(nextProps.visiable){

            //恢复到初始化状态
            if(this.state.panes.length === 3){
                this.remove2_3();
            }else if(this.state.panes.length === 2){
                this.remove('2');
            }
            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,
                record: nextProps.record,
                orgType: nextProps.record.orgType,
                remarks: nextProps.record.remarks,
                groupCode:nextProps.record.orgGroupCode,
                compCode:nextProps.record.orgCompCode,
            });

            if(nextProps.record.orgType === 'FUNDER'){
                console.log("=== FUNDER dispaly状态：",this.state.visibleAdd)
                this.setState({
                    visibleAdd: 'none',
                });
            }else{
                console.log("=== BUSI dispaly状态：",this.state.visibleAdd)
                this.setState({
                    visibleAdd: '',
                });
            }

            // reset Group
            if(nextProps.record.orgGroupProfile !== undefined){//给集团信息赋值

                if(this.group !== undefined){
                    var obj_group = JSON.parse(nextProps.record.orgGroupProfile);
                    this.group.setState({
                        code: obj_group['code'],
                        codename: obj_group['codename'],
                        shortname: obj_group['shortname'],
                        email: obj_group['email'],
                        phone: obj_group['phone'],
                        accno: obj_group['accno'],
                        accname: obj_group['accname'],
                        bankname: obj_group['bankname'],
                        branchname: obj_group['branchname'],
                        codenameDisa: true,
                        shortnameDisa: true,
                        emailDisa: true,
                        phoneDisa: true,
                        accnoDisa: true,
                        accnameDisa: true,
                        bankDisa: true,
                        branchDisa: true,
                    });
                }
            }

            if(nextProps.record.orgCompProfile !== undefined){//给公司信息赋值
                this.add();
                if(this.comp !== undefined){
                    var obj_comp = JSON.parse(nextProps.record.orgCompProfile);
                    this.comp.setState({
                        code: obj_comp['code'],
                        codename: obj_comp['codename'],
                        shortname: obj_comp['shortname'],
                        email: obj_comp['email'],
                        phone: obj_comp['phone'],
                        accno: obj_comp['accno'],
                        accname: obj_comp['accname'],
                        bankname: obj_comp['bankname'],
                        branchname: obj_comp['branchname'],
                        codenameDisa: true,
                        shortnameDisa: true,
                        emailDisa: true,
                        phoneDisa: true,
                        accnoDisa: true,
                        accnameDisa: true,
                        bankDisa: true,
                        branchDisa: true,
                    });
                }
            }

            if(nextProps.record.orgSiteProfile !== undefined){//给网点信息赋值
                this.add();
                if(this.site !== undefined){
                    var obj_site = JSON.parse(nextProps.record.orgSiteProfile);
                    if(this.site.mounted){
                        this.site.setState({
                            code: obj_site['code'],
                            codename: obj_site['codename'],
                            shortname: obj_site['shortname'],
                            email: obj_site['email'],
                            phone: obj_site['phone'],
                            accno: obj_site['accno'],
                            accname: obj_site['accname'],
                            bankname: obj_site['bankname'],
                            branchname: obj_site['branchname'],
                            codenameDisa: true,
                            shortnameDisa: true,
                            emailDisa: true,
                            phoneDisa: true,
                            accnoDisa: true,
                            accnameDisa: true,
                            bankDisa: true,
                            branchDisa: true,
                        });
                    }
                }
            }

        }
    }

    OnRefGroup = (ref) => {
        this.group = ref;
        console.log("---137--------- this ---",this);
        var obj_group = JSON.parse(this.state.record.orgGroupProfile);
        this.group.setState({
            code: obj_group['code'],
            codename: obj_group['codename'],
            shortname: obj_group['shortname'],
            email: obj_group['email'],
            phone: obj_group['phone'],
            accno: obj_group['accno'],
            accname: obj_group['accname'],
            bankname: obj_group['bankname'],
            branchname: obj_group['branchname'],
            codenameDisa: true,
            shortnameDisa: true,
            emailDisa: true,
            phoneDisa: true,
            accnoDisa: true,
            accnameDisa: true,
            bankDisa: true,
            branchDisa: true,

        });
    }

    OnRefComp = (ref) => {
        this.comp = ref;

        if(this.state.record.orgCompProfile !== undefined){
            var obj_comp = JSON.parse(this.state.record.orgCompProfile);
            this.comp.setState({
                code: obj_comp['code'],
                codename: obj_comp['codename'],
                shortname: obj_comp['shortname'],
                email: obj_comp['email'],
                phone: obj_comp['phone'],
                accno: obj_comp['accno'],
                accname: obj_comp['accname'],
                bankname: obj_comp['bankname'],
                branchname: obj_comp['branchname'],
                codenameDisa: true,
                shortnameDisa: true,
                emailDisa: true,
                phoneDisa: true,
                accnoDisa: true,
                accnameDisa: true,
                bankDisa: true,
                branchDisa: true,
            });
        }

    }

    OnRefSite = (ref) => {
        this.site = ref;

        if(this.state.record.orgSiteProfile !== undefined){
            var obj_site = JSON.parse(this.state.record.orgSiteProfile);
            this.site.setState({
                code: obj_site['code'],
                codename: obj_site['codename'],
                shortname: obj_site['shortname'],
                email: obj_site['email'],
                phone: obj_site['phone'],
                accno: obj_site['accno'],
                accname: obj_site['accname'],
                bankname: obj_site['bankname'],
                branchname: obj_site['branchname'],
                codenameDisa: true,
                shortnameDisa: true,
                emailDisa: true,
                phoneDisa: true,
                accnoDisa: true,
                accnameDisa: true,
                bankDisa: true,
                branchDisa: true,
            });
        }

    }

    onTabClick = () => {
        console.log('onTabClick--------this.group--',this.group);
    }

    handleOk = () => {
        console.log('submit-------this.state--',this.state);
        console.log('submit-------this.group--',this.group);
        console.log('submit-------this.comp--',this.comp);
        console.log('submit-------this.site--',this.site);


        if(checkNull(this.state.orgType,'机构类型')){
            return;
        }

        if(checkNull(this.state.remarks,'机构说明')){
            return;
        }
        // check 集团信息
        var count_group = 0; //统计【公司信息】未填项的个数
        if(this.group !== undefined && this.group.state !== undefined){
            //此种情况属于弹出了编辑页面，但是没有去到过【集团信息】的Tab下面查看内容
            if(checkNull(this.group.state.code,'集团信息')){
                count_group += 1;
            }

            if(checkNull(this.group.state.codename,'集团名称')){
                count_group += 1;
            }

            if(checkNull(this.group.state.shortname,'集团简称')){
                count_group += 1;
            }

            if(checkNull(this.group.state.email,'集团_邮箱')){
                count_group += 1;
            }
            if(!checkIsEmail(this.group.state.email)){
                warningInfo("【集团_邮箱】需为邮箱格式！");
                return;
            }

            if(checkNull(this.group.state.phone,'集团_联系电话')){
                count_group += 1;
            }
            if(checkNull(this.group.state.accno,'集团_收款账户')){
                count_group += 1;
            }
            if(!isRealNum(this.group.state.accno,'集团_收款账户')){
                warningInfo("【集团_收款账户】需为数字！");
                return;
            }

            if(checkNull(this.group.state.accname,'集团_收款账户名')){
                count_group += 1;
            }

            if(checkNull(this.group.state.bankname,'集团_收款银行')){
                count_group += 1;
            }

            if(checkNull(this.group.state.branchname,'集团_收款支行')){
                count_group += 1;
            }
        }
        if(count_group > 0){//未填个数大于0个
            warningInfo("【集团信息】必须全填！");
            return;
        }

        // check 公司信息
        var count_comp = 0; //统计【公司信息】未填项的个数
        if(this.comp !== undefined && this.comp.state !== undefined && this.state.panes.length > 1){

            if(checkEmpty(this.comp.state.code)){
                count_comp += 1;
            }
            if(checkEmpty(this.comp.state.codename)){
                count_comp += 1;
            }
            if(checkEmpty(this.comp.state.shortname)){
                count_comp += 1;
            }
            if(checkEmpty(this.comp.state.email)){
                count_comp += 1;
            }
            if(!checkIsEmail(this.comp.state.email)){
                warningInfo("【公司_邮箱】需为邮箱格式！");
                return;
            }
            if(checkEmpty(this.comp.state.phone)){
                count_comp += 1;
            }
            if(checkEmpty(this.comp.state.accno)){
                count_comp += 1;
            }
            if(!isRealNum(this.comp.state.accno)){
                warningInfo("【公司_收款账户】需为数字！");
                return;
            }
            if(checkEmpty(this.comp.state.accname)){
                count_comp += 1;
            }
            if(checkEmpty(this.comp.state.bankname)){
                count_comp += 1;
            }
            if(checkEmpty(this.comp.state.branchname)){
                count_comp += 1;
            }
            console.log('count_comp------',count_comp);
        }
        if(count_comp > 0 && count_comp < 9){
            warningInfo("【公司信息】只能全填，或者全不填！");
            return;
        }

        // check 网点信息
        var count_site = 0; //统计【网点信息】未填项的个数
        if(this.site !== undefined && this.site.state !== undefined && this.state.panes.length > 2){

            if(checkEmpty(this.site.state.code)){
                count_site += 1;
            }
            if(checkEmpty(this.site.state.codename)){
                count_site += 1;
            }
            if(checkEmpty(this.site.state.shortname)){
                count_site += 1;
            }
            if(checkEmpty(this.site.state.email)){
                count_site += 1;
            }
            if(!checkIsEmail(this.site.state.email)){
                warningInfo("【网点_邮箱】需为邮箱格式！");
                return;
            }
            if(checkEmpty(this.site.state.phone)){
                count_site += 1;
            }
            if(checkEmpty(this.site.state.accno)){
                count_site += 1;
            }
            if(!isRealNum(this.site.state.accno)){
                warningInfo("【网点_收款账户】需为数字！");
                return;
            }
            if(checkEmpty(this.site.state.accname)){
                count_site += 1;
            }
            if(checkEmpty(this.site.state.bankname)){
                count_site += 1;
            }
            if(checkEmpty(this.site.state.branchname)){
                count_site += 1;
            }
            console.log('count_site------',count_comp);
        }
        if(count_site > 0 && count_site < 9){
            warningInfo("【网点信息】只能全填，或者全不填！");
            return;
        }

        var orgGroupProfile = undefined;
        if(this.group !== undefined && this.group.state !== undefined && count_group === 0){//未填的个数等于0
            orgGroupProfile = {
                code : this.group.state.code,
                codename: this.group.state.codename,
                shortname: this.group.state.shortname,
                email: this.group.state.email,
                phone: this.group.state.phone,
                accno: this.group.state.accno,
                accname: this.group.state.accname,
                bankname: this.group.state.bankname,
                branchname: this.group.state.branchname,
            }
        }

        var orgCompProfile = undefined;
        if(this.comp !== undefined && this.comp.state !== undefined && count_comp === 0 && this.state.panes.length > 1){//未填的个数等于0
            orgCompProfile = {
                code : this.comp.state.code,
                codename: this.comp.state.codename,
                shortname: this.comp.state.shortname,
                email: this.comp.state.email,
                phone: this.comp.state.phone,
                accno: this.comp.state.accno,
                accname: this.comp.state.accname,
                bankname: this.comp.state.bankname,
                branchname: this.comp.state.branchname,
            }
        }

        var orgSiteProfile = undefined;
        if(this.site !== undefined && this.site.state !== undefined && count_site === 0 && this.state.panes.length > 2){//未填的个数等于0
            orgSiteProfile = {
                code : this.site.state.code,
                codename: this.site.state.codename,
                shortname: this.site.state.shortname,
                email: this.site.state.email,
                phone: this.site.state.phone,
                accno: this.site.state.accno,
                accname: this.site.state.accname,
                bankname: this.site.state.bankname,
                branchname: this.site.state.branchname,
            }
        }

        var orgType = this.state.orgType
        var thi = this;
        var data = undefined;
        if(this.state.panes.length === 1){
            data = {
                "orgType": orgType === "请选择" ? undefined : orgType,
                "remarks": thi.state.remarks,
                "orgGroupProfile": orgGroupProfile,
                "status": "DRAFT"
            }
        }else if(this.state.panes.length === 2){
            if(orgGroupProfile === undefined){//未进入集团界面
                orgGroupProfile = JSON.parse(this.state.record.orgGroupProfile);
            }
            data = {
                "orgType": orgType === "请选择" ? undefined : orgType,
                "remarks": thi.state.remarks,
                "orgGroupProfile": orgGroupProfile,
                "orgCompProfile": orgCompProfile,
                "status": "DRAFT"
            }
        }else if(this.state.panes.length === 3){
            if(orgGroupProfile === undefined){//未进入集团界面
                orgGroupProfile = JSON.parse(this.state.record.orgGroupProfile);
            }
            if(orgCompProfile === undefined){//未进入公司界面
                orgCompProfile = JSON.parse(this.state.record.orgCompProfile);
            }
            data = {
                "orgType": orgType === "请选择" ? undefined : orgType,
                "remarks": thi.state.remarks,
                "orgGroupProfile": orgGroupProfile,
                "orgCompProfile": orgCompProfile,
                "orgSiteProfile": orgSiteProfile,
                "status": "DRAFT"
            }
        }
        console.log('-------423----',this.state);
        console.log('-------423----',data);
        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/addOrgConf',
            data
        ).then(function (response) {
            if(response.data.STATUS === '200'){
                console.log('response-2',response);
                successInfo("机构信息复制成功");
				thi.setState({ visible: false });
				thi.props.parent.setState({copyOrgConfRuleVisiable:false})
				thi.state.parent.state.parent.handleFilterSubmit();				
            }else{
                sysErrorInfo();
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });


    };

    handleCancel = () => {
		this.setState({ visible: false });
		this.props.parent.setState({copyOrgConfRuleVisiable:false})
    };

    onChange = (activeKey) => {
        this.setState({ activeKey });
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    add = () => {
        console.log('add-------------',this.state);
        const panes = this.state.panes;
        const activeKey = '' + (this.state.panes.length + 1);
        var curtitle = '';
        var visibleAddCur;
        var titleAddCur;
        if(activeKey === '2'){
            curtitle = '公司信息';//显示当前tab显示的标题
            visibleAddCur = ''//显示新增网点信息的按钮
            titleAddCur = '新增网点信息'//显示新增网点信息的按钮标题
            panes.push({ title: curtitle, content: <OrgConfSpanComp key={activeKey} onRef={this.OnRefComp} parent={this} />, key: activeKey, closable:true});

        }
        if(activeKey === '3'){
            curtitle = '网点信息';//显示当前tab显示的标题
            visibleAddCur = 'none'//不显示新增按钮
            panes.push({ title: curtitle, content: <OrgConfSpanSite key={activeKey} onRef={this.OnRefSite} parent={this} />, key: activeKey, closable:true});

        }
       this.setState({
            panes,
            activeKey,
            visibleAdd: visibleAddCur,
            titleAdd: titleAddCur
        });
    }

    remove = (targetKey) => {
        console.log('remove-------------',this.state);
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key;
          } else {
            activeKey = panes[0].key;
          }
        }

        var visibleAddCur;
        var titleAddCur;
        if(panes.length === 1){
            visibleAddCur = '';
            titleAddCur = '新增公司信息';
        }else if(panes.length === 2){
            visibleAddCur = '';
            titleAddCur = '新增网点信息';
        }

        this.setState({
            panes,
            activeKey,
            visibleAdd: visibleAddCur,
            titleAdd: titleAddCur
        });
        // eslint-disable-next-line
        this.state.panes = panes;
        // eslint-disable-next-line
        this.state.activeKey = activeKey;
        // eslint-disable-next-line
        this.state.visibleAdd = visibleAddCur;
        // eslint-disable-next-line
        this.state.titleAdd = titleAddCur;
    }

    remove2_3() {
        console.log('remove------------2_3-',this.state);
        let activeKey = '1'

        const panes = this.state.panes.filter(pane => pane.key === '1');//只留key==='1'的

        console.log('2--3---',panes)

        var visibleAddCur = ''; //显示新增按钮
        var titleAddCur = '新增公司信息'; //新增按钮title

        this.setState({
            panes,
            activeKey,
            visibleAdd: visibleAddCur,
            titleAdd: titleAddCur
        });
        // eslint-disable-next-line
        this.state.panes = panes;
        // eslint-disable-next-line
        this.state.activeKey = activeKey;
        // eslint-disable-next-line
        this.state.visibleAdd = visibleAddCur;
        // eslint-disable-next-line
        this.state.titleAdd = titleAddCur;
    }

    handleOrgType = (value) => {
        this.setState({orgType: value});
    }

    // handleEffectiveDatetime = (value, dateString) => {
    //     this.setState({ effectiveDatetime : value ,effectiveDatetimeStr: dateString});
    // }

    // handleExpireDatetime = (value, dateString) => {
    //     this.setState({ expireDatetime: value ,expireDatetimeStr: dateString});
    // }

    handleRemarks = (e) => {
        this.setState({ remarks: e.target.value});
    }

    render() {

        var count = 0;
        this.state.panes.forEach( (item) => {
            count += 1;
            if(count !== 1 && count === this.state.panes.length){
                item['closable'] = true;//非第一个并且是最后一个的话，允许删除
            }else{
                item['closable'] = false;
            }

            console.log('item-----------',item)
        });

        return (
        <div className="gutter-example">
        <Modal
        width="730px"
        visible={this.state.visible}
        title="复制机构信息"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                提交
            </Button>,
        ]}
        >

            <Row>
                <Col span={11}>
                        <Row>
                            <Col span={8}>机构类型： </Col>
                            <Col span={16}>
                                <Select style={{ width: '200px' }} onChange={this.handleOrgType} value={this.state.orgType} disabled>
                                    {selectUtils('orgType')}
                                </Select>
                            </Col>
                        </Row>

                </Col>
                <Col span={2} />
                <Col span={11}>
                        <Row> <Col span={6}>机构说明：
                        </Col><Col span={18}><Input type="textarea" onChange={this.handleRemarks} value={this.state.remarks} rows="6" size="large" /></Col></Row>
                </Col>
            </Row>
            <br />
            <hr />
            <br />
            <div style={{ marginBottom: 16 }}>
              <Button onClick={this.add} style={{display: this.state.visibleAdd}} >{this.state.titleAdd}</Button>
            </div>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.state.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
              onTabClick={this.onTabClick}
            >
              {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>{pane.content}</TabPane>)}
            </Tabs>
        </Modal>
        </div>
        );
    }
}
export default CopyOrgConfRule;