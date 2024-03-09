<script lang="ts">
	import { getHash } from "$lib/sd-jwt";
	import { Disclosure } from "@sd-jwt/utils";

	export let disclosures: Array<Disclosure> = [];
	export let jwtPayloadSelection: { digest: string; disclosure: string };

	const dummyHasherAndAlg = {
		hasher: getHash,
		alg: "sha-256",
	};
</script>

<div class="box">
	<div class="stripes">
		<h5>DISCLOSURES</h5>
	</div>
	{#each disclosures as disclosure}
		<div
			class="stripes"
			role="contentinfo"
			on:mouseover={async () => {
				jwtPayloadSelection.disclosure = disclosure.encode();
				jwtPayloadSelection.digest = await disclosure.digest(dummyHasherAndAlg);
			}}
			on:focus
		>
			<p style="text-align: center;"><small><b>{disclosure.key}</b></small></p>
			<div style="background-color: whitesmoke;">
				<p>
					<small> Value:</small>
					<small class="right">{JSON.stringify(disclosure.value)}</small>
				</p>
			</div>
			<p>
				<small> Salt:</small>
				<small class="right"><i>{disclosure.salt}</i></small>
			</p>
		</div>
	{/each}
</div>

<style>
	h5 {
		margin: 0.5rem;
		text-align: center;
	}

	p {
		flex: 1;
		margin: 0 0.5rem;

		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	small {
		flex: 1;

		min-width: 0;
	}

	.right {
		flex: 3;

		text-align: right;
	}

	.stripes {
		display: flex;
		flex-direction: column;

		border-color: black;
		border-style: solid;
		border-width: 1px;
		border-left: 0;
		border-right: 0;
		border-top: 0;
	}

	.box {
		flex: 1;
		display: flex;
		flex-direction: column;

		background-color: #fffffe;
	}
</style>
