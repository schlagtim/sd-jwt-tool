<script lang="ts">
	import { SignatureMode } from "$lib/sd-jwt";

	export let title: string = "Signatures";
	export let flexSize: number = 1;
	export let jwtSignature: SignatureMode = SignatureMode.CouldNotVerify;
	export let showKeyBindingSignature: boolean = false;
	export let keyBindingSignature: SignatureMode = SignatureMode.CouldNotVerify;

	const signatureIssue = "⚠️ Could not verify";
	const signatureValid = "✅ Signature Verified";
	const signatureInvalid = "❌ Invalid Signature";

	let jwtSignatureMessage: string;
	let keyBindingSignatureMessage: string;

	/*
	function setSignatures(keyBinding: boolean) {
		keyBindingSignature = keyBinding;

		if (keyBinding) {
			flexSize = 1;
		} else {
			flexSize = flexSize / 2;
		}
	}

	setSignatures(false);
	*/

	function setSignatureMessage(mode: SignatureMode) {
		switch (mode) {
			case SignatureMode.CouldNotVerify:
				return signatureIssue;
			case SignatureMode.Verified:
				return signatureValid;
			case SignatureMode.Invalid:
				return signatureInvalid;
			default:
				return signatureInvalid;
		}
	}

	$: jwtSignatureMessage = setSignatureMessage(jwtSignature);
	$: keyBindingSignatureMessage = setSignatureMessage(keyBindingSignature);
</script>

<div class="box" style="--flex-size: {flexSize}">
	<div class="stripes">
		<h5>{title.toUpperCase()}</h5>
	</div>
	<div class="signatures">
		<div class="row">
			<h3>JWT Signature:</h3>
			<h3 class="signatures-right">{jwtSignatureMessage}</h3>
		</div>
		{#if showKeyBindingSignature}
			<div class="row">
				<h3>Key Binding Signature:</h3>
				<h3 class="signatures-right">{keyBindingSignatureMessage}</h3>
			</div>
		{/if}
	</div>
</div>

<style>
	h5 {
		margin: 0.5rem;
		text-align: center;
	}

	h3 {
		flex: 1;
		text-align: right;
		margin: 1rem;
		align-self: center;
	}

	.stripes {
		border-color: black;
		border-style: solid;
		border-width: 1px;
		border-left: 0;
		border-right: 0;
	}

	.box {
		flex: var(--flex-size);

		display: flex;
		flex-direction: column;
		background-color: #fffffe;
	}

	.signatures {
		flex: 1;

		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.signatures-right {
		text-align: left;
	}

	.row {
		flex: 1;

		display: flex;
		flex-direction: row;
		justify-content: center;
	}
</style>
