import React from 'react';
import PropTypes from 'prop-types';
import FeeFines from './FeeFinesTable';
import Pane from '@folio/stripes-components/lib/Pane';

class FeefinesTypesSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
   this.connectedFeeFines = props.stripes.connect(FeeFines);
  }

  render() {
    return (<Pane defaultWidth="fill" fluidContentWidth paneTitle="Fees/Fines Table">
      <this.connectedFeeFines
        {...this.props}
        baseUrl="feefines"
        records="feefines"
        label="Fees/Fines Table"
        nameKey="feeFineType"
      /></Pane>
    );
  }
}

export default FeefinesTypesSettings;
