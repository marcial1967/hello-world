import React from 'react'

import Select from '@folio/stripes-components/lib/Select'

const Owners = (props) => {
	const options = [];
	const shared = props.dataOptions.find(d => d.desc === "Shared") || {};
	options.push(<option value={shared.id} key="0">{shared.desc}</option>)
   if (props.dataOptions) {
      props.dataOptions.forEach(option => {
         if (option.id != shared.id)options.push(<option value={option.id} key={option.id}>{option.desc}</option>);
      });
   }

	return(
		<Select style={{margin: '20px'}} onChange={props.onChange}>
      	{options}
   	</Select>
	)
}

export default Owners;
