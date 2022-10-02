import React from 'react';
import { ExternalLinkIcon, BellIcon, LayersIcon } from '@radix-ui/react-icons';
import './styles.css';
//import UrlMetadata from 'url-metadata';

export type ItemProps = {
	title: string,
	subtitle: string,
	description: string,
	license: string,
	url: string,
	applications: string,
};

export function truncateStringMiddle(
	value: string,
	maxLength: number,
	separator: string = '\u2026'
): string {
	if (value.length <= maxLength) { return value; }

	const charsToShow = maxLength - separator.length;
	const frontChars = Math.ceil(charsToShow/2);
	const backChars = Math.floor(charsToShow/2);

	return value.substr(0, frontChars) +
		separator +
		value.substr(value.length - backChars);
}

export function ItemCard({ title, subtitle, description, license, url, applications }: ItemProps) {
	let desc: string = description ? description : '';
	// if(desc.length === 0) {
	// 	let metadata = getMetadata(url).then((data) => {
	// 		desc = data.description as string;
	// 	});
	// }

	return (
		<section className="item">
			<LayersIcon className="icon" />
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
				<ul className="statistics">
					<li className="stat-field">
						<span className="stat-field-label">License</span>
						<span className="item-tag license" title={license}>{truncateStringMiddle(license, 20)}</span>
					</li>
					<li className="stat-field">
						<span className="stat-field-label">Application</span>
						<span className="item-tag application" title={applications}>{applications}</span>
					</li>
				</ul>
			</div>
		</section>
	);
}