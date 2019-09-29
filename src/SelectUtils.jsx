import React from 'react';
import { Select } from 'antd';
import {selectList} from './mapper.js';
import routes from './routes/config';
import {selectButtonList} from './routes/config.js'

export function selectUtils(type) {
    var result = [];
    selectList(type,'list[type]').forEach( (item) => {
        result.push(<Select.Option key={item['key']}>{item['value']}</Select.Option>);
    });
    return result;

}

export function selectUtilsKey(type) {
    var result = [];
    selectList(type,'list[type]').forEach( (item) => {
        result.push(<Select.Option key={item['key']}>{item['key']}</Select.Option>);
    });
    return result;

}

export function selectGroupList(groupId) {

    var result_value = "未定义";

    routes.menus.forEach( (item) => {
        if(item.key === groupId){
            result_value = item.title
        }
    });

    return result_value
}
export function selectPageList(pageId) {


    var result_value = "未定义";

    routes.menus.forEach( (item) => {
        if(item.subs){
            item.subs.map(sub => sub.key === pageId
                ?result_value = sub.title:'未定义'
            )
        }
    });

    return result_value
}

const renderOption = item => ( // item.route 菜单单独跳转的路由
    <Select.Option key={item.key}>{item.title}</Select.Option>
);

export function selectGroupUtils() {
    var result = [];
    routes.menus.forEach( (item) => {
        result.push(item.key ? renderOption(item):'')
    });
    return result;

}

export function selectPageUtils() {
    var result = [];
    routes.menus.forEach( (item) => {
        result.push(item.subs ? item.subs.map(item => renderOption(item)) : '')
    });
    return result;

}

export function selectButtonUtils(pageId) {
    var result = [];
    selectButtonList('buttonId', pageId, null).forEach( (item) => {
        if(item['pageId']===pageId){
            result.push(<Select.Option key={item['buttonId']}>{item['buttonName']}</Select.Option>);
        }

    });
    return result;
}

export function selectAccStatusUtils(accStatus) {

    var result = selectList('accStatus', accStatus);

    if(result.length < 1){
        result = "未定义";
    }
    return result;
}