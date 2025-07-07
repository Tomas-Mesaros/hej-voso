<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    let members = [];
    let isLoading = true;

    // Force reactivity
    $: console.log('Reactive members update:', members, 'length:', members?.length);
    let isLoggedIn = false;
    let showDeleteModal = false;
    let memberToDelete = null;

    onMount(async () => {
        if (browser) {
            const loggedIn = localStorage.getItem('isLoggedIn');
            if (loggedIn !== 'true') {
                goto('/login');
                return;
            }
            isLoggedIn = true;
        }

        await loadMembers();
    });

    async function loadMembers() {
        try {
            console.log('Loading members from /api/band-members...');
            const response = await fetch('/api/band-members');
            console.log('Response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Raw data received:', data);
                // Force reactive update
                members = [...data];
                console.log('Members array set to:', members);
                console.log('Members length:', members.length);
                console.log('First member:', members[0]);
            } else {
                console.error('Failed to fetch members, status:', response.status);
            }
        } catch (error) {
            console.error('Error loading members:', error);
        } finally {
            isLoading = false;
            console.log('Loading finished, isLoading:', isLoading);
        }
    }

    function editMember(id) {
        goto(`/admin/members/edit/${id}`);
    }

    function confirmDelete(member) {
        memberToDelete = member;
        showDeleteModal = true;
    }

    async function deleteMember() {
        if (!memberToDelete) return;

        try {
            const response = await fetch(`/api/band-members/${memberToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                await loadMembers();
                showDeleteModal = false;
                memberToDelete = null;
            } else {
                alert('Chyba pri mazaní člena');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Chyba pri mazaní člena');
        }
    }

    async function toggleActive(member) {
        try {
            const formData = new FormData();
            Object.keys(member).forEach(key => {
                if (key === 'isActive') {
                    formData.append(key, !member.isActive);
                } else if (member[key] !== null && member[key] !== undefined) {
                    formData.append(key, member[key]);
                }
            });

            const response = await fetch(`/api/band-members/${member.id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                await loadMembers();
            } else {
                alert('Chyba pri aktualizácii člena');
            }
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Chyba pri aktualizácii člena');
        }
    }

    function cancelDelete() {
        showDeleteModal = false;
        memberToDelete = null;
    }
</script>

<svelte:head>
    <title>Správa členov - Admin Panel</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isLoggedIn}
    <main class="admin-members">
        <div class="page-header">
            <div class="header-content">
                <div class="title-section">
                    <h1><i class="fas fa-users"></i> Správa členov kapely</h1>
                    <p>Spravujte členov kapely, ich profily a statusy</p>
                </div>
                <div class="header-actions">
                    <a href="/admin/members/add" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Pridať člena
                    </a>
                    <a href="/admin" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i>
                        Späť na admin
                    </a>
                </div>
            </div>
        </div>

        <div class="content-container">
            {#if isLoading}
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    Načítavam členov...
                </div>
            {:else if members.length === 0}
                <div class="no-members">
                    <i class="fas fa-users"></i>
                    <h2>Žiadni členovia</h2>
                    <p>Zatiaľ nie sú pridaní žiadni členovia kapely.</p>
                    <a href="/admin/members/add" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Pridať prvého člena
                    </a>
                </div>
            {:else}
                <div class="members-table">
                    <div class="table-header">
                        <h2>Zoznam členov ({members.length})</h2>
                    </div>
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Meno</th>
                                    <th>Rola</th>
                                    <th>Status</th>
                                    <th>Poradie</th>
                                    <th>Akcie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each members as member}
                                    <tr class="member-row" class:inactive={!member.isActive}>
                                        <td class="photo-cell">
                                            {#if member.photo}
                                                <img src="/uploads/band-members/{member.photo}" alt="{member.firstName} {member.lastName}" class="member-photo">
                                            {:else}
                                                <img src="/img/default-avatar-small.svg" alt="Predvolený avatar" class="member-photo default-avatar">
                                            {/if}
                                        </td>
                                        <td class="name-cell">
                                            <div class="member-name">
                                                <strong>{member.firstName} {member.lastName}</strong>
                                                {#if member.stageName}
                                                    <span class="nickname">"{member.stageName}"</span>
                                                {/if}
                                            </div>
                                        </td>
                                        <td class="role-cell">
                                            <span class="role-badge">{member.role || 'Neurčená'}</span>
                                        </td>
                                        <td class="status-cell">
                                            <button
                                                class="status-toggle"
                                                class:active={member.isActive}
                                                on:click={() => toggleActive(member)}
                                            >
                                                {member.isActive ? 'Aktívny' : 'Neaktívny'}
                                            </button>
                                        </td>
                                        <td class="order-cell">
                                            <span class="order-number">{member.sortOrder || 0}</span>
                                        </td>
                                        <td class="actions-cell">
                                            <div class="action-buttons">
                                                <button 
                                                    class="btn-action edit" 
                                                    on:click={() => editMember(member.id)}
                                                    title="Upraviť"
                                                >
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    class="btn-action delete" 
                                                    on:click={() => confirmDelete(member)}
                                                    title="Vymazať"
                                                >
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/if}

<style>
    .admin-members {
        min-height: 100vh;
        background-color: var(--background-color);
        color: var(--text-color);
    }

    .page-header {
        background: linear-gradient(135deg, var(--primary-color), rgba(138, 3, 3, 0.8));
        padding: 30px 0;
        border-bottom: 3px solid var(--secondary-color);
        margin-bottom: 40px;
    }

    .header-content {
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .title-section h1 {
        color: var(--secondary-color);
        font-size: var(--font-size-lg);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .title-section p {
        color: var(--text-color);
        font-size: var(--font-size-me);
        margin: 0;
        opacity: 0.9;
    }

    .header-actions {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
    }

    .content-container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .btn {
        padding: 12px 20px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        cursor: pointer;
    }

    .btn-primary {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }

    .btn-primary:hover {
        background-color: #e6c200;
        transform: translateY(-2px);
    }

    .btn-secondary {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid var(--secondary-color);
    }

    .btn-secondary:hover {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }

    .btn-danger {
        background-color: #dc3545;
        color: white;
    }

    .btn-danger:hover {
        background-color: #c82333;
    }

    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        font-size: var(--font-size-me);
        color: var(--text-color);
        gap: 15px;
    }

    .no-members {
        text-align: center;
        padding: 60px 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        border: 2px dashed var(--secondary-color);
    }

    .no-members i {
        font-size: 60px;
        color: var(--secondary-color);
        margin-bottom: 20px;
    }

    .no-members h2 {
        color: var(--secondary-color);
        margin-bottom: 15px;
    }

    .no-members p {
        margin-bottom: 30px;
        opacity: 0.8;
    }

    .members-table {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 25px;
        border: 2px solid transparent;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .table-header {
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 2px solid var(--secondary-color);
    }

    .table-header h2 {
        color: var(--secondary-color);
        margin: 0;
        font-size: var(--font-size-me);
    }

    .table-container {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 15px 10px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    th {
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--secondary-color);
        font-weight: 600;
        font-size: var(--font-size-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .member-row {
        transition: all 0.3s ease;
    }

    .member-row:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .member-row.inactive {
        opacity: 0.6;
    }

    .photo-cell {
        width: 80px;
    }

    .member-photo {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--secondary-color);
    }

    .default-avatar {
        border: 2px solid var(--secondary-color);
    }

    .member-name {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .nickname {
        font-size: var(--font-size-sm);
        color: var(--secondary-color);
        font-style: italic;
    }

    .role-badge {
        background-color: var(--secondary-color);
        color: var(--background-color);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: var(--font-size-sm);
        font-weight: 600;
    }

    .status-toggle {
        padding: 6px 12px;
        border-radius: 20px;
        border: none;
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: #dc3545;
        color: white;
    }

    .status-toggle.active {
        background-color: #28a745;
    }

    .status-toggle:hover {
        transform: scale(1.05);
    }

    .order-number {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        font-weight: 600;
    }

    .action-buttons {
        display: flex;
        gap: 8px;
    }

    .btn-action {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 14px;
    }

    .btn-action.edit {
        background-color: #007bff;
        color: white;
    }

    .btn-action.edit:hover {
        background-color: #0056b3;
        transform: scale(1.1);
    }

    .btn-action.delete {
        background-color: #dc3545;
        color: white;
    }

    .btn-action.delete:hover {
        background-color: #c82333;
        transform: scale(1.1);
    }

    /* Modal styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background-color: var(--background-color);
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        border: 2px solid var(--secondary-color);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .modal-header h3 {
        color: var(--secondary-color);
        margin: 0 0 20px 0;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .modal-content p {
        margin-bottom: 15px;
        line-height: 1.6;
    }

    .warning {
        color: #dc3545;
        font-weight: 600;
        font-size: var(--font-size-sm);
    }

    .modal-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 30px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            text-align: center;
        }

        .header-actions {
            justify-content: center;
        }

        .table-container {
            font-size: var(--font-size-sm);
        }

        th, td {
            padding: 10px 5px;
        }

        .member-photo {
            width: 40px;
            height: 40px;
        }

        .action-buttons {
            flex-direction: column;
        }

        .modal {
            margin: 20px;
            padding: 20px;
        }

        .modal-actions {
            flex-direction: column;
        }
    }
</style>
        </div>
    </main>

    <!-- Delete confirmation modal -->
    {#if showDeleteModal && memberToDelete}
        <div class="modal-overlay" on:click={cancelDelete}>
            <div class="modal" on:click|stopPropagation>
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Potvrdiť vymazanie</h3>
                </div>
                <div class="modal-content">
                    <p>Naozaj chcete vymazať člena <strong>{memberToDelete.firstName} {memberToDelete.lastName}</strong>?</p>
                    <p class="warning">Táto akcia sa nedá vrátiť späť.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-danger" on:click={deleteMember}>
                        <i class="fas fa-trash"></i>
                        Vymazať
                    </button>
                    <button class="btn btn-secondary" on:click={cancelDelete}>
                        Zrušiť
                    </button>
                </div>
            </div>
        </div>
    {/if}
{:else}
    <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Kontrolujem prihlásenie...
    </div>
{/if}
