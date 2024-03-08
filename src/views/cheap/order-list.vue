<template>
  <div>
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
          订单状态：
          <el-select v-model="listQuery.orderStatus" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="block">
          商城：
          <el-select v-model="listQuery.mall" clearable placeholder="请选择">
            <el-option
              v-for="item in mallOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>

      <el-col :span="5" :xs="24">
        <div class="block">
          结算状态：
          <el-select v-model="listQuery.status" clearable placeholder="请选择">
            <el-option
              v-for="item in auditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin: 40px 15px 40px">
      <el-col :span="4" :xs="24">
        <div class="block">
          邀请码：
          <el-input
            v-model="listQuery.inviteCode"
            placeholder="邀请码"
            style="width: 160px; max-width: 100%"
          />
        </div>
      </el-col>
      <el-col :span="3" :xs="24">
        <div class="block">
          <el-button type="primary" @click.prevent.stop="getList"> 查询 </el-button>
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
      <el-table-column align="center" label="邀请码" width="75">
        <template slot-scope="scope">
          <span>{{ scope.row.inviteCode }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台订单号" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.platformOrderNo }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.platform | parsePlatform }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.orderTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="140px" align="center" label="完成时间">
        <template slot-scope="scope">
          <span>{{ scope.row.finishTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="商品标题" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.itemTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品图片" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.itemImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatus | parseOrderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态描述" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.statusRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算状态" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.status | parseStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预估计佣金额" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.estimateCosAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际计佣金额" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.actualCosAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预估佣金" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.estimateCommissionAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际佣金" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.actualCommissionAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最终佣金" width="90">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.finalCommissionAmount"
            :readonly="scope.row.status == 1"
            @change="inputFinalCommissionAmount(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台佣金率" width="70">
        <template slot-scope="scope">
          <span>%{{ scope.row.commissionRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分成比例" width="70">
        <template slot-scope="scope">
          <span>%{{ scope.row.shareRate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户实际佣金" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.userActualCommissionAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户最终佣金" width="90">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.userFinalCommissionAmount"
            :readonly="scope.row.status == 1"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="数量" width="40">
        <template slot-scope="scope">
          <span>{{ scope.row.itemQuantity }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单价" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.itemPrice }}</span>
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
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            :disabled="scope.row.status != 0"
            @click="operate(scope.row)"
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
import { fetchList, orderAudit } from '@/api/order';
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination

export default {
  name: 'Order',
  components: { Pagination },
  filters: {
    //上面的parseTime也是filter
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      };
      return statusMap[status];
    },
    parsePlatform(platform) {
      const platformMap = {
        1: '淘宝',
        2: '京东',
        3: '拼多多',
        4: '美团',
        5: '饿了么',
      };
      return platformMap[platform];
    },
    parseOrderStatus(orderStatus) {
      const orderStatusMap = {
        '-1': '无效',
        1: '未付款',
        5: '已付款',
        7: '已成团（pdd）',
        10: '已确认收货',
        12: '审核成功（pdd）',
        15: '商家已支付佣金',
        20: '已付订金',
      };
      return orderStatusMap[orderStatus];
    },
    parseStatus(status) {
      const statusMap = {
        '-1': '无效订单',
        0: '未结算',
        1: '已结算',
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
        mall: null,
        orderStatus: 15,
        inviteCode: null,
        dateRange: [new Date().setDate(new Date().getDate() - 7), new Date()],
      },
      options: [],
      auditOptions: [],
      mallOptions: [],
      approveOptions: [
        {
          value: -1,
          label: '拒绝',
        },
        {
          value: 1,
          label: '同意',
        },
      ],
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
      if (row.approveOption == -1) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(({ value }) => {
            row.remark = value;
            orderAudit(row, row.approveOption).then((response) => {
              console.log('code = ' + response.data.code);
              if (response.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '审核成功: 拒绝' + value,
                });
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: '审核失败: 拒绝' + value,
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入',
            });
          });
      } else {
        if (row.actualCommissionAmount > 0) {
          if (row.finalCommissionAmount == undefined || row.finalCommissionAmount == '') {
            this.$message({
              type: 'error',
              message: '最终佣金不能为空',
            });
            return;
          }
          if (row.userFinalCommissionAmount == undefined || row.userFinalCommissionAmount == '') {
            this.$message({
              type: 'error',
              message: '用户最终佣金不能为空',
            });
            return;
          }
        }

        orderAudit(row, row.approveOption).then((response) => {
          console.log('code = ' + response.data.code);
          if (response.data.code == 0) {
            this.$message({
              type: 'success',
              message: '审核成功: 同意',
            });
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: '审核失败: 同意',
            });
          }
        });
      }
    },
    inputFinalCommissionAmount(row) {
      if (row.finalCommissionAmount > 0) {
        let userFinalCommissionAmount = (row.finalCommissionAmount * row.shareRate) / 100;
        row.userFinalCommissionAmount = userFinalCommissionAmount.toFixed(2);
      }
    },

    setOptions() {
      this.options = [
        {
          value: -1,
          label: '无效',
        },
        {
          value: 1,
          label: '下单未付款',
        },
        {
          value: 5,
          label: '已付款',
        },
        {
          value: 7,
          label: '已成团（pdd）',
        },
        {
          value: 10,
          label: '已确认收货',
        },
        {
          value: 12,
          label: '审核成功（pdd）',
        },
        {
          value: 15,
          label: '商家已支付佣金',
        },
        {
          value: 20,
          label: '已付定金',
        },
      ];
      this.auditOptions = [
        {
          value: -1,
          label: '无效订单',
        },
        {
          value: 0,
          label: '未结算',
        },
        {
          value: 1,
          label: '已结算',
        },
      ];
      this.mallOptions = [
        {
          value: 1,
          label: '淘宝',
        },
        {
          value: 2,
          label: '京东',
        },
        {
          value: 3,
          label: '拼多多',
        },
        {
          value: 4,
          label: '美团',
        },
        {
          value: 5,
          label: '饿了么',
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
