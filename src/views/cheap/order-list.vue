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
          <el-select v-model="listQuery.orderStatus" placeholder="请选择">
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
          <el-input v-model="scope.row.finalCommissionAmount"></el-input>
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
          <el-input v-model="scope.row.userFinalCommissionAmount"></el-input>
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
          <el-select v-model="scope.row.approveOption" placeholder="请选择">
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
      <el-table-column align="center" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="operate(scope.row)">
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
        4: '唯品会',
        5: '苏宁易购',
      };
      return platformMap[platform];
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
        orderStatus: 15,
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
          }
          if (row.userFinalCommissionAmount == undefined || row.userFinalCommissionAmount == '') {
            this.$message({
              type: 'error',
              message: '用户最终佣金不能为空',
            });
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
