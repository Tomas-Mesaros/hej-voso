<script>
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    let username = '';
    let password = '';
    let isLoading = false;
    let errorMessage = '';
    let showPassword = false;

    // Kontrola či je už prihlásený
    if (browser) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            goto('/admin');
        }
    }

    async function handleLogin() {
        if (!username.trim() || !password.trim()) {
            errorMessage = 'Prosím vyplňte všetky polia';
            return;
        }

        isLoading = true;
        errorMessage = '';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Uloženie do localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userToken', data.token || 'authenticated');
                localStorage.setItem('userName', data.user.name);

                // Presmerovanie na admin panel
                goto('/admin');
            } else {
                errorMessage = data.message || 'Nesprávne prihlasovacie údaje';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage = 'Chyba pri prihlasovaní. Skúste to znovu.';
        } finally {
            isLoading = false;
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }

    function togglePasswordVisibility() {
        showPassword = !showPassword;
    }
</script>

<svelte:head>
    <title>Prihlásenie - Hej-Voso Admin</title>
    <meta name="description" content="Prihlásenie do administračného panelu" />
    <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="login-page">
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="logo">
                    <i class="fas fa-music"></i>
                </div>
                <h1>Administrácia</h1>
                <p class="subtitle">Hej-Voso Admin Panel</p>
            </div>

            <form class="login-form" on:submit|preventDefault={handleLogin}>
                <div class="form-group">
                    <label for="username">
                        <i class="fas fa-user"></i>
                        Používateľské meno
                    </label>
                    <input
                        id="username"
                        type="text"
                        bind:value={username}
                        on:keypress={handleKeyPress}
                        placeholder="Zadajte používateľské meno"
                        disabled={isLoading}
                        autocomplete="username"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="password">
                        <i class="fas fa-lock"></i>
                        Heslo
                    </label>
                    <div class="password-input">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            bind:value={password}
                            on:keypress={handleKeyPress}
                            placeholder="Zadajte heslo"
                            disabled={isLoading}
                            autocomplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            class="password-toggle"
                            on:click={togglePasswordVisibility}
                            title={showPassword ? 'Skryť heslo' : 'Zobraziť heslo'}
                        >
                            <i class="fas {showPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                    </div>
                </div>

                {#if errorMessage}
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        {errorMessage}
                    </div>
                {/if}

                <button type="submit" class="login-btn" disabled={isLoading}>
                    {#if isLoading}
                        <i class="fas fa-spinner fa-spin"></i>
                        Prihlasuje sa...
                    {:else}
                        <i class="fas fa-sign-in-alt"></i>
                        Prihlásiť sa
                    {/if}
                </button>
            </form>

            <div class="login-footer">
                <p class="security-note">
                    <i class="fas fa-shield-alt"></i>
                    Zabezpečené prihlásenie
                </p>
                <a href="/" class="back-link">
                    <i class="fas fa-arrow-left"></i>
                    Späť na hlavnú stránku
                </a>
            </div>
        </div>
    </div>
</main>

<style>
    .login-page {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--background-color) 0%, #0a0a0a 100%);
        padding: 20px;
    }

    .login-container {
        width: 100%;
        max-width: 450px;
    }

    .login-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 40px;
        border: 2px solid var(--secondary-color);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
    }

    .login-header {
        text-align: center;
        margin-bottom: 40px;
    }

    .logo {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 35px;
        color: var(--background-color);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .login-header h1 {
        color: var(--secondary-color);
        font-size: var(--font-size-lg);
        margin-bottom: 10px;
    }

    .subtitle {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        opacity: 0.8;
        margin: 0;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group label {
        color: var(--text-color);
        font-size: var(--font-size-sm);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .form-group input {
        background-color: rgba(255, 255, 255, 0.1);
        border: 2px solid var(--button-color);
        border-radius: 10px;
        padding: 15px 20px;
        color: var(--text-color);
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
        outline: none;
    }

    .form-group input:focus {
        border-color: var(--secondary-color);
        background-color: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
    }

    .form-group input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .password-input {
        position: relative;
        display: flex;
        align-items: center;
    }

    .password-input input {
        flex: 1;
        padding-right: 50px;
    }

    .password-toggle {
        position: absolute;
        right: 15px;
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        transition: all 0.3s ease;
        opacity: 0.7;
    }

    .password-toggle:hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .error-message {
        background-color: rgba(220, 53, 69, 0.1);
        border: 1px solid rgba(220, 53, 69, 0.3);
        border-radius: 10px;
        padding: 15px;
        color: #dc3545;
        font-size: var(--font-size-sm);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .login-btn {
        background: linear-gradient(135deg, var(--secondary-color), var(--button-hover-color));
        color: var(--background-color);
        border: none;
        border-radius: 12px;
        padding: 18px 25px;
        font-size: var(--font-size-sm);
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }

    .login-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(255, 140, 0, 0.3);
    }

    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }

    .login-footer {
        margin-top: 30px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .security-note {
        color: var(--text-color);
        font-size: 0.9rem;
        opacity: 0.7;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 0;
    }

    .back-link {
        color: var(--secondary-color);
        text-decoration: none;
        font-size: var(--font-size-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;
        padding: 10px;
        border-radius: 8px;
    }

    .back-link:hover {
        background-color: rgba(255, 255, 255, 0.05);
        transform: translateX(-3px);
    }

    /* Responsive design */
    @media (max-width: 480px) {
        .login-card {
            padding: 30px 25px;
            margin: 10px;
        }

        .logo {
            width: 60px;
            height: 60px;
            font-size: 25px;
        }

        .login-header h1 {
            font-size: var(--font-size-me);
        }

        .form-group input {
            padding: 12px 15px;
        }

        .login-btn {
            padding: 15px 20px;
        }
    }

    /* Placeholder styling */
    ::placeholder {
        color: rgba(241, 241, 241, 0.5);
    }

    /* Autofill styling */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset;
        -webkit-text-fill-color: var(--text-color);
        transition: background-color 5000s ease-in-out 0s;
    }
</style>