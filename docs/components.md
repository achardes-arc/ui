# API v0.1

Les composants s’importent explicitement depuis `@arcadran/ui`. Charger d’abord le CSS du design system puis `@arcadran/ui/style.css`. Les attributs natifs sont conservés sauf ceux que le composant doit calculer pour son comportement.

## ArAuthGate

Obligatoires : `appName`, `description`, `logoSrc`.

Optionnels : `brandName` (Arcadran), `accessLabel` (Restricted access), `signInHref`, `signInLabel` (Sign in with GitHub), `error`, `busy`, `busyLabel` (Preparing sign-in).

Slots : `actions` remplace toute l’action fournisseur ; `footer` ajoute une information sous la carte. Sans lien ni slot, aucun bouton de connexion n’est créé. Le mode occupé désactive le lien par défaut ; le contenu d’un slot gère son propre état.

```vue
<ArAuthGate app-name="Cadran" logo-src="/brand/logo.svg"
  description="Connectez-vous avec votre compte Google autorisé."
  access-label="Accès réservé" :error="error">
  <template #actions><div ref="googleButtonMount" /></template>
</ArAuthGate>
```

Le composant émet du texte échappé et n’accepte pas de HTML en prop. `signInHref` est une URL de confiance construite et validée par l’application ; UI ne valide pas une redirection OAuth. Le composant rend une section ; l’application fournit son élément `main` et le titre de page.

## ArBrand

`logoSrc` requis ; `name` (Arcadran), `tagline`, `layout` (`inline` ou `stacked`). Logo décoratif avec `alt=""` car le nom est adjacent. La marque n’est pas un lien ; l’application peut l’entourer d’un lien de navigation nommé. Fournir le petit logo pour le mode en ligne.

## ArButton

`variant`: neutral (défaut), primary, brand, danger. `size`: md (défaut), sm. `block` occupe toute la largeur.

Sans `href` : bouton HTML, `type="button"` par défaut ; `submit` et `reset` explicites. Avec `href` : lien natif. `disabled` ou `loading` désactivent l’action ; un lien désactivé perd son URL et sort de l’ordre de tabulation. Le clic n’est pas émis. `loadingLabel` nomme le chargement. `click` est l’événement public. Slots `default` pour le libellé et `icon` pour une icône décorative. Pour une action sans texte visible, fournir un `aria-label`.

Ne pas remplacer un lien par un gestionnaire JavaScript pour la navigation ordinaire. Un bouton primary par écran ; brand désigne l’accent secondaire, pas un succès.

## ArDialog

`v-model` contrôle l’ouverture ; `title` requis, `description` facultative. `size`: sm (420), md (720), lg (960). `closeLabel` est traduisible. `dismissible=false` ignore Escape et le fond et masque la croix ; **le contenu doit alors fournir une action explicite de sortie**.

```vue
<ArDialog v-model="open" title="Modifier le projet" close-label="Fermer">
  <ArTextField v-model="name" label="Nom" />
  <template #footer><ArButton @click="open = false">Annuler</ArButton></template>
</ArDialog>
```

Focus géré par le dialogue natif ; un attribut `autofocus` sur un contrôle du contenu peut choisir la cible initiale. Le titre et la description sont associés par ID. Les modales imbriquées sont possibles mais à réserver aux parcours nécessaires. Le SSR ne rend pas l’attribut open pour éviter un dialogue non modal avant hydratation. Pas de polyfill pour les navigateurs anciens ; les styles de branding nécessitent également un navigateur moderne.

## ArTextField

`label` requis ; `v-model` texte, `type` (text, email, password, search, url, tel), `id` facultatif. `hint`, `error`, `required`, `disabled`, `describedBy` (IDs supplémentaires). Les attributs `name`, `autocomplete`, `placeholder`, `maxlength`, `autofocus` et événements natifs vont à l’input.

Le label, l’aide et l’erreur utilisent des IDs stables créés par Vue `useId`. Le champ annonce `aria-invalid` lorsqu’une erreur existe ; aucune validation métier n’est embarquée. Le type number est volontairement absent de cette version : la conversion et les états intermédiaires requièrent un contrat distinct.

## ArBanner / ArBadge

Banner : `tone` = info, warning, danger, brand. `live=true` par défaut : erreur en `role=alert`, autres en `role=status`. Pour un exemple statique ou un texte permanent, `live=false`. Slot `icon` facultatif ; texte dans le slot principal.

Badge : `tone` = neutral, success, warning, danger, primary, brand. Pas de rôle live par défaut : les statuts d’une liste ne doivent pas tous être annoncés à chaque rendu. Le texte porte le sens, jamais seulement la couleur.

## ArProgress / ArSpinner

Progress : `label` requis ; `value` facultatif, `max=100`. Valeur bornée entre 0 et max ; max invalide revient à 100, valeur absente ou non finie donne une progression indéterminée. Élément HTML progress natif.

Spinner : `label=Loading`, traduisible ; le texte est accessible et le dessin est décoratif. L’animation et sa réduction viennent du design system.

## ArTopbar

Barre haute sémantique (`header`), basée sur `.topbar` du design system. `sticky=true` par défaut ; `sticky=false` pour une barre dans un panneau ou une démonstration. Sa hauteur minimale est de 58 px ; elle grandit lorsque son contenu passe à la ligne. Les actions ne sont pas masquées sur petit écran.

Props de marque : `logoSrc` (petit logo), `brandName` (Arcadran), `appName` (sous-titre), `homeHref` (lien facultatif), `homeLabel` (Home, à traduire). Sans logo ni slot brand, aucune région de marque n’est rendue.

Navigation simple : `items` contient des `{ label, href, current?, count? }`. `current=true` ajoute `aria-current="page"` et le style actif. L’application décide de la page courante ; un seul élément devrait être courant. `navigationLabel` nomme le repère de navigation (Main navigation par défaut). Les liens natifs sont rendus côté serveur sans router.

Slots :

- `brand` : remplace entièrement la marque, par exemple avec un NuxtLink.
- `navigation` : remplace les liens par défaut, dans le nav nommé. Utiliser des NuxtLink avec les classes `chip`, `on` et `aria-current` appropriées ; ne pas ajouter un deuxième nav.
- `context` : fichier, recherche, statut ou sélection de projet.
- `actions` : boutons d’action fournis par l’application.
- `account` : identité et actions de compte.

```vue
<ArTopbar app-name="Calque" logo-src="/logo-small.svg"
  home-href="/" home-label="Calque, accueil">
  <template #context>{{ filename }}</template>
  <template #actions>
    <ArButton size="sm" @click="exportFile">Export JSON</ArButton>
    <ArButton size="sm" variant="primary" @click="importFile">Import .fig</ArButton>
  </template>
  <template #account>
    <ArButton size="sm" aria-label="Sign out" title="Sign out" @click="signOut">
      <template #icon><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false"><path d="M10 4H4v16h6M10 12h11m-4-4 4 4-4 4" /></svg></template>
    </ArButton>
  </template>
</ArTopbar>
```

Aucun appel réseau, store d’authentification ou changement de thème automatique. Les slots reçoivent les contrôles de l’application, avec leurs labels accessibles. Éviter les largeurs fixes ou contenus non sécables dans les slots. Un menu déroulant de compte, un tiroir mobile et les onglets de panneau (`role=tablist`) sont des composants distincts ; `ArTopbar` fournit ici une navigation par liens.
