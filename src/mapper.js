
//Key - Value 配置文件，传入Key,得到Value
//例：type：ruleStatus,   subType：'A',返回：'激活'，如果subType为null,返回整个type的整个list

export function selectList(type,subType) {
// console.log("typetypetypetypetypetypetype")
// console.log(type)
// console.log(subType)
    var list ={

        'ActiveStatus' : //通用启用状态
        [
            {key : 'Y', value : '是'},
            {key : 'N', value : '否'},
        ],
        'tempKind' :
        [
            {key : 'FDD', value : '签章模板'},
            {key : 'PDF', value : 'PDF模板'},
        ],
        'ruleStatus' : //规则状态
        [
            {key : 'ACTIVE', value : '激活'},
            {key : 'INACTIVE', value : '禁用'},
			{key : 'DRAFT', value : '草稿'}			
        ],

        'ruleTPStatus' : //规则状态含临时禁用状态
        [
            {key : 'ACTIVE', value : '激活'},
            {key : 'INACTIVE', value : '禁用'},
            {key : 'TPIN', value : '临时禁用'},
            {key : 'DRAFT', value : '草稿'}
        ],
        'fielFormatType' : //文件格式
        [
            {key : 'IMG', value : 'IMG'},
            {key : 'PDF', value : 'PDF'},
        ],
        'confileFlag' : //资金方文件注记
        [
            {key : '1', value : '图片'},
            {key : '2', value : 'PDF'},
        ],
        'serviceOrgType' ://机构类型和服务主体类型
        [
            {key : 'SUP', value : '供应商'},
            {key : 'FUNDER', value : '资金方'},
            {key : 'TSERVICE', value : '技术服务主体'},
        ],
        'department' :
            [
                {key : '1', value : '管理'},
                {key : '2', value : '财务'},
                {key : '3', value : '业务'},
                {key : '4', value : '账务'},
                {key : '5', value : '技术'},
                {key : '7', value : '产品'},
                {key : '8', value : '风控'},
                {key : '9', value : '其他'},
            ],

        'deductDayRuleCode' ://还款日规则代码
        [
            {key : 'RANGE', value : '区间制'},
            {key : 'SAMEDAY', value : '当日制'},
        ],

        'roundRule' ://进位规则
        [
            {key : '0', value : '无条件进位'},
            {key : '1', value : '无条件舍弃'},
            {key : '4', value : '四舍五入'},
        ],
        'decimalScale' ://小数位数
        [
            {key : '0', value : '0'},
            {key : '1', value : '1'},
            {key : '2', value : '2'},
            {key : '3', value : '3'},
            {key : '4', value : '4'},
			{key : '5', value : '5'},
        ],
		'tranType' :
        [
            {key : '1', value : '费率'},
            {key : '2', value : '单笔'},
        ],
        'creditPlace' :
        [
            {key : '01', value : '境内'},
            {key : '02', value : '境外'},
        ],
        'creditPeriodType' :
        [
            {key : '01', value : '固定型'},
            {key : '02', value : '非固定型'},
        ],
        'creditTriger' :
        [
            {key : '01', value : '首次动用'},
            {key : '02', value : '指定日'},
        ],
        'repayType' :
        [
            {key : '01', value : '先息后本'},
            {key : '02', value : '到期一次性还本付息'},
            {key : '03', value : '按月付息，到期还本'},
            {key : '04', value : '按季付息，到期还本'},
            {key : '05', value : '其他（待补充）'},
        ],
        'feeType' :
        [
            {key : '01', value : '前置一次性'},
            {key : '02', value : '后置一次性'},
            {key : '03', value : '分批'},
		],		
        'conType' ://合同类型
            [
                {key : 'MAIN', value : '业务合同'},
                {key : 'FUNDER', value : '资金合同'},
            ],
        'isDelete' ://是否删除
        [
            {key : '0', value : '未删除'},
            {key : '1', value : '已删除'},
        ],
        'dayOfYear' ://全年计息天数
        [
            {key : '360', value : '360'},
            {key : '365', value : '365'},
        ],
        'signfileType' : //资金方需要的文件类型 除去身份证正反面得文件
        [
            {key : 'G', value : '贷款合同'},
            {key : 'N', value : '受委托支付协议'},
            {key : 'T', value : '消费合同'},
            {key : 'XFY', value : '学分云服务协议'},
            {key : 'NOTICE', value : '分期申请成功通知书'},
            {key : 'AGREEBOOK', value : '分期申请同意书'},
        ],
		
        'finAplStatus' ://融资状态
            [
                {key : 'INIT', value : '待融资'},
                {key : 'APLD', value : '发起融资申请'},
                {key : 'APRY', value : '一级审批通过'},
                {key : 'APRN', value : '一级审批退回'},
                {key : 'APSY', value : '二级审批通过'},
                {key : 'APSN', value : '二级审批退回'},
                {key : 'PAYD', value : '已放款'},
                {key : 'USED', value : '已确认资金用途'},
                {key : 'FACD', value : '资金方确认回款'},
                {key : 'BACD', value : '供应商确认回款'},
                {key : 'SUCC', value : '融资结束'},
            ],
        'signChannel' ://签章渠道
            [
                {key : 'FDD', value : '法大大'},
            ],
        'supPayPeriod' ://付款时间
        [
            {key : 30, value : '30天以内'},
            {key : 60, value : '60天以内'},
            {key : 90, value : '90天以内'},
        ],



    }

    if(subType === null){
        return null;
	}

	if(subType === 'list[type]'){
        return list[type];
	}
	

    var result_value = subType;

    list[type].forEach( (item) => {
       if(item['key'] === subType){
            result_value = item['value']
       } else if(item['key'] === ''){
            result_value = ''
       }
    });
    return result_value
}
