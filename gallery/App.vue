<script setup lang="ts">
import { ref, watch } from 'vue';
import { ArAuthGate, ArButton, ArBadge, ArBanner, ArTextField, ArDialog, ArProgress, ArSpinner, ArTopbar } from '../src';
import logo from '@arcadran/design-system/assets/logo.svg';
import logoSmall from '@arcadran/design-system/assets/logo-small.svg';
const theme = ref('night');
watch(theme, (value) => document.documentElement.setAttribute('data-theme', value));
const app = ref('Calque');
const authError = ref(false);
const authBusy = ref(false);
const open = ref(false);
const nested = ref(false);
const persistent = ref(false);
const email = ref('');
const submitted = ref(false);
const progress = ref(64);
const topbarProduct = ref('Calque');
const topbarFeedback = ref('');
const topbarSearch = ref('');
const descriptions: Record<string, string> = {
  Calque: 'Sign in with your authorized GitHub account to explore layers and understand the layout of your Figma files.',
  Jalon: 'Sign in with the GitHub account that gives you access to the projects. You will see the repositories you are a collaborator on.',
  YouShallNotPass: 'Sign in with your authorized GitHub account to follow reviews and their results.',
};
</script>
<template>
  <ArTopbar :logo-src="logoSmall" app-name="UI / COMPONENT LIBRARY" home-href="#overview" home-label="Component library home">
    <template #actions><ArBadge tone="primary">0.1.0</ArBadge><ArButton size="sm" @click="theme = theme === 'night' ? 'day' : 'night'">{{ theme === 'night' ? 'Switch to light' : 'Switch to dark' }}</ArButton></template>
  </ArTopbar>
  <div class="gallery-layout">
    <aside class="gallery-sidebar"><div class="mlab">FOUNDATIONS → INTERFACES</div><nav aria-label="Components"><a href="#overview">Overview <span>01</span></a><a href="#topbar">Topbar <span>02</span></a><a href="#auth">Authentication <span>03</span></a><a href="#primitives">Primitives <span>04</span></a><a href="#forms">Forms & feedback <span>05</span></a><a href="#dialogs">Dialogs <span>06</span></a></nav><p>Shared structure.<br>One visual language.<br>Built for Arcadran.</p><code>@arcadran/ui</code></aside>
    <main class="gallery-main">
      <section id="overview" class="gallery-intro"><div class="kicker">ARCADRAN / SHARED INTERFACES</div><h1>Built once.<br><span>Recognized everywhere.</span></h1><p class="sub">A working collection of Vue components, grounded in the Arcadran design system. Consistent details from sign-in to everyday actions.</p><div class="gallery-facts"><div><b>10</b><span>COMPONENTS</span></div><div><b>02</b><span>THEMES</span></div><div><b>Vue 3</b><span>NUXT READY</span></div></div></section>
      <section id="topbar" class="gallery-section">
        <div class="gallery-heading"><div><span class="kicker">02 / APPLICATION SHELL</span><h2>A familiar starting point.</h2></div><ArBadge>ArTopbar</ArBadge></div>
        <p class="gallery-copy">Brand, navigation, context, actions and account — composed around each product. Controls stay visible as the bar wraps on smaller screens.</p>
        <div class="gallery-controls"><label>Example <select v-model="topbarProduct" class="input" aria-label="Topbar example" @change="topbarFeedback = ''"><option>Calque</option><option>Jalon</option><option>Cadran</option></select></label><span>Same component · different content</span></div>
        <div class="gallery-topbar-stage" data-testid="topbar-stage">
          <ArTopbar :logo-src="logoSmall" :app-name="topbarProduct" home-href="#topbar" :home-label="`${topbarProduct}, home`" :sticky="false"
            :items="topbarProduct === 'Jalon' ? [{ label: 'Board', href: '#topbar', current: true, count: 12 }, { label: 'Code review', href: '#dialogs', count: 3 }] : []" navigation-label="Example navigation">
            <template v-if="topbarProduct === 'Calque' || topbarProduct === 'Cadran'" #context>
              <span v-if="topbarProduct === 'Calque'" class="gallery-topbar-file" title="telemetrics-data-agility.fig">telemetrics-data-agility.fig</span>
              <form v-else role="search" @submit.prevent="topbarFeedback = topbarSearch ? `Search requested: ${topbarSearch}` : 'Enter a search term.'"><input v-model="topbarSearch" class="input" aria-label="Search projects" placeholder="Search projects…" type="search" /></form>
            </template>
            <template #actions>
              <template v-if="topbarProduct === 'Calque'"><ArButton size="sm" @click="topbarFeedback = 'Export requested. This is a local example.'">Export JSON</ArButton><ArButton size="sm" variant="primary" @click="topbarFeedback = 'Import requested. This is a local example.'">Import .fig</ArButton></template>
              <ArBadge v-else-if="topbarProduct === 'Jalon'" tone="success">Live</ArBadge>
            </template>
            <template #account><span v-if="topbarProduct === 'Cadran'" class="gallery-topbar-user">designer@arcadran.com</span><ArButton size="sm" @click="topbarFeedback = 'Sign-out requested. Your session has not changed.'">Sign out</ArButton></template>
          </ArTopbar>
          <div class="gallery-topbar-content"><span class="mlab">{{ topbarProduct }} WORKSPACE</span><p role="status">{{ topbarFeedback || 'Application content starts here.' }}</p></div>
        </div>
        <div class="gallery-code"><code>&lt;ArTopbar :logo-src="logo" app-name="Calque"&gt;… #context / #actions / #account …&lt;/ArTopbar&gt;</code></div>
      </section>
      <section id="auth" class="gallery-section"><div class="gallery-heading"><div><span class="kicker">03 / COMPOSITION</span><h2>One entrance. Every product.</h2></div><ArBadge>ArAuthGate</ArBadge></div><p class="gallery-copy">The same brand, spacing and feedback. Product copy and authorization stay in the application.</p><div class="gallery-controls"><label>Product <select v-model="app" class="input" aria-label="Example product"><option>Calque</option><option>Jalon</option><option>YouShallNotPass</option></select></label><label><input v-model="authError" type="checkbox" /> Show error</label><label><input v-model="authBusy" type="checkbox" /> Loading</label></div><div class="gallery-stage" data-testid="auth-stage"><ArAuthGate :app-name="app" :description="descriptions[app] || ''" :logo-src="logo" sign-in-href="#auth" :busy="authBusy" :error="authError ? 'This account is not authorized. Try a different account.' : undefined" /></div><div class="gallery-code"><code>&lt;ArAuthGate app-name="Calque" :sign-in-href="href" :error="error" … /&gt;</code></div><details><summary>Google or another provider</summary><p class="gallery-copy">Place the provider’s official button inside the actions slot. The library does not load an SDK or manage a session.</p><div class="gallery-provider"><ArAuthGate app-name="Cadran" brand-name="Cadran" access-label="Authorized accounts" description="Connect with your authorized Google account." :logo-src="logo"><template #actions><div class="gallery-provider-slot">#actions · Google Sign-In mounts here</div></template></ArAuthGate></div></details></section>
      <section id="primitives" class="gallery-section"><div class="gallery-heading"><div><span class="kicker">04 / PRIMITIVES</span><h2>Actions with clear intent.</h2></div><ArBadge>Button · Badge · Brand</ArBadge></div><div class="gallery-card"><h3 class="mlab">A SINGLE PRIMARY ACTION PER SCREEN</h3><div class="gallery-row"><ArButton variant="primary">Save changes</ArButton><ArButton>Cancel</ArButton><ArButton variant="brand">Generate</ArButton><ArButton variant="danger">Delete</ArButton></div><div class="gallery-row"><ArButton size="sm">Compact</ArButton><ArButton disabled>Unavailable</ArButton><ArButton loading>Saving</ArButton><ArButton href="#primitives" disabled>Disabled link</ArButton></div><div class="gallery-rule" /><h3 class="mlab">STATUS IS NOT THE BRAND COLOR</h3><div class="gallery-row"><ArBadge>Draft</ArBadge><ArBadge tone="success">Passed</ArBadge><ArBadge tone="warning">Needs review</ArBadge><ArBadge tone="danger">Failed</ArBadge><ArBadge tone="primary">Selected</ArBadge><ArBadge tone="brand">Featured</ArBadge></div></div></section>
      <section id="forms" class="gallery-section"><div class="gallery-heading"><div><span class="kicker">05 / FEEDBACK</span><h2>Every state accounted for.</h2></div><ArBadge>Field · Banner · Progress · Spinner</ArBadge></div><div class="gallery-grid"><form class="gallery-card" @submit.prevent="submitted = true"><ArTextField v-model="email" label="Email address" name="email" type="email" hint="Use your organization’s email address." :error="submitted && !email ? 'Enter your email address.' : undefined" autocomplete="email" /><ArButton type="submit">Validate example</ArButton><p class="gallery-copy" aria-live="polite">{{ submitted && email ? 'Example saved locally.' : 'This demo does not submit any data.' }}</p></form><div class="gallery-card gallery-feedback"><ArBanner :live="false">Your file stays in your browser.</ArBanner><ArBanner tone="warning" :live="false">Review the changes before publishing.</ArBanner><ArBanner tone="danger" :live="false">The request failed. Please try again.</ArBanner><label class="mlab" for="progress">IMPORT PROGRESS · {{ progress }}%</label><ArProgress :value="Number(progress)" label="Import progress" /><input id="progress" v-model="progress" type="range" min="0" max="100" /><div class="gallery-row"><ArSpinner /><span>Preparing the preview…</span></div></div></div></section>
      <section id="dialogs" class="gallery-section"><div class="gallery-heading"><div><span class="kicker">06 / INTERACTION</span><h2>A shared place for decisions.</h2></div><ArBadge>ArDialog</ArBadge></div><div class="gallery-card"><p class="gallery-copy">Native modal behavior: keyboard focus stays inside, Escape closes it, and focus returns to the opening action.</p><div class="gallery-row"><ArButton @click="open = true">Open example dialog</ArButton><ArButton @click="persistent = true">Open required decision</ArButton></div></div></section>
      <footer class="gallery-footer"><span>ARCADRAN UI / 0.1.0</span><span>DESIGN SYSTEM 2.2.0 · LOCAL ASSETS · NO AUTH SDK</span></footer>
    </main>
  </div>
  <ArDialog v-model="open" title="A reusable dialog" description="This shell is shared. The content and actions belong to your product."><ArTextField label="Project name" model-value="Calque" /><ArButton @click="nested = true">Open nested dialog</ArButton><template #footer><ArButton @click="open = false">Cancel dialog</ArButton><ArButton variant="primary" @click="open = false">Save example</ArButton></template></ArDialog>
  <ArDialog v-model="nested" title="Nested dialog" size="sm"><p>The parent remains open when this dialog closes.</p><template #footer><ArButton @click="nested = false">Back to parent</ArButton></template></ArDialog>
  <ArDialog v-model="persistent" title="A decision is required" :dismissible="false" size="sm"><p>This example ignores Escape and backdrop clicks.</p><template #footer><ArButton @click="persistent = false">Acknowledge</ArButton></template></ArDialog>
</template>
