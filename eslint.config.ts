import antfu from '@antfu/eslint-config';

export default antfu({
  vue: true,
  typescript: true,
  stylistic: true,
  rules: {
    'no-console': 'off',
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/comma-dangle': ['error', 'never']
  }
});
