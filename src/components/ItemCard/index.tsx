import React from 'react';
import { FaceIcon, CheckIcon, HamburgerMenuIcon, ExternalLinkIcon, BellIcon } from '@radix-ui/react-icons';
import './styles.css';

export type ItemProps = {
	title: string,
	subtitle: string,
	description: string,
	license: string,
	url: string,
	applications: string,
};

export function ItemCard({ title, subtitle, description, license, url, applications }: ItemProps) {
	return (
		<section className="item">
			<FaceIcon className="icon" />
			<div className="content">
				<header className="item-header">
					<div className="item-content">
						<h2 className="item-title">{title}</h2>
						<span className="item-subtitle">{subtitle}</span>
					</div>
					<div className="item-actions">
						<BellIcon className="icon bell" role="button" tabIndex={0} onClick={async () => {
							const phoneNumber = prompt('Enter your phone number (+19876543210):');
							if (phoneNumber && phoneNumber.match(/^\+1\d{10}$/)) {
								const response = await fetch('/api/subscribe', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({
										source_name: title,
										phone_number: phoneNumber,
									})
								});
								const data = await response.json();
								if (data.success) {
									alert('Subscribed successfully!');
								} else {
									alert(`Failed to subscribe: ${data.message}`);
								}
							} else {
								alert('You must enter a phone number in the specified format.')
							}
						}} />
						<a href={url} target="_blank">
							<ExternalLinkIcon className="icon external-link" />
						</a>
					</div>
				</header>
				<p className="item-description">{description}</p>
				<span className="item-license" title="License">{license}</span>
				<p className="item-application" title="Application">{applications}</p>
			</div>
		</section>
	);
}