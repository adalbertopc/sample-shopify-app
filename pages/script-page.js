import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useEffect } from 'react';
import axios from 'axios';
const CREATE_SCRIPT_TAG = gql`
	mutation scriptTagCreate($input: ScriptTagInput!) {
		scriptTagCreate(input: $input) {
			scriptTag {
				id
			}
			userErrors {
				field
				message
			}
		}
	}
`;
function ScriptPage() {
	const cors = 'https://cors-anywhere.herokuapp.com/';
	const fetchData = async () => {
		const res = await axios.get(
			`https://purple-dragon-0.loca.lt/api/getMetafields`
		);
		if ((await res).status == 200) {
			console.log((await res).status);
			console.log(res.data);
		}
	};
	const newMeta = {
		metafield: {
			namespace: 'seed',
			key: 'test',
			value: 1,
			value_type: 'integer',
		},
	};
	const postData = async () => {
		try {
			const res = await axios.post(
				`https://purple-dragon-0.loca.lt/api/metafield`,
				newMeta
			);
			console.log(res.data);
		} catch (error) {
			console.log('super error', error);
		}
	};
	useEffect(() => {
		//fetchData();
		postData();
	}, []);
	return (
		<div>
			<h1>Hello Script Page</h1>
		</div>
	);
}

export default ScriptPage;
