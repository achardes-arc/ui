# Composants du site www

Lecture détaillée de `www/index.html`, `www/legal.html` et `www/css/site.css`, le 15 septembre 2026. Ce relevé décrit le checkout local ; il ne valide pas les informations légales ni le contenu déployé.

## Primitives extraites

| Sources dans www | Composant UI | Réutilisation |
|---|---|---|
| `.band-head`, `.kicker.ruled`, `.band-title`, `.band-lede` des sections expertise / AI ; titres équipe / contact | `ArSectionHeading` | Introductions de pages publiques, d’aide ou de sections produit ; hiérarchie de titres paramétrable |
| Les quatre `article.card.practice`, `.p-head`, `.p-kicker`, variantes vert/or de `.practices.ai` | `ArContentCard` | Présentation de services, fonctionnalités ou ressources ; carte de contenu existant déjà dans le design system |
| `dl.legal-facts` de legal.html | `ArDescriptionList` | Informations publiques et propriétés de l’inspecteur Calque (`dl.property-list`), sans formatter ni données métier imposés |

La carte garde le filet d’accent, le titre typographique, l’icône facultative et les zones de contenu. Les deux sous-rubriques Automotive / Mobile restent une composition de la galerie ; aucun tableau de métiers n’est codé dans le composant. Les icônes passent par un slot SVG : aucune police Material Symbols n’est requise par UI.

La liste utilise les éléments natifs `dl`, `dt` et `dd`, revient sur une colonne en petit écran, accepte des valeurs multilignes et un slot pour les liens. Les valeurs légales de www ne sont pas copiées dans les exemples ; la galerie montre des métadonnées de projet.

## Éléments déjà couverts

- `.topbar.site-top` : composition de `ArTopbar` avec marque, contact et thème ; le site public n’a pas de compte à afficher.
- `.btn.btn-primary` du hero : `ArButton` rend déjà un vrai lien, y compris une adresse mailto.
- Marque : `ArBrand` et les assets du package branding.
- Message de brouillon : `ArBanner` peut assurer le retour visuel ; le texte et les conditions restent à l’application.

## À conserver dans la composition du site

- **Hero et motifs animés :** silhouette du logo en masque, aiguille pivotant au scroll, variantes AI et mouvement réduit. Ce sont des décisions de marque et une mise en scène propre au site. Si elles deviennent nécessaires à plusieurs sites, extraire d’abord les assets et règles dans branding ; éviter de dupliquer les grands paths SVG dans UI.
- **Grilles et équipe :** conteneur de page de 1180 px, grille de pratiques et colonnes du texte d’équipe. Ce sont des layouts et du contenu, pas de nouvelles primitives.
- **Contact :** composition d’un titre, de prose et d’un lien mailto. Un composant ContactArcadran avec une adresse codée en dur n’apporterait pas de réutilisation.
- **Footer :** marque compacte, localisation, copyright et mentions légales. Candidat à une composition publique partagée si un deuxième site l’adopte ; ne pas confondre avec le pied de page technique de Calque.
- **Texte légal et préférences :** données, textes et politique locale de stockage du thème restent dans www. UI n’injecte ni informations juridiques ni stockage navigateur.

## Adoption

Les nouveaux composants sont disponibles aux applications Vue et dans la galerie. `www` reste un site HTML sans build et n’a pas été modifié. Il conserve le CSS partagé via branding. Toute future évolution générique des styles de base doit être promue dans branding pour bénéficier également aux consommateurs HTML ; UI ne remplace pas ce canal.
