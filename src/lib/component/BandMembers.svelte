<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let members = [];
    let isLoading = true;

    onMount(async () => {
        try {
            const response = await fetch('/api/band-members');
            if (response.ok) {
                members = await response.json();

            } else {
                console.error('Failed to fetch band members');
            }
        } catch (error) {
            console.error('Chyba pri načítaní členov:', error);
        } finally {
            isLoading = false;
        }
    });

    function viewMemberDetail(memberId) {
        goto(`/about/member/${memberId}`);
    }
</script>

{#if isLoading}
    <section class="loading">
        <h2>Načítavam členov kapely...</h2>
    </section>
{:else}
    <section class="band-members">
        <h2><i class="fas fa-users"></i> Členovia kapely</h2>
        
        {#if members.length === 0}
            <div class="no-members">
                <p>Zatiaľ nie sú pridaní žiadni členovia kapely.</p>
            </div>
        {:else}
            <div class="members-grid">
                {#each members as member}
                    <div class="member-card" on:click={() => viewMemberDetail(member.id)} on:keydown={(e) => e.key === 'Enter' && viewMemberDetail(member.id)} tabindex="0" role="button">
                        <div class="member-photo">
                            {#if member.photo}
                                <img src="/uploads/band-members/{member.photo}" alt="Foto {member.firstName} {member.lastName}">
                            {:else}
                                <img src="/img/default-member.svg" alt="Predvolený obrázok člena kapely" class="default-member-image">
                            {/if}

                            <div class="status-badge" class:active={member.isActive} class:inactive={!member.isActive}>
                                <i class="fas {member.isActive ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                {member.isActive ? 'Aktívny' : 'Neaktívny'}
                            </div>
                        </div>

                        <div class="member-info">
                            <h3 class="member-name">
                                {member.stageName || `${member.firstName} ${member.lastName}`}
                            </h3>

                            {#if member.stageName && member.firstName}
                                <p class="real-name">{member.firstName} {member.lastName}</p>
                            {/if}
                            
                            {#if member.role}
                                <p class="member-role">
                                    <i class="fas fa-music"></i>
                                    {member.role}
                                </p>
                            {:else}
                                <p class="member-role no-role">
                                    <i class="fas fa-question"></i>
                                    Rola nie je špecifikovaná
                                </p>
                            {/if}
                            
                            {#if member.bio}
                                <p class="member-bio">{member.bio.substring(0, 100)}{member.bio.length > 100 ? '...' : ''}</p>
                            {:else}
                                <p class="member-bio no-bio">Biografické údaje nie sú dostupné</p>
                            {/if}
                        </div>
                        
                        <div class="member-actions">
                            <span class="view-detail">
                                <i class="fas fa-eye"></i>
                                Zobraziť detail
                            </span>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </section>
{/if}

<style>
    /* Loading state */
    .loading {
        text-align: center;
        padding: 40px;
        color: var(--text-color);
    }

    /* Main section */
    .band-members h2 {
        text-align: center;
        color: var(--secondary-color);
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    /* No members message */
    .no-members {
        text-align: center;
        padding: 40px;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        color: var(--text-color);
    }

    /* Members grid */
    .members-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 25px;
        padding: 20px 0;
    }

    /* Member card */
    .member-card {
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .member-card:hover {
        border-color: var(--secondary-color);
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .member-card:focus {
        outline: none;
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.3);
    }

    /* Member photo */
    .member-photo {
        position: relative;
        text-align: center;
        margin-bottom: 15px;
    }

    .member-photo img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--secondary-color);
    }

    .default-member-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 0 auto;
        border: 3px solid var(--secondary-color);
        transition: transform var(--transition-normal);
    }

    .default-member-image:hover {
        transform: scale(1.05);
    }



    /* Status badge */
    .status-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .status-badge.active {
        background-color: rgba(40, 167, 69, 0.9);
        color: white;
    }

    .status-badge.inactive {
        background-color: rgba(220, 53, 69, 0.9);
        color: white;
    }

    /* Member info */
    .member-info {
        text-align: center;
    }

    .member-name {
        color: var(--secondary-color);
        font-size: var(--font-size-me);
        margin-bottom: 5px;
    }

    .real-name {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        opacity: 0.8;
        margin-bottom: 10px;
    }

    .member-role {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--button-hover-color);
        font-weight: 600;
        margin-bottom: 10px;
    }

    .member-role.no-role {
        color: var(--text-color);
        opacity: 0.6;
        font-style: italic;
    }

    .member-bio {
        color: var(--text-color);
        line-height: 1.4;
        font-size: var(--font-size-sm);
    }

    .member-bio.no-bio {
        opacity: 0.6;
        font-style: italic;
    }

    /* Member actions */
    .member-actions {
        text-align: center;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid var(--button-color);
    }

    .view-detail {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--secondary-color);
        font-weight: 600;
        font-size: var(--font-size-sm);
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .members-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .member-card {
            padding: 15px;
        }

        .member-photo img,
        .default-member-image {
            width: 100px;
            height: 100px;
        }
    }
</style>
