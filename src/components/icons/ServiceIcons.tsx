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
	"aria-hidden": true,
});

export function StrategyIcon({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<circle
				cx="16"
				cy="16"
				r="12"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1.4" />
			<circle cx="16" cy="16" r="2" fill="currentColor" />
			<path
				d="M16 2v4M16 26v4M2 16h4M26 16h4"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function DiscoveryIcon({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<circle
				cx="13"
				cy="13"
				r="8.5"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<path
				d="M19.5 19.5L28 28"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
			<path
				d="M9.5 13h7M13 9.5v7"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function FdeIcon({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<circle cx="6" cy="16" r="3" stroke="currentColor" strokeWidth="1.4" />
			<path
				d="M9 16h14"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
			<path
				d="M19 10l6 6-6 6"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="6" cy="16" r="0.8" fill="currentColor" />
		</svg>
	);
}

export function GovernanceIcon({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<path
				d="M16 3l11 4v8c0 7-5 12.5-11 14-6-1.5-11-7-11-14V7l11-4z"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinejoin="round"
			/>
			<path
				d="M11 16l4 4 7-8"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function HarnessIcon({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<circle cx="16" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
			<circle cx="6" cy="24" r="3" stroke="currentColor" strokeWidth="1.4" />
			<circle cx="26" cy="24" r="3" stroke="currentColor" strokeWidth="1.4" />
			<circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.4" />
			<path
				d="M16 9v4M14 18.5l-6 3M18 18.5l6 3"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function MangaIcon({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<rect
				x="4"
				y="4"
				width="11"
				height="11"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<rect
				x="17"
				y="4"
				width="11"
				height="11"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<rect
				x="4"
				y="17"
				width="24"
				height="11"
				rx="1"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
			<path
				d="M20 21.5h5M20 24.5h3"
				stroke="currentColor"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/** Anthropic / Claude four-point asterisk mark */
export function ClaudeMark({ className, size = 44 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
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
		<svg {...svgBase(size)} className={className}>
			<circle
				cx="16"
				cy="16"
				r="13"
				stroke="currentColor"
				strokeWidth="1.4"
			/>
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

/* ---------- Category (smaller) icons ---------- */

export function StrategyCatIcon({ className, size = 20 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<path
				d="M7 4v24"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
			<path
				d="M7 5l16 4-16 4"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinejoin="round"
				fill="none"
			/>
		</svg>
	);
}

export function BuildCatIcon({ className, size = 20 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<circle
				cx="16"
				cy="16"
				r="3"
				stroke="currentColor"
				strokeWidth="1.6"
			/>
			<path
				d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l3 3M22 22l3 3M22 10l3-3M7 25l3-3"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function ShieldCatIcon({ className, size = 20 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<path
				d="M16 3l11 4v8c0 7-5 12.5-11 14-6-1.5-11-7-11-14V7l11-4z"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function ContentCatIcon({ className, size = 20 }: IconProps) {
	return (
		<svg {...svgBase(size)} className={className}>
			<path
				d="M5 5h10a4 4 0 0 1 4 4v18a3 3 0 0 0-3-3H5V5z"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinejoin="round"
			/>
			<path
				d="M19 9a4 4 0 0 1 4-4h4v19h-11"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
