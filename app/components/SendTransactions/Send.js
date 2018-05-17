import React, { Component } from 'react';
import { connect } from 'react-redux';
import {TweenMax} from "gsap";

import AddressBook from './AddressBook';
import * as actions from '../../actions';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Input from '../Others/Input';
import ConfirmButtonPopup from '../Others/ConfirmButtonPopup'
import CloseButtonPopup from '../Others/CloseButtonPopup'
import SendConfirmation from './SendConfirmation'
var classNames = require('classnames');

import $ from 'jquery';

const Tools = require('../../utils/tools');

class Send extends Component {
  constructor(props) {
    super(props);
    this.handleClear = this.handleClear.bind(this);
    this.confirmSend = this.confirmSend.bind(this);
    this.resetUI = this.resetUI.bind(this);
    this.isSending = this.props.isSendingEcc;
  }

  componentDidMount(){
    $('.tableCustom').on('click', this.resetUI.bind(this))
  }

  handleClear() {
    this.props.setAmountSend("");
    this.props.setAddressSend("");
    this.props.setUsernameSend("");
    this.props.setAddressOrUsernameSend("");
  }

  async confirmSend() {

    if(this.props.amount === "" || isNaN(this.props.amount) === 1){
      Tools.highlightInput('#inputAmountSend', 1000)
    }
    if(this.props.addressOrUsername === ""){
      Tools.highlightInput('#inputAddressSend', 1000)
    }
    if(this.props.addressOrUsername !== "" && this.props.amount !== "" && Number(this.props.amount) > 0){
      if(Number(this.props.amount) > Number(this.props.balance)){
        Tools.showTemporaryMessage('.Send__message-status', this.props.lang.notEnoughBalance);
        Tools.highlightInput('#inputAmountSend', 2100)
      }
      else{
        let result;
        try{
          result = await Tools.searchForUsernameOrAddress(this.props.wallet, this.props.addressOrUsername);
          if(result.ans && result.addresses.length === 1){
            this.props.setUsernameSend(result.addresses[0].Name, "#"+result.addresses[0].Code);
            this.props.setAddressSend(result.addresses[0].Address);
          }
          else if(result.ans && result.addresses.length > 1){
            this.props.setMultipleAnsAddresses(result.addresses);
          }
          else{
            this.props.setAddressSend(result.addresses[0].address);
          }
        }catch(err){
          console.log("err: ", err)
        }

        if (!result) {
          Tools.showTemporaryMessage('.Send__message-status', this.props.lang.invalidFailedAddress);
          Tools.highlightInput('#inputAddressSend', 2100)
        } else {
            TweenMax.to('.Send__contacts', 0.3, {css:{top: "-51px", height: "92px"}})
            TweenMax.to(['.tableContainer, .Send__form'], 0.1, {autoAlpha: 0})
            TweenMax.set('.Send__contacts', {css: {cursor: "pointer"}})
            TweenMax.set('.Send__confirmation', {css: {display: "flex"}})
            TweenMax.to('.Send__confirmation', 0.3, {autoAlpha: 1, delay: 0.2});
            TweenMax.set('.Send__confirmation-panel', {css: {boxShadow: "none"}})
            TweenMax.fromTo('.Send__confirmation-panel', 0.3, {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, delay: 0.2});
            TweenMax.set('.Send__confirmation-panel', {css: {boxShadow: "0 4px 11px -6px black"}, delay: 0.3})
            TweenMax.fromTo('.Send__confirmation-recent', 0.3, {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, delay: 0.35});

            setTimeout(() => {
              this.props.setSendingECC(true);
              $('#sendPasswordId').focus();
            }, 700);

            this.isSending = true;
        }
      }
    }
  }

  resetUI(e){
    if(this.isSending){
      TweenMax.to('.Send__contacts', 0.3, {css:{top: "0px", height: "100%"}})
      TweenMax.set('.Send__contacts', {css: {cursor: "default"}})
      TweenMax.set('.tableContainer', {autoAlpha: 1})
      TweenMax.set('.Send__form', {autoAlpha: 1})
      TweenMax.set('.Send__form-buttons', {autoAlpha: 1})
      TweenMax.to('.Send__confirmation', 0.3, {autoAlpha: 0})
      this.isSending = false;
      setTimeout(() => this.props.setSendingECC(false), 300);
      this.props.setPassword("");
    }
  }

  render() {
    let clearButton = require('../../../resources/images/clearButton-orange.png');
    var sendContacts = classNames({
      'Send__contacts': true,
      'Send__contacts--is-compact': this.props.isSendingEcc
    });


    return (
      <div className="panel Send" style={{overflow: "hidden"}}>
        <div className={sendContacts}>
          <AddressBook sendPanel={true}/>;
          <p className="Send__message-status">{ this.props.lang.addressCopiedBelow }</p>
          <div className="Send__form">
            <div className="Send__inputs-wrapper">
              <Input
                placeholder= { this.props.lang.ansNameOrAddress }
                placeholderId="addressSend"
                value={this.props.addressOrUsername}
                handleChange={this.props.setAddressOrUsernameSend}
                type="text"
                inputId="inputAddressSend"
                style={{marginBottom: "25px"}}
                autoFocus
                isLeft
                onSubmit={this.confirmSend}
              />
              <Input
                placeholder= { this.props.lang.amount }
                placeholderId="amountSend"
                value={this.props.amount}
                handleChange={this.props.setAmountSend}
                type="number"
                inputId="inputAmountSend"
                isLeft
                onSubmit={this.confirmSend}
              />
            </div>
            <div className="Send__form-buttons">
              <img className="Send__form-clear-btn" onClick={this.handleClear} src={clearButton}/>
              <ConfirmButtonPopup
                className="Send__form-confirm-btn"
                text="Send"
                handleConfirm={this.confirmSend}
                hasLoader={false}
              />
            </div>
          </div>
        </div>
        <SendConfirmation handleClose={this.resetUI}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    lang: state.startup.lang,
    addressOrUsername: state.application.addressOrUsernameSend,
    amount: state.application.amountSend,
    balance: state.chains.balance,
    wallet: state.application.wallet,
    address: state.application.addressSend,
    username: state.application.userNameToSend,
    code: state.application.codeToSend,
    isSendingEcc: state.application.sendingEcc
  };
};

export default connect(mapStateToProps, actions)(Send);
