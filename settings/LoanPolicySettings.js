import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class FeefinesTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="feefines"
        records="feefines"
        label="feefines Types"
        visibleFields={['desc']}
        itemTemplate={{ feefinetype: 'string', id: 'string' }}
        nameKey="feefinetype"
      />
    );
  }
}

export default FeefinesTypesSettings;
