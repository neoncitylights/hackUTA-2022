import React from 'react';
import { FaceIcon, CheckIcon, HamburgerMenuIcon, ExternalLinkIcon, BellIcon } from '@radix-ui/react-icons';
import './styles.css';

export type ItemProps = {
	title: string,
	subtitle: string,
	description: string,
	license: string,
	url: string,
};

export function ItemCard({title, subtitle, description, license, url}: ItemProps) {
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
						<BellIcon className="icon bell" />
						<a href={url} target="_blank">
							<ExternalLinkIcon className="icon external-link"/>
						</a>
					</div>
				</header>
				<p className="item-description">{description}</p>
				<span className="item-license">{license}</span>
			</div>
		</section>
	);
}