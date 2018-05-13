import React, { Component } from 'react';
import { connect } from 'react-redux';
import {TweenMax} from "gsap";

import * as actions from '../../actions';
import CloseButtonPopup from '../Others/CloseButtonPopup';
import ConfirmButtonPopup from '../Others/ConfirmButtonPopup';
import Input from '../Others/Input';
import ansAddressesInfo from '../../utils/ansAddressesInfo';
import renderHTML from 'react-render-html';

import $ from 'jquery';

const event = require('../../utils/eventhandler');
const Tools = require('../../utils/tools');

// This is temporary until ANS is enabled
const ansEnabled = false;

class ConfirmNewAddress extends React.Component {
 constructor() {
    super();
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeNameAddress = this.handleChangeNameAddress.bind(this);
    this.createNormalAddress = this.createNormalAddress.bind(this);
    this.getConfirmationText = this.getConfirmationText.bind(this);
    this.saveNewlyCreatedAnsAddress = this.saveNewlyCreatedAnsAddress.bind(this);
    this.createdAddress = false;
  }

  componentWillMount(){
    Tools.hideFunctionIcons();
  }

  componentWillUnmount()
  {
    Tools.showFunctionIcons();
    this.props.setNewAddressNamePopup("");
    this.props.setPassword('');
  }

  createNormalAddress(){
    this.props.wallet.createNewAddress(this.props.account).then((newAddress) => {
      	event.emit('newAddress');
        this.props.setPopupLoading(false)
      	this.props.setCreatingAddress(false);
    }).catch((err) => {
       console.log("error creating address: ", err)
       this.props.setPopupLoading(false)
    });
  }

  createNewAnsAddress() {
    let newAddress;
    this.props.wallet.createNewAddress()
      .then(address => {
        newAddress = address;
        return this.props.wallet.sendMoney(newAddress, 51);
      })
      .then(() => {
        return this.createANSAddress(newAddress);
      })
      .catch(err => {
        console.log('error creating ANS address: ', err);
        if(err.message.indexOf("Insufficient funds") !== -1){
          Tools.showTemporaryMessage('#wrongPassword', "Not enough funds in the address. You need to have a little over 50 ECC to account for the transfer fees.", 7000, this.props.lang.wrongPassword);
        }
        this.props.setPopupLoading(false)
      });
  }

  saveNewlyCreatedAnsAddress(address){
    const currentBlock = this.props.blockPayment;
    ansAddressesInfo.get('addresses').push({address: address, creationBlock: currentBlock}).write();
  }

  createANSAddress(address) {
    return this.props.wallet.createNewANSAddress(address, this.props.upgradingAddress ? this.props.usernamePopup : this.props.username)
      .then(response => {
        this.saveNewlyCreatedAnsAddress(address);
        this.createdAddress = true;
        TweenMax.to('#ConfirmNewAddress__content', 0.2, {autoAlpha: 0, scale: 0.5});
        TweenMax.fromTo('#ConfirmNewAddress__success-message', 0.2, {autoAlpha: 0, scale: 0.2}, {autoAlpha: 1, scale: 1});
        TweenMax.set('#unlockPanel', {height: "331px"});
        TweenMax.set('#confirmButtonPopup', {position: "absolute"});
        TweenMax.to('#unlockPanel', 0.3, {height: "220px"});
        this.props.setPopupLoading(false)
      })
      .catch(err => {
        this.props.setPopupLoading(false)
        console.log('error creating ANS address: ', err);
        if(err.message.indexOf("Insufficient funds") !== -1){
          Tools.showTemporaryMessage('#wrongPassword', "Not enough funds in the address. You need to have a little over 50 ECC to account for the transfer fees.", 7000, this.props.lang.wrongPassword);
        }
        else if(err.message.indexOf("there can only be") !== -1){
          Tools.showTemporaryMessage('#wrongPassword', this.props.lang.ansInputsError, 7000, this.props.lang.wrongPassword);
        }
        else if(err.message.indexOf("Username contains invalid") !== -1){
          Tools.showTemporaryMessage('#wrongPassword', this.props.lang.usernamInvalid, 7000, this.props.lang.wrongPassword);
        }
        else if(err.message.indexOf("maxiumum length of") !== -1){
          Tools.showTemporaryMessage('#wrongPassword', this.props.usernameTooBig, 5000, this.props.lang.wrongPassword);
        }
      });
  }


  handleConfirm(){
    if(this.createdAddress){
      this.props.setPopupLoading(false)
      this.props.setCreatingAddress(false);
      this.props.setUpgradingAddress(false);
      this.props.setNewAddressName(name);
      TweenMax.set('#addressNamePlaceHolder', {autoAlpha: 1});
      return;
    }

    this.props.setPopupLoading(true)
    if (!this.props.ansAddress) {
      this.createNormalAddress();
    } else {
      this.unlockWallet(false, 5, () => {
        if (this.props.selectedAddress && this.props.upgradingAddress) {
          this.createANSAddress(this.props.selectedAddress.address);
        } else  {
          this.createNewAnsAddress();
        }
      });
    }
  }

  handleChangeNameAddress(event){
    const name = event.target.value;
    if(name.length === 0)
      TweenMax.set('#addressNamePopupPlaceHolder', {autoAlpha: 1});
    else
      TweenMax.set('#addressNamePopupPlaceHolder', {autoAlpha: 0});

    this.props.setNewAddressNamePopup(name);
  }

  handleCancel(){
    this.props.setPassword('');
    this.props.setCreatingAddress(false);
    this.props.setUpgradingAddress(false);
  }

  handleChange(event) {
    const pw = event.target.value;
    if(pw.length === 0)
      TweenMax.set('#password', {autoAlpha: 1});
    else
      TweenMax.set('#password', {autoAlpha: 0});

    this.props.setPassword(pw);
  }

  unlockWallet(flag, time, callback){
    var batch = [];
    var obj = {
      method: 'walletpassphrase', parameters: [this.props.passwordVal, time, flag]
    };
    batch.push(obj);

    this.props.wallet.command(batch).then((data) => {

      data = data[0];
      console.log(data)
      if (data !== null && (data.code === -14 || data.code === -1)) {
        Tools.showTemporaryMessage('#wrongPassword');
        this.props.setPopupLoading(false)
      } else if (data !== null && data.code === 'ECONNREFUSED') {
          console.log("Daemon not running - Dev please look into this and what exactly triggered it");
      } else if (data === null) {
          callback();
      } else {
        console.log("error unlocking wallet: ", data)
      }
    }).catch((err) => {
      console.log("err unlocking wallet: ", err);
    });
  }

  getConfirmationText(){
    const successMessageToRender = (
      <div id="ConfirmNewAddress__success-message" style={{position: "absolute", top:"0px", width:"100%", fontSize:"15px", visibility: "hidden"}}>
        <p>Sucess! We will notify you when your ANS address is ready.</p>
        <p style={{marginTop: "20px"}}>It can take anywhere from 5 minutes to 10 minutes.</p>
      </div>
    )


   if(this.props.ansAddress && !this.props.upgradingAddress) {
  		return(
        <div style={{position: "relative"}}>
          <div id="ConfirmNewAddress__content">
            <p className="confirmationText" style={{ marginBottom: '25px' }}>{ this.props.lang.ansCreateConfirm1 } <span className="ecc">{ this.props.lang.ansCreateConfirm2 }</span> { this.props.lang.ansCreateConfirm3 } "{this.props.username}".</p>
            <Input
              divStyle={{width: "400px", marginTop: "20px"}}
              placeholder= { this.props.lang.password }
              placeholderId= "password"
              placeHolderClassName="inputPlaceholder inputPlaceholderUnlock"
              value={this.props.passwordVal}
              handleChange={this.handleChange.bind(this)}
              type="password"
              inputId="passwordAnsId"
              inputStyle={{width: "400px", top: "20px", marginBottom: "30px"}}
              autoFocus={true}
            />
          </div>
          {successMessageToRender}
        </div>
      )
    } else if(this.props.upgradingAddress) {
      return (
       <div style={{position: "relative"}}>
          <div id="ConfirmNewAddress__content">
            <p className="confirmationText" style={{ marginBottom: '25px' }}>{renderHTML(this.props.lang.ansUsernameAndPassword)}.</p>
            <Input
              divId="addressName"
              divStyle={{width: "400px", marginTop: "20px"}}
              placeholder= { this.props.lang.name }
              placeHolderClassName="inputPlaceholder changePasswordInput"
              placeholderId="addressNamePopupPlaceHolder"
              value={this.props.usernamePopup}
              handleChange={this.handleChangeNameAddress.bind(this)}
              type="text"
              inputId="usernameAnsId"
              inputStyle={{width:"400px", display: "inline-block"}}
              autoFocus={true}
            />
            <Input
              divStyle={{width: "400px", marginTop: "20px", marginBottom: "15px"}}
              placeholder= { this.props.lang.password }
              placeholderId= "password"
              placeHolderClassName="inputPlaceholder inputPlaceholderUnlock changePasswordInput"
              value={this.props.passwordVal}
              handleChange={this.handleChange.bind(this)}
              type="password"
              inputId="passwordAnsId"
              inputStyle={{width: "400px"}}
            />
          </div>
           {successMessageToRender}
        </div>
      )
  	} else if(!this.props.ansAddress && this.props.account === ""){
  		return(
  			<p className="confirmationText">{ this.props.lang.normalCreateConfirm1 } <span className="ecc">{ this.props.lang.normalCreateConfirm2 }</span>.</p>
  		)
  	} else if(!this.props.ansAddress && this.props.account !== ""){
  		return(
  			<p className="confirmationText">{ this.props.lang.normalCreateConfirm1 } <span className="ecc">{ this.props.lang.normalCreateConfirm2 }</span> { this.props.lang.normalCreateConfirm4 } "{this.props.account}". { this.props.lang.normalCreateConfirm5 }  <span className="ecc">{ this.props.lang.ansCreateConfirm2 }</span> { this.props.lang.normalCreateConfirm6 }.</p>
  		)
  	}
  }

  render() {
     return (
      <div style={{height: "auto !important", textAlign: "center", width: "535px"}}>
        <CloseButtonPopup handleClose={this.handleCancel}/>
        <p className="popupTitle">{ this.props.upgradingAddress ? this.props.lang.upgradingAns : this.props.lang.confirmNewAddress }</p>
        {this.getConfirmationText()}
        <p id="wrongPassword" style={{width: "75%", margin: "0 auto"}} className="wrongPassword">{ this.props.lang.wrongPassword }</p>
        <ConfirmButtonPopup
          inputId="#passwordAnsId, #usernameAnsId"
          textLoading={this.props.lang.confirming}
          text={this.props.lang.confirm}
          handleConfirm={this.handleConfirm}
          text="Confirm"
          style={{position: 'relative', marginTop: '30px', bottom: "10px", left:"205px"}}/>
      </div>
      );
    }

}

const mapStateToProps = state => {
  return{
    lang: state.startup.lang,
    username: state.application.newAddressName,
    usernamePopup: state.application.newAddressNamePopup,
    ansAddress: state.application.creatingAnsAddress,
    upgradingAddress: state.application.upgradingAddress,
    selectedAddress: state.application.selectedAddress,
    account: state.application.newAddressAccount,
    wallet: state.application.wallet,
    passwordVal: state.application.password,
    blockPayment: state.chains.blockPayment
  };
};


export default connect(mapStateToProps, actions)(ConfirmNewAddress);
