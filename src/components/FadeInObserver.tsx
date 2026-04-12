"use client";

import { useEffect } from "react";

export default function FadeInObserver() {
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add("visible");
					}
				}
			},
			{ threshold: 0.1 },
		);

		const staggerObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const items = entry.target.querySelectorAll(".fade-in-item");
						items.forEach((item, index) => {
							setTimeout(() => {
								item.classList.add("visible");
							}, index * 150);
						});
					}
				}
			},
			{ threshold: 0.1 },
		);

		const fadeEls = document.querySelectorAll(".fade-in");
		for (const el of fadeEls) {
			observer.observe(el);
		}

		const staggerEls = document.querySelectorAll(".fade-in-stagger");
		for (const el of staggerEls) {
			staggerObserver.observe(el);
		}

		return () => {
			observer.disconnect();
			staggerObserver.disconnect();
		};
	}, []);

	return null;
}
