# Inventaire des consommateurs Arcadran

Relevé local du 15 septembre 2026. Les constats portent sur les fichiers présents, pas sur une vérification des déploiements de chaque application. Les archives et propositions graphiques ne sont pas traitées comme des consommateurs actifs.

## Dépôts et pertinence

| Dépôt | Stack / sources observées | Besoins partagés | Décision pour la v0.1 |
|---|---|---|---|
| branding | CSS, assets, reference.html, starter.html, scripts de synchronisation | Tokens, thèmes, boutons, champs, badges, modales, connexion | Source de vérité conservée ; package publié 2.2.0 utilisé |
| calque | Nuxt 4 / Vue 3 ; app/pages/login.vue, PropertyPanel, LayoutCanvas | GitHub, marque, boutons, aide modale, messages, champs | Pilote prioritaire ; aucun composant de géométrie exporté |
| jalon | Nuxt 4 / Vue 3 ; apps/dashboard/app/pages/login.vue, IssueCreateModal, IssueModal | GitHub, modales, formulaires, statut, pagination | Deuxième pilote ; tickets et logique de création d’issue restent locaux |
| YouShallNotPass | Nuxt 4 / Vue 3 ; dashboard/login.vue, JobButton, VerdictBadge, PublishBadge | GitHub, bouton asynchrone, badges de revue, erreurs | Même contrat de connexion ; mapping des verdicts reste local |
| cadran | Nuxt 3 / Vue 3 ; pages/login.vue, AppToast, MetricCard, AppTopbar | Google officiel, marque, champs, toast, métriques | Slot fournisseur prévu ; pas de SDK Google dans UI |
| studio | Nuxt 3 / Vue 3 ; AppToast, MetricCard, AppSidebar, pages/login.vue | Primitives et structure proches de Cadran | Même potentiel ; vérifier sa trajectoire produit avant migration |
| console | HTML / JS natif ; public/index.html et style.css | Connexion Google, modales config/déploiement, progrès, badges | Conserver HTML/CSS ; ne pas ajouter Vue uniquement pour UI |
| linear | HTML / JS natif ; public/login.html, index.html | Google, connexion, tableaux, modales, progression | Consommateur du CSS ; futur adaptateur seulement si besoin confirmé |
| invoicer | HTML / JS natif ; public/login.html et index.html | Connexion Google, champs, tableaux ; identité de l’entité émettrice | Pas de remplacement automatique des logos de facturation |
| www | Site HTML ; index.html et legal.html | Marque, boutons, blocs éditoriaux | Garder la voie CSS et assets |
| chiro | React 19 / Vite ; components/ui, site-shell, theme-builder | Nombreuses primitives déjà présentes, identité éditoriale distincte | Pas de dépendance Vue ; réévaluer un adaptateur React si convergence décidée |
| vault | Plugin/outils Node, dialogues natifs système | Interaction avec le coffre de secrets | Hors bibliothèque web |
| vps | Infrastructure, templates de services et contrôles de livraison | Conventions de publication / sécurité | Référence opérationnelle ; pas de composant UI ici |
| spade | Dossier local sans sources applicatives visibles | Aucun besoin démontrable | Hors périmètre |

## Duplications concrètes

- Calque et Jalon utilisent `@arcadran/design-system@2.2.0`, mais recopient le HTML du login, le SVG GitHub et le correctif de marque empilée. Jalon documente explicitement ce correctif local absent du package 2.2.0.
- Les connexions Google de Cadran, Console, Linear et Invoicer réutilisent le cadre de connexion avec un widget fournisseur. Un composant exclusivement GitHub les exclurait.
- Jalon compose ses modales à partir de `overlay`/`modal` et de boutons locaux ; Calque a un dialogue d’aide. Le comportement clavier est une responsabilité à partager avec le cadre visuel.
- Les boutons asynchrones, badges et bandeaux ont des usages dans plusieurs produits. Leurs états UI peuvent être communs ; les états métier (revue, déploiement, analyse) restent locaux.
- Cadran/Studio exposent déjà des toasts et métriques. Console/Linear affichent des progressions. Ces besoins complètent le périmètre sans rendre la bibliothèque dépendante du métier Jalon.

## Décisions

**Deux couches.** `branding` reste indépendant des frameworks ; `ui` fournit les composants Vue. Les sites HTML ne prennent pas une dépendance Vue et Chiro ne migre pas de React.

**CSS additif.** La version publiée 2.2.0 est épinglée. `ui` ne remplace aucune classe globale `.btn`, `.brand` ou `.gate`. Le correctif de composition de la marque est ciblé par `.ar-brand--stacked`. Une évolution générique des styles de base devra être intégrée à branding puis testée lors de la mise à niveau.

**Connexion présentative.** GitHub est une action par défaut facultative. Le slot `actions` accueille un widget Google officiel ou un autre parcours. Les SDK, liens validés, cookies, callbacks et autorisations restent aux applications. Les noms, logos et textes sont paramétrables.

**Modale native.** `<dialog>.showModal()` gère la couche modale, l’inertie du fond et la navigation du focus. UI ajoute les labels, l’API contrôlée et le retour du focus. Le navigateur est testé réellement, y compris pour les modales imbriquées. La modale est fermée dans le HTML SSR et s’ouvre après montage si demandé.

## Migration proposée

1. **Calque :** remplacer le login par ArAuthGate, supprimer son correctif de marque/bouton, comparer nuit/jour/mobile ; conserver les routes auth.
2. **Jalon :** même login pour prouver la mutualisation ; migrer ensuite le cadre d’IssueCreateModal en conservant la logique du formulaire.
3. **YouShallNotPass :** login, états asynchrones des boutons et badges. Le mapping de statuts reste un wrapper local.
4. **Cadran :** essayer la composition du login avec le vrai widget Google, puis sélectionner champs/toasts.
5. Étendre à Studio si pertinent. Garder Console, Linear, Invoicer et www sur le contrat CSS. Ne créer un second adaptateur que pour un consommateur qui l’utilisera réellement.

## Suite priorisée

| À ajouter ensuite | Pourquoi / consommateurs |
|---|---|
| Select, textarea, checkbox | Formulaires Jalon et Cadran ; labellisation cohérente |
| Toast | Déjà présent dans Cadran/Studio ; besoin de confirmations dans Calque/Jalon |
| Pagination et état vide | TablePager Jalon, listes de revues et de contenus |
| Topbar composée | Marque / actions / compte partagés ; navigation propre à chaque produit |
| Carte de métrique | Cadran/Studio ; valider l’usage dans un autre dashboard |
| Tests de référence visuelle | Après validation des captures initiales sur un environnement CI fixe |

À garder hors de UI : canvas Figma, calcul de distances, arbre de calques, diff Git, ticket métier, validation de déploiement, client OAuth, éditeur de factures, stockage de secrets.
