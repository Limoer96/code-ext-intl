# Change Log

## [1.1.0] - 2020-07-10

### Added

- 集成[kiwi-intl](https://github.com/alibaba/kiwi/tree/master/kiwi-intl)，解决最后一步问题，全流程自动生成。
- 新的语言文件输出方式和组织形式。
- 修改`config`，新增`langs`用于指定项目支持的多语言，默认为`['en-US', 'zh-CN']`

### Removed

- 移除`config.mode`，默认按照源文件目录结构导出
- 移除`config.template`，默认生成其它语言文件模板
