"use client";

import { useEffect, useRef } from "react";

interface Curtain {
	baseX: number;
	phase: number;
	amp: number;
	speed: number;
	width: number;
	alpha: number;
}

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	r: number;
}

const CURTAIN_COUNT = 6;
const PARTICLES_PER_CLICK = 36;

export default function AuroraDrift() {
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
		const curtains: Curtain[] = [];
		const particles: Particle[] = [];
		const cursor = { x: -9999, y: -9999, active: false };

		const initCurtains = () => {
			curtains.length = 0;
			for (let i = 0; i < CURTAIN_COUNT; i++) {
				curtains.push({
					baseX:
						(i + 0.5) * (width / CURTAIN_COUNT) + (Math.random() - 0.5) * 80,
					phase: Math.random() * Math.PI * 2,
					amp: 70 + Math.random() * 90,
					speed: 0.00025 + Math.random() * 0.0005,
					width: 140 + Math.random() * 220,
					alpha: 0.05 + Math.random() * 0.07,
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
			initCurtains();
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
		};
		const onDown = (e: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			const cx = e.clientX - rect.left;
			const cy = e.clientY - rect.top;
			for (let i = 0; i < PARTICLES_PER_CLICK; i++) {
				const a = (i / PARTICLES_PER_CLICK) * Math.PI * 2 + Math.random() * 0.4;
				const speed = 0.8 + Math.random() * 3.2;
				particles.push({
					x: cx,
					y: cy,
					vx: Math.cos(a) * speed,
					vy: Math.sin(a) * speed,
					life: 1,
					r: 1 + Math.random() * 2.5,
				});
			}
		};
		parent.addEventListener("pointermove", onMove);
		parent.addEventListener("pointerleave", onLeave);
		parent.addEventListener("pointerdown", onDown);

		let raf = 0;
		let t = 0;

		const draw = () => {
			if (!reduceMotion) t += 1;

			ctx.clearRect(0, 0, width, height);
			ctx.globalCompositeOperation = "lighter";

			// Subtle vertical wash
			const bg = ctx.createLinearGradient(0, 0, 0, height);
			bg.addColorStop(0, "rgba(255,255,255,0.018)");
			bg.addColorStop(1, "rgba(255,255,255,0)");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, width, height);

			// Sky curtains
			for (const c of curtains) {
				const drift = Math.sin(c.phase + t * c.speed) * c.amp;
				let x = c.baseX + drift;
				if (cursor.active) {
					const dx = cursor.x - x;
					const falloff = Math.exp(-Math.abs(dx) / 220);
					x += Math.sign(dx) * falloff * 50;
				}
				const g = ctx.createLinearGradient(
					x - c.width / 2,
					0,
					x + c.width / 2,
					0,
				);
				g.addColorStop(0, "rgba(255,255,255,0)");
				g.addColorStop(0.5, `rgba(255,255,255,${c.alpha})`);
				g.addColorStop(1, "rgba(255,255,255,0)");
				ctx.fillStyle = g;
				ctx.fillRect(x - c.width / 2, 0, c.width, height);
			}

			// Cursor glow
			if (cursor.active) {
				const rg = ctx.createRadialGradient(
					cursor.x,
					cursor.y,
					0,
					cursor.x,
					cursor.y,
					200,
				);
				rg.addColorStop(0, "rgba(255,255,255,0.08)");
				rg.addColorStop(1, "rgba(255,255,255,0)");
				ctx.fillStyle = rg;
				ctx.fillRect(cursor.x - 200, cursor.y - 200, 400, 400);
			}

			// Click blooms
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;
				p.vx *= 0.96;
				p.vy *= 0.96;
				p.life -= 0.012;
				if (p.life <= 0) {
					particles.splice(i, 1);
					continue;
				}
				ctx.fillStyle = `rgba(255,255,255,${p.life * 0.6})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r * (0.4 + p.life * 0.6), 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.globalCompositeOperation = "source-over";

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
		<canvas ref={canvasRef} className="aurora-canvas" aria-hidden="true" />
	);
}
