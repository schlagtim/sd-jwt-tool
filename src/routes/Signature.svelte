<script lang="ts">
	import { SignatureMode } from "$lib/sd-jwt";

	export let title: string = "Signatures";
	export let flexSize: number = 1;
	export let jwtSignature: SignatureMode = SignatureMode.CouldNotVerify;
	export let showKeyBindingSignature: boolean = false;
	export let keyBindingSignature: SignatureMode = SignatureMode.CouldNotVerify;

	const signatureIssue = "Could not verify";
	const signatureValid = "Signature Verified";
	const signatureInvalid = "Invalid Signature";
</script>

<div class="box" style="--flex-size: {flexSize}, height: 100px">
	<div class="stripes">
		<h5>{title.toUpperCase()}</h5>
	</div>
	<div class="signatures">
		<div class="row">
			<h3>JWT Signature:</h3>
			{#if jwtSignature === SignatureMode.Verified}
				<h3 class="signatures-right" style="color: green">{signatureValid}</h3>
			{:else if jwtSignature === SignatureMode.Invalid}
				<h3 class="signatures-right" style="color: red">{signatureInvalid}</h3>
			{:else}
				<h3 class="signatures-right" style="color: orange">{signatureIssue}</h3>
			{/if}
		</div>
		{#if showKeyBindingSignature}
			<div class="row">
				<h3>Key Binding Signature:</h3>
				{#if keyBindingSignature === SignatureMode.Verified}
					<h3 class="signatures-right" style="color: green">{signatureValid}</h3>
				{:else if keyBindingSignature === SignatureMode.Invalid}
					<h3 class="signatures-right" style="color: red">{signatureInvalid}</h3>
				{:else}
					<h3 class="signatures-right" style="color: orange">{signatureIssue}</h3>
				{/if}
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
