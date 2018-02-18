import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { Field } from 'redux-form';
import Button from '@folio/stripes-components/lib/Button';
import TextField from '@folio/stripes-components/lib/TextField';
import Select from '@folio/stripes-components/lib/Select';

const ItemEdit = ({ field, visibleFields, additionalFields, onCancel, onSave }) => {
  const fields = visibleFields.map(name => {
	if(name=="allowManualCreation") {
		return(
			<Col key={name} xs>
				<Field
                name={`${field}.${name}`}
					 id={name}
                component={Select}
                fullWidth
					 marginBottom0
                dataOptions={[{label:"Yes", value: true}, {label:"No", value: false}]}
              />
			</Col>
		)
	} else if(name=="taxVat"|| name=="defaultAmount") {
		return(
      <Col key={name} xs>
          <Field
            name={`${field}.${name}`}
          	id={name}
          	type="number"
            component={TextField}
            fullWidth
            marginBottom0
            placeholder={name}
            endControl={<span></span>}
          />
        </Col>
    );
	} else {
		return(
   		<Col key={name} xs>
      		<Field
	        		name={`${field}.${name}`}
					id={name}
        			component={TextField}
        			fullWidth
        			marginBottom0
        			placeholder={name}
      		/>
    		</Col>
		)
	}
  });

  const actions = (
    <Row end="xs" around="xs">
      <Col xs>
        <Button onClick={onCancel} aria-label="Cancel">Cancel</Button>
        <Button onClick={onSave} aria-label="Save Item">Save</Button>
      </Col>
    </Row>
  );

  if (additionalFields) {
    _.forOwn(additionalFields, (additionalField) => {
      fields.push((
        <Col key={additionalField.gloss} xs />
      ));
    });
  }

  return (
    <Row around="xs">
      {fields}
      <Col xs>{actions}</Col>
    </Row>
  );
};

ItemEdit.propTypes = {
  field: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  visibleFields: PropTypes.arrayOf(PropTypes.string),
  additionalFields: PropTypes.object,
};

export default ItemEdit;
