import React, { useState } from 'react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
function Index() {
	const [modal, setModal] = useState({ open: false });
	return (
		<Page>
			<ResourcePicker
				resourceType='Product'
				showVariants={false}
				open={modal.open}
				onCancel={() => setModal({ open: false })}
			/>
			<Layout>
				<EmptyState
					heading='Manage your inventory transfers'
					action={{
						content: 'Select Products',
						onAction: () => setModal({ open: true }),
					}}
					image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
				>
					<p>Select Products</p>
				</EmptyState>
			</Layout>
		</Page>
	);
}

export default Index;
