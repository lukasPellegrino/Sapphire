import React, { Component } from 'react';
import * as actions from '../../actions';
import Receive from '../../components/ReceiveTransaction/Receive';
import ReceiveCardUI from '../../components/ReceiveCardPage/Receive';
import { connect } from 'react-redux';

class ReceivePage extends Component {
  render() {
    const viewToRender = this.props.betaUI ? <ReceiveCardUI /> : <Receive />;
    return (
      <div>
        {viewToRender}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    betaUI: state.application.betaUI,
  };
};

export default connect(mapStateToProps, actions)(ReceivePage);
