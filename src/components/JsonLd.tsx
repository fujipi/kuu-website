type JsonLdSchema = Record<string, unknown>;

type JsonLdProps = {
	data: JsonLdSchema | JsonLdSchema[];
};

/**
 * Renders JSON-LD structured data script tags.
 * Content is always server-generated static schema objects — no user input is injected.
 */
export default function JsonLd({ data }: JsonLdProps) {
	const schemas = Array.isArray(data) ? data : [data];

	return (
		<>
			{schemas.map((schema, i) => (
				<script
					key={i}
					type="application/ld+json"
					// JSON.stringify output of static schema objects is safe; no user-controlled content
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static server-side JSON-LD only
					dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
				/>
			))}
		</>
	);
}
