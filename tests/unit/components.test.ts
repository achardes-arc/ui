import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { ArButton, ArTextField, ArAuthGate, ArBanner, ArProgress, ArDialog, ArTopbar, ArSectionHeading, ArContentCard, ArDescriptionList } from '../../src';

describe('actions', () => {
  it('defaults to a non-submitting button and forwards enabled clicks', async () => {
    const button = mount(ArButton, { slots: { default: 'Save' } });
    expect(button.attributes('type')).toBe('button');
    await button.trigger('click');
    expect(button.emitted('click')).toHaveLength(1);
  });
  it('removes the destination and blocks activation while a link is loading', async () => {
    const button = mount(ArButton, { props: { href: '#login', loading: true }, slots: { default: 'Sign in' } });
    expect(button.element.tagName).toBe('A');
    expect(button.attributes('href')).toBeUndefined();
    expect(button.attributes('aria-disabled')).toBe('true');
    expect(button.attributes('tabindex')).toBe('-1');
    await button.trigger('click');
    expect(button.emitted('click')).toBeUndefined();
    await button.setProps({ loading: false });
    expect(button.attributes('href')).toBe('#login');
    expect(button.attributes('tabindex')).toBeUndefined();
    await button.trigger('click');
    expect(button.emitted('click')).toHaveLength(1);
  });
  it('disables busy form actions', () => {
    expect(mount(ArButton, { props: { loading: true, type: 'submit' } }).attributes('disabled')).toBeDefined();
  });
});
describe('fields and feedback', () => {
  it('connects the label, hint and error to the input and emits text', async () => {
    const field = mount(ArTextField, { props: { label: 'Email', hint: 'Work account', error: 'Required', describedBy: 'policy' }, attrs: { name: 'email', autocomplete: 'email' } });
    const input = field.get('input');
    const id = input.attributes('id');
    expect(field.get('label').attributes('for')).toBe(id);
    expect(input.attributes('aria-describedby')).toBe(`policy ${id}-hint ${id}-error`);
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('name')).toBe('email');
    await input.setValue('person@example.com');
    expect(field.emitted('update:modelValue')?.[0]).toEqual(['person@example.com']);
    await field.setProps({ error: '' });
    expect(input.attributes('aria-invalid')).toBeUndefined();
    expect(input.attributes('aria-describedby')).not.toContain('-error');
  });
  it('makes errors assertive and supports quiet static messages', () => {
    expect(mount(ArBanner, { props: { tone: 'danger' } }).attributes('role')).toBe('alert');
    expect(mount(ArBanner, { props: { live: false } }).attributes('role')).toBeUndefined();
  });
  it('clamps progress and supports indeterminate values', () => {
    expect(mount(ArProgress, { props: { label: 'Build', value: 120 } }).attributes('value')).toBe('100');
    expect(mount(ArProgress, { props: { label: 'Build', value: -2, max: 0 } }).attributes('value')).toBe('0');
    expect(mount(ArProgress, { props: { label: 'Build', value: Number.NaN } }).attributes('value')).toBeUndefined();
  });
});
describe('authentication composition', () => {
  const props = { appName: 'Calque', description: 'Explore the layout', logoSrc: '/logo.svg', signInHref: '/api/auth/github' };
  it('renders a local GitHub link and accessible failure feedback', () => {
    const gate = mount(ArAuthGate, { props: { ...props, error: 'Not authorized' } });
    expect(gate.get('a').attributes('href')).toBe('/api/auth/github');
    expect(gate.get('[role=alert]').text()).toBe('Not authorized');
    expect(gate.find('script').exists()).toBe(false);
  });
  it('lets a provider replace the action without retaining the GitHub button', () => {
    const gate = mount(ArAuthGate, { props, slots: { actions: '<div id="google-provider">Provider widget</div>' } });
    expect(gate.find('#google-provider').exists()).toBe(true);
    expect(gate.find('a').exists()).toBe(false);
  });
  it('escapes text supplied by the application', () => {
    const gate = mount(ArAuthGate, { props: { ...props, error: '<img src=x onerror=alert(1)>' } });
    expect(gate.get('[role=alert]').find('img').exists()).toBe(false);
  });
});
describe('SSR contract', () => {
  it('renders without browser APIs and gives multiple fields distinct stable ids', async () => {
    const component = { render: () => h('div', [h(ArTextField, { label: 'First' }), h(ArTextField, { label: 'Second' }), h(ArDialog, { modelValue: true, title: 'Example' })]) };
    const first = await renderToString(createSSRApp(component));
    const second = await renderToString(createSSRApp(component));
    expect(first).toBe(second);
    const ids = [...first.matchAll(/<input[^>]*id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(first).not.toContain('<dialog open');
  });
});

describe('topbar composition', () => {
  it('renders named navigation, current page and zero counts', () => {
    const bar = mount(ArTopbar, { props: {
      logoSrc: '/logo-small.svg', appName: 'Jalon', homeHref: '/', homeLabel: 'Jalon home',
      navigationLabel: 'Projects', items: [{ label: 'Board', href: '/board', current: true, count: 0 }, { label: 'Reviews', href: '/reviews' }],
    } });
    expect(bar.get('header').classes()).toContain('topbar');
    expect(bar.get('a[aria-label="Jalon home"]').attributes('href')).toBe('/');
    expect(bar.get('nav').attributes('aria-label')).toBe('Projects');
    expect(bar.get('a[href="/board"]').attributes('aria-current')).toBe('page');
    expect(bar.get('a[href="/board"] .n').text()).toBe('0');
    expect(bar.get('a[href="/reviews"]').attributes('aria-current')).toBeUndefined();
  });
  it('supports router-aware slots and omits unused regions', () => {
    const empty = mount(ArTopbar);
    expect(empty.find('nav').exists()).toBe(false);
    expect(empty.find('.ar-topbar__end').exists()).toBe(false);
    expect(empty.find('.ar-topbar__brand').exists()).toBe(false);
    const bar = mount(ArTopbar, {
      props: { sticky: false, items: [{ label: 'Unused fallback', href: '/fallback' }] },
      slots: { brand: '<a href="/custom">Custom brand</a>', navigation: '<a href="/custom/board">Custom route</a>', context: 'Current file', actions: '<button>Import</button>', account: '<button>Sign out</button>' },
    });
    expect(bar.find('a[href="/fallback"]').exists()).toBe(false);
    expect(bar.get('.ar-topbar__brand').text()).toBe('Custom brand');
    expect(bar.get('.ar-topbar__context').text()).toBe('Current file');
    expect(bar.classes()).toContain('ar-topbar--static');
  });
  it('renders its navigation on the server without a browser or router', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(ArTopbar, { appName: 'Calque', logoSrc: '/logo.svg', items: [{ label: 'Overview', href: '/', current: true }] }) }));
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('Calque');
  });
});

describe('website content primitives', () => {
  it('respects the surrounding heading hierarchy and escapes editorial text', () => {
    const heading = mount(ArSectionHeading, { props: { title: '<script>Example</script>', level: 3, titleId: 'expertise', kicker: 'What we do' } });
    expect(heading.get('h3').attributes('id')).toBe('expertise');
    expect(heading.get('h3').text()).toBe('<script>Example</script>');
    expect(heading.find('script').exists()).toBe(false);
    expect(heading.find('p').exists()).toBe(false);
  });
  it('keeps multiple SSR card labels distinct and preserves actions as real links', async () => {
    const html = await renderToString(createSSRApp({ render: () => h('section', [
      h(ArContentCard, { title: 'First', level: 4 }, { footer: () => h('a', { href: '/details' }, 'Read more') }),
      h(ArContentCard, { title: 'Second', accent: 'brand', level: 4 }),
    ]) }));
    const labels = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(labels).size).toBe(2);
    for (const label of labels) expect(html).toContain(`id="${label}"`);
    expect(html).toContain('href="/details"');
    expect(html.match(/<h4 /g)).toHaveLength(2);
  });
  it('uses definition-list semantics and allows structured values without raw HTML', () => {
    const list = mount(ArDescriptionList, {
      props: { items: [{ term: 'Email', description: 'person@example.com' }, { term: 'Note', description: '<img src=x>' }] },
      slots: { value: ({ item }) => item.term === 'Email' ? h('a', { href: `mailto:${item.description}` }, item.description) : item.description },
    });
    expect(list.element.tagName).toBe('DL');
    expect(list.findAll('dt').map((term) => term.text())).toEqual(['Email', 'Note']);
    expect(list.findAll('dd')).toHaveLength(2);
    expect(list.get('a').attributes('href')).toBe('mailto:person@example.com');
    expect(list.find('img').exists()).toBe(false);
    expect(mount(ArDescriptionList, { props: { items: [] } }).find('dl').exists()).toBe(false);
  });
});
