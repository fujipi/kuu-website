import Script from "next/script";

/**
 * GA4 + Google Search Console meta is handled via layout metadata.
 * GA tag ID is read from NEXT_PUBLIC_GA_ID at build time (static export).
 * If unset, nothing is rendered.
 */
export default function Analytics() {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;
	if (!gaId) return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
				strategy="afterInteractive"
			/>
			<Script id="ga4-init" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${gaId}', {
						anonymize_ip: true,
						cookie_flags: 'SameSite=None;Secure'
					});
				`}
			</Script>
		</>
	);
}
