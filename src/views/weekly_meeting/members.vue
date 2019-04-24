<template>
  <div class="app-container calendar-list-container">
    <!-- 过滤器 -->
    <div class="filter-container" v-permission="['admin', 'useradmin']">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
    </div>
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

      <el-table-column width="120px" align="center" label="成员姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" label="UUID" v-permission="['admin', 'useradmin']">
        <template slot-scope="scope">
          <span>{{scope.row.UUID}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="230">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUpdate(scope.row)" size="small">更新</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')" v-permission="['admin', 'useradmin']">删除</el-button>
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
        <el-form-item label="成员姓名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="UUID" prop="UUID">
          <el-input v-model="temp.UUID"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createMember, fetchMemberList, updateMember, deleteMember } from '@/api/weekly_meeting'
import { parseTime } from '@/utils'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'inlineEditTable',
  directives: {
    permission
  },
  data() {
    return {
      total: null,
      list: null,
      listLoading: true,
      dialogStatus: false,
      temp: {
        name: '',
        UUID: ''
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
    resetTemp() {
      this.temp = {
        name: '',
        UUID: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.errors = {}
          // this.temp.uuid = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          createMember(this.temp).then((res) => {
            // console.log(res)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(res => {
            this.errors = res.errors
          })
        }
      })
    },
    handleModifyStatus(row, status) {
      // console.log(row)
      this.$confirm('是否确认删除： ' + row.name, '操作确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMember({
          id: row.id
        }).then(res => {
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
        // row.status = status
      }).catch(() => {
        return
      })
    },
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
      fetchMemberList(this.listQuery).then(response => {
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
          updateMember(tempData).then(() => {
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
  color: #888;
}
</style>
