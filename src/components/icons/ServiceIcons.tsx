type IconProps = {
	className?: string;
	size?: number;
};

const svgBase = (size: number) => ({
	width: size,
	height: size,
	viewBox: "0 0 32 32",
	fill: "none" as const,
	xmlns: "http://www.w3.org/2000/svg",
});

/** Anthropic / Claude four-point asterisk mark */
export function ClaudeMark({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className} aria-hidden="true">
			<path
				d="M16 2c0.9 4.7 2.6 10.2 14 14-11.4 3.8-13.1 9.3-14 14-0.9-4.7-2.6-10.2-14-14 11.4-3.8 13.1-9.3 14-14z"
				fill="currentColor"
			/>
		</svg>
	);
}

/** OpenAI knot-like mark, simplified */
export function OpenAiMark({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className} aria-hidden="true">
			<circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.4" />
			<path
				d="M16 7v9M16 16l7.8 4.5M16 16l-7.8 4.5"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
			<circle cx="16" cy="7" r="1.6" fill="currentColor" />
			<circle cx="23.8" cy="20.5" r="1.6" fill="currentColor" />
			<circle cx="8.2" cy="20.5" r="1.6" fill="currentColor" />
		</svg>
	);
}
