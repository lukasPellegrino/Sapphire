import React, { Component } from 'react';
import { traduction } from '../../lang/lang';
import { connect } from 'react-redux';
import {TweenMax} from "gsap";
import * as actions from '../../actions';
import $ from 'jquery';
const lang = traduction();
const Tools = require('../../utils/tools');
import event from '../../utils/eventhandler';
class Loader extends React.Component {

 constructor() {
    super();
    this.showLoadingBlockIndex = this.showLoadingBlockIndex.bind(this);
  }

  shouldComponentUpdate(nextProps){
  	if(!this.props.loading && nextProps.loading){
  		this.showLoadingBlockIndex();
  		return false;
  	}
  	return true;
  }

  showMessage(message){
  	$('#gettingReady').text(message);
	TweenMax.to(['#blockIndexLoad'], 0.2, {autoAlpha: 0, scale: 0.5});
    TweenMax.fromTo('#message', 0.2, {autoAlpha: 0, scale: 0.5}, {autoAlpha: 1, scale: 1});
  }

  componentWillMount(){
  	if(this.props.showingFunctionIcons){
  	  Tools.hideFunctionIcons();
      this.props.setShowingFunctionIcons(false);
  	}

  }

  componentDidMount(){

    event.on('downloading-file', (payload) => {
      const walletPercent = payload.percent * 100;
      // this.setState({
      //   isInstalling: true,
      //   progress: walletPercent.toFixed(2),
      //   progressMessage: `Downloading wallet \n ${walletPercent.toFixed(2)}%`
      // });
    });

    event.on('downloaded-file', () => {
      // this.setState({
      //   isInstalling: true,
      //   progress: 100,
      //   progressMessage: 'Downloaded wallet 100%'
      // });
    });

    event.on('verifying-file', () => {
      // this.setState({
      //   isInstalling: true,
      //   progressMessage: 'Verifying wallet...'
      // });
    });

    event.on('unzipping-file', (payload) => {
      // this.setState({
      //   isInstalling: true,
      //   progressMessage: `${payload.message}`
      // });
    });

    event.on('file-download-complete', () => {
      // this.setState({
      //   isInstalling: false,
      //   progressMessage: ''
      // });
    });

    event.on('download-error', (payload) => {
      console.log(payload);
    });


  	//fix for when importing a wallet with the setup done, without this the "loading" text doesn't show up, since the prop is already set to true
  	if(this.props.loading && $(this.refs.blockIndexLoad).css('visibility') == "hidden"){
  		this.showLoadingBlockIndex();
  	}
  }

  showLoadingBlockIndex(){
	TweenMax.to('#gettingReady', 0.2, {autoAlpha: 0, scale: 0.5});
    TweenMax.to('#blockIndexLoad', 0.2, {autoAlpha: 1, scale: 1});
  }

  render() {
    return (
      <div>
			<svg version="1.1" id="logoLoader" x="0px" y="0px" viewBox="0 0 1672.439 893.7" style={{enableBackground:"new 0 0 1672.439 893.7"}}>
 				<filter id="black">
			        <feOffset result="offOut" in="SourceAlpha" dx="10" dy="0"/>
			        <feColorMatrix in="offOut" result ="matrixOut" type="matrix"
			                                     values="0 0 0 0 0
			                                             0 0 0 0 0
			                                             0 0 0 0 0
			                                             0 0 0 1 0" />
			        <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="15"/>
			        <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
		  		</filter>
 				<filter id="yellow">
			        <feOffset result="offOut" in="SourceAlpha" dx="10" dy="0"/>
			        <feColorMatrix in="offOut" result ="matrixOut" type="matrix"
			                                     values="0 0 0 0 1
	                                                0 0 0 0 0.4
	                                                0 0 0 0 -0.5
	                                                0 0 0 1 0" />
			        <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="25"/>
			        <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
		  		</filter>
				<g ref="logo1" id="logo1" filter="url(#black)" x="0px" y="50px" >
					<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="-290.6265" y1="702.6533" x2="-290.6265" y2="474.5693" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
					</linearGradient>
					<path fill="url(#SVGID_1_)" d="M965.377,658.342l-145.944-98.114l-88.712,59.686c-7.461,5.009-16.25,4.396-22.791,0.205
						c0.613,0.511,1.125,0.92,1.737,1.431l231.794,167.815c13.798,9.914,33.012,0.103,33.012-16.863v-96.785
						C974.575,668.766,971.1,662.225,965.377,658.342z"/>
					<g>
						<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="-300.6274" y1="536.5273" x2="-300.6274" y2="314.3662" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
						</linearGradient>
						<path fill="url(#SVGID_2_)" d="M941.563,461.807L851.217,396.5L707.01,500.95c-5.416,3.884-8.585,10.118-8.585,16.863v84.93
							c0,16.659,18.601,26.471,32.398,17.272l232.714-156.573C956.894,466.815,948.514,466.917,941.563,461.807z"/>
						
						<linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="-160.124" y1="362.9458" x2="-160.124" y2="362.59" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
						</linearGradient>
						<path fill="url(#SVGID_3_)" d="M974.575,445.762c0,0.102,0,0.204,0,0.408C974.575,446.068,974.575,445.966,974.575,445.762z"/>
					</g>
						<linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="-292.0259" y1="382.1465" x2="-292.0259" y2="154.1626" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#F29D27"}}/>
							<stop  offset="1" style={{stopColor: "#A16A29"}}/>
						</linearGradient>
						<path fill="url(#SVGID_4_)" d="M965.377,330.887l-145.944-98.114l-88.609,59.584c-8.585,5.825-19.01,4.088-25.755-1.941
							c0.817,0.817,1.635,1.532,2.555,2.146l233.838,169.246c13.798,9.914,33.012,0.103,33.012-16.863v-96.785
							C974.575,341.209,971.1,334.771,965.377,330.887z"/>
						<linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="-295.2271" y1="215.9648" x2="-295.2271" y2="-73.9209" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#F29D27"}}/>
							<stop  offset="1" style={{stopColor: "#A16A29"}}/>
						</linearGradient>
						<path fill="url(#SVGID_5_)" d="M707.01,173.394L941.563,3.636c13.798-9.913,33.012-0.102,33.012,16.863v96.785
							c0,6.95-3.476,13.389-9.198,17.272l-234.554,157.8c-13.798,9.301-32.398-0.613-32.398-17.272v-84.827
							C698.425,183.613,701.594,177.277,707.01,173.394z"/>
					</g>
				<g id="logo2" filter="url(#yellow)" x="0px" y="50px">
					<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="-290.6265" y1="702.6533" x2="-290.6265" y2="474.5693" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
					</linearGradient>
					<path id="fifth" fill="url(#SVGID_1_)" d="M965.377,658.342l-145.944-98.114l-88.712,59.686c-7.461,5.009-16.25,4.396-22.791,0.205
						c0.613,0.511,1.125,0.92,1.737,1.431l231.794,167.815c13.798,9.914,33.012,0.103,33.012-16.863v-96.785
						C974.575,668.766,971.1,662.225,965.377,658.342z"/>
					<g>
						<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="-300.6274" y1="536.5273" x2="-300.6274" y2="314.3662" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
						</linearGradient>
						<path id="forth" fill="url(#SVGID_2_)" d="M941.563,461.807L851.217,396.5L707.01,500.95c-5.416,3.884-8.585,10.118-8.585,16.863v84.93
							c0,16.659,18.601,26.471,32.398,17.272l232.714-156.573C956.894,466.815,948.514,466.917,941.563,461.807z"/>
						
						<linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="-160.124" y1="362.9458" x2="-160.124" y2="362.59" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
						</linearGradient>
						<path id="third" fill="url(#SVGID_3_)" d="M974.575,445.762c0,0.102,0,0.204,0,0.408C974.575,446.068,974.575,445.966,974.575,445.762z"/>
					</g>
						<linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="-292.0259" y1="382.1465" x2="-292.0259" y2="154.1626" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#F29D27"}}/>
							<stop  offset="1" style={{stopColor: "#A16A29"}}/>
						</linearGradient>
						<path id="second" fill="url(#SVGID_4_)" d="M965.377,330.887l-145.944-98.114l-88.609,59.584c-8.585,5.825-19.01,4.088-25.755-1.941
							c0.817,0.817,1.635,1.532,2.555,2.146l233.838,169.246c13.798,9.914,33.012,0.103,33.012-16.863v-96.785
							C974.575,341.209,971.1,334.771,965.377,330.887z"/>
						<linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="-295.2271" y1="215.9648" x2="-295.2271" y2="-73.9209" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#F29D27"}}/>
							<stop  offset="1" style={{stopColor: "#A16A29"}}/>
						</linearGradient>
						<path id="first" fill="url(#SVGID_5_)" d="M707.01,173.394L941.563,3.636c13.798-9.913,33.012-0.102,33.012,16.863v96.785
							c0,6.95-3.476,13.389-9.198,17.272l-234.554,157.8c-13.798,9.301-32.398-0.613-32.398-17.272v-84.827
							C698.425,183.613,701.594,177.277,707.01,173.394z"/>
					</g>
				<g id="logo3" x="0px" y="50px">
											<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="-290.6265" y1="702.6533" x2="-290.6265" y2="474.5693" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
					</linearGradient>
					<path fill="url(#SVGID_1_)" d="M965.377,658.342l-145.944-98.114l-88.712,59.686c-7.461,5.009-16.25,4.396-22.791,0.205
						c0.613,0.511,1.125,0.92,1.737,1.431l231.794,167.815c13.798,9.914,33.012,0.103,33.012-16.863v-96.785
						C974.575,668.766,971.1,662.225,965.377,658.342z"/>
					<g>
						<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="-300.6274" y1="536.5273" x2="-300.6274" y2="314.3662" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
						</linearGradient>
						<path fill="url(#SVGID_2_)" d="M941.563,461.807L851.217,396.5L707.01,500.95c-5.416,3.884-8.585,10.118-8.585,16.863v84.93
							c0,16.659,18.601,26.471,32.398,17.272l232.714-156.573C956.894,466.815,948.514,466.917,941.563,461.807z"/>
						
						<linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="-160.124" y1="362.9458" x2="-160.124" y2="362.59" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#1D304A"}}/>
							<stop  offset="1" style={{stopColor: "#111D2D"}}/>
						</linearGradient>
						<path fill="url(#SVGID_3_)" d="M974.575,445.762c0,0.102,0,0.204,0,0.408C974.575,446.068,974.575,445.966,974.575,445.762z"/>
					</g>
						<linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="-292.0259" y1="382.1465" x2="-292.0259" y2="154.1626" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#F29D27"}}/>
							<stop  offset="1" style={{stopColor: "#A16A29"}}/>
						</linearGradient>
						<path fill="url(#SVGID_4_)" d="M965.377,330.887l-145.944-98.114l-88.609,59.584c-8.585,5.825-19.01,4.088-25.755-1.941
							c0.817,0.817,1.635,1.532,2.555,2.146l233.838,169.246c13.798,9.914,33.012,0.103,33.012-16.863v-96.785
							C974.575,341.209,971.1,334.771,965.377,330.887z"/>
						<linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="-295.2271" y1="215.9648" x2="-295.2271" y2="-73.9209" gradientTransform="matrix(1.022 0 0 1.022 1138.2222 75.2188)">
							<stop  offset="0" style={{stopColor: "#F29D27"}}/>
							<stop  offset="1" style={{stopColor: "#A16A29"}}/>
						</linearGradient>
						<path fill="url(#SVGID_5_)" d="M707.01,173.394L941.563,3.636c13.798-9.913,33.012-0.102,33.012,16.863v96.785
							c0,6.95-3.476,13.389-9.198,17.272l-234.554,157.8c-13.798,9.301-32.398-0.613-32.398-17.272v-84.827
							C698.425,183.613,701.594,177.277,707.01,173.394z"/>
					</g>
			</svg>
			<div id="loaderText" style={{marginTop: "15px"}}>
				<div id="blockIndexLoad" ref="blockIndexLoad">
					<p id="loading" style={{fontSize: "45px", fontWeight: "bold"}}>{ this.props.lang.loading }</p>
				</div>
				<p ref="mainMessage" style={{marginTop: "-50px", fontWeight:"300", visibility:"hidden"}} id="gettingReady">{ this.props.lang.mainMessage }</p>
			</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    lang: state.startup.lang,
    loading: state.startup.loading,
    updatingApplication: state.startup.updatingApp,
    showingFunctionIcons: state.application.showingFunctionIcons
  };
};



export default connect(mapStateToProps, actions, null)(Loader);
