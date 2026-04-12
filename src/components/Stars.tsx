"use client";

import { useEffect } from "react";

export default function Stars() {
	useEffect(() => {
		const count = 120;
		const stars: HTMLDivElement[] = [];
		for (let i = 0; i < count; i++) {
			const star = document.createElement("div");
			star.className = "star";
			star.style.left = `${Math.random() * 100}vw`;
			star.style.top = `${Math.random() * 100}vh`;
			star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
			star.style.setProperty("--delay", `${Math.random() * 5}s`);
			document.body.appendChild(star);
			stars.push(star);
		}
		return () => {
			for (const star of stars) {
				star.remove();
			}
		};
	}, []);

	return null;
}
