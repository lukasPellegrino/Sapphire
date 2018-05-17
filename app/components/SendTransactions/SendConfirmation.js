import React, { Component } from 'react';
import { connect } from 'react-redux';
import {TweenMax} from "gsap";

import * as actions from '../../actions';
import CloseButtonPopup from '../Others/CloseButtonPopup';
import ConfirmButtonPopup from '../Others/ConfirmButtonPopup';
import Input from '../Others/Input';
var classNames = require('classnames');

const Tools = require('../../utils/tools');

class SendConfirmation extends React.Component {
 constructor() {
    super();
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showWrongPassword = this.showWrongPassword.bind(this);
    this.sendECC = this.sendECC.bind(this);
    this.getNameOrAddressHtml = this.getNameOrAddressHtml.bind(this);
    this.reset = this.reset.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.animated = false;
  }

  showWrongPassword(){
    Tools.showTemporaryMessage('#wrongPassword');
  }

  componentWillMount(){
  }

  componentWillUnmount()
  {

  }

  sendECC(){
    let wasStaking = this.props.staking;
    this.props.setPopupLoading(true)
    this.unlockWallet(false, 5, () => {
      var batch = [];
      console.log(this.props.amount);
      var obj = {
        method: 'sendToAddress', parameters: [this.props.address, this.props.amount]
      };
      batch.push(obj);
      this.props.wallet.command(batch).then((data) => {
        if(data && data[0] && typeof data[0] === 'string'){
          if(wasStaking){
              this.unlockWallet(true, 31556926, () => {
             });
          }
          else{
            this.props.setStaking(false);
          }
          this.reset();
          this.props.setTemporaryBalance(this.props.balance - this.props.amount);
          this.showMessage(this.props.lang.sentSuccessfully);
        }
        else{
          this.showMessage(this.props.lang.failedToSend);
          this.reset();
        }
      }).catch((err) => {
        this.showMessage(this.props.lang.failedToSend);
        this.reset();
      });
    })
  }

  showMessage(message){
    $('.Send__message-status').text(message);
    Tools.showTemporaryMessage('.Send__message-status');
    setTimeout(() => {
      $('.Send__message-status').text(this.props.lang.addressCopiedBelow)
    }, 2500)
  }

  reset(){
    this.props.setPopupLoading(false)
    this.props.setPassword("");
    this.props.setUsernameSend("");
    this.props.setAmountSend("");
    this.props.setAddressSend("");
    this.props.setAddressOrUsernameSend("");
  }

  unlockWallet(flag, time, callback){
    var batch = [];
    var obj = {
      method: 'walletpassphrase', parameters: [this.props.passwordVal, time, flag]
    };
    batch.push(obj);

    this.props.wallet.command(batch).then((data) => {
      console.log("data: ", data);
      data = data[0];
      if (data !== null && data.code === -14) {
        this.showWrongPassword();
      } else if (data !== null && data.code === 'ECONNREFUSED') {
          console.log("Daemon not running - Dev please look into this and what exactly triggered it");
      } else if (data === null) {
          callback();
          return;
      } else {
        console.log("error unlocking wallet: ", data)
      }
      this.props.setPopupLoading(false)
    }).catch((err) => {
      this.props.setPopupLoading(false)
      console.log("err unlocking wallet: ", err);
    });
  }

  handleConfirm(){
    if(this.props.passwordVal === ""){
      this.showWrongPassword();
      return;
    }
    this.sendECC();
  }

  handleCancel(){
    this.props.setSendingECC(false);
  }

  handleClick(val){
    this.props.setUsernameSend(val.Name, "#"+val.Code);
    this.props.setAddressSend(val.Address);
    if(this.animated) return;
    this.animated = true;
    TweenMax.to('#unlockPanel', 0.3, {css:{top: "10%"}})
    TweenMax.to('#unlockPanel', 0.3, {css:{height: "520px"}})
    TweenMax.set('#labels', {css:{display: "block", visibility: "hidden"}, delay: 0.3})
    TweenMax.set('#send_inputs', {css:{display: "block", visibility: "hidden"}, delay: 0.3})
    TweenMax.fromTo('#labels', 0.3, {y: 30}, {y: 0, autoAlpha: 1, delay: 0.3})
    TweenMax.to('#send_inputs', 0.3,  {autoAlpha: 1, delay: 0.5})
  }

  getNameOrAddressHtml(){
    if(this.props.multipleAddresses.length > 0){
      return(
        <div>
          <p className="multipleAddresses">{this.props.multipleAddresses.length} {this.props.lang.foundMultipleUsernames}.</p>
          <div className="ansAddressesList">
            {this.props.multipleAddresses.map((val) => {
              return(
                <p key={val.Code} onClick={this.handleClick.bind(this, val)} className="ansAddressesList-item">{val.Name}#{val.Code}</p>
              )
            })}
          </div>
          <div id="labels" style={{display: "none"}}>
            <p className="labelAmountSend" style={{paddingTop: "0px"}}>{ this.props.lang.amount }: {Tools.formatNumber(Number(this.props.amount))} <span className="ecc">ECC</span></p>
            <p className="labelSend">{ this.props.lang.name }: {this.props.username}<span className="Receive__ans-code">{this.props.codeToSend}</span> </p>
            <p className="labelAddressSend">({this.props.address})</p>
          </div>
        </div>
      )
    }
    else if(this.props.username && this.props.username !== ""){
      return(
        <div>
          <p className="labelAmountSend">{ this.props.lang.amount }: {Tools.formatNumber(Number(this.props.amount))} <span className="ecc">ECC</span></p>
          <p className="labelSend">{ this.props.lang.name }: {this.props.username}<span className="Receive__ans-code">{this.props.codeToSend}</span> </p>
          <p className="labelAddressSend">({this.props.address})</p>
        </div>
      )
    }else{
      return(
        <div>
          <p className="labelAmountSend">{ this.props.lang.amount }: {Tools.formatNumber(Number(this.props.amount))} <span className="ecc">ECC</span></p>
          <p className="labelSend">{ this.props.lang.address }: <span style={{fontSize:"14px"}}>{this.props.address}</span> </p>
        </div>
      )
    }
  }

  render() {
    var sendConfirmation = classNames({
      'Send__confirmation': true,
      'Send__confirmation--is-compact': !this.props.isSendingEcc
    });

     return (
      <div className={sendConfirmation}>
        <CloseButtonPopup handleClose={this.props.handleClose}/>
        <div className="Send__confirmation-panel">
          <p className="Send__confirmation-panel-header">Confirm Transaction</p>
          <div className="Send__confirmation-panel-item" style={{marginTop: "10px"}}>
            <p className="Send__confirmation-panel-label">Amount</p>
            <p className="Send__confirmation-panel-label-right">{Tools.formatNumber(Number(this.props.amount))} <span className="ecc">ECC</span></p>
          </div>
          <div className="Send__confirmation-panel-item">
            <p className="Send__confirmation-panel-label">Name</p>
            <p className="Send__confirmation-panel-label-right">{this.props.username !== "" ? this.props.username : "-----"}</p>
          </div>
          <p className="Send__confirmation-panel-label">Address</p>
          <p className="Send__confirmation-panel-label Send__confirmation-panel-address">{this.props.address}</p>
          <div className="Send__confirmation-panel-item">
            <p className="Send__confirmation-panel-label">Estimated fee</p>
            <p className="Send__confirmation-panel-label-right">0.01 <span className="ecc">ECC</span></p>
          </div>
          <div className="Send__confirmation-panel-confirm">
            <div className="Send__confirmation-panel-item">
              <p className="Send__confirmation-panel-label">Total</p>
              <p className="Send__confirmation-panel-label-right">{Tools.formatNumber(Number(this.props.amount) + 0.01)} <span className="ecc">ECC</span></p>
            </div>
            <Input
              placeholder= { this.props.lang.password }
              placeholderId="password"
              value={this.props.passwordVal}
              handleChange={this.props.setPassword}
              type="password"
              inputId="sendPasswordId"
              onSubmit={this.handleConfirm}
              style={{width: "70%", marginTop: "15px"}}
              autoFocus
            />
            <p id="wrongPassword" className="wrongPassword">Wrong password</p>
            <ConfirmButtonPopup
              className="Send__confirmation-panel-btn"
              text="Send"
              handleConfirm={this.handleConfirm}
              textLoading={this.props.lang.confirming}
              text={ this.props.lang.confirm }
              hasLoader={false}
            />
          </div>
        </div>
        <div className="Send__confirmation-recent">
          <p className="Send__confirmation-recent-header">Recent transactions to this address</p>
          <p className="Send__confirmation-recent--no">No recent transactions</p>
        </div>
      </div>
      );
    }

}

const mapStateToProps = state => {
  return{
    lang: state.startup.lang,
    passwordVal: state.application.password,
    amount: state.application.amountSend,
    address: state.application.addressSend,
    username: state.application.userNameToSend,
    staking: state.chains.isStaking,
    wallet: state.application.wallet,
    balance: state.chains.balance,
    codeToSend: state.application.codeToSend,
    multipleAddresses: state.application.ansAddressesFound,
    isSendingEcc: state.application.sendingEcc
  };
};


export default connect(mapStateToProps, actions)(SendConfirmation);
