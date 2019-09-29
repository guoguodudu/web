import React from 'react';
import { Modal, Button, Tabs, Select,Row, Col, Input } from 'antd';
import OrgConfSpan from './OrgConfSpan.jsx';
import OrgConfSpanComp from './OrgConfSpanComp.jsx';
import OrgConfSpanSite from './OrgConfSpanSite.jsx';
import {selectUtils} from '../../../SelectUtils.jsx';
import axios from 'axios';
import { checkEmpty, checkNull, checkIsEmail, isRealNum, successInfo, warningInfo, sysErrorInfo,errorInfo} from '../../../Common.jsx';

//不用做下拉框选择集团公司等信息，用复制代替

const TabPane = Tabs.TabPane;
class AddOrgConfRule extends React.Component {

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
        // visibleComp: 'none',
        // visibleSite: 'none'
    };

    componentWillMount() {
        console.log("------AddOrgConfRule---componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------AddOrgConfRule----componentWillReceiveProps---------------",nextProps);
        console.log("------AddOrgConfRule----componentWillReceiveProps---------------",this.state);
        //初始化界面：
        //初始化【集团信息】【公司信息】【网点信息】界面：
        if(nextProps.visiable){

            if(this.state.panes.length === 3){
                this.remove2_3();
            }else if(this.state.panes.length === 2){
                this.remove('2');
            }

            this.setState({
                parent:nextProps.parent,
                visible:nextProps.visiable,
                orgType: '请选择',
                // effectiveDatetime: null,
                // expireDatetime: null,
                remarks: undefined,
            });


            // reset Group
            if(this.group !== undefined){
                this.group.setState({
                        code: undefined,
                        codename: undefined,
                        shortname: undefined,
                        email: undefined,
                        phone: undefined,
                        accno: undefined,
                        accname: undefined,
                        bankname: undefined,
                        branchname: undefined,
                });
            }


        }
    }

    OnRefGroup = (ref) => {
        this.group = ref;
    }

    OnRefComp = (ref) => {
        this.comp = ref;
    }

    OnRefSite = (ref) => {
        this.site = ref;
    }

    onTabClick = () => {
        console.log('onTabClick--------this.group--',this.group);
    }

    OnRefOrgConf = (ref) => {
        this.addOrgConfRule = ref;
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
        if(checkNull(this.group.state.code,'集团信息')){
            return;
        }

        if(checkNull(this.group.state.codename,'集团名称')){
            return;
        }

        if(checkNull(this.group.state.shortname,'集团简称')){
            return;
        }

        if(!checkIsEmail(this.group.state.email)){
            warningInfo("【集团_邮箱】需为邮箱格式！");
            return;
        }

        if(checkNull(this.group.state.phone,'集团_联系电话')){
            return;
        }

        if(!isRealNum(this.group.state.accno,'集团_收款账户')){
            warningInfo("【集团_收款账户】需为数字！");
            return;
        }

        if(checkNull(this.group.state.accname,'集团_收款账户名')){
            return;
        }

        if(checkNull(this.group.state.bankname,'集团_收款银行')){
            return;
        }

        if(checkNull(this.group.state.branchname,'集团_收款支行')){
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
            console.log('count_comp------',count_comp);
        }
        if(count_site > 0 && count_site < 9){
            warningInfo("【网点信息】只能全填，或者全不填！");
            return;
        }



        var orgGroupProfile = {
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
                // "effectiveDatetime": thi.state.effectiveDatetimeStr,
                // "expireDatetime": thi.state.expireDatetimeStr,
                "remarks": thi.state.remarks,
                "orgGroupProfile": orgGroupProfile,
                "status": "DRAFT"
            }
        }else if(this.state.panes.length === 2){
            data = {
                "orgType": orgType === "请选择" ? undefined : orgType,
                // "effectiveDatetime": thi.state.effectiveDatetimeStr,
                // "expireDatetime": thi.state.expireDatetimeStr,
                "remarks": thi.state.remarks,
                "orgGroupProfile": orgGroupProfile,
                "orgCompProfile": orgCompProfile,
                "status": "DRAFT"
            }
        }else if(this.state.panes.length === 3){
            data = {
                "orgType": orgType === "请选择" ? undefined : orgType,
                // "effectiveDatetime": thi.state.effectiveDatetimeStr,
                // "expireDatetime": thi.state.expireDatetimeStr,
                "remarks": thi.state.remarks,
                "orgGroupProfile": orgGroupProfile,
                "orgCompProfile": orgCompProfile,
                "orgSiteProfile": orgSiteProfile,
                "status": "DRAFT"
            }
        }

        axios.post(localStorage.getItem('IP_PORT_BACKEND')+'/confapi/addOrgConf',
            data
        ).then(function (response) {
            console.log('response-2',response)
            if(response.data.STATUS === '200'){

                successInfo("机构信息新增成功");
				thi.setState({ visible: false });
				thi.props.parent.setState({addOrgConfRuleVisiable:false})
                thi.state.parent.state.parent.handleFilterSubmit();
            } else if(response.data.STATUS === '201'){
                errorInfo(response.data.CONTENT);
                thi.setState({ visible: false });
                thi.state.parent.state.parent.handleFilterSubmit();
            } else {
                sysErrorInfo();
                console.log("response.data.CONTENT",response.data.CONTENT);
            }
        }).catch(function (error) {
            sysErrorInfo(error);
        });


    };

    handleCancel = () => {
        this.setState({ visible: false });
		this.props.parent.setState({addOrgConfRuleVisiable:false})
    };

    onChange = (activeKey) => {
        console.log("onchange===========activeKey========",activeKey)
        this.setState({ activeKey });
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    add = () => {
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
    }

    remove2_3() {
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
    }

    handleOrgType = (value) => {
        console.log("=====OrgType=====",value) //FUNDER

        if(value === 'FUNDER'){
            this.remove('2');
            this.remove2_3();
            this.setState({
                visibleAdd: 'none',
            });


        }else{
            console.log("=========value===",value)
            this.setState({
                visibleAdd: '',
            });
        }

        this.setState({orgType: value});
        this.group.setState({
            code: undefined,
            codename: undefined,
            shortname: undefined,
            email: undefined,
            phone: undefined,
            accno: undefined,
            accname: undefined,
            bankname: undefined,
            branchname: undefined,
        });
    }

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
        title="新增机构信息"
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
                                <Select style={{ width: '200px' }} onChange={this.handleOrgType} value={this.state.orgType} >
                                    {selectUtils('orgType')}
                                </Select>
                            </Col>
                        </Row>
                        {/* <br />
                        <Row> <Col span={8}>生效时间： </Col><Col span={16}><DatePicker style={{width:'200px'}} onChange={this.handleEffectiveDatetime} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row>
                        <br />
                        <Row> <Col span={8}>失效时间： </Col><Col span={16}><DatePicker style={{width:'200px'}} onChange={this.handleExpireDatetime} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormat)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row> */}

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
              {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key} closable={pane.closable} >{pane.content}</TabPane>)}
            </Tabs>
        </Modal>
        </div>
        );
    }
}
export default AddOrgConfRule;