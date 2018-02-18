import React from 'react'
import { Field, reduxForm } from 'redux-form'

import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import RadioButton from '@folio/stripes-components/lib/RadioButton';
import RadioButtonGroup from '@folio/stripes-components/lib/RadioButtonGroup';

import Owners from './Owners'

class CopyForm extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {

		const options = [];

		this.props.owners.forEach(owner => {
			if(owner.desc != "Shared" )options.push({label: owner.desc, value: owner.id});
		});

		return(
			<form>
      	<Field name="copyowner" component={RadioButtonGroup} onChange={this.props.onChangeRadio}>
        	<RadioButton label="Yes" id="yes" value="true" inline checked/>
					<Field
						name="selectedowner"
						component={Select}
						dataOptions={options}
						onChange={this.props.onChangeOwner}
            placeholder="Select One"
					/>
          <RadioButton label="No" id="no" value="false"/>
				</Field>
        <Button onClick={this.props.onClickContinue} >Continue</Button>
        <Button onClick={this.props.closeModal}>Cancel</Button>
			</form>
		);
	}
}

CopyForm = reduxForm({
  form: 'copyForm',
  fields: [ /* ... */ ],
})(CopyForm);

export default CopyForm;
