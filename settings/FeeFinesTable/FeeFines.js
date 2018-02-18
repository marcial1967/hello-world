import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import Owners from './Owners';
import EditableList from './EditableList'
import CopyOwnerModal from './CopyOwnerModal';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;

let ownerId = 0;
let notEmptyList = [];
let render = true;

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
    location: PropTypes.shape({
    	search: PropTypes.string,
		}).isRequired,
    history: PropTypes.shape({
    	push: PropTypes.func.isRequired,
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
			GET: {
				path: 'feefines?query=(ownerId=%{activeRecord.ownerId})&limit=100'
      },
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
		allfeefines: {
			type: 'okapi',
      records: 'feefines',
      recordsRequired: '%{userCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      path: 'feefines',
		},
    activeRecord: {},
	});

  constructor(props) {
  	super(props);

		this.state = {
			searchTerm: '*',
			openModal: false,
		}

	  this.onCreateType = this.onCreateType.bind(this);
    this.onDeleteType = this.onDeleteType.bind(this);
		this.onUpdateType = this.onUpdateType.bind(this);

		this.onChangeOwner = this.onChangeOwner.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.copyOwner = this.copyOwner.bind(this)

	}

	onCreateType(type) {
  	type.ownerId = ownerId;
    if(type.allowManualCreation==""){type.allowManualCreation = true}
    this.props.mutator.feefines.POST(type);
  }

	onUpdateType(type) {
  	this.props.mutator.activeRecord.update({ id: type.id });
    delete type.metadata;
    this.props.mutator.feefines.PUT(type);
  }

  onDeleteType(typeId) {
  	this.props.mutator.activeRecord.update({ id: typeId });
    this.props.mutator.feefines.DELETE(this.props.resources.feefines.records.find(t => t.id === typeId));
  }

  closeModal() {
    this.setState({ openModal: false});
  }

	onChangeOwner(e) {
    ownerId = e.target.value;
		const owners = (this.props.resources.owners || {}).records || [];
		const shared = owners.find(o => o.desc === "Shared") || {};
    this.setState({ searchTerm: ownerId });
		this.props.mutator.activeRecord.update({ownerId: ownerId});
    const ids = [];
    notEmptyList.forEach(owner => {
      ids.push(owner.id)
    });
    if(ids.indexOf(ownerId)<0&&ids.length!=0&&ownerId!=shared.id) {
    	this.setState({openModal: true})
    }
	}

	copyOwner(selectedOwner) {
		const feefines = (this.props.resources.allfeefines || {}).records || [];
		feefines.forEach( feefine => {
			if(feefine.ownerId === selectedOwner) {
				feefine.id = uuid();
				feefine.ownerId = ownerId;
    		this.props.mutator.feefines.POST(feefine);
			}
		});
	}

	componentDidMount() {
		const owners = (this.props.resources.owners || {}).records || [];
		const shared = owners.find(o => o.desc === "Shared");
		const sharedId = (shared)?shared.id:'0';
		this.setState({ searchTerm: sharedId });
		this.props.mutator.activeRecord.update({ownerId: sharedId});
	}

	componentWillReceiveProps(next_props) {
		if(render && next_props.resources.owners.records.length != 0) {
			const shared = ((next_props.resources.owners || {}).records || []).find(o => o.desc === 'Shared').id;
			ownerId = shared;
			this.props.mutator.activeRecord.update({ownerId: shared});
			render = false;
		}
	}

	render () {

		const suppressor = {
			delete: () => true,
			edit: () => false,
		};

		const resources = this.props.resources;
		const feefines = (resources.feefines || {}).records || [];
		const data = (resources.allfeefines || {}).records || [];
		const owners = (resources.owners || {}).records || [];


		const ownerList = [];
		notEmptyList = [];

		data.forEach( feefine => {
			if(ownerList.indexOf(feefine.ownerId) < 0) {
				ownerList.push(feefine.ownerId)
			}
    });

		owners.forEach(owner => {
			if(ownerList.indexOf(owner.id) >=0 ) {
				notEmptyList.push(owner)
			}
		});

		return (
			<div>
				FEE/FINE OWNER<Owners dataOptions={owners} onChange={this.onChangeOwner}/>
				<EditableList
					{...this.props}
					contentData={feefines}
					createButtonLabel="+ Add new"
          visibleFields={['feeFineType', 'defaultAmount', 'allowManualCreation', 'taxVat']}
				  itemTemplate={{ id: 'number', feeFineType: 'string' , defaultAmount: 'string', allowManualCreation: 'string', taxVat: 'string'}} 
				  onUpdate={this.onUpdateType}
				  onDelete={this.onDeleteType}
				  onCreate={this.onCreateType}
					nameKey={this.props.nameKey}
					actionSuppression={suppressor}
        />

				<CopyOwnerModal
					openWhen={this.state.openModal}
					owners={notEmptyList}
					onContinue={this.copyOwner}
					cancel={this.closeModal}
					closeCB={this.closeModal}
				/>

			</div>
		);
	}

}

export default FeeFines;
