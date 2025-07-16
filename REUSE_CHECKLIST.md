# 🚀 飞书认证系统复用清单

## 📋 复用到新项目的完整步骤

### 第一步：项目初始化

#### ✅ 1.1 复制核心文件
```bash
# 复制以下核心目录和文件到新项目
├── src/lib/                 # 核心工具库
│   ├── auth.ts             # 认证工具函数
│   └── feishu.ts           # 飞书API客户端
├── src/contexts/           # React Context
│   └── AuthContext.tsx     # 认证上下文
├── src/app/api/auth/       # 认证API路由
│   ├── login/route.ts      # 登录API
│   ├── register/route.ts   # 注册API
│   └── logout/route.ts     # 登出API
├── .env.example            # 环境变量模板
├── vercel.json             # 部署配置
└── setup.md                # 快速设置指南
```

#### ✅ 1.2 安装必要依赖
```bash
npm install axios bcryptjs js-cookie jsonwebtoken
npm install -D @types/bcryptjs @types/js-cookie @types/jsonwebtoken
```

#### ✅ 1.3 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local 填入实际配置
```

### 第二步：飞书配置

#### ✅ 2.1 创建飞书应用
- [ ] 访问 [飞书开放平台](https://open.feishu.cn/)
- [ ] 创建企业自建应用
- [ ] 获取 `App ID` 和 `App Secret`
- [ ] 配置应用权限：`bitable:app`, `bitable:app:readonly`

#### ✅ 2.2 创建多维表格
- [ ] 在飞书中创建新的多维表格
- [ ] 添加必需字段：
  - [ ] `username` (文本) - 用户名，设为主键
  - [ ] `email` (文本) - 邮箱地址
  - [ ] `password_hash` (文本) - 加密密码
  - [ ] `phone` (数字) - 手机号码
  - [ ] `status` (文本) - 用户状态
  - [ ] `created_time` (文本) - 创建时间
  - [ ] `last_login` (文本) - 最后登录时间
- [ ] 获取 `App Token` 和 `Table ID`

### 第三步：代码集成

#### ✅ 3.1 更新页面路由
```bash
# 根据需要创建或修改页面
src/app/login/page.tsx      # 登录页面
src/app/register/page.tsx   # 注册页面
src/app/dashboard/page.tsx  # 用户仪表板
```

#### ✅ 3.2 集成认证上下文
```tsx
// 在 layout.tsx 中包装 AuthProvider
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### ✅ 3.3 使用认证功能
```tsx
// 在组件中使用认证
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();
  // 使用认证功能
}
```

### 第四步：自定义配置

#### ✅ 4.1 品牌定制
- [ ] 修改页面标题和描述
- [ ] 更新 logo 和品牌色彩
- [ ] 调整 UI 组件样式
- [ ] 自定义错误消息文案

#### ✅ 4.2 功能扩展（可选）
- [ ] 添加邮箱验证
- [ ] 实现密码重置
- [ ] 集成第三方登录
- [ ] 添加用户角色管理
- [ ] 实现用户头像上传

#### ✅ 4.3 字段自定义（可选）
如需添加用户字段：
- [ ] 在飞书表格中添加新字段
- [ ] 更新 `src/lib/feishu.ts` 中的类型定义
- [ ] 修改注册表单和验证逻辑
- [ ] 更新 API 接口处理

### 第五步：测试验证

#### ✅ 5.1 功能测试
- [ ] 测试用户注册流程
- [ ] 测试用户登录功能
- [ ] 测试密码验证
- [ ] 测试重复用户检查
- [ ] 测试登出功能

#### ✅ 5.2 错误处理测试
- [ ] 测试网络错误处理
- [ ] 测试表单验证错误
- [ ] 测试飞书API错误
- [ ] 测试JWT令牌过期

#### ✅ 5.3 响应式测试
- [ ] 测试桌面端显示
- [ ] 测试移动端适配
- [ ] 测试不同浏览器兼容性

### 第六步：部署上线

#### ✅ 6.1 环境配置
- [ ] 配置生产环境变量
- [ ] 更新 `NEXTAUTH_URL` 为生产域名
- [ ] 检查飞书应用生产权限

#### ✅ 6.2 部署选择

**Vercel部署**
- [ ] 推送代码到GitHub
- [ ] 在Vercel导入项目
- [ ] 配置环境变量
- [ ] 部署并测试

**其他平台部署**
- [ ] 构建生产版本：`npm run build`
- [ ] 配置服务器环境变量
- [ ] 启动生产服务：`npm start`

#### ✅ 6.3 上线后验证
- [ ] 测试生产环境注册登录
- [ ] 检查飞书数据同步
- [ ] 验证SSL证书和安全性
- [ ] 监控错误日志

## 🔧 常用配置模板

### 环境变量模板
```env
# 飞书应用配置
FEISHU_APP_ID=cli_xxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxx
FEISHU_APP_TOKEN=bascxxxxxxxxxx
FEISHU_TABLE_ID=tblxxxxxxxxxx

# JWT密钥 (32位以上随机字符串)
JWT_SECRET=your_super_secret_jwt_key_here

# NextAuth配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://yourdomain.com
```

### 飞书表格字段配置
| 字段名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| username | 文本 | ✅ | 用户名，建议设为主键 |
| email | 文本 | ✅ | 邮箱地址 |
| password_hash | 文本 | ✅ | bcrypt加密后的密码 |
| phone | 数字 | ❌ | 手机号码 |
| status | 文本 | ✅ | 用户状态 (active/inactive) |
| created_time | 文本 | ✅ | 账户创建时间 |
| last_login | 文本 | ❌ | 最后登录时间 |

## 🚨 注意事项

### 安全要求
- ⚠️ **绝不要**将 `.env.local` 提交到版本控制
- ⚠️ **必须使用**强密码作为JWT密钥
- ⚠️ **定期更换**飞书应用密钥
- ⚠️ **启用HTTPS**在生产环境

### 性能优化
- 💡 使用 Next.js 的 Server Components
- 💡 实现适当的缓存策略
- 💡 优化飞书API调用频率
- 💡 压缩和优化静态资源

### 维护建议
- 📝 定期备份飞书表格数据
- 📝 监控API调用限制
- 📝 记录用户反馈和错误
- 📝 保持依赖包更新

## 📞 技术支持

遇到问题时的解决步骤：
1. 查看 `setup.md` 中的常见问题
2. 检查飞书开放平台文档
3. 查看项目 GitHub Issues
4. 联系项目维护者

---

**完成复用后，建议创建一个测试账户验证所有功能正常工作！** ✅