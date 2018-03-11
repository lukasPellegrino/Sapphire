import {
	NOTIFICATIONS_POPUP,
	NEWS_CHECKED,
	EARNINGS_CHECKED,
	NEWS_NOTIFICATION,
	STAKING_NOTIFICATION,
	OPERATIVE_SYSTEM_NOTIFICATIONS, 
	NEWS_NOTIFICATIONS, 
	STAKING_NOTIFICATIONS
} from '../actions/types';

import notificationsInfo from '../utils/notificationsInfo';

//I might end up splitting notifications, so that there is a tab specific to messaging, unsure... too many clicks to get to something is also no good.

const INITIAL_STATE = {popupEnabled: false, lastCheckedNews: notificationsInfo.get('info').value().lastCheckedNews, lastCheckedEarnings: notificationsInfo.get('info').value().lastCheckedEarnings, operativeSystemNotificationsEnabled: false, newsNotificationsEnabled: false, stakingNotificationsEnabled: false, entries: {
	total: 0,
	differentKinds: 0,
	last: "",
    messaging: {messages: [], date: GetOldDate()}, 
	news: {total: 0, date: GetOldDate()}, 
	stakingEarnings: {total: 0, count: 0, date: GetOldDate()}, 
	ansPayments: {total: 0.00001, firstDueDate: new Date().setDate(31), payments: [{cost:0.00001, dueDate: new Date().setDate(31)}]},
	warnings: []
	}
}

export default(state = INITIAL_STATE, action) => {
	if(action.type == NOTIFICATIONS_POPUP){
		return {...state, popupEnabled: action.payload}
	}
	else if(action.type == OPERATIVE_SYSTEM_NOTIFICATIONS){
		return {...state, operativeSystemNotificationsEnabled: action.payload}
	}
	else if(action.type == NEWS_NOTIFICATIONS){
		return {...state, newsNotificationsEnabled: action.payload}
	}
	else if(action.type == STAKING_NOTIFICATIONS){
		return {...state, stakingNotificationsEnabled: action.payload}
	}
	else if(action.type == EARNINGS_CHECKED){
		let entries = Object.assign({}, state.entries);
		entries["total"] = entries["total"] - entries["stakingEarnings"].count;
		entries["stakingEarnings"].count = 0;
		entries["stakingEarnings"].total = 0;
		entries["differentKinds"] -= 1;
		if(entries["last"] == "earnings"){
			entries["last"] = "news";
		}
		UpdateNotificationInfo(state.lastCheckedNews, action.payload);
		return {...state, lastCheckedEarnings: action.payload, entries: entries}
	}
	else if(action.type == NEWS_CHECKED){
		let entries = Object.assign({}, state.entries);
		let differentKinds = entries["differentKinds"];
		entries["total"] = entries["total"] - entries["news"].total;
		entries["news"].total = 0;
		entries["differentKinds"] -= 1;

		UpdateNotificationInfo(action.payload, state.lastCheckedEarnings, entries: entries);
		return {...state, lastCheckedNews: action.payload, entries: entries}
	}
	else if(action.type == NEWS_NOTIFICATION){
		let entries = Object.assign({}, state.entries);
		if(entries["news"].total == 0){
			entries["differentKinds"] += 1;
			if(entries["last"] == "")
				entries["last"] = "news";
		}
		entries["total"] = entries["total"] += 1;
		entries["news"].total = entries["news"].total += 1;
		if(action.payload > entries["news"].date){
			entries["news"].date = action.payload;
		}

		return {...state, entries: entries}
	}
	else if(action.type == STAKING_NOTIFICATION){
		let entries = Object.assign({}, state.entries);
		let differentKinds = entries["differentKinds"];
		if(entries["stakingEarnings"].count == 0){
			entries["differentKinds"] += 1;
			if(entries["last"] == "" || entries["last"] == "news")
				entries["last"] = "earnings";
		}
		entries["total"] = entries["total"] + 1;
		entries["stakingEarnings"].count = entries["stakingEarnings"].count+=1;
		entries["stakingEarnings"].total = entries["stakingEarnings"].total+=action.payload.earnings;
		if(action.payload.date > entries["stakingEarnings"].date){
			entries["stakingEarnings"].date = action.payload.date;
		}
		return {...state, entries: entries}
	}
	return state;
}

function UpdateNotificationInfo(lastCheckedNews, lastCheckedEarnings){
	notificationsInfo.set('info', {lastCheckedNews: lastCheckedNews, lastCheckedEarnings: lastCheckedEarnings, lastCheckedChat: {}}).write();
}


function GetOldDate(){
	return new Date(new Date().setFullYear(2000)).getTime();
}