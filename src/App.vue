<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { globalTool } from './components/tool';
// 用户类型定义
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: number;
  creditScore: number;
  gender: number; // 0: 未知, 1: 男, 2: 女
}
// 用户数据（默认数据）
const users = ref<User[]>([
  {
    "id": '1',
    "name": "张三",
    "email": "zhangsan@ex.com",
    "phone": "13800138000",
    "status": 1,
    "creditScore": 750,
    "gender": 1
  },
  {
    "id": '2',
    "name": "李四",
    "email": "lisi@ex.com",
    "phone": "13900139000",
    "status": 1,
    "creditScore": 680,
    "gender": 1
  },
  {
    "id": '3',
    "name": "王五",
    "email": "wangwu@ex.com",
    "phone": "13700137000",
    "status": 0,
    "creditScore": 620,
    "gender": 1
  },
  {
    "id": '4',
    "name": "赵六",
    "email": "zhaoliu@ex.com",
    "phone": "13600136000",
    "status": 2,
    "creditScore": 800,
    "gender": 1
  },
  {
    "id": '5',
    "name": "钱七",
    "email": "qianqi@ex.com",
    "phone": "13500135000",
    "status": 1,
    "creditScore": 720,
    "gender": 2
  },
  {
    "id": '6',
    "name": "孙八",
    "email": "sunba@ex.com",
    "phone": "13400134000",
    "status": 1,
    "creditScore": 690,
    "gender": 1
  },
  {
    "id": '7',
    "name": "周九",
    "email": "zhoujiu@ex.com",
    "phone": "13300133000",
    "status": 0,
    "creditScore": 580,
    "gender": 2
  },
  {
    "id": '8',
    "name": "吴十",
    "email": "wushi@ex.com",
    "phone": "13200132000",
    "status": 1,
    "creditScore": 810,
    "gender": 1
  },
  {
    "id": '9',
    "name": "郑十一",
    "email": "zhengshiyi@ex.com",
    "phone": "13100131000",
    "status": 1,
    "creditScore": 730,
    "gender": 2
  },
  {
    "id": '10',
    "name": "王十二",
    "email": "wangshier@ex.com",
    "phone": "13000130000",
    "status": 2,
    "creditScore": 670,
    "gender": 0
  }
]);
const isModalVisible = ref(false);
const isAddUser = ref(true);
// 表单数据
const formState = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  status: 1,
  creditScore: 0,
  gender: 0
});

// 搜索条件
const searchParams = reactive({
  name: '',
  email: '',
  phone: '',
  status: null,
  gender: null,
  creditScore: ''
});

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  position: ['bottomCenter']
});

// 操作历史
const operationHistory = ref<User[][]>([]);

// 表单校验规则
const validateEmail = (_: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入邮箱地址'));
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    callback(new Error('请输入有效的邮箱地址'));
  } else {
    callback();
  }
};

const validatePhone = (_: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入电话号码'));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入有效的11位手机号码'));
  } else {
    callback();
  }
};

// 表单校验规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, validator: validateEmail, trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  creditScore: [
    { required: true, message: '请输入信用分', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
};

// 表单引用
const formRef = ref();

// 初始化数据
onMounted(() => {
  loadUsers();
});

// 加载用户数据
const loadUsers = () => {
  const cachedUsers: User[] | null = globalTool.get('user_list');
  if (cachedUsers && cachedUsers.length > 0) {
    users.value = cachedUsers;
  } else {
    // 如果没有缓存数据，使用默认数据并保存
    saveUsers();
  }
  pagination.total = users.value.length;
};

// 保存用户数据
const saveUsers = () => {
  globalTool.set('user_list', users.value);
};

// 搜索用户
const searchUsers = () => {
  const filteredUsers = users.value.filter(user => {
    // 模糊搜索所有文本字段
    const nameMatch = searchParams.name ? user.name.toLowerCase().includes(searchParams.name.toLowerCase()) : true;
    const emailMatch = searchParams.email ? user.email.toLowerCase().includes(searchParams.email.toLowerCase()) : true;
    const phoneMatch = searchParams.phone ? user.phone.includes(searchParams.phone) : true;
    
    // 精确匹配状态和性别
    const statusMatch = searchParams.status === null || user.status === searchParams.status;
    const genderMatch = searchParams.gender === null || user.gender === searchParams.gender;
    
    // 信用分范围搜索
    const creditScoreMatch = searchParams.creditScore ? 
      user.creditScore.toString().includes(searchParams.creditScore) : true;
    
    return nameMatch && emailMatch && phoneMatch && statusMatch && genderMatch && creditScoreMatch;
  });
  pagination.total = filteredUsers.length;
  return filteredUsers;
};

// 分页数据
const paginatedUsers = () => {
  const filteredUsers = searchUsers();
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredUsers.slice(start, end);
};

// 添加用户
const addUser = () => {
  if (!formState.name || !formState.email || !formState.phone) {
    message.error('请填写完整信息');
    return;
  }
  operationHistory.value.push([...users.value]);
  const newUser = { ...formState, id: Date.now().toString() };
  users.value.push(newUser);
  saveUsers();
  message.success('添加成功');
  resetForm();
};
const handleAddModal = () => {
  resetForm();
  isAddUser.value = true;
  isModalVisible.value = true;
};

// 编辑用户
const handleEditUser = (user: User) => {
  formState.id = user.id;
  formState.name = user.name;
  formState.email = user.email;
  formState.phone = user.phone;
  formState.status = user.status;
  formState.creditScore = user.creditScore;
  formState.gender = user.gender;
  isAddUser.value = false;
  isModalVisible.value = true;
};

// 更新用户
const updateUser = () => {
  if (!formState.name || !formState.email || !formState.phone) {
    message.error('请填写完整信息');
    return;
  }
  const index = users.value.findIndex(user => user.id === formState.id);
  if (index !== -1) {
    operationHistory.value.push([...users.value]);
    users.value[index] = { ...formState };
    saveUsers();
    message.success('更新成功');
    isModalVisible.value = false;
    resetForm();
  }
};
const handleOk = () => {
  formRef.value.validate().then(() => {
    if (isAddUser.value) {
      addUser();
    } else {
      updateUser();
    }
    isModalVisible.value = false;
  }).catch((error: any) => {
    console.log('表单校验失败:', error);
  });
};

// 删除用户
const deleteUser = (id: string) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该用户吗？',
    onOk() {
      operationHistory.value.push([...users.value]);
      users.value = users.value.filter(user => user.id !== id);
      saveUsers();
      message.success('删除成功');
    }
  });
};

// 重置表单
const resetForm = () => {
  formState.id = '';
  formState.name = '';
  formState.email = '';
  formState.phone = '';
  formState.status = 1;
  formState.creditScore = 0;
  formState.gender = 0;
};

// 撤销操作
const undoOperation = () => {
  const lastOperation = operationHistory.value.pop();
  console.log('lastOperation',lastOperation);
  if (lastOperation) {
    users.value = lastOperation;
    saveUsers();
    message.success('撤销成功');
  } else {
    message.warning('没有可撤销的操作');
  }
};
</script>

<template>
  <div class="container">
    <h1>用户管理</h1>
    <a-form layout="inline" :model="searchParams">
      <a-form-item label="姓名">
        <a-input v-model:value="searchParams.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-model:value="searchParams.email" placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="电话">
        <a-input v-model:value="searchParams.phone" placeholder="请输入电话" />
      </a-form-item>
      <a-form-item label="状态">
        <a-select v-model:value="searchParams.status" placeholder="请选择状态" style="width: 120px">
          <a-select-option :value="null">全部</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
          <a-select-option :value="1">启用</a-select-option>
          <a-select-option :value="2">待审核</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="性别">
        <a-select v-model:value="searchParams.gender" placeholder="请选择性别" style="width: 120px">
          <a-select-option :value="null">全部</a-select-option>
          <a-select-option :value="0">未知</a-select-option>
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="2">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="信用分">
        <a-input v-model:value="searchParams.creditScore" placeholder="请输入信用分" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="searchUsers">搜索</a-button>
      </a-form-item>
    </a-form>

    <a-divider />

    <a-button type="primary" @click="handleAddModal">添加用户</a-button>
    <a-button @click="undoOperation">撤销</a-button>

    <a-table :columns="[
      { title: 'ID', dataIndex: 'id' },
      { title: '姓名', dataIndex: 'name' },
      { title: '邮箱', dataIndex: 'email' },
      { title: '电话', dataIndex: 'phone' },
      { title: '状态', dataIndex: 'status' },
      { title: '性别', dataIndex: 'gender' },
      { title: '信用分', dataIndex: 'creditScore' },
      { title: '操作', key: 'action' }
    ]" :data-source="paginatedUsers()" :pagination="pagination"
      @change="(page: any) => { pagination.current = page.current }" rowKey="id">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <span :style="{ color: record.status === 1 ? 'green' : record.status === 0 ? 'red' : 'orange' }">
            {{ record.status === 1 ? '启用' : record.status === 0 ? '禁用' : '待审核' }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'gender'">
          <span>{{ record.gender === 1 ? '男' : record.gender === 2 ? '女' : '未知' }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="() => handleEditUser(record)">编辑</a-button>
          <a-button type="link" danger @click="() => deleteUser(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="isModalVisible" :title="formState.id === '' ? '添加用户' : '编辑用户'" @ok="handleOk">
      <a-form ref="formRef" :model="formState" :rules="formRules" layout="vertical">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" placeholder="请输入邮箱地址" />
        </a-form-item>
        <a-form-item label="电话" name="phone">
          <a-input v-model:value="formState.phone" placeholder="请输入11位手机号码" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formState.status">
            <a-select-option :value="0">禁用</a-select-option>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="2">待审核</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-select v-model:value="formState.gender">
            <a-select-option :value="0">未知</a-select-option>
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="信用分" name="creditScore">
          <a-input-number v-model:value="formState.creditScore" :min="0" :max="1000" placeholder="请输入信用分" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
</style>