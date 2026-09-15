import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { ArButton, ArTextField, ArAuthGate, ArBanner, ArProgress, ArDialog } from '../../src';

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
