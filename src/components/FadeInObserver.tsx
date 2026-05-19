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
			{ threshold: 0, rootMargin: "0px 0px -10% 0px" },
		);

		const staggerObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const items = entry.target.querySelectorAll(".fade-in-item");
						const maxDelay = 800;
						const step = Math.min(
							150,
							Math.floor(maxDelay / Math.max(1, items.length)),
						);
						items.forEach((item, index) => {
							setTimeout(() => {
								item.classList.add("visible");
							}, index * step);
						});
					}
				}
			},
			{ threshold: 0, rootMargin: "0px 0px -10% 0px" },
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
