<template>
  <div>
    <el-dialog title="打款" width="20%" :visible.sync="dialogVisible">
      <el-card>
        <el-row type="flex" justify="center">
          <el-image style="width: 250px; height: 250px" :src="qrUrl" fit="cover"></el-image>
        </el-row>
      </el-card>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="withdrawSuccessful">成功</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="5" style="margin: 40px 15px 40px">
      <el-col :span="7" :xs="24">
        <div class="block">
          日期选择：
          <el-date-picker
            v-model="listQuery.dateRange"
            :placeholder="$t('order.datePlaceholder')"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-col>

      <el-col :span="5" :xs="24">
        <div class="block">
          状态：
          <el-select clearable v-model="listQuery.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :span="3" :xs="24">
        <div class="block">
          <el-button type="primary" @click.prevent.stop="getList">查询</el-button>
        </div>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="邀请码" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.inviteCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="提现方式" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawType | parseWithdrawType }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="二维码" width="60">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 80px"
            :src="scope.row.qrUrl"
            :preview-src-list="scope.row.qrUrl"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="提现金额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="可提现金额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawableAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="已提现金额" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawedAmount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status | parseStatus }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="申请时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="描述" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.approveOption"
            placeholder="请选择"
            :disabled="scope.row.status == 1"
          >
            <el-option
              v-for="item in approveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="operate(scope.row)"
            :disabled="scope.row.status != 0"
          >
            确定
          </el-button>
        </template>
      </el-table-column>
      <!-- 
      <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon
            v-for="n in +scope.row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column>
      
      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter"> {{ row.status }} </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{ row }">
          <router-link :to="'/example/edit/' + row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit"> Edit </el-button>
          </router-link>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchList, getUserAccount, withdrawResult } from '@/api/withdraw';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination

export default {
  name: 'Withdraw',
  components: { Pagination },
  filters: {
    //上面的parseTime也是filter
    parseWithdrawType(type) {
      const withdrawTypeMap = {
        1: '微信收款码',
        2: '人工转账',
        3: '微信零钱',
      };
      return withdrawTypeMap[type];
    },
    parseStatus(status) {
      const statusMap = {
        0: '用户申请',
        1: '已支付',
        '-1': '支付拒绝',
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: 0,
        dateRange: [new Date().setDate(new Date().getDate() - 7), new Date()],
      },
      options: [],
      approveOptions: [
        {
          value: -1,
          label: '拒绝',
        },
        {
          value: 1,
          label: '打款',
        },
      ],
      dialogVisible: false,
      qrUrl: '',
      operatingRow: null,
    };
  },
  created() {
    this.setOptions(); // set default select options
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        console.log('records = ' + response.data.data.records);
        this.list = response.data.data.records;
        this.total = Number(response.data.data.total);
        this.listLoading = false;
      });
    },

    operate(row) {
      if (row.approveOption == undefined) {
        this.$alert('请选择"操作"', '数据不完整', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `action: ${action}`,
            });
          },
        });
        return;
      }
      this.operatingRow = row;
      //提现驳回
      if (row.approveOption == -1) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({ value }) => {
            row.remark = value;
            withdrawResult(row, row.approveOption).then((response) => {
              console.log('code = ' + response.data.code);
              if (response.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '操作成功: 提现拒绝' + value,
                });
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: '操作失败: 提现拒绝' + value,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '取消输入',
            });
          });

        this.operatingRow = null;
      } else {
        getUserAccount(row.userId).then((response) => {
          console.log('code = ' + response.data.code);
          if (response.data.code == 0) {
            this.dialogVisible = true; //打开会话框
            console.log(response.data.data.userWechatReceiveMoneyQr);
            if (
              response.data.data.userWechatReceiveMoneyQr != '' &&
              response.data.data.userWechatReceiveMoneyQr != null
            ) {
              this.qrUrl = response.data.data.userWechatReceiveMoneyQr;
            }
          } else {
            this.$message({
              type: 'error',
              message: '内部错误',
            });
          }
        });
        this.getList();
      }
    },

    withdrawSuccessful() {
      withdrawResult(this.operatingRow, 1).then((response) => {
        console.log('code = ' + response.data.code);
        if (response.data.code == 0) {
          this.$message({
            type: 'success',
            message: '操作成功: 提现',
          });

          this.getList();
        } else {
          this.$message({
            type: 'error',
            message: '操作失败: 提现',
          });
        }
        this.dialogVisible = false;
        this.operatingRow = null;
      });
    },

    setOptions() {
      this.options = [
        {
          value: -1,
          label: '支付驳回',
        },
        {
          value: 0,
          label: '用户申请',
        },
        {
          value: 1,
          label: '已支付',
        },
      ];
    },
  },
};
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
