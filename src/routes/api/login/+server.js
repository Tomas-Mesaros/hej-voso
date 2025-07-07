import { json } from '@sveltejs/kit';
import { db } from '$lib/database.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { name, password } = await request.json();
    
    if (!name || !password) {
      return json(
        { success: false, message: 'Meno a heslo sú povinné' },
        { status: 400 }
      );
    }

    // Nájdi používateľa podľa mena
    const user = await db.users.findByName(name);
    
    if (!user) {
      return json(
        { success: false, message: 'Nesprávne prihlasovacie údaje' },
        { status: 401 }
      );
    }

    // Kontrola hesla (v produkčnom prostredí by sa malo použiť bcrypt)
    if (user.password !== password) {
      return json(
        { success: false, message: 'Nesprávne prihlasovacie údaje' },
        { status: 401 }
      );
    }

    // Úspešné prihlásenie
    return json({
      success: true,
      message: 'Úspešne prihlásený',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: 'authenticated' // Jednoduchý token pre demo
    });

  } catch (error) {
    console.error('Login error:', error);
    return json(
      { success: false, message: 'Chyba servera' },
      { status: 500 }
    );
  }
}
