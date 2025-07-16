# 快速设置指南

## 🚀 5分钟快速部署

### 1. 环境准备
```bash
# 安装依赖
npm install

# 复制环境变量模板
cp .env.example .env.local
```

### 2. 飞书配置

#### 创建飞书应用
1. 访问 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 `App ID` 和 `App Secret`

#### 创建多维表格
1. 在飞书中创建多维表格
2. 添加以下字段：
   - `username` (文本) - 用户名
   - `email` (文本) - 邮箱
   - `password_hash` (文本) - 密码哈希
   - `phone` (数字) - 手机号
   - `status` (文本) - 状态
   - `created_time` (文本) - 创建时间
   - `last_login` (文本) - 最后登录

3. 获取 `App Token` 和 `Table ID`

#### 配置应用权限
在飞书开放平台为应用添加以下权限：
- `bitable:app` - 多维表格应用权限
- `bitable:app:readonly` - 多维表格只读权限

### 3. 环境变量配置

编辑 `.env.local` 文件：

```env
# 飞书配置
FEISHU_APP_ID=cli_xxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxx
FEISHU_APP_TOKEN=bascxxxxxxxxxx
FEISHU_TABLE_ID=tblxxxxxxxxxx

# JWT密钥 (建议使用随机生成的强密码)
JWT_SECRET=your_super_secret_jwt_key_here

# NextAuth配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. 启动项目

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
npm start
```

### 5. 测试功能

1. 访问 `http://localhost:3000`
2. 点击"注册新账户"测试注册功能
3. 使用注册的账户测试登录功能

## 🔧 常见问题

### Q: 飞书API调用失败
A: 检查以下项目：
- App ID 和 App Secret 是否正确
- 应用权限是否已配置
- 网络连接是否正常

### Q: 表格字段不匹配
A: 确保飞书表格包含所有必需字段，字段名称和类型要完全匹配

### Q: JWT令牌验证失败
A: 检查 JWT_SECRET 是否配置正确，建议使用长度至少32位的随机字符串

## 📱 移动端适配

项目已完全适配移动端，支持：
- 响应式布局
- 触摸友好的交互
- 移动端优化的表单

## 🚀 生产部署

### Vercel部署
1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 更新 `NEXTAUTH_URL` 为生产域名

### 其他平台
确保设置正确的环境变量和构建命令：
```bash
npm run build
npm start
```

---

**提示**: 首次部署后，建议创建一个管理员账户用于系统管理。