
# 党费记账软件 - Product Requirement Document

## Overview
- **Summary**: 一款专为各级党组织设计的单机版财务管理软件，实现党费收缴、使用、管理的全流程数字化，包含凭证管理、账簿查询、科目自定义、数据自动保存等核心功能，支持Windows和银河麒麟国产操作系统。
- **Purpose**: 解决传统手工记账效率低、易出错、数据不规范、查询困难等问题，帮助党组织实现党费管理的规范化、标准化、信息化，提高财务工作效率和数据准确性。
- **Target Users**: 各级党组织财务人员、党务工作者。

## Goals
- 实现完整的会计科目自定义管理
- 提供便捷的凭证录入、审核、记账功能
- 支持明细账、总账等账簿查询
- 实现数据定期自动保存和手动备份恢复
- 支持Windows和银河麒麟双平台
- 提供直观易用的用户界面

## Non-Goals (Out of Scope)
- 网络版/云端多用户功能
- 与其他财务系统的复杂集成
- 复杂的财务分析和预测功能
- 移动APP版本
- 用户权限管理和认证

## Background & Context
- 参考金蝶、用友等成熟财务软件的行政事业版设计理念
- 采用单机版架构，确保数据安全性和独立性
- 使用Electron实现跨平台支持
- 采用本地SQLite数据库存储数据

## Functional Requirements
- **FR-1**: 会计科目管理
  - 支持科目自定义（新增、修改、删除）
  - 支持科目树形结构（多级科目）
  - 预置标准党费会计科目
- **FR-2**: 凭证管理
  - 凭证录入（支持多借多贷）
  - 凭证修改、删除
  - 凭证审核、记账
  - 凭证查询和筛选
- **FR-3**: 账簿查询
  - 明细账查询
  - 总账查询
  - 科目余额表查询
  - 支持数据导出
- **FR-4**: 数据管理
  - 定期自动保存数据
  - 手动数据备份
  - 数据恢复功能
- **FR-5**: 报表生成
  - 党费收缴报表
  - 党费使用报表
  - 财务汇总报表

## Non-Functional Requirements
- **NFR-1**: 跨平台兼容性 - 在Windows 10/11和银河麒麟系统上正常运行
- **NFR-2**: 性能 - 凭证录入响应时间&lt;1秒，账簿查询响应时间&lt;2秒
- **NFR-3**: 数据安全性 - 本地存储，数据备份加密
- **NFR-4**: 易用性 - 界面简洁直观，操作流程清晰
- **NFR-5**: 可靠性 - 自动保存功能确保数据不丢失

## Constraints
- **Technical**: 使用Electron + React + TypeScript + SQLite
- **Business**: 单机版，不需要网络连接
- **Dependencies**: 依赖Electron、better-sqlite3、React等开源库

## Assumptions
- 用户具备基本的财务知识
- 用户使用的设备满足Electron运行要求
- 数据存储在用户本地文件系统

## Acceptance Criteria

### AC-1: 会计科目管理
- **Given**: 用户打开科目管理页面
- **When**: 用户进行科目新增、修改、删除操作
- **Then**: 操作成功，科目列表实时更新，支持树形结构展示
- **Verification**: `programmatic`

### AC-2: 凭证录入
- **Given**: 用户打开凭证录入页面
- **When**: 用户填写凭证信息并保存
- **Then**: 凭证保存成功，自动校验借贷平衡
- **Verification**: `programmatic`

### AC-3: 账簿查询
- **Given**: 用户打开账簿查询页面
- **When**: 用户选择科目和查询条件
- **Then**: 显示对应的明细账或总账数据
- **Verification**: `programmatic`

### AC-4: 自动保存
- **Given**: 系统正在运行
- **When**: 达到预设的自动保存时间间隔
- **Then**: 数据自动保存到本地数据库
- **Verification**: `programmatic`

### AC-5: 跨平台运行
- **Given**: 在Windows或银河麒麟系统上
- **When**: 用户启动应用程序
- **Then**: 应用程序正常启动，功能完整可用
- **Verification**: `human-judgment`

### AC-6: 界面设计
- **Given**: 用户使用应用程序
- **When**: 用户浏览各个功能页面
- **Then**: 界面美观、直观、易用，符合党建特色风格
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要支持多账套管理？
- [ ] 数据备份是否需要加密？
- [ ] 是否需要支持打印功能？

