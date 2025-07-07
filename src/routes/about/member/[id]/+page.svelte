<script>
    import { page } from '$app/stores';
    import MemberDetail from '$lib/component/MemberDetail.svelte';

    $: memberId = $page.params.id;
</script>

<svelte:head>
    <title>Profil člena - Hej-Voso</title>
    <meta name="description" content="Detailný profil člena kapely Hej-Voso" />
</svelte:head>

<main>
    <MemberDetail {memberId} />
</main>
