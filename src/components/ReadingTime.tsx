interface Props {
	minutes: number;
}

export default function ReadingTime({ minutes }: Props) {
	return (
		<span
			style={{
				fontSize: "0.65rem",
				color: "var(--gray-dim)",
				fontFamily: "var(--font-heading)",
				letterSpacing: "0.05em",
				marginLeft: "0.75rem",
			}}
		>
			約 {minutes} 分で読めます
		</span>
	);
}
