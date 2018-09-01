<template>
  <div class="app-container calendar-list-container">
    <!-- 列表 -->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}年{m}月{d}日 {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="宝宝姓名">
        <template slot-scope="scope">
          <span>{{scope.row.baby_name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="出生日期">
        <template slot-scope="scope">
          <span>{{scope.row.birth_day | parseTime('{y}年{m}月{d}日 {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="出生医院">
        <template slot-scope="scope">
          <span>{{scope.row.birth_hospital}}</span>
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
      <el-table-column width="100" align="center" label="订单状态">
        <template slot-scope="scope">
          <span>{{scope.row.step | orderState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="聚会类型">
        <template slot-scope="scope">
          <span>{{scope.row.party_type}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="120" align="center" label="流水号">
        <template slot-scope="scope">
          <span>{{scope.row.flow_id}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="120" align="center" label="出生城市">
        <template slot-scope="scope">
          <span>{{scope.row.birth_city}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUpdate(scope.row)" size="small" icon="el-icon-edit">详情</el-button>
          <!-- <el-button type="" @click="clone" size="small" icon="el-icon-circle-check-outline">Clone</el-button> -->
        </template>
      </el-table-column>


    </el-table>
    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 编辑窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="宝宝姓名" prop="baby_name">
          <el-input v-model="temp.baby_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="出生城市" prop="birth_city">
          <el-input v-model="temp.birth_city" disabled></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth_day">
          <el-input v-model="getBirthday" disabled></el-input>
        </el-form-item>
        <el-form-item label="出生医院" prop="birth_hospital">
          <el-input v-model="temp.birth_hospital" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="temp.create_time" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="流水号" prop="flow_id">
          <el-input v-model="temp.flow_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="参加人数" prop="parent_attandance">
          <el-input v-model="temp.parent_attandance" disabled></el-input>
        </el-form-item>
        <el-form-item label="家长姓名" prop="parent_name">
          <el-input v-model="temp.parent_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="家长电话" prop="parent_tel">
          <el-input v-model="temp.parent_tel" disabled></el-input>
        </el-form-item>
        <el-form-item label="聚会类型" prop="party_type">
          <el-input v-model="temp.party_type" disabled></el-input>
        </el-form-item>
        <el-form-item label="守时金" prop="pay_deposit">
          <el-input v-model="temp.pay_deposit" disabled></el-input>
        </el-form-item>
        <el-form-item label="报名费" prop="pay_fee">
          <el-input v-model="temp.pay_fee" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="订单状态" prop="step">
          <el-input v-model="temp.step" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="微信支付单号" prop="pay_prepay_id" v-if="temp.pay_prepay_id">
          <el-input v-model="temp.pay_prepay_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refund_amount" v-if="temp.step
        !=='10'">
          <el-input v-model="temp.refund_amount" :error="errors.birth_city"></el-input>
        </el-form-item>
        <el-form-item label="退款单号" prop="refund_order_id" v-if="temp.step
        !=='10'">
          <el-input v-model="temp.refund_order_id" :error="errors.birth_city"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList, updateApplyInfo } from '@/api/baby_party'
import { parseTime } from '@/utils'

export default {
  name: 'inlineEditTable',
  data() {
    return {
      total: null,
      list: null,
      listLoading: true,
      dialogStatus: false,
      temp: {
        baby_name: '',
        birth_day: '',
        birth_hospital: '',
        flow_id: '',
        parent_attandance: '',
        parent_name: '',
        parent_tel: '',
        party_type: '',
        pay_deposit: '',
        pay_prepay_id: '',
        refund_amount: '',
        refund_order_id: ''
      },
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        // baby_name: [{ required: true, message: 'login name is required', trigger: 'blur' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // birth_city: [{ required: true, message: 'password is required', trigger: 'blur' }]
      },
      errors: {}
    }
  },
  computed: {
    getBirthday: function(v) {
      // console.log(v, this.temp.birth_day)
      return parseTime(this.temp.birth_day, '{y}年{m}月{d}日')
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.total = response.data.total
        const items = response.data.items || []
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html

          v.originalTitle = v.title //  will be used when user click the cancel botton

          return v
        })
        this.listLoading = false
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.errors = {}
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateApplyInfo(tempData).then(() => {
            for (const v of this.list) {
              if (v.flow_id === this.temp.flow_id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(res => {
            console.log(res)
            this.errors = res.errors
          })
        }
      })
    }
  }
}
</script>

<style>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-input.is-disabled .el-input__inner{
  color: #222;
}
</style>
