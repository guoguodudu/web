/**
 * 路由组件出口文件
 */

import Dashboard from './dashboard/Dashboard';
// --------------------------业务组件
import OrgRateConfList from '../components/conFinRule/orgRateConf/OrgRateConfList';
import SignTempalteList from '../components/conFinRule/signTemplate/SignTempalteList';

import SignParmList from '../components/conFinRule/signParmRouter/SignParmList';
import SignConConfList from '../components/conFinRule/signConConf/SignConConfList';
import OrgSignList from '../components/conFinRule/orgSign/OrgSignList';
import OrgConfRuleList from '../components/conFinRule/orgConfRule/OrgConfRuleList';
import OrgConConfList from '../components/conFinRule/orgConConf/OrgConConfList';
import PermissionList from '../components/systemManage/permissionManage/PermissionList';
import RoleList from '../components/systemManage/roleManage/RoleList';
import UserList from '../components/systemManage/userManage/UserList';
import TfeeRateConfList from '../components/conFinRule/tfeeRateConf/TfeeRateConfList';
import UpdateOldPwd from './dashboard/UpdateOldPwd';
import SupInfo from './finance/supInfo/SupInfoList';
import FinancingBusinessInformation from './finance/financingBusinessInformation';
import AccountsReceivableManagement from './finance/accountsReceivableManagement/AccountsReceivableManagement';
import ContractConfList from '../components/conFinRule/contractConf/ContractConfList';

import LegalnfoList from './finance/legalnfo/LegalnfoList';


import FunderInfoList from '../components/conFinRule/funderInfo/FunderInfoList';

import SubConList from './finance/subCon/SubConList';
import RepayAccountLogList from './finance/repayAccountLog/RepayAccountLogList';


export default {
	Dashboard,

    OrgRateConfList,
    OrgConfRuleList,
    SignTempalteList,

    SignParmList,
    SignConConfList,
    OrgSignList,

    OrgConConfList,
    PermissionList,
    RoleList,
    UserList,
    TfeeRateConfList,
	UpdateOldPwd,


	SupInfo,
	FinancingBusinessInformation,
	AccountsReceivableManagement,
    ContractConfList,
    
    LegalnfoList,

    FunderInfoList,

    SubConList,
    RepayAccountLogList,
    
    
}
