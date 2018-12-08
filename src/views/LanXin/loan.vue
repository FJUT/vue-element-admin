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

      <el-table-column width="220px" align="center" label="设备号">
        <template slot-scope="scope">
          <span>{{scope.row.DID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="授信额度">
        <template slot-scope="scope">
          <span>{{scope.row.credit_amount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="借款金额">
        <template slot-scope="scope">
          <span>{{scope.row.borrow_amount}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.idNo}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phoneNumber}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="120" align="center" label="流水号">
        <template slot-scope="scope">
          <span>{{scope.row.flow_id}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="120" align="center" label="信用分">
        <template slot-scope="scope">
          <span>{{scope.row.creditRate}}</span>
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
        <el-form-item label="授信额度" prop="credit_amount">
          <el-input v-model="temp.credit_amount" ></el-input>
        </el-form-item>
        <el-form-item label="借款金额" prop="borrow_amount">
          <el-input v-model="temp.borrow_amount" ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNo">
          <el-input v-model="temp.idNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="temp.sex" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="temp.phoneNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="信用分" prop="creditRate">
          <el-input v-model="temp.creditRate" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="componyName">
          <el-input v-model="temp.componyName" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="componyAddress">
          <el-input v-model="temp.componyAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="homeAddress">
          <el-input v-model="temp.homeAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人1姓名" prop="contactName1">
          <el-input v-model="temp.contactName1" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人1手机" prop="contactTel1">
          <el-input v-model="temp.contactTel1" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人2姓名" prop="contactName2">
          <el-input v-model="temp.contactName1" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人2手机" prop="contactTel2">
          <el-input v-model="temp.contactTel1" disabled></el-input>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确认</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/LanXin'
import { parseTime } from '@/utils'

export default {
  name: 'LanXin_loan',
  data() {
    return {
      total: null,
      list: null,
      listLoading: true,
      dialogStatus: false,
      temp: {},
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
    /**
             * 通过身份证号码得到性别
             *  身份证号码 return 1/2 男/女
    */
    getSexForCard(str) {
      if (str && (str.length === 15 || str.length === 18)) {
        var inputStr = str.toString()
        var sex
        var ret
        if (inputStr.length === 18) {
          sex = inputStr.charAt(16)
          if (sex % 2 === 0) {
            ret = 2
          } else {
            ret = 1
          }
        } else {
          sex = inputStr.charAt(14)
          if (sex % 2 === 0) {
            ret = 2
          } else {
            ret = 1
          }
        }
        return ret === 1 ? '男' : '女'
      } else {
        return '未知'
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
      this.temp.sex = this.getSexForCard(this.temp.idNo)
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
          // updateApplyInfo(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.flow_id === this.temp.flow_id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // }).catch(res => {
          //   console.log(res)
          //   this.errors = res.errors
          // })
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
