<!--  -->
<script lang="ts" setup>
import { PersonList } from '../person-proto';
import { ref, reactive } from 'vue';
const fetchData = async () => {
    const res = await fetch('/person.json');
    const data = await res.json();
    const newPersonList = PersonList.fromObject({ persons: data });
    return newPersonList.persons;
};
const persons = await fetchData();
const personList = ref(persons);
// 分页
const pagination = reactive({
    current: 1,
    pageSize: 5,
    total: persons.length,
    position: ['bottomCenter']
});
// 分页数据
const paginatedUsers = () => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return personList.value.slice(start, end);
};
</script>
<template>
    <a-table :columns="[
        { title: 'ID', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '邮箱', dataIndex: 'email' },
        { title: '电话', dataIndex: 'phone' },
        { title: '状态', dataIndex: 'status' },
        { title: '性别', dataIndex: 'gender' },
        { title: '信用分', dataIndex: 'creditScore' },
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
        </template>
    </a-table>

</template>

<style scoped></style>