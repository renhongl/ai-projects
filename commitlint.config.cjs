module.exports = {
  // 继承业界通用的 Angular 约定式提交规范（即包含了 feat, fix, docs 等类型）
  extends: ['@commitlint/config-conventional'],

  // 如果团队有特殊诉求，可以在这里自定义规则（可选）
  rules: {
    // 比如：限制 header 的最大长度为 100 个字符
    'header-max-length': [2, 'always', 100],
    // 比如：限制 type 的可选范围必须是下面这几种
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'ci',
      ],
    ],
  },
};
