import React from 'react';
import { Modal, Button, Tabs, Select,Row, Col, Input } from 'antd';
import OrgConfSpan from './OrgConfSpan.jsx';
import OrgConfSpanComp from './OrgConfSpanComp.jsx';
import OrgConfSpanSite from './OrgConfSpanSite.jsx';
import {selectUtils} from '../../../SelectUtils.jsx';


//不用做下拉框选择集团公司等信息，用复制代替

const TabPane = Tabs.TabPane;
class ReadOrgConfRule extends React.Component {

    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
          { title: '集团信息', content: <OrgConfSpan onRef={this.OnRefGroup} key={'1'} />, key: '1'},
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
        console.log("------EditOrgConfRule---componentWillMount---------------");
    }

    componentWillReceiveProps(nextProps) {//每次重新打开此组件，需重新初始化值
        console.log("------EditOrgConfRule----componentWillReceiveProps---------------",nextProps);
        console.log("------EditOrgConfRule----componentWillReceiveProps---------------",this.state);
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
                // effectiveDatetime: nextProps.record.effectiveDatetime,
                // effectiveDatetimeStr: dateFormat(nextProps.record.effectiveDatetime),
                // expireDatetime: nextProps.record.expireDatetime,
                // expireDatetimeStr: dateFormat(nextProps.record.expireDatetime),
                remarks: nextProps.record.remarks,
            });

            //机构类型=FUNDER(资金方)，则只显示集团信息
            if(nextProps.record.orgType === 'FUNDER'){
                console.log("=== FUNDER dispaly状态：",this.state.visibleAdd)
                this.setState({
                    visibleAdd: 'none',
                });
            }else{
                //机构类型=BUSI(商户)，则三个页签均可显示
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
                        });
                    }
                }
            }

        }
    }

    OnRefGroup = (ref) => {
        this.group = ref;

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
            });
        }
    }

    onTabClick = () => {
        console.log('onTabClick--------this.group--',this.group);
    }

    handleCancel = () => {
        this.setState({ visible: false });
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
            panes.push({ title: curtitle, content: <OrgConfSpanComp key={activeKey} onRef={this.OnRefComp} />, key: activeKey, closable:true});

        }
        if(activeKey === '3'){
            curtitle = '网点信息';//显示当前tab显示的标题
            visibleAddCur = 'none'//不显示新增按钮
            panes.push({ title: curtitle, content: <OrgConfSpanSite key={activeKey} onRef={this.OnRefSite} />, key: activeKey, closable:true});

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
        title="编辑机构信息"
        onCancel={this.handleCancel}
        footer={[
            <Button key="back" size="large" onClick={this.handleCancel}>取消</Button>,
            
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
                        {/* <br />
                        <Row> <Col span={8}>生效时间： </Col><Col span={16}><DatePicker style={{width:'200px'}} onChange={this.handleEffectiveDatetime} value={this.state.effectiveDatetime == null ? undefined : moment(this.state.effectiveDatetime, dateFormats)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row>
                        <br />
                        <Row> <Col span={8}>失效时间： </Col><Col span={16}><DatePicker style={{width:'200px'}} onChange={this.handleExpireDatetime} value={this.state.expireDatetime == null ? undefined : moment(this.state.expireDatetime, dateFormats)} showTime="true" format="YYYY-MM-DD HH:mm:ss" /></Col></Row> */}

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
export default ReadOrgConfRule;