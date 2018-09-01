<template>
  <div class="app-container calendar-list-container">
    <!-- 列表 -->
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="聚会类型">
        <template slot-scope="scope">
          <span>{{scope.row.party_types}}</span>
        </template>
      </el-table-column>

      <el-table-column width="190px" align="center" label="城市">
        <template slot-scope="scope">
          <span>{{scope.row.birth_citys | getNameStr}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="聚会时间">
        <template slot-scope="scope">
          <span>{{scope.row.party_time}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" label="报名情况">
        <template slot-scope="scope">
          <span>{{scope.row.party_user_limit}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="聚会地点">
        <template slot-scope="scope">
          <span>{{scope.row.party_place}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">编辑</el-button>
          <!-- <el-button type="" @click="clone" size="small" icon="el-icon-circle-check-outline">Clone</el-button> -->
        </template>
      </el-table-column>


    </el-table>
    <!-- 编辑窗口 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 500px; margin-left:50px;'>
        <el-form-item label="聚会类型" prop="party_types" :error="errors.user_info">
          <el-input v-model="temp.party_types" disabled></el-input>
        </el-form-item>
        <el-form-item label="出生城市" prop="birth_citys" :error="errors.user_info">
          <span @click="addCity" class="btn">新增</span>
          <span v-for="(item, index) in temp.birth_citys" :key="index">
            <el-input v-model="item.name"></el-input>
            <el-checkbox class="filter-item" style='margin-left:15px;' v-model="item.isAvailable">可选</el-checkbox>
            <span @click="delCity(index)" class="btn">删除</span>
          </span>
        </el-form-item>
        <!-- <el-select clearable style="width: 90px" class="filter-item" v-model="temp.party_types" placeholder="请选择">
          <el-option v-for="item in ['百日', '周岁']" :key="item" :label="item" :value="item">
          </el-option>
        </el-select> -->
        <el-form-item label="聚会时间" prop="party_time" :error="errors.party_time">
          <el-input v-model="temp.party_time"></el-input>
        </el-form-item>
        
        <el-form-item label="聚会说明" prop="party_intro" :error="errors.party_intro">
          <el-input type="textarea" :autosize="{minRows:2}" v-model="temp.party_intro"></el-input>
        </el-form-item>
        <el-form-item label="聚会地点" prop="party_place" :error="errors.party_place">
          <el-input type="textarea" :autosize="{minRows:2}" v-model="temp.party_place"></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="temp.create_time"></el-input>
        </el-form-item> -->
        <el-form-item label="聚会安排" prop="party_flow" :error="errors.party_flow">
          <el-input type="textarea" :autosize="{minRows:2}" v-model="temp.party_flow"></el-input>
        </el-form-item>
        <el-form-item label="聚会条件" prop="party_provide" :error="errors.party_provide">
          <el-input type="textarea" :autosize="{minRows:2}" v-model="temp.party_provide"></el-input>
        </el-form-item>
        <el-form-item label="出生医院" prop="party_hospital" :error="errors.party_hospital">
          <el-input type="textarea" :autosize="{minRows:2}" v-model="temp.party_hospital" placeholder="每行录入一个"></el-input>
        </el-form-item>
        <el-form-item label="价格（元/单人）" prop="party_price_single" :error="errors.party_price_single">
          <el-input v-model="temp.party_price_single"></el-input>
        </el-form-item>
        <el-form-item label="价格（元/双人）" prop="party_price_couple" :error="errors.party_price_couple">
          <el-input v-model="temp.party_price_couple"></el-input>
        </el-form-item>
        <el-form-item label="守时金（元）" prop="party_price_promise" :error="errors.party_price_promise">
          <el-input v-model="temp.party_price_promise"></el-input>
        </el-form-item>
        <el-form-item label="报名数限制" prop="party_user_limit" :error="errors.party_user_limit">
          <el-input v-model="temp.party_user_limit"></el-input>
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
import { fetchPartyList, updatePartyInfo } from '@/api/baby_party'

export default {
  name: 'inlineEditTable',
  data() {
    return {
      list: null,
      listLoading: true,
      dialogStatus: false,
      temp: {
        baby_name: '',
        birth_day: '',
        birth_hospital: '',
        id: '',
        parent_attandance: '',
        parent_name: '',
        parent_tel: '',
        party_type: '',
        pay_deposit: '',
        pay_prepay_id: '',
        refund_amount: '',
        refund_order_id: '',
        birth_citys: []
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
      errors: {},
      rules: {
        // login_password: [{ required: true, message: 'password is required', trigger: 'blur' }]
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
      fetchPartyList(this.listQuery).then(response => {
        const items = response.data.items
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html

          v.originalTitle = v.title //  will be used when user click the cancel botton
          v.birth_citys = JSON.parse(v.birth_citys)

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
    addCity() {
      this.temp.birth_citys.push({
        name: '',
        isAvailable: false
      })
    },
    delCity(idx) {
      this.temp.birth_citys.splice(idx, 1)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.errors = {}
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updatePartyInfo(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
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

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.btn {
  color: #409EFF;
  cursor: pointer;
}
.el-input.is-disabled .el-input__inner{
  color: #222;
}
</style>
