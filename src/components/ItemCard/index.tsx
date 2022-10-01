import React from 'react';
import { FaceIcon, CheckIcon, HamburgerMenuIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import './styles.css';

export type ItemProps = {
	title: string,
	subtitle: string,
	description: string,
};

export function ItemCard({title, subtitle, description}: ItemProps) {
	return (
		<section className="item">
			<FaceIcon className="icon" />
			<div className="content">
				<header className="item-header">
					<div className="item-content">
						<h2 className="item-title">{title}</h2>
						<span className="item-subtitle">{subtitle}</span>
					</div>
					<ExternalLinkIcon className="icon external-link" />
				</header>
				<p className="item-description">{description}</p>
				<span className="item-license">CC-BY-SA-4.0</span>
			</div>
		</section>
	);
}