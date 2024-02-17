<script lang="ts">
	export let title: string = "Signatures";
	export let flexSize: number = 1;

	const signatureValid = "✅ Signature Verified";
	const signatureInvalid = "❌ Invalid Signature";

	let holderKeyBinding: boolean = true;
	let jwtSignature: string = signatureInvalid;
	let keyBindingSignature: string = signatureInvalid;

	function setSignatures(keyBinding: boolean) {
		holderKeyBinding = keyBinding;

		if (keyBinding) {
			flexSize = 1;
		} else {
			flexSize = flexSize / 2;
		}
	}

	setSignatures(false);
</script>

<div class="box" style="--flex-size: {flexSize}">
	<div class="stripes">
		<h5>{title.toUpperCase()}</h5>
	</div>
	<div class="signatures">
		<div class="row">
			<h3>JWT Signature:</h3>
			<h3 class="signatures-right">{jwtSignature}</h3>
		</div>
		{#if holderKeyBinding}
			<div class="row">
				<h3>Key Binding Signature:</h3>
				<h3 class="signatures-right">{keyBindingSignature}</h3>
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
