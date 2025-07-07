<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    let isLoggedIn = false;
    let isSubmitting = false;
    let errors = {};

    // Form data
    let formData = {
        firstName: '',
        lastName: '',
        nickname: '',
        stageName: '',
        role: '',
        bio: '',
        birthDate: '',
        joinDate: '',
        leaveDate: '',
        photo: '',
        email: '',
        phone: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        isActive: true,
        sortOrder: 0
    };

    let photoFile = null;

    onMount(() => {
        if (browser) {
            const loggedIn = localStorage.getItem('isLoggedIn');
            if (loggedIn !== 'true') {
                goto('/login');
                return;
            }
            isLoggedIn = true;
        }
    });

    function validateForm() {
        errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'Meno je povinné';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Priezvisko je povinné';
        }

        if (!formData.role.trim()) {
            errors.role = 'Rola je povinná';
        }

        return Object.keys(errors).length === 0;
    }



    async function submitForm() {
        if (!validateForm()) {
            return;
        }

        isSubmitting = true;

        try {
            // Vytvorenie FormData objektu
            const formDataToSend = new FormData();

            // Pridanie všetkých polí okrem photo (to sa pridá osobne)
            Object.keys(formData).forEach(key => {
                if (key !== 'photo' && formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Pridanie foto súboru ak je vybraný
            if (photoFile) {
                console.log('Adding photo file to form data:', photoFile.name);
                formDataToSend.append('photo', photoFile);
            } else {
                console.log('No photo file to add');
            }

            const response = await fetch('/api/band-members', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                goto('/admin/members');
            } else {
                const errorData = await response.json();
                console.error('Error creating member:', errorData);
                alert('Chyba pri vytváraní člena');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Chyba pri vytváraní člena');
        } finally {
            isSubmitting = false;
        }
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        console.log('File selected:', file);
        if (file) {
            photoFile = file;
            console.log('Photo file set:', photoFile.name, photoFile.size);
        }
    }

    function cancel() {
        goto('/admin/members');
    }
</script>

<svelte:head>
    <title>Pridať člena - Admin Panel</title>
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if isLoggedIn}
    <main class="admin-add-member">
        <div class="page-header">
            <div class="header-content">
                <div class="title-section">
                    <h1><i class="fas fa-user-plus"></i> Pridať nového člena</h1>
                    <p>Vytvorte profil pre nového člena kapely</p>
                </div>
                <div class="header-actions">
                    <button type="button" class="btn btn-secondary" on:click={cancel}>
                        <i class="fas fa-arrow-left"></i>
                        Späť na zoznam
                    </button>
                </div>
            </div>
        </div>

        <div class="content-container">
            <div class="form-container">
                <form on:submit|preventDefault={submitForm}>
                    <div class="form-grid">
                        <!-- Základné informácie -->
                        <div class="form-section">
                            <h3><i class="fas fa-user"></i> Základné informácie</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">Meno *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        bind:value={formData.firstName}
                                        class:error={errors.firstName}
                                        required
                                    >
                                    {#if errors.firstName}
                                        <span class="error-message">{errors.firstName}</span>
                                    {/if}
                                </div>

                                <div class="form-group">
                                    <label for="lastName">Priezvisko *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        bind:value={formData.lastName}
                                        class:error={errors.lastName}
                                        required
                                    >
                                    {#if errors.lastName}
                                        <span class="error-message">{errors.lastName}</span>
                                    {/if}
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nickname">Prezývka</label>
                                    <input 
                                        type="text" 
                                        id="nickname" 
                                        bind:value={formData.nickname}
                                        placeholder="Nepovinné"
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="stageName">Umelecké meno</label>
                                    <input
                                        type="text"
                                        id="stageName"
                                        bind:value={formData.stageName}
                                        placeholder="napr. Hej-Voso, Drums Pete..."
                                    >
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="role">Rola v kapele *</label>
                                    <input
                                        type="text"
                                        id="role"
                                        bind:value={formData.role}
                                        class:error={errors.role}
                                        placeholder="napr. Spev, Gitara, Bicie..."
                                        required
                                    >
                                    {#if errors.role}
                                        <span class="error-message">{errors.role}</span>
                                    {/if}
                                </div>
                                <div class="form-group">
                                    <!-- Prázdne miesto pre zachovanie layoutu -->
                                </div>
                            </div>
                        </div>

                        <!-- Dátumy -->
                        <div class="form-section">
                            <h3><i class="fas fa-calendar"></i> Dátumy</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="birthDate">Dátum narodenia</label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        bind:value={formData.birthDate}
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="joinDate">Dátum vstupu do kapely</label>
                                    <input
                                        type="date"
                                        id="joinDate"
                                        bind:value={formData.joinDate}
                                    >
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="leaveDate">Dátum vystúpenia z kapely</label>
                                    <input
                                        type="date"
                                        id="leaveDate"
                                        bind:value={formData.leaveDate}
                                    >
                                    <small>Vyplňte len ak člen už nie je aktívny</small>
                                </div>
                                <div class="form-group">
                                    <!-- Prázdne miesto pre zachovanie layoutu -->
                                </div>
                            </div>
                        </div>

                        <!-- Kontaktné informácie -->
                        <div class="form-section">
                            <h3><i class="fas fa-address-book"></i> Kontaktné informácie</h3>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        bind:value={formData.email}
                                        placeholder="napr. jan.novak@email.com"
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="phone">Telefón</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        bind:value={formData.phone}
                                        placeholder="napr. +421 909 123 456"
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Sociálne siete -->
                        <div class="form-section">
                            <h3><i class="fas fa-share-alt"></i> Sociálne siete</h3>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="facebookUrl">Facebook URL</label>
                                    <input
                                        type="url"
                                        id="facebookUrl"
                                        bind:value={formData.facebookUrl}
                                        placeholder="https://www.facebook.com/..."
                                    >
                                </div>

                                <div class="form-group">
                                    <label for="instagramUrl">Instagram URL</label>
                                    <input
                                        type="url"
                                        id="instagramUrl"
                                        bind:value={formData.instagramUrl}
                                        placeholder="https://www.instagram.com/..."
                                    >
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="youtubeUrl">YouTube URL</label>
                                    <input
                                        type="url"
                                        id="youtubeUrl"
                                        bind:value={formData.youtubeUrl}
                                        placeholder="https://www.youtube.com/..."
                                    >
                                </div>
                                <div class="form-group">
                                    <!-- Prázdne miesto pre zachovanie layoutu -->
                                </div>
                            </div>
                        </div>

                        <!-- Foto a nastavenia -->
                        <div class="form-section">
                            <h3><i class="fas fa-image"></i> Foto a nastavenia</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="photo_file">Nahrať fotografiu</label>
                                    <input
                                        type="file"
                                        id="photo_file"
                                        accept="image/*"
                                        on:change={handleFileSelect}
                                        class="file-input"
                                    >
                                    <small>Podporované formáty: JPG, PNG, GIF (max 2MB)</small>
                                    {#if photoFile}
                                        <div class="file-preview">
                                            <i class="fas fa-image"></i>
                                            Vybraný súbor: {photoFile.name}
                                        </div>
                                    {/if}
                                </div>

                                <div class="form-group">
                                    <label for="sortOrder">Poradie zobrazenia</label>
                                    <input
                                        type="number"
                                        id="sortOrder"
                                        bind:value={formData.sortOrder}
                                        min="0"
                                        step="1"
                                    >
                                    <small>Nižšie číslo = vyššie v zozname</small>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input
                                        type="checkbox"
                                        bind:checked={formData.isActive}
                                    >
                                    <span class="checkmark"></span>
                                    Aktívny člen
                                </label>
                            </div>
                        </div>

                        <!-- Biografia -->
                        <div class="form-section full-width">
                            <h3><i class="fas fa-file-text"></i> Biografia</h3>
                            
                            <div class="form-group">
                                <label for="bio">Popis člena</label>
                                <textarea 
                                    id="bio" 
                                    bind:value={formData.bio}
                                    rows="6"
                                    placeholder="Napíšte niečo o členovi kapely..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <i class="fas fa-spinner fa-spin"></i>
                                Vytváram...

                            {:else}
                                <i class="fas fa-save"></i>
                                Vytvoriť člena
                            {/if}
                        </button>
                        
                        <button 
                            type="button" 
                            class="btn btn-secondary" 
                            on:click={cancel}
                            disabled={isSubmitting}
                        >
                            <i class="fas fa-times"></i>
                            Zrušiť
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
{:else}
    <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Kontrolujem prihlásenie...
    </div>
{/if}

<style>
    .admin-add-member {
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

    .content-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .form-container {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 30px;
        border: 2px solid transparent;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 30px;
        margin-bottom: 30px;
    }

    .form-section {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 10px;
        padding: 25px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .form-section.full-width {
        grid-column: 1 / -1;
    }

    .form-section h3 {
        color: var(--secondary-color);
        margin-bottom: 20px;
        font-size: var(--font-size-me);
        display: flex;
        align-items: center;
        gap: 10px;
        border-bottom: 2px solid var(--secondary-color);
        padding-bottom: 10px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group:last-child {
        margin-bottom: 0;
    }

    label {
        color: var(--text-color);
        font-weight: 600;
        font-size: var(--font-size-sm);
    }

    input, textarea {
        padding: 12px 15px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-color);
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
    }

    input:focus, textarea:focus {
        outline: none;
        border-color: var(--secondary-color);
        background-color: rgba(255, 255, 255, 0.1);
    }

    input.error {
        border-color: #dc3545;
    }

    .file-input {
        padding: 0.5rem;
        border: 2px dashed #666;
        border-radius: 4px;
        background: #2a2a2a;
        color: #fff;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }

    .file-input:hover {
        border-color: #8B4513;
    }

    .file-preview {
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: #333;
        border-radius: 4px;
        color: #8B4513;
        font-size: 0.9rem;
    }

    .file-preview i {
        margin-right: 0.5rem;
    }

    .error-message {
        color: #dc3545;
        font-size: var(--font-size-xs);
        font-weight: 600;
    }

    small {
        color: var(--text-color);
        opacity: 0.7;
        font-size: var(--font-size-xs);
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        font-weight: 600;
    }

    .checkbox-label input[type="checkbox"] {
        width: 20px;
        height: 20px;
        margin: 0;
    }

    .form-actions {
        display: flex;
        gap: 20px;
        justify-content: flex-end;
        padding-top: 30px;
        border-top: 2px solid var(--secondary-color);
    }

    .btn {
        padding: 15px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        border: none;
        cursor: pointer;
        min-width: 150px;
        justify-content: center;
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-primary {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }

    .btn-primary:hover:not(:disabled) {
        background-color: #e6c200;
        transform: translateY(-2px);
    }

    .btn-secondary {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid var(--secondary-color);
    }

    .btn-secondary:hover:not(:disabled) {
        background-color: var(--secondary-color);
        color: var(--background-color);
    }

    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-size: var(--font-size-me);
        color: var(--text-color);
        gap: 15px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            text-align: center;
        }

        .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .form-container {
            padding: 20px;
        }

        .form-section {
            padding: 20px;
        }

        .form-actions {
            flex-direction: column;
        }

        .btn {
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        .content-container {
            padding: 0 10px;
        }

        .form-container {
            padding: 15px;
        }

        .form-section {
            padding: 15px;
        }
    }
</style>
