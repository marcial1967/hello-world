import React from 'react'
import PropTypes from 'prop-types';

import Modal from '@folio/stripes-components/lib/Modal';

import CopyForm from './CopyForm'

let ownerid = 0;

class CopyOwnerModal extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			reply: "true",
		}

		this.onChangeRadio = this.onChangeRadio.bind(this);
		this.onContinue = this.onContinue.bind(this);
		this.onChangeOwner = this.onChangeOwner.bind(this);
	}

	onContinue(e) {
		if(this.state.reply=="true") {
			this.props.onContinue(ownerid);
			this.props.closeCB();
		} else {
			this.props.closeCB();
		}
	}

	onChangeOwner(e) {
		ownerid = e.target.value;
	}

	onChangeRadio(e) {
		this.setState({reply: e.target.value});
	}

	render() {
		return(
			<Modal
   			onClose={this.props.closeCB}
	   	  open={this.props.openWhen}
		    label="Copy existing fee/fine owner table entries?"
	   	 	size="small"
			>
		  	<CopyForm
	   	  	closeModal={this.props.closeCB}
	      	owners={this.props.owners}
		      onChangeOwner={this.onChangeOwner}
   		    onClickContinue={this.onContinue}
      		onChangeRadio={this.onChangeRadio}
		    />
			</Modal>
		);
	}

}

export default CopyOwnerModal;
