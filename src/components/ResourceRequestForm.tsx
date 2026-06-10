"use client";

import { type FormEvent, useState } from "react";
import { FORMSPREE_RESOURCE, trackEvent } from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
	/** 請求対象リソースの slug（送信内容に含める） */
	resourceSlug: string;
	resourceTitle: string;
	/** frontmatter `download` がある場合、送信成功後に直接DLリンクを表示 */
	downloadUrl?: string | null;
}

/**
 * 資料請求フォーム（その場で完結）。送信成功後、downloadUrl があれば
 * ダウンロードリンクを即時表示し、なければメール送付の旨を表示する。
 */
export default function ResourceRequestForm({
	resourceSlug,
	resourceTitle,
	downloadUrl,
}: Props) {
	const [status, setStatus] = useState<Status>("idle");
	const [errors, setErrors] = useState<{ company?: string; email?: string }>(
		{},
	);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const data = new FormData(form);
		const next: { company?: string; email?: string } = {};
		if (!String(data.get("company") ?? "").trim()) {
			next.company = "会社名を入力してください";
		}
		const email = String(data.get("email") ?? "").trim();
		if (!EMAIL_RE.test(email)) {
			next.email = "メールアドレスの形式が正しくありません";
		}
		setErrors(next);
		if (Object.keys(next).length > 0) return;

		setStatus("submitting");
		try {
			data.set("form_type", "resource_request");
			data.set("resource", resourceSlug);
			data.set("_subject", `資料請求: ${resourceTitle}`);
			const res = await fetch(FORMSPREE_RESOURCE, {
				method: "POST",
				body: data,
				headers: { Accept: "application/json" },
			});
			if (res.ok) {
				setStatus("success");
				trackEvent("resource_request", { resource: resourceSlug });
				form.reset();
			} else {
				setStatus("error");
			}
		} catch {
			setStatus("error");
		}
	};

	if (status === "success") {
		return (
			<div role="status">
				<p
					style={{
						fontSize: "0.95rem",
						color: "var(--white)",
						marginBottom: "0.75rem",
					}}
				>
					ご請求ありがとうございます。
				</p>
				{downloadUrl ? (
					<a
						href={downloadUrl}
						download
						onClick={() =>
							trackEvent("resource_download", { resource: resourceSlug })
						}
						style={{
							display: "inline-block",
							fontSize: "0.85rem",
							color: "var(--white)",
							border: "1px solid var(--white)",
							padding: "0.7rem 1.75rem",
							fontFamily: "var(--font-heading)",
							letterSpacing: "0.05em",
						}}
					>
						資料をダウンロード
					</a>
				) : (
					<p style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}>
						ご入力いただいたメールアドレスへ、最新版を数営業日以内にお送りします。
					</p>
				)}
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate>
			<input
				type="text"
				name="_gotcha"
				style={{ display: "none" }}
				tabIndex={-1}
				autoComplete="off"
			/>
			<div className="form-group">
				<label htmlFor="rr-company">
					会社名 <span className="required">*</span>
				</label>
				<input
					type="text"
					id="rr-company"
					name="company"
					required
					placeholder="例：株式会社サンプル"
					aria-invalid={!!errors.company}
				/>
				{errors.company ? (
					<p className="form-error" role="alert">
						{errors.company}
					</p>
				) : null}
			</div>
			<div className="form-group">
				<label htmlFor="rr-email">
					メールアドレス <span className="required">*</span>
				</label>
				<input
					type="email"
					id="rr-email"
					name="email"
					required
					placeholder="例：yamada@example.com"
					aria-invalid={!!errors.email}
				/>
				{errors.email ? (
					<p className="form-error" role="alert">
						{errors.email}
					</p>
				) : null}
			</div>
			<button
				type="submit"
				className="btn-submit"
				disabled={status === "submitting"}
			>
				{status === "submitting" ? "送信中…" : "資料を請求する"}
			</button>
			{status === "error" ? (
				<p className="form-error" role="alert" style={{ marginTop: "1rem" }}>
					送信に失敗しました。時間をおいて再度お試しください。
				</p>
			) : null}
		</form>
	);
}
