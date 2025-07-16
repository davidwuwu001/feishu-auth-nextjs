import axios from 'axios';

// 飞书API配置
const FEISHU_BASE_URL = 'https://open.feishu.cn/open-apis';

// 飞书API客户端类
export class FeishuClient {
  private appId: string;
  private appSecret: string;
  private appToken: string;
  private tableId: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.appId = process.env.FEISHU_APP_ID || '';
    this.appSecret = process.env.FEISHU_APP_SECRET || '';
    this.appToken = process.env.FEISHU_APP_TOKEN || '';
    this.tableId = process.env.FEISHU_TABLE_ID || '';
    
    // 调试：检查环境变量是否正确加载
    console.log('飞书配置检查:', {
      appId: this.appId ? '已设置' : '未设置',
      appSecret: this.appSecret ? '已设置' : '未设置',
      appToken: this.appToken ? '已设置' : '未设置',
      tableId: this.tableId ? '已设置' : '未设置'
    });
    
    // 验证必要的配置
    if (!this.appId || !this.appSecret || !this.appToken || !this.tableId) {
      throw new Error('飞书配置不完整，请检查环境变量设置');
    }
  }

  // 获取访问令牌
  private async getAccessToken(): Promise<string> {
    const now = Date.now();
    
    // 如果token还有效，直接返回
    if (this.accessToken && now < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${FEISHU_BASE_URL}/auth/v3/tenant_access_token/internal/`,
        {
          app_id: this.appId,
          app_secret: this.appSecret,
        }
      );

      if (response.data.code === 0) {
        this.accessToken = response.data.tenant_access_token;
        // 设置过期时间为1小时50分钟后（提前10分钟刷新）
        this.tokenExpiry = now + (110 * 60 * 1000);
        return this.accessToken;
      } else {
        throw new Error(`获取访问令牌失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('获取飞书访问令牌失败:', error);
      throw error;
    }
  }

  // 获取请求头
  private async getHeaders() {
    const token = await this.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // 查询用户记录
  async findUser(username: string): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const url = `${FEISHU_BASE_URL}/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records`;
      
      const response = await axios.get(url, {
        headers,
        params: {
          filter: `CurrentValue.[username] = "${username}"`,
        },
      });

      console.log('飞书API响应(用户名查询):', JSON.stringify(response.data, null, 2));
      
      if (response.data.code === 0) {
        const records = response.data.data?.items || [];
        return records.length > 0 ? records[0] : null;
      } else {
        throw new Error(`查询用户失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('查询用户失败:', error);
      throw error;
    }
  }

  // 根据邮箱查询用户
  async findUserByEmail(email: string): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const url = `${FEISHU_BASE_URL}/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records`;
      
      const response = await axios.get(url, {
        headers,
        params: {
          filter: `CurrentValue.[email] = "${email}"`,
        },
      });

      if (response.data.code === 0) {
        const records = response.data.data?.items || [];
        return records.length > 0 ? records[0] : null;
      } else {
        throw new Error(`查询用户失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('查询用户失败:', error);
      throw error;
    }
  }

  // 创建用户记录
  async createUser(userData: {
    username: string;
    email: string;
    password_hash: string;
    phone?: string;
  }): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const url = `${FEISHU_BASE_URL}/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records`;
      
      // 处理phone字段：如果为空或无效，设为null；否则转换为数字
      let phoneValue = null;
      if (userData.phone && userData.phone.trim() !== '') {
        const phoneNumber = parseInt(userData.phone.replace(/\D/g, ''), 10);
        if (!isNaN(phoneNumber)) {
          phoneValue = phoneNumber;
        }
      }
      
      const requestData = {
        fields: {
          username: userData.username,
          email: userData.email,
          password_hash: userData.password_hash,
          phone: phoneValue,
          status: '激活',
          created_time: Date.now().toString(),
        },
      };
      
      console.log('创建用户请求数据:', JSON.stringify(requestData, null, 2));
      
      const response = await axios.post(url, requestData, { headers });
      
      console.log('创建用户响应:', JSON.stringify(response.data, null, 2));

      if (response.data.code === 0) {
        return response.data.data.record;
      } else {
        throw new Error(`创建用户失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('创建用户失败:', error);
      if (error.response) {
        console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  // 更新用户最后登录时间
  async updateLastLogin(recordId: string): Promise<void> {
    try {
      const headers = await this.getHeaders();
      const url = `${FEISHU_BASE_URL}/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records/${recordId}`;
      
      await axios.put(
        url,
        {
          fields: {
            last_login: Date.now(),
          },
        },
        { headers }
      );
    } catch (error) {
      console.error('更新最后登录时间失败:', error);
      throw error;
    }
  }

  // 更新用户信息
  async updateUser(recordId: string, updateData: any): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const url = `${FEISHU_BASE_URL}/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/records/${recordId}`;
      
      const response = await axios.put(
        url,
        {
          fields: updateData,
        },
        { headers }
      );

      if (response.data.code === 0) {
        return response.data.data.record;
      } else {
        throw new Error(`更新用户失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }

  // 获取数据表字段信息
  async getTableFields(): Promise<any> {
    try {
      const headers = await this.getHeaders();
      const url = `${FEISHU_BASE_URL}/bitable/v1/apps/${this.appToken}/tables/${this.tableId}/fields`;
      
      const response = await axios.get(url, { headers });
      
      console.log('飞书字段信息:', JSON.stringify(response.data, null, 2));
      
      if (response.data.code === 0) {
        return response.data.data.items;
      } else {
        throw new Error(`获取字段信息失败: ${response.data.msg}`);
      }
    } catch (error) {
      console.error('获取字段信息失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const feishuClient = new FeishuClient();