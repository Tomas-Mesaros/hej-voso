<script>
    import { goto } from '$app/navigation';

    let formData = {
        name: '',
        description: '',
        event_date: '',
        is_active: true,
        sort_order: 0
    };

    let isSubmitting = false;
    let errors = {};

    function validateForm() {
        errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Názov kategórie je povinný';
        }

        if (formData.sort_order < 0) {
            errors.sort_order = 'Poradie nemôže byť záporné';
        }

        return Object.keys(errors).length === 0;
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        isSubmitting = true;

        try {
            const response = await fetch('/api/gallery-categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const category = await response.json();

                goto('/admin/gallery');
            } else {
                const errorData = await response.json();
                console.error('Chyba pri vytváraní kategórie:', errorData);
                alert('Chyba pri vytváraní kategórie');
            }
        } catch (error) {
            console.error('Chyba pri vytváraní kategórie:', error);
            alert('Chyba pri vytváraní kategórie');
        } finally {
            isSubmitting = false;
        }
    }

    function goBack() {
        goto('/admin/gallery');
    }
</script>

<svelte:head>
    <title>Pridať kategóriu - Admin</title>
</svelte:head>

<main class="admin-container">
    <div class="admin-header">
        <div class="header-content">
            <h1><i class="fas fa-plus"></i> Pridať kategóriu galérie</h1>
            <p>Vytvorte novú sekciu pre organizáciu fotografií</p>
        </div>
        <div class="header-actions">
            <button class="btn btn-secondary" on:click={goBack}>
                <i class="fas fa-arrow-left"></i>
                Späť na galériu
            </button>
        </div>
    </div>

    <div class="form-container">
        <form on:submit|preventDefault={handleSubmit} class="category-form">
            <div class="form-section">
                <h3><i class="fas fa-info-circle"></i> Základné informácie</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="name">Názov kategórie *</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={formData.name}
                            placeholder="napr. Koncert v Bratislave 2024"
                            class:error={errors.name}
                            required
                        >
                        {#if errors.name}
                            <span class="error-message">{errors.name}</span>
                        {/if}
                        <small>Názov sekcie, ktorý sa zobrazí v galérii</small>
                    </div>

                    <div class="form-group">
                        <label for="event_date">Dátum/Rok akcie</label>
                        <input
                            type="text"
                            id="event_date"
                            bind:value={formData.event_date}
                            placeholder="napr. 2024, Marec 2024, 15.3.2024"
                        >
                        <small>Môže byť rok, mesiac alebo presný dátum</small>
                    </div>
                </div>

                <div class="form-group">
                    <label for="description">Popis kategórie</label>
                    <textarea
                        id="description"
                        bind:value={formData.description}
                        placeholder="Krátky popis akcie alebo miesta..."
                        rows="3"
                    ></textarea>
                    <small>Voliteľný popis, ktorý sa zobrazí pod názvom</small>
                </div>
            </div>

            <div class="form-section">
                <h3><i class="fas fa-cog"></i> Nastavenia</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="sort_order">Poradie zobrazenia</label>
                        <input
                            type="number"
                            id="sort_order"
                            bind:value={formData.sort_order}
                            min="0"
                            step="1"
                            class:error={errors.sort_order}
                        >
                        {#if errors.sort_order}
                            <span class="error-message">{errors.sort_order}</span>
                        {/if}
                        <small>Nižšie číslo = vyššie v zozname (0 = najvyššie)</small>
                    </div>

                    <div class="form-group">
                        <div class="checkbox-group">
                            <input
                                type="checkbox"
                                id="is_active"
                                bind:checked={formData.is_active}
                            >
                            <label for="is_active">Aktívna kategória</label>
                        </div>
                        <small>Neaktívne kategórie sa nezobrazujú vo verejnej galérii</small>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary" disabled={isSubmitting}>
                    {#if isSubmitting}
                        <i class="fas fa-spinner fa-spin"></i>
                        Vytváram...
                    {:else}
                        <i class="fas fa-save"></i>
                        Vytvoriť kategóriu
                    {/if}
                </button>
                <button type="button" class="btn btn-secondary" on:click={goBack}>
                    <i class="fas fa-times"></i>
                    Zrušiť
                </button>
            </div>
        </form>
    </div>
</main>

<style>
    .admin-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        gap: 2rem;
    }

    .header-content h1 {
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
    }

    .header-content p {
        color: #7f8c8d;
        margin: 0;
    }

    .form-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .category-form {
        padding: 2rem;
    }

    .form-section {
        margin-bottom: 2rem;
    }

    .form-section:last-of-type {
        margin-bottom: 0;
    }

    .form-section h3 {
        color: #2c3e50;
        margin: 0 0 1.5rem 0;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #ecf0f1;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group label {
        font-weight: 500;
        color: #2c3e50;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .form-group input,
    .form-group textarea {
        padding: 0.75rem;
        border: 2px solid #ecf0f1;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s;
        width: 100%;
        box-sizing: border-box;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #3498db;
    }

    .form-group input.error,
    .form-group textarea.error {
        border-color: #e74c3c;
    }

    .form-group small {
        color: #7f8c8d;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .error-message {
        color: #e74c3c;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .checkbox-group input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .checkbox-group label {
        margin: 0;
        cursor: pointer;
    }

    .form-actions {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #ecf0f1;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-primary {
        background: #3498db;
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: #2980b9;
    }

    .btn-secondary {
        background: #95a5a6;
        color: white;
    }

    .btn-secondary:hover {
        background: #7f8c8d;
    }

    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 1rem;
        }

        .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .form-actions {
            flex-direction: column-reverse;
        }
    }
</style>
