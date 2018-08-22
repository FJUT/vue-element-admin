<template>
  <div class="app-container calendar-list-container">

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_at | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="190px" align="center" label="宝宝姓名">
        <template slot-scope="scope">
          <span>{{scope.row.baby_name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="家长姓名">
        <template slot-scope="scope">
          <span>{{scope.row.parent_name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{scope.row.parent_tel}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="付款金额">
        <template slot-scope="scope">
          <span>{{scope.row.pay_amount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="付款编号">
        <template slot-scope="scope">
          <span>{{scope.row.pay_prepay_id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="退款情况">
        <template slot-scope="scope">
          <span>{{scope.row.refund_order_id}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <el-button type="primary" @click='editParty(scope.row)' size="small" icon="el-icon-edit">Edit</el-button>
          <!-- <el-button type="" @click="clone" size="small" icon="el-icon-circle-check-outline">Clone</el-button> -->
        </template>
      </el-table-column>


    </el-table>
  </div>
</template>

<script>
import { fetchUserList } from '@/api/baby_party'

export default {
  name: 'inlineEditTable',
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        const items = response.data.items || []
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html

          v.originalTitle = v.title //  will be used when user click the cancel botton

          return v
        })
        this.listLoading = false
      })
    },
    editParty(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
