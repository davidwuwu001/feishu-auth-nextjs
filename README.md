# 飞书认证系统 (Feishu Auth App)

基于 Next.js 14 和飞书多维表格的用户认证系统，提供完整的用户注册、登录和管理功能。

## 🚀 功能特性

- ✅ 用户注册和登录
- ✅ 基于 JWT 的身份认证
- ✅ 密码加密存储（bcrypt）
- ✅ 飞书多维表格数据存储
- ✅ 响应式设计
- ✅ TypeScript 类型安全
- ✅ 现代化 UI 界面

## 🛠 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据存储**: 飞书多维表格
- **身份认证**: JWT + bcrypt
- **HTTP 客户端**: Axios
- **部署平台**: Vercel

## 📋 项目结构

```
feishu-auth-app/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── api/auth/           # 认证相关 API 路由
│   │   │   ├── login/          # 登录接口
│   │   │   ├── register/       # 注册接口
│   │   │   ├── logout/         # 登出接口
│   │   │   └── me/             # 获取用户信息接口
│   │   ├── login/              # 登录页面
│   │   ├── register/           # 注册页面
│   │   ├── dashboard/          # 用户仪表板
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 首页
│   ├── contexts/               # React Context
│   │   └── AuthContext.tsx    # 认证状态管理
│   └── lib/                    # 工具库
│       ├── feishu.ts          # 飞书 API 客户端
│       └── auth.ts            # 认证工具函数
├── .env.local                  # 环境变量配置
├── package.json               # 项目依赖
└── README.md                  # 项目说明
```

## 🔧 环境配置

### 1. 飞书应用配置

首先需要在飞书开放平台创建应用并获取相关配置：

1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 App ID 和 App Secret
4. 创建多维表格并获取 App Token 和 Table ID

### 2. 环境变量设置

复制 `.env.local` 文件并填入实际配置：

```bash
# 飞书应用配置
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_APP_TOKEN=your_app_token
FEISHU_TABLE_ID=your_table_id

# JWT 密钥（请使用强密码）
JWT_SECRET=your_jwt_secret_key

# Next.js 配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. 飞书多维表格结构

在飞书多维表格中创建用户表，包含以下字段：

| 字段名 | 字段类型 | 说明 |
|--------|----------|------|
| id | 单行文本 | 用户唯一标识 |
| username | 单行文本 | 用户名 |
| email | 单行文本 | 邮箱地址 |
| password | 单行文本 | 加密后的密码 |
| phone | 单行文本 | 手机号码 |
| status | 单选 | 账户状态（active/inactive） |
| created_at | 日期时间 | 注册时间 |
| last_login | 日期时间 | 最后登录时间 |

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
# 编辑 .env.local 文件，填入实际配置
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📚 API 接口说明

### 用户注册

**POST** `/api/auth/register`

请求体：
```json
{
  "username": "用户名",
  "email": "邮箱地址",
  "password": "密码",
  "phone": "手机号码"
}
```

响应：
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "邮箱地址"
    }
  }
}
```

### 用户登录

**POST** `/api/auth/login`

请求体：
```json
{
  "identifier": "用户名或邮箱",
  "password": "密码"
}
```

响应：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "邮箱地址"
    },
    "token": "JWT令牌"
  }
}
```

### 获取用户信息

**GET** `/api/auth/me`

需要在 Cookie 中包含有效的 JWT 令牌。

响应：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "用户ID",
      "username": "用户名",
      "email": "邮箱地址",
      "phone": "手机号码",
      "status": "账户状态",
      "created_at": "注册时间",
      "last_login": "最后登录时间"
    }
  }
}
```

### 用户登出

**POST** `/api/auth/logout`

响应：
```json
{
  "success": true,
  "message": "登出成功"
}
```

## 🔒 安全特性

- **密码加密**: 使用 bcrypt 对密码进行哈希加密
- **JWT 认证**: 使用 JSON Web Token 进行身份验证
- **HTTP-only Cookie**: 令牌存储在 HTTP-only Cookie 中，防止 XSS 攻击
- **输入验证**: 对所有用户输入进行严格验证
- **错误处理**: 统一的错误处理和响应格式

## 📱 页面功能

### 首页 (`/`)
- 项目介绍和功能展示
- 根据登录状态显示不同的导航选项
- 技术栈说明

### 注册页面 (`/register`)
- 用户名、邮箱、密码、手机号输入
- 实时表单验证
- 密码强度检查
- 注册成功后自动跳转到登录页

### 登录页面 (`/login`)
- 支持用户名或邮箱登录
- 密码显示/隐藏切换
- 登录成功后跳转到仪表板

### 用户仪表板 (`/dashboard`)
- 显示用户详细信息
- 账户状态管理
- 登出功能

## 🚀 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. 在 Vercel 中导入项目

1. 访问 [Vercel](https://vercel.com/)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量
5. 部署项目

### 3. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_APP_TOKEN`
- `FEISHU_TABLE_ID`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (设置为你的 Vercel 域名)

## 🛠 开发指南

### 添加新的 API 路由

1. 在 `src/app/api/` 目录下创建新的路由文件
2. 使用统一的响应格式（`createSuccessResponse` 和 `createErrorResponse`）
3. 添加适当的错误处理和输入验证

### 添加新页面

1. 在 `src/app/` 目录下创建新的页面文件
2. 使用 `useAuth` Hook 获取用户状态
3. 添加适当的加载状态和错误处理

### 修改用户数据结构

1. 更新 `src/lib/feishu.ts` 中的类型定义
2. 修改相关的 API 接口
3. 更新前端组件以显示新字段

## 🐛 常见问题

### 1. 飞书 API 调用失败

- 检查 App ID 和 App Secret 是否正确
- 确认应用权限配置是否完整
- 检查多维表格的 App Token 和 Table ID

### 2. JWT 令牌验证失败

- 确认 JWT_SECRET 环境变量已设置
- 检查令牌是否已过期
- 确认 Cookie 设置是否正确

### 3. 部署后环境变量不生效

- 确认在 Vercel 中正确设置了所有环境变量
- 重新部署项目以应用新的环境变量

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过以下方式联系：

- 创建 GitHub Issue
- 发送邮件到项目维护者

---

**注意**: 请确保在生产环境中使用强密码和安全的环境变量配置。