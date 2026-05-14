"use client";

import { useEffect, useRef } from "react";

interface Node {
	x: number;
	y: number;
	vx: number;
	vy: number;
	r: number;
}

const LINK_DIST = 130;
const CURSOR_PULL_RADIUS = 180;
const CLICK_IMPULSE_RADIUS = 220;

export default function Constellation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const parent = canvas.parentElement;
		if (!parent) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		let width = 0;
		let height = 0;
		const nodes: Node[] = [];
		const cursor = { x: -9999, y: -9999, active: false };

		const targetCount = () =>
			Math.max(24, Math.min(72, Math.floor((width * height) / 18000)));

		const initNodes = () => {
			nodes.length = 0;
			const count = targetCount();
			for (let i = 0; i < count; i++) {
				nodes.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.25,
					vy: (Math.random() - 0.5) * 0.25,
					r: 0.8 + Math.random() * 0.8,
				});
			}
		};

		const resize = () => {
			const rect = parent.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = width * dpr;
			canvas.height = height * dpr;
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (nodes.length === 0) {
				initNodes();
			} else {
				for (const n of nodes) {
					n.x = Math.min(Math.max(n.x, 0), width);
					n.y = Math.min(Math.max(n.y, 0), height);
				}
			}
		};
		resize();

		const onResize = () => resize();
		window.addEventListener("resize", onResize);

		const onMove = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			cursor.x = e.clientX - rect.left;
			cursor.y = e.clientY - rect.top;
			cursor.active = true;
		};
		const onLeave = () => {
			cursor.active = false;
			cursor.x = -9999;
			cursor.y = -9999;
		};
		const onDown = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			const cx = e.clientX - rect.left;
			const cy = e.clientY - rect.top;
			for (const n of nodes) {
				const dx = n.x - cx;
				const dy = n.y - cy;
				const d2 = dx * dx + dy * dy;
				const radius = CLICK_IMPULSE_RADIUS;
				if (d2 < radius * radius) {
					const d = Math.sqrt(d2) || 1;
					const strength = (1 - d / radius) * 3.5;
					n.vx += (dx / d) * strength;
					n.vy += (dy / d) * strength;
				}
			}
		};
		parent.addEventListener("pointermove", onMove);
		parent.addEventListener("pointerleave", onLeave);
		parent.addEventListener("pointerdown", onDown);

		let raf = 0;

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			if (!reduceMotion) {
				for (const n of nodes) {
					// Cursor pull
					if (cursor.active) {
						const dx = cursor.x - n.x;
						const dy = cursor.y - n.y;
						const d2 = dx * dx + dy * dy;
						const r = CURSOR_PULL_RADIUS;
						if (d2 < r * r && d2 > 1) {
							const d = Math.sqrt(d2);
							const pull = (1 - d / r) * 0.04;
							n.vx += (dx / d) * pull;
							n.vy += (dy / d) * pull;
						}
					}

					// Velocity damping (so click impulses decay)
					n.vx *= 0.985;
					n.vy *= 0.985;
					// Gentle drift: floor of velocity so nodes never freeze
					const speed = Math.hypot(n.vx, n.vy);
					if (speed < 0.08) {
						const a = Math.random() * Math.PI * 2;
						n.vx += Math.cos(a) * 0.02;
						n.vy += Math.sin(a) * 0.02;
					}

					n.x += n.vx;
					n.y += n.vy;

					// Reflect at edges
					if (n.x < 0) {
						n.x = 0;
						n.vx = Math.abs(n.vx);
					} else if (n.x > width) {
						n.x = width;
						n.vx = -Math.abs(n.vx);
					}
					if (n.y < 0) {
						n.y = 0;
						n.vy = Math.abs(n.vy);
					} else if (n.y > height) {
						n.y = height;
						n.vy = -Math.abs(n.vy);
					}
				}
			}

			// Draw connection lines (including to cursor as virtual node)
			ctx.lineWidth = 0.6;
			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					const dx = a.x - b.x;
					const dy = a.y - b.y;
					const d2 = dx * dx + dy * dy;
					if (d2 < LINK_DIST * LINK_DIST) {
						const d = Math.sqrt(d2);
						const alpha = (1 - d / LINK_DIST) * 0.22;
						ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.stroke();
					}
				}
				if (cursor.active) {
					const dx = a.x - cursor.x;
					const dy = a.y - cursor.y;
					const d2 = dx * dx + dy * dy;
					const r = CURSOR_PULL_RADIUS;
					if (d2 < r * r) {
						const d = Math.sqrt(d2);
						const alpha = (1 - d / r) * 0.38;
						ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(cursor.x, cursor.y);
						ctx.stroke();
					}
				}
			}

			// Draw nodes
			for (const n of nodes) {
				ctx.fillStyle = "rgba(255,255,255,0.65)";
				ctx.beginPath();
				ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
				ctx.fill();
			}

			// Cursor glow
			if (cursor.active) {
				const g = ctx.createRadialGradient(
					cursor.x,
					cursor.y,
					0,
					cursor.x,
					cursor.y,
					CURSOR_PULL_RADIUS,
				);
				g.addColorStop(0, "rgba(255,255,255,0.05)");
				g.addColorStop(1, "rgba(255,255,255,0)");
				ctx.fillStyle = g;
				ctx.fillRect(
					cursor.x - CURSOR_PULL_RADIUS,
					cursor.y - CURSOR_PULL_RADIUS,
					CURSOR_PULL_RADIUS * 2,
					CURSOR_PULL_RADIUS * 2,
				);
			}

			raf = requestAnimationFrame(draw);
		};

		raf = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", onResize);
			parent.removeEventListener("pointermove", onMove);
			parent.removeEventListener("pointerleave", onLeave);
			parent.removeEventListener("pointerdown", onDown);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="constellation-canvas"
			aria-hidden="true"
		/>
	);
}
