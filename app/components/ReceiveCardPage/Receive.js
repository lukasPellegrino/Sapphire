import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Receive extends Component {
  constructor(props) {
    super(props);
  }

  renderAddressCard(address, i) {
    console.log(address);
    //console.log(this.qrCodeForAddress(address));
    return (
      <div className="card addressCard col-sm-12" key={i}>
        <div className="container">
          <div className="row">
            <div className="col-sm-10">
              <h4 className="card-title homePanelTitleOne">{address.address}</h4>
              {!address.ans && <h5 className="homePanelTitleTwo">Standard</h5>}
              {address.ans && <h5>ANS</h5>}
              <div className="card-body">
                <span className="addressBalance">
                  {address.amount} <span className="ecc">ecc</span>
                </span>
              </div>
            </div>
            <div className="col-sm-2 upgradeBtn">
              {!address.ans && <span className="ecc">Upgrade</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="panel">
        <h1>Addresses</h1>
        <div className="container">
          {this.props.userAddresses.map((address, i) => this.renderAddressCard(address, i))}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    lang: state.startup.lang,
    userAddresses: state.application.userAddresses, 
  };
};

export default connect(mapStateToProps, actions)(Receive);
