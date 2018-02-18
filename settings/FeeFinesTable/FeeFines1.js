import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Select from '@folio/stripes-components/lib/Select';
import Modal from '@folio/stripes-components/lib/Modal';
import EditableList from './EditableList'

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FeeFines extends React.Component {

	static propTypes = {
   	resources: PropTypes.shape({
      	feefines: PropTypes.shape({
	      	records: PropTypes.arrayOf(PropTypes.object),
	      }),
	      owners: PropTypes.shape({
   	   	records: PropTypes.arrayOf(PropTypes.object),
	      }),
   	}).isRequired,
		mutator: PropTypes.shape({
      	feefines: PropTypes.shape({
      		POST: PropTypes.func.isRequired,
            PUT: PropTypes.func.isRequired,
            DELETE: PropTypes.func.isRequired,
      	}),
    	}).isRequired,
		okapi: PropTypes.object,
	};

	static manifest = Object.freeze({
   	userCount: { initialValue: INITIAL_RESULT_COUNT },
    	feefines: {
      	type: 'okapi',
      	records: 'feefines',
      	path: 'feefines',
	      recordsRequired: '%{userCount}',
	      perRequest: RESULT_COUNT_INCREMENT,
			PUT: {
				path: 'feefines/%{activeRecord.id}',
			},
         DELETE: {
         	path: 'feefines/%{activeRecord.id}',
         },
   	},
   	owners: {
      	type: 'okapi',
	      records: 'owners',
	      recordsRequired: '%{userCount}',
	      perRequest: RESULT_COUNT_INCREMENT,
	      path: 'owners',
   	},
      activeRecord: {},
	});

   constructor(props) {
      super(props);

		this.state = {
			ownerid: "0",
			copyOwnerModal: false,
		}

	   this.onCreateType = this.onCreateType.bind(this);
      this.onDeleteType = this.onDeleteType.bind(this);
		this.onUpdateType = this.onUpdateType.bind(this);

		this.onChangeOwner = this.onChangeOwner.bind(this);

		this.onCloseCopyOwnerModal = this.onCloseCopyOwnerModal.bind(this);
		this.onOpenCopyOwnerModal = this.onOpenCopyOwnerModal.bind(this);

		const logger = props.stripes.logger;
    	this.log = logger.log.bind(logger);

   }

	onChangeOwner(e) {
		this.setState({
			ownerid: e.target.value,
		});
	}

	onCloseCopyOwnerModal(e) {
      this.setState({
         copyOwnerModal: false,
      });
   }

	onOpenCopyOwnerModal(e) {
      this.setState({
         copyOwnerModal: true,
      });
   }

	onCreateType(type) {
/*      type.ownerid = ownerid;
      if(type.allowmanualcreation==""){type.allowmanualcreation = true}
      this.props.mutator.feefines.POST(type);*/
   }

   onDeleteType(typeId) {
/*      this.props.mutator.activeRecord.update({ id: typeId });
      this.props.mutator.feefines.DELETE(this.props.resources.feefines.records.find(t => t.id === typeId));*/
   }

	onUpdateType(type) {
/*      this.props.mutator.activeRecord.update({ id: type.id });
      delete type.metadata;
      this.props.mutator.feefines.PUT(type);*/
   }

   render () {
		const resources = this.props.resources;
		const ownerid = this.state.ownerid;

   	const suppressor = {
  			delete: () => true,
   		edit: () => false,
      };

		let feefines = _.get(resources, ['feefines', 'records'], []);
		const owners = _.get(resources, ['owners', 'records'],[]);

		if(ownerid != "0") {
			feefines = feefines.filter(f => f.ownerid === ownerid);
		}

		const options = [];
		options.push({label: "Shared", value: "*"});
		owners.forEach(o => {
			options.push({label: o.desc, value: o.id});
		});

		return (
				<Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
					FEE/FINE OWNER<Select dataOptions={options} onChange={this.onChangeOwner}/>
					<EditableList
						contentData={feefines}
						createButtonLabel="+ Add new"
                  visibleFields={['feefinetype', 'defaultamount', 'allowmanualcreation', 'taxvat']}
					   itemTemplate={{ id: 'number', feefinetype: 'string' , defaultamount: 'string', allowmanualcreation: 'string', taxvat: 'string'}} 
					   onUpdate={this.onUpdateType}
					   onDelete={this.onDeleteType}
					   onCreate={this.onCreateType}
						isEmptyMessage={`There are no Fees/Fines`}
		            nameKey={this.props.nameKey}
					   actionSuppression={suppressor}
            	/>
					<Modal
						isOpen={this.state.copyOwnerModal}
						onClose={this.onCloseCopyOwnerModal}
						label="Copy existing fee/fine owner table entries?"
						size="small"
					>
						CopyModal !!!!
					</Modal>
				</Pane>
		)
   }
}

export default FeeFines;
