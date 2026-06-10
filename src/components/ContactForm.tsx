"use client";

import { type FormEvent, useState } from "react";
import { FORMSPREE_CONTACT, trackEvent } from "@/lib/forms";
import type { Locale } from "@/lib/i18n";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
	company?: string;
	name?: string;
	email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 問い合わせフォーム。クライアントバリデーション → fetch POST（AJAX）→
 * 成功/失敗の状態表示。JS無効環境でも素の form POST として動くよう
 * action/method は残す（プログレッシブエンハンスメント）。
 */
const TEXT = {
	ja: {
		companyRequired: "会社名を入力してください",
		nameRequired: "お名前を入力してください",
		emailRequired: "メールアドレスを入力してください",
		emailInvalid: "メールアドレスの形式が正しくありません",
		successTitle: "送信が完了しました。",
		successBody: "通常1〜2営業日以内にご返信いたします。",
		company: "会社名",
		companyPh: "例：株式会社サンプル",
		name: "お名前",
		namePh: "例：山田 太郎",
		email: "メールアドレス",
		emailPh: "例：yamada@example.com",
		type: "お問い合わせ種別",
		typeDefault: "選択してください",
		types: [
			"プロジェクトのご相談",
			"業務提携について",
			"採用について",
			"その他",
		],
		message: "メッセージ",
		messagePh: "ご相談内容やご質問をご記入ください",
		submitting: "送信中…",
		submit: "送信する",
		failure:
			"送信に失敗しました。お手数ですが、時間をおいて再度お試しください。",
		note: "通常1〜2営業日以内にご返信いたします。",
	},
	en: {
		companyRequired: "Please enter your company name",
		nameRequired: "Please enter your name",
		emailRequired: "Please enter your email address",
		emailInvalid: "Please enter a valid email address",
		successTitle: "Your message has been sent.",
		successBody: "We usually reply within 1–2 business days.",
		company: "Company",
		companyPh: "e.g. Example Inc.",
		name: "Name",
		namePh: "e.g. Taro Yamada",
		email: "Email",
		emailPh: "e.g. yamada@example.com",
		type: "Inquiry type",
		typeDefault: "Please select",
		types: ["Project consultation", "Partnership", "Careers", "Other"],
		message: "Message",
		messagePh: "Tell us about your project or question",
		submitting: "Sending…",
		submit: "Send",
		failure: "Failed to send. Please try again later.",
		note: "We usually reply within 1–2 business days.",
	},
} as const;

export default function ContactForm({ locale = "ja" }: { locale?: Locale }) {
	const t = TEXT[locale];
	const [status, setStatus] = useState<Status>("idle");
	const [errors, setErrors] = useState<FieldErrors>({});

	const validate = (form: HTMLFormElement): FieldErrors => {
		const data = new FormData(form);
		const next: FieldErrors = {};
		if (!String(data.get("company") ?? "").trim()) {
			next.company = t.companyRequired;
		}
		if (!String(data.get("name") ?? "").trim()) {
			next.name = t.nameRequired;
		}
		const email = String(data.get("email") ?? "").trim();
		if (!email) {
			next.email = t.emailRequired;
		} else if (!EMAIL_RE.test(email)) {
			next.email = t.emailInvalid;
		}
		return next;
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const fieldErrors = validate(form);
		setErrors(fieldErrors);
		if (Object.keys(fieldErrors).length > 0) return;

		setStatus("submitting");
		try {
			const res = await fetch(FORMSPREE_CONTACT, {
				method: "POST",
				body: new FormData(form),
				headers: { Accept: "application/json" },
			});
			if (res.ok) {
				setStatus("success");
				trackEvent("form_submit", { form_type: "contact" });
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
			<div className="form-success" role="status">
				<p
					style={{
						fontSize: "0.95rem",
						color: "var(--white)",
						marginBottom: "0.75rem",
					}}
				>
					{t.successTitle}
				</p>
				<p style={{ fontSize: "0.85rem", color: "var(--gray-medium)" }}>
					{t.successBody}
				</p>
			</div>
		);
	}

	return (
		<>
			<form
				className="contact-form"
				action={FORMSPREE_CONTACT}
				method="POST"
				onSubmit={onSubmit}
				noValidate
			>
				<input
					type="text"
					name="_gotcha"
					style={{ display: "none" }}
					tabIndex={-1}
					autoComplete="off"
				/>
				<div className="form-group">
					<label htmlFor="company">
						{t.company} <span className="required">*</span>
					</label>
					<input
						type="text"
						id="company"
						name="company"
						required
						placeholder={t.companyPh}
						aria-invalid={!!errors.company}
					/>
					{errors.company ? (
						<p className="form-error" role="alert">
							{errors.company}
						</p>
					) : null}
				</div>
				<div className="form-group">
					<label htmlFor="name">
						{t.name} <span className="required">*</span>
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						placeholder={t.namePh}
						aria-invalid={!!errors.name}
					/>
					{errors.name ? (
						<p className="form-error" role="alert">
							{errors.name}
						</p>
					) : null}
				</div>
				<div className="form-group">
					<label htmlFor="email">
						{t.email} <span className="required">*</span>
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						placeholder={t.emailPh}
						aria-invalid={!!errors.email}
					/>
					{errors.email ? (
						<p className="form-error" role="alert">
							{errors.email}
						</p>
					) : null}
				</div>
				<div className="form-group">
					<label htmlFor="service">{t.type}</label>
					<select id="service" name="service">
						<option value="">{t.typeDefault}</option>
						{t.types.map((label) => (
							<option key={label} value={label}>
								{label}
							</option>
						))}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="message">{t.message}</label>
					<textarea
						id="message"
						name="message"
						rows={6}
						placeholder={t.messagePh}
					/>
				</div>
				<button
					type="submit"
					className="btn-submit"
					disabled={status === "submitting"}
				>
					{status === "submitting" ? t.submitting : t.submit}
				</button>
			</form>
			{status === "error" ? (
				<p className="form-error" role="alert" style={{ marginTop: "1rem" }}>
					{t.failure}
				</p>
			) : null}
			<p className="form-note">{t.note}</p>
		</>
	);
}
