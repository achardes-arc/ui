# @arcadran/ui

Composants Vue 3 pour l’identité Arcadran. Première version **0.1.0**, construite à partir des besoins observés dans les dépôts voisins, le 15 septembre 2026.

- **branding / @arcadran/design-system** reste la source de vérité des couleurs, thèmes et styles de base.
- **ui / @arcadran/ui** ajoute le HTML, les comportements et les API de composants réutilisables.
- Les applications conservent leurs données, textes, routage et politiques d’accès.

## Voir et vérifier

Node 24 LTS recommandé ; pnpm 11.21.0. L’accès au package privé `@arcadran/design-system` sur GitHub Packages doit être configuré dans votre environnement npm. Aucun jeton n’est enregistré ici.

```sh
pnpm install --frozen-lockfile
pnpm dev                       # galerie : http://127.0.0.1:3011
pnpm check                     # types, contrat CSS, tests, package SSR, builds
pnpm exec playwright install chromium
pnpm test:browser              # clavier, dialogues, responsive, thèmes
```

La galerie utilise les vrais composants, avec les variantes Calque, Jalon et YouShallNotPass. La topbar existe en variantes Calque (fichier et actions), Jalon (navigation) et Cadran (recherche et compte), et équipe la galerie elle-même. Elle comprend aussi un exemple de slot pour un fournisseur de connexion externe. Les actions sont des démonstrations locales ; aucun SDK d’authentification n’est chargé.

Les tests navigateur produisent des captures des cartes d’authentification et des topbars dans `test-results/`. Ce sont des artefacts de revue visuelle, pas encore des tests de comparaison avec une image de référence approuvée.

## Contenu de cette version

| Composant | Responsabilité |
|---|---|
| `ArAuthGate` | Carte de connexion, identité, message, action GitHub facultative, slot fournisseur, erreur |
| `ArTopbar` | Barre haute composée : marque, navigation, contexte, actions et compte ; mise en page adaptable |
| `ArBrand` | Logo fourni par l’application, nom, slogan, variantes en ligne / empilée |
| `ArButton` | Bouton ou lien, variantes sémantiques, taille, chargement, désactivation |
| `ArDialog` | Modale native, titre accessible, contenu, actions, fermeture et retour du focus |
| `ArTextField` | Champ texte contrôlé, label, aide et erreur associés, attributs natifs |
| `ArBadge` | Statut avec les couleurs du design system |
| `ArBanner` | Information, alerte ou erreur, annonce accessible facultative |
| `ArProgress` | Progression native nommée, bornée ou indéterminée |
| `ArSpinner` | Chargement avec libellé accessible |

API détaillée : [docs/components.md](docs/components.md). Inventaire et priorités : [docs/repository-audit.md](docs/repository-audit.md).

## Utilisation locale avant publication

Ce dépôt est une bibliothèque ; aucune application existante n’a été migrée. Il n’est pas encore publié sur npm/GitHub Packages et aucun dépôt distant n’est requis pour essayer la version locale.

```sh
# Dans ui : produit arcadran-ui-0.1.0.tgz avec le JS compilé, CSS et types.
pnpm pack
# Dans l’application choisie :
pnpm add /chemin/vers/ui/arcadran-ui-0.1.0.tgz
```

Le package a deux peer dependencies : Vue `^3.5.24` et `@arcadran/design-system` **2.2.0**. Le CSS n’embarque pas de seconde copie du design system. Importer une seule fois, dans cet ordre :

```ts
// Nuxt 3/4 — nuxt.config.ts
export default defineNuxtConfig({
  css: ['@arcadran/design-system', '@arcadran/ui/style.css', '~/assets/css/main.css'],
})
```

```vue
<script setup lang="ts">
import { ArAuthGate } from '@arcadran/ui'
// L’application fournit une destination validée et gère elle-même les erreurs OAuth.
defineProps<{ href: string; error?: string }>()
</script>

<template>
  <main>
    <ArAuthGate
      app-name="Calque"
      logo-src="/logo.svg"
      description="Explore layers and understand your Figma layouts."
      :sign-in-href="href"
      :error="error"
    />
  </main>
</template>
```

Pour Vue/Vite, importer les deux feuilles dans le point d’entrée puis les composants explicitement. Pas d’enregistrement global, de module Nuxt ou d’auto-import nécessaire. Nuxt n’est pas une dépendance de la bibliothèque. La validation actuelle couvre le rendu SSR Vue ; la migration dans chaque application Nuxt reste une étape à valider.

Le logo et les polices sont servis par l’application, en local pour les applications soumises à une CSP stricte. Charger Archivo, Chakra Petch et JetBrains Mono. Utiliser `logo-small.svg` pour la marque en ligne de 30 px, `logo.svg` pour la carte de connexion. La galerie importe les logos depuis le package branding et sert les polices locales ; ils ne sont pas embarqués dans le package UI.

## Principes d’évolution

1. Extraire un besoin partagé, ou une primitive de retour à l’utilisateur déjà définie par branding.
2. Les composants n’appellent aucune API métier, ne connaissent aucune allowlist et ne stockent aucune session.
3. Les variantes sont explicites ; les textes sont fournis par l’application. Les labels par défaut sont en anglais et remplaçables.
4. Le CSS ajouté est préfixé `ar-` et utilise les tokens du design system. Les changements de palette et des classes de base se font dans branding.
5. Les applications personnalisent la composition et le contenu ; les corrections de composants partagés remontent ici.
6. Vérifier les deux thèmes, le mobile, le clavier et le SSR avant de livrer. Les contraintes de contraste existantes du design system demandent une revue dédiée ; cette version ne constitue pas une certification WCAG.

Une bibliothèque facilite la cohérence, mais ne peut pas empêcher une application de surcharger son CSS. La revue et les contrôles de collision dans branding restent utiles. Pendant la migration, retirer les anciens correctifs `.gate-card .brand`, `.gh-btn`, etc. devenus redondants, puis comparer visuellement.

## Livraison

La CI fournie lance les contrôles et les tests Chromium et conserve les captures. Lors de la création du dépôt GitHub, autoriser son workflow à lire `@arcadran/design-system` dans les paramètres du package branding. Aucune publication automatique n’est activée.

Avant une première publication : relire la galerie avec les deux applications pilotes, réserver le package privé `@arcadran/ui`, ajouter les métadonnées du dépôt réel et configurer la publication. Épingler les versions chez les consommateurs et proposer les mises à jour par PR. Ne pas déclencher une mise à niveau non vérifiée sur tout le parc.

## Sources techniques

- [Vite : construction de bibliothèques et externalisation de Vue](https://vite.dev/guide/build.html#library-mode).
- [Vue : rendu côté serveur](https://vuejs.org/api/ssr.html).
- [HTML dialog : comportement modal natif](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).
