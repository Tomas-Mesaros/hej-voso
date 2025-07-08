<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    export let memberId;

    let member = {};
    let isLoading = true;
    let error = null;

    onMount(async () => {
        if (!memberId) {
            error = 'ID člena nie je špecifikované';
            isLoading = false;
            return;
        }

        try {
            const response = await fetch(`/api/band-members/${memberId}`);
            if (response.ok) {
                member = await response.json();
                console.log('Načítaný člen:', member);
            } else {
                error = 'Člen nebol nájdený';
            }
        } catch (err) {
            console.error('Chyba pri načítaní člena:', err);
            error = 'Chyba pri načítaní údajov';
        } finally {
            isLoading = false;
        }
    });

    function goBack() {
        goto('/about');
    }
</script>

{#if isLoading}
    <section class="loading">
        <h2>Načítavam profil člena...</h2>
    </section>
{:else if error}
    <section class="error">
        <h2>Chyba</h2>
        <p>{error}</p>
        <button class="back-btn" on:click={goBack}>
            <i class="fas fa-arrow-left"></i>
            Späť na členov
        </button>
    </section>
{:else}
    <section class="member-detail">
        <div class="header-section">
            <button class="back-btn" on:click={goBack}>
                <i class="fas fa-arrow-left"></i>
                Späť na členov
            </button>
            
            <div class="member-header">
                <h2>{member.stageName || `${member.firstName} ${member.lastName}`}</h2>
                <div class="status-badge" class:active={member.isActive} class:inactive={!member.isActive}>
                    <i class="fas {member.isActive ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    {member.isActive ? 'Aktívny člen' : 'Neaktívny člen'}
                </div>
            </div>
        </div>
        
        <article class="member-profile">
            <div class="profile-content">
                <div class="image-section">
                    {#if member.photo}
                        <img src="/uploads/band-members/{member.photo}" alt="Profilová fotka {member.firstName} {member.lastName}">
                    {:else}
                        <div class="no-photo">
                            <div class="avatar-placeholder-large">
                                <div class="avatar-head-large"></div>
                                <div class="avatar-body-large"></div>
                                <div class="avatar-instruments-large">
                                    {#if member.role && member.role.toLowerCase().includes('spev')}
                                        <i class="fas fa-microphone"></i>
                                    {:else if member.role && member.role.toLowerCase().includes('gitar')}
                                        <i class="fas fa-guitar"></i>
                                    {:else if member.role && member.role.toLowerCase().includes('bub')}
                                        <i class="fas fa-drum"></i>
                                    {:else if member.role && member.role.toLowerCase().includes('klav')}
                                        <i class="fas fa-piano"></i>
                                    {:else if member.role && member.role.toLowerCase().includes('bas')}
                                        <i class="fas fa-guitar"></i>
                                    {:else}
                                        <i class="fas fa-music"></i>
                                    {/if}
                                </div>
                            </div>
                            <p class="no-photo-text">Foto nie je dostupné</p>
                        </div>
                    {/if}
                    
                    {#if member.role}
                        <div class="role-badge">
                            <i class="fas fa-music"></i>
                            {member.role}
                        </div>
                    {/if}
                </div>

                <div class="info-section">
                    <div class="basic-info">
                        <h3><i class="fas fa-user"></i> Základné informácie</h3>
                        <ul class="info-list">
                            <li>
                                <span class="label">Meno:</span>
                                <span class="value">{member.firstName} {member.lastName}</span>
                            </li>
                            {#if member.stageName}
                                <li>
                                    <span class="label">Umelecké meno:</span>
                                    <span class="value">{member.stageName}</span>
                                </li>
                            {/if}
                            {#if member.role}
                                <li>
                                    <span class="label">Pozícia:</span>
                                    <span class="value">{member.role}</span>
                                </li>
                            {:else}
                                <li>
                                    <span class="label">Pozícia:</span>
                                    <span class="value no-data">Nie je špecifikovaná</span>
                                </li>
                            {/if}
                        </ul>
                    </div>

                    {#if member.email || member.phone}
                        <div class="contact-info">
                            <h3><i class="fas fa-address-book"></i> Kontaktné informácie</h3>
                            <ul class="info-list">
                                {#if member.email}
                                    <li>
                                        <span class="label">E-mail:</span>
                                        <a href="mailto:{member.email}" class="contact-link">
                                            <i class="fas fa-envelope"></i>
                                            {member.email}
                                        </a>
                                    </li>
                                {:else}
                                    <li>
                                        <span class="label">E-mail:</span>
                                        <span class="value no-data">Nie je uvedený</span>
                                    </li>
                                {/if}
                                
                                {#if member.phone}
                                    <li>
                                        <span class="label">Telefón:</span>
                                        <a href="tel:{member.phone}" class="contact-link">
                                            <i class="fas fa-phone"></i>
                                            {member.phone}
                                        </a>
                                    </li>
                                {:else}
                                    <li>
                                        <span class="label">Telefón:</span>
                                        <span class="value no-data">Nie je uvedený</span>
                                    </li>
                                {/if}
                            </ul>
                        </div>
                    {/if}

                    {#if member.facebook_url || member.instagram_url || member.youtube_url}
                        <div class="social-media">
                            <h3><i class="fas fa-share-alt"></i> Sociálne siete</h3>
                            <ul class="social-list">
                                {#if member.facebookUrl}
                                    <li>
                                        <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" class="social-link facebook">
                                            <i class="fab fa-facebook"></i>
                                            Facebook
                                        </a>
                                    </li>
                                {/if}
                                {#if member.instagramUrl}
                                    <li>
                                        <a href={member.instagramUrl} target="_blank" rel="noopener noreferrer" class="social-link instagram">
                                            <i class="fab fa-instagram"></i>
                                            Instagram
                                        </a>
                                    </li>
                                {/if}
                                {#if member.youtubeUrl}
                                    <li>
                                        <a href={member.youtubeUrl} target="_blank" rel="noopener noreferrer" class="social-link youtube">
                                            <i class="fab fa-youtube"></i>
                                            YouTube
                                        </a>
                                    </li>
                                {/if}
                            </ul>
                        </div>
                    {:else}
                        <div class="social-media">
                            <h3><i class="fas fa-share-alt"></i> Sociálne siete</h3>
                            <p class="no-data">Sociálne siete nie sú uvedené</p>
                        </div>
                    {/if}
                </div>
            </div>
            
            <div class="bio-section">
                <h3><i class="fas fa-info-circle"></i> Biografia</h3>
                {#if member.bio}
                    <p class="bio-text">{member.bio}</p>
                {:else}
                    <p class="no-data">Biografické údaje zatiaľ nie sú dostupné</p>
                {/if}
            </div>
        </article>
    </section>
{/if}

<style>
    /* Loading and error states */
    .loading, .error {
        text-align: center;
        padding: 40px;
        color: var(--text-color);
    }

    .error h2 {
        color: var(--button-hover-color);
        margin-bottom: 15px;
    }

    /* Back button */
    .back-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--button-color);
        color: var(--text-color);
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        margin-bottom: 20px;
    }

    .back-btn:hover {
        background-color: var(--button-hover-color);
        color: var(--background-color);
    }

    /* Header section */
    .header-section {
        margin-bottom: 30px;
    }

    .member-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 15px;
    }

    .member-header h2 {
        color: var(--secondary-color);
        margin: 0;
    }

    .status-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: var(--font-size-sm);
    }

    .status-badge.active {
        background-color: rgba(40, 167, 69, 0.2);
        color: #28a745;
        border: 2px solid #28a745;
    }

    .status-badge.inactive {
        background-color: rgba(220, 53, 69, 0.2);
        color: #dc3545;
        border: 2px solid #dc3545;
    }

    /* Profile content */
    .member-profile {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .profile-content {
        display: flex;
        flex-direction: row;
        gap: 40px;
        align-items: flex-start;
    }

    /* Image section */
    .image-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        min-width: 300px;
    }

    .image-section img {
        max-width: 300px;
        max-height: 300px;
        width: 100%;
        height: auto;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .no-photo {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, var(--button-color) 0%, #2d2d2d 50%, var(--button-color) 100%);
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: var(--text-color);
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .avatar-placeholder-large {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        animation: avatar-breathe 3s ease-in-out infinite;
    }

    @keyframes avatar-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    .avatar-head-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
        margin-bottom: 20px;
        position: relative;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }

    .avatar-head-large::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 22px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 20px 0 0 rgba(255, 255, 255, 0.9);
    }

    .avatar-head-large::after {
        content: '';
        position: absolute;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        width: 25px;
        height: 6px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.7);
    }

    .avatar-body-large {
        width: 100px;
        height: 60px;
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
        border-radius: 30px 30px 15px 15px;
        position: relative;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    }

    .avatar-instruments-large {
        position: absolute;
        bottom: 20px;
        right: 20px;
        color: var(--secondary-color);
        font-size: 24px;
        animation: instrument-pulse-large 2.5s ease-in-out infinite;
        text-shadow: 0 0 15px var(--secondary-color);
    }

    @keyframes instrument-pulse-large {
        0%, 100% {
            opacity: 0.8;
            transform: scale(1) rotate(-5deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.3) rotate(5deg);
        }
    }

    .no-photo-text {
        font-size: 1rem;
        opacity: 0.8;
        font-style: italic;
        margin: 0;
    }

    .no-photo:hover .avatar-placeholder-large {
        animation: avatar-breathe 1.5s ease-in-out infinite;
    }

    .no-photo:hover .avatar-head-large {
        background: linear-gradient(135deg, var(--button-hover-color), var(--secondary-color));
    }

    .no-photo:hover .avatar-body-large {
        background: linear-gradient(135deg, var(--button-hover-color), var(--secondary-color));
    }

    .no-photo:hover .avatar-instruments-large {
        color: var(--button-hover-color);
        text-shadow: 0 0 20px var(--button-hover-color);
        animation: instrument-pulse-large 1s ease-in-out infinite;
    }

    .role-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--secondary-color);
        color: var(--background-color);
        padding: 8px 16px;
        border-radius: 25px;
        font-weight: 700;
        font-size: var(--font-size-sm);
    }

    /* Info sections */
    .info-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .basic-info, .contact-info, .social-media, .bio-section {
        background-color: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid var(--secondary-color);
    }

    .basic-info h3, .contact-info h3, .social-media h3, .bio-section h3 {
        color: var(--secondary-color);
        font-size: var(--font-size-me);
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .info-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .info-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--button-color);
    }

    .label {
        font-weight: 600;
        color: var(--text-color);
        min-width: 100px;
    }

    .value {
        color: var(--secondary-color);
        font-weight: 500;
    }

    .value.no-data, .no-data {
        color: var(--text-color);
        opacity: 0.6;
        font-style: italic;
    }

    .contact-link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--button-hover-color);
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .contact-link:hover {
        color: var(--secondary-color);
    }

    /* Social media */
    .social-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .social-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 15px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .social-link.facebook {
        color: #1877f2;
        background-color: rgba(24, 119, 242, 0.1);
    }

    .social-link.facebook:hover {
        background-color: rgba(24, 119, 242, 0.2);
        border-color: #1877f2;
    }

    .social-link.instagram {
        color: #e4405f;
        background-color: rgba(228, 64, 95, 0.1);
    }

    .social-link.instagram:hover {
        background-color: rgba(228, 64, 95, 0.2);
        border-color: #e4405f;
    }

    .social-link.youtube {
        color: #ff0000;
        background-color: rgba(255, 0, 0, 0.1);
    }

    .social-link.youtube:hover {
        background-color: rgba(255, 0, 0, 0.2);
        border-color: #ff0000;
    }

    /* Bio section */
    .bio-text {
        font-size: var(--font-size-me);
        line-height: 1.8;
        color: var(--text-color);
        text-align: justify;
    }

    /* Responsive design */
    @media (max-width: 1300px) {
        .profile-content {
            flex-direction: column;
            align-items: center;
            gap: 30px;
        }

        .image-section {
            min-width: auto;
            width: 100%;
            max-width: 400px;
        }

        .info-section {
            width: 100%;
        }
    }

    @media (max-width: 920px) {
        .member-header {
            flex-direction: column;
            text-align: center;
        }

        .image-section img, .no-photo {
            max-width: 250px;
            max-height: 250px;
            width: 250px;
            height: 250px;
        }

        .basic-info, .contact-info, .social-media, .bio-section {
            padding: 15px;
        }

        .info-list li {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .social-list {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }

        .social-link {
            flex: 1;
            min-width: 120px;
            justify-content: center;
        }
    }

    @media (max-width: 570px) {
        .image-section img, .no-photo {
            max-width: 200px;
            max-height: 200px;
            width: 200px;
            height: 200px;
        }

        .no-photo i {
            font-size: 40px;
        }

        .basic-info h3, .contact-info h3, .social-media h3, .bio-section h3 {
            font-size: var(--font-size-sm);
        }

        .status-badge {
            font-size: 0.9rem;
            padding: 6px 12px;
        }

        .social-list {
            flex-direction: column;
        }

        .social-link {
            min-width: auto;
        }
    }
</style>
