// Fonctions centralisées pour la gestion des utilisateurs

/**
 * Ajouter un rôle à un utilisateur.
 * @param userId - L'ID de l'utilisateur.
 * @param role - Le rôle à ajouter.
 */
export function addRole(userId: string, role: string): void {
    // Logique pour ajouter un rôle à un utilisateur
    console.log(`Ajout du rôle ${role} à l'utilisateur ${userId}`);
}

/**
 * Changer le pseudo d'un utilisateur.
 * @param userId - L'ID de l'utilisateur.
 * @param newPseudo - Le nouveau pseudo à définir.
 */
export function changePseudo(userId: string, newPseudo: string): void {
    // Logique pour changer le pseudo d'un utilisateur
    console.log(`Changement du pseudo de l'utilisateur ${userId} en ${newPseudo}`);
}

/**
 * Ajouter un badge à un utilisateur.
 * @param userId - L'ID de l'utilisateur.
 * @param badge - Le badge à ajouter.
 */
export function addBadge(userId: string, badge: string): void {
    // Logique pour ajouter un badge à un utilisateur
    console.log(`Ajout du badge ${badge} à l'utilisateur ${userId}`);
}

// Ajouter d'autres fonctions liées aux utilisateurs si nécessaire
