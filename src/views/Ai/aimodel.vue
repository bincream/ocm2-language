<template>
  <div class="app-container">
    <div class="filter-container" style="position:relative">
      <el-input
        v-model="listQuery.keywords"
        :placeholder="$t('ai.qingshurumoxingmingcheng')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleFilter" />

      <el-button
        v-if="checkPermission(['aiModel/save'])"
        class="filter-item"
        style="position:absolute;right:0px"
        type="primary"
        @click="handleCreate"
      >{{ $t('ai.moxingtianjia') }}</el-button>
      <el-button
        class="filter-item"
        style="position:absolute;right:120px"
        type="primary"
        @click="handlestop"
      >{{ $t('ai.zhongzhixunlian') }}</el-button>

    </div>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
      :data="list"
      stripe
      :row-style="{textAlign: 'center'}"
      highlight-current-row
      height="500"
      @row-click="handleDetail"
    >
      <el-table-column :label="$t('ai.moxingmingcheng')" prop="modelName" />
      <el-table-column :label="$t('ai.miaoshu')" prop="modelDesc" />
      <el-table-column :label="$t('ai.xunlianjindu')" width="160">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.process" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('ai.xunlianzhuangtai')" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.status | status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ai.leixingshuliang')" prop="typeCount" />
      <!-- <el-table-column label="模型存放路径" prop="path" /> -->
      <el-table-column :label="$t('ai.moxingzhixindu')" prop="score" />
      <el-table-column :label="$t('ai.caozuo')" width="700">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission(['aiModel/enable'])"
            v-show="scope.row.enable == 1"
            type="primary"
            size="small"
            disabled
            @click.stop="handleChangeStatus(scope.row)"
          >{{ $t('ai.tingyong') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/enable'])"
            v-show="scope.row.enable == 0"
            type="warning"
            size="small"
            @click.stop="handleChangeStatus(scope.row)"
          >{{ $t('ai.qiyong') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/update'])"
            type="primary"
            size="small"
            @click.stop="handleUpdate(scope.row)"
          >{{ $t('ai.xiugai') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/delete'])"
            type="danger"
            size="small"
            @click.stop="handleDelete(scope.row)"
          >{{ $t('ai.shanchu') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/bindAlarm'])"
            type="primary"
            size="small"
            @click.stop="handleSign(scope.row)"
          >{{ $t('ai.biaoji') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/practice'])"
            :disabled="status"
            type="primary"
            size="small"
            @click.stop="handleTrain(scope.row)"
          >{{ $t('ai.xunlian') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/saveType'])"
            type="primary"
            size="small"
            @click.stop="handleAdd(scope.row)"
          >{{ $t('ai.tianjialeixing') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/uploadFile'])"
            type="primary"
            size="small"
            @click.stop="handleImport(scope.row)"
          >{{ $t('ai.daoru') }}</el-button>
          <el-button
            v-if="checkPermission(['aiModel/exportZip'])"
            type="primary"
            size="small"
            @click.stop="handleExport(scope.row)"
          >{{ $t('ai.daochu') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!--新增编辑页面 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form
        ref="modelEdit"
        :rules="rules"
        :model="modelEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <table>
            <tr>
              <td class="width33">
                <el-form-item :label="$t('ai.moxingmingcheng')" prop="modelName">
                  <el-input
                    v-model="modelEdit.modelName"
                    style="width:78%"
                    size="small"
                    :placeholder="$t('ai.qingshurumoxingmingcheng')"
                  />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('ai.miaoshu')" prop="modelDesc">
                  <el-input
                    v-model="modelEdit.modelDesc"
                    style="width:78%"
                    type="text"
                    size="small"
                    :placeholder="$t('ai.qingshurumoxingmiaoshu')"
                  />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <el-form-item :label="$t('ai.hongsebaojingtubiao')">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="modelEdit.alarmIconRed" :src="modelEdit.alarmIconRed" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
              <td width="33%">
                <el-form-item :label="$t('ai.chengsebaojingtubiao')">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess3"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="modelEdit.alarmIconOrange" :src="modelEdit.alarmIconOrange" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
              <td width="33%">
                <el-form-item :label="$t('ai.huangsebaojingtubiao')">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess4"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="modelEdit.alarmIconYellow" :src="modelEdit.alarmIconYellow" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <el-form-item :label="$t('ai.lansebaojingtubiao')">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess5"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="modelEdit.alarmIconBlue" :src="modelEdit.alarmIconBlue" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogStatus == 'create' ? createData('modelEdit') : updateData('modelEdit')"
        >{{ $t('ai.queren') }}</el-button>
        <el-button @click="dialogFormVisible = false">{{ $t('ai.quxiao') }}</el-button>
      </div>
    </el-dialog>

    <!-- 标记 -->
    <el-dialog :visible.sync="dialogSignVisible" :title="$t('ai.biaoji')" width="100%">
      <el-form
        ref="signEdit"
        :rules="rules"
        :model="signEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <table>
            <tr>
              <td>
                <el-form-item :label="$t('ai.biaojileixing')" prop="typeId">
                  <el-select
                    v-model="signEdit.typeId"
                    :placeholder="$t('ai.qingxuanzebiaojileixing')"
                    style="width: 240px;"
                    class="filter-item"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in aiModelTypeList"
                      :key="item.id"
                      :label="item.typeZhName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div class="title">
        <span>{{ $t('ai.lishigaojingliebiao') }}</span>
      </div>
      <div class="filter-container" style="position:relative">
        <el-input
          v-model="listQueryType.vibType"
          :placeholder="$t('ai.qingshuruzhendongleixing')"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-date-picker
          v-model="date"
          style="width: 380px;margin-bottom: 10px;vertical-align: middle;"
          type="datetimerange"
          :start-placeholder="$t('ai.kaishiriqi')"
          :end-placeholder="$t('ai.gaojingriqi')"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
        />
        <el-select
          v-model="listQueryType.type"
          :placeholder="$t('ai.qingxuanzechulileixing')"
          style="width: 220px;"
          class="filter-item"
          clearable
          filterable
        >
          <el-option
            v-for="item in soluTypelList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />

        </el-select>
        <el-button class="filter-item" icon="el-icon-search" @click="handleTypeFilter" />
      </div>
      <el-table
        ref="historyTable"
        v-loading="listLoading"
        :header-cell-style="{background: 'rgb(22, 159, 231)', textAlign: 'center', color: 'white'}"
        :data="alarmHisList"
        stripe
        highlight-current-row
        height="500"
        :row-key="getRowKeys"
        @selection-change="handleHistoryChange"
      >
        <el-table-column type="selection" width="55" reserve-selection />
        <el-table-column :label="$t('ai.baojingleixing')" prop="alarmType" />
        <el-table-column :label="$t('ai.tongdaohao')" prop="lineInfoChannel" />
        <el-table-column :label="$t('ai.juli')" prop="distance" />
        <el-table-column :label="$t('ai.kaishidian')" prop="beginCol" />
        <el-table-column :label="$t('ai.zhongxindian')" prop="centerCol" />
        <el-table-column :label="$t('ai.jieshudian')" prop="endCol" />
        <el-table-column :label="$t('ai.kaishishijian')" prop="beginTime" />
        <el-table-column :label="$t('ai.gaojingshijian')" prop="alarmTime" />
        <el-table-column :label="$t('ai.zhendongcishu')" prop="freq" />
        <el-table-column :label="$t('ai.qiangdu')" prop="amplitude" />
        <el-table-column :label="$t('ai.dengji')" prop="level" />
        <el-table-column :label="$t('ai.zhendongleixing')" prop="vibType" />
        <el-table-column :label="$t('ai.chulizhuangtai')">
          <template slot-scope="scope">
            <span>{{ scope.row.solution | solution }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ai.yinpin')" width="320">
          <template slot-scope="scope">
            <audio v-if="scope.row.oggPath && scope.row.audioPath" :id="scope.row.id" controls="controls">
              <source :src="'http://192.168.8.131/uploadAudio/' + scope.row.oggPath">
              <source :src="scope.row.fileName">
            </audio>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-show="alarmTotal>0"
          :current-page="listQueryType.page"
          :page-sizes="[10,20,30, 50]"
          :page-size="listQueryType.limit"
          :total="alarmTotal"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeType"
          @current-change="handleCurrentChangeType"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="signCreate('signEdit')"
        >{{ $t('ai.queren') }}</el-button>
        <el-button @click="dialogSignVisible = false">{{ $t('ai.quxiao') }}</el-button>
      </div>
    </el-dialog>

    <!--添加类型页面 -->
    <el-dialog :title="$t('ai.tianjialeixing')" :visible.sync="dialogAddVisible" width="80%">
      <el-form
        ref="typeEdit"
        :rules="rules"
        :model="typeEdit"
        :show-message="false"
        inline
        status-icon
      >
        <div class="basic">
          <table>
            <tr>
              <td class="width33">
                <el-form-item :label="$t('ai.leixingyingwenming')" prop="typeEnName">
                  <el-input
                    v-model="typeEdit.typeEnName"
                    style="width:70%"
                    size="small"
                    :placeholder="$t('ai.qingshuruleixingmingcheng')"
                  />
                </el-form-item>
              </td>
              <td class="width33">
                <el-form-item :label="$t('ai.leixingzhongwenming')" prop="typeZhName">
                  <el-input
                    v-model="typeEdit.typeZhName"
                    style="width:70%"
                    size="small"
                    :placeholder="$t('ai.qingshuruleixingmingcheng')"
                  />
                </el-form-item>
              </td>
              <td>
                <el-form-item :label="$t('ai.quanzhongyinzi')" prop="weight">
                  <el-select
                    v-model="typeEdit.weight"
                    :placeholder="$t('ai.qingxuanze')"
                    style="width:60%;"
                    class="filter-item"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in weightlList"
                      :key="item.id"
                      :label="item.value"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="33%">
                <el-form-item :label="$t('ai.leixingtubiao')">
                  <el-upload
                    :show-file-list="false"
                    :on-success="uploadAvatarSuccess1"
                    :before-upload="beforeAvatarUpload"
                    :headers="headers"
                    :action="uploadUrl"
                    class="avatar-uploader"
                  >
                    <img v-if="typeEdit.typeIcon" :src="typeEdit.typeIcon" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="typeData('typeEdit')"
        >{{ $t('queren') }}</el-button>
        <el-button @click="dialogAddVisible = false">{{ $t('quxiao') }}</el-button>
      </div>
    </el-dialog>

    <!-- 导入 -->
    <el-dialog
      :visible.sync="uploadVisible"
      :close-on-click-modal="false"
      :title="$t('ai.tishi')"
      width="30%"
      style="text-align: center"
    >
      <el-upload
        ref="uploadExcel"
        :action="importUrl"
        :file-list="fileList"
        :show-file-list="false"
        :on-progress="uploadExcelProcess"
        :on-error="importError"
        :on-success="importSuccess"
        :before-upload="beforeAvatarUpload1"
        :headers="headers"
        :data="params"
        class="uploadExcel"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          {{ $t('ai.jiangwenjiantuodaocichu') }}
          <em>{{ $t('ai.dianjishangchuan') }}</em>
        </div>
        <el-progress
          v-if="excelFlag == true"
          type="circle"
          :width="183"
          :percentage="uploadPercent"
          class="progress"
        />
      </el-upload>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog :visible.sync="dialogDetVisible" :title="$t('ai.xiangqing')" width="100%">
      <div class="basic">
        <div class="title">{{ $t('ai.moxingxinxi') }}</div>
        <table>
          <tr>
            <td class="blackMark">{{ $t('ai.moxingmingcheng') }}</td>
            <td class="width21">
              <span>{{ modelInfo.modelName }}</span>
            </td>
            <td class="blackMark">{{ $t('ai.moxingmiaoshu:') }}</td>
            <td class="width21">
              <span>{{ modelInfo.modelDesc }}</span>
            </td>
            <td class="blackMark">{{ $t('ai.xunlianjindu') }}</td>
            <td class="width21">
              <span>{{ modelInfo.process }}</span>
            </td>
          </tr>
          <tr>
            <!-- <td class="blackMark">模型存放路径：</td>
            <td class="width21">
              <span>{{ modelInfo.path }}</span>
            </td> -->
            <td class="blackMark">{{ $t('ai.moxingzhixindu:') }}</td>
            <td class="width21">
              <span>{{ modelInfo.score }}</span>
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('ai.hongsebaojingtubiao:') }}</td>
            <td width="21%">
              <img
                v-show="modelInfo.alarmIconRed"
                :src="modelInfo.alarmIconRed"
                alt
                class="border"
                @click="bigImg(modelInfo.alarmIconRed)"
              >
            </td>
            <td class="blackMark">{{ $t('ai.chengsebaojingtubiao:') }}</td>
            <td width="21%">
              <img
                v-show="modelInfo.alarmIconOrange"
                :src="modelInfo.alarmIconOrange"
                alt
                class="border"
                @click="bigImg(modelInfo.alarmIconOrange)"
              >
            </td>
            <td class="blackMark">{{ $t('ai.huangsebaojingtubiao:') }}</td>
            <td width="21%">
              <img
                v-show="modelInfo.alarmIconYellow"
                :src="modelInfo.alarmIconYellow"
                alt
                class="border"
                @click="bigImg(modelInfo.alarmIconYellow)"
              >
            </td>
          </tr>
          <tr>
            <td class="blackMark">{{ $t('ai.lansebaojingtubiao:') }}</td>
            <td width="21%">
              <img
                v-show="modelInfo.alarmIconBlue"
                :src="modelInfo.alarmIconBlue"
                alt
                class="border"
                @click="bigImg(modelInfo.alarmIconBlue)"
              >
            </td>
          </tr>
        </table>
        <div class="title">{{ $t('ai.leixingxinxi') }}</div>
        <table>
          <tr
            v-for="(item,index) in modelInfo.typeList"
            :key="index"
            style="border-bottom: 1px solid #eeeeee;"
          >
            <td class="blackMark">{{ $t('ai.leixingyingwenming:') }}</td>
            <td class="width21">
              <span>{{ item.typeEnName }}</span>
            </td>
            <td class="blackMark">{{ $t('ai.leixingzhongwenming:') }}</td>
            <td class="width21">
              <span>{{ item.typeZhName }}</span>
            </td>
            <td class="blackMark">{{ $t('ai.quanzhongyinzi:') }}</td>
            <td class="width21">
              <span>{{ item.weight | weight }}</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetVisible = false">{{ $t('quxiao') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllList, getInfo, saveType, update, save, deleteData, bindAlarm, practice, enable } from '@/api/AI/aimodel'
import { reboot } from '@/api/index'
import { aiModelTypeList, alarmHisList, stopPractice } from '@/api/public'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'SysUser',
  directives: {
    waves
  },
  filters: {
    status: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '未训练'
          case 1:
            return '训练中'
          case 2:
            return '通讯失败'
          case 3:
            return '训练成功'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Untrained'
          case 1:
            return 'Training'
          case 2:
            return 'Communication failed'
          case 3:
            return 'Successful training'
          default:
            break
        }
      }
    },
    enable: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '停用'
          case 1:
            return '启用'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Disable'
          case 1:
            return 'Enable'
          default:
            break
        }
      }
    },
    solution: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '未处理'
          case 1:
            return '已处理'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Untreated'
          case 1:
            return 'Processed'
          default:
            break
        }
      }
    },
    weight: function(val) {
      switch (val) {
        case 0:
          return '0'
        case 1:
          return '1'
        default:
          break
      }
    }
  },
  data() {
    return {
      list: [],
      total: null,
      alarmTotal: null,
      listLoading: true,
      status: false,
      dialogStatus: '',
      date: '',
      textMap: {
        update: 'Modify',
        create: 'Add'
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      params: {},
      listQueryType: {
        page: 1,
        limit: 20
      },
      dialogDetVisible: false,
      dialogSignVisible: false,
      dialogAddVisible: false,
      uploadVisible: false,
      excelFlag: false,
      importUrl: process.env.VUE_APP_BASE_API + 'api-web/ai/aiModel/uploadFile',
      uploadUrl: process.env.VUE_APP_BASE_API + 'api-web/public/uploadFile',
      fileList: [],
      ids: [],
      aiModelTypeList: [],
      modelInfo: {},
      modelEdit: {},
      signEdit: {},
      typeEdit: {},
      alarmHisList: [],
      weightlList: [{ id: 0, value: '0' }, { id: 1, value: '1' }],
      soluTypelList: [{ id: 0, value: 'Untreated' }, { id: 1, value: 'Processed' }, { id: 2, value: 'Communication failed' }],
      dialogFormVisible: false,
      rules: {
        modelName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        modelDesc: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],

        weight: [
          { required: true, message: '请选择', trigger: 'chage' }
        ],
        typeEnName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        typeZhName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择', trigger: 'chage' }
        ]
      },
      getRowKeys(row) {
        return row.id
      }
    }
  },
  computed: {
    headers() {
      return {
        'Authorization': 'Bearer ' + this.$store.getters.token,
        'orgId': this.$store.getters.orgId
      }
    }
  },
  watch: {
    dialogDetVisible(val) {
      !val && setTimeout(() => {
        this.modelInfo = {}
      }, 100)
    },
    dialogFormVisible(val) {
      !val && setTimeout(() => {
        this.$refs['modelEdit'].resetFields()
        this.modelEdit = {}
      }, 100)
    },
    uploadVisible(val) {
      !val && setTimeout(() => {
        this.$refs['uploadExcel'].clearFiles()
        this.$refs['uploadExcel'].abort()
        this.excelFlag = false
        this.uploadPercent = 0
        this.fileList = []
      }, 100)
    },
    dialogAddVisible(val) {
      !val && setTimeout(() => {
        this.$refs['typeEdit'].resetFields()
        this.typeEdit = {}
      }, 100)
    },
    dialogSignVisible(val) {
      !val && setTimeout(() => {
        this.signEdit = {}
        this.listQueryType = {
          page: 1,
          limit: 20
        }
        this.$refs['historyTable'].clearSelection()
      }, 100)
    }
  },
  created() { },
  mounted() {
    this.getList()
  },

  beforeRouteLeave(to, from, next) {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
    next()
  },
  methods: {
    checkPermission,
    init(id) {
      const that = this
      this.interval = setInterval(function() {
        that.getList(id)
      }, 1000)
    },
    out() {
      if (this.interval) {
        clearInterval(this.interval) // 关闭
        this.interval = null
      }
      this.status = false
      this.getList()
    },
    getHistoryList() {
      this.listLoading = true
      alarmHisList(this.listQueryType).then(response => {
        this.alarmHisList = response.data.list
        this.alarmTotal = response.data.total
        this.listLoading = false
      })
    },
    getList(id) {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === id) {
            if (this.list[i].status === 3 || this.list[i].status === 2) {
              this.out()
            }
          }
        }
      })
    },
    getMtList() {
      aiModelTypeList({ aiModelId: this.aiModelId }).then(response => {
        this.aiModelTypeList = response.data
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
    handleFilter() {
      if (this.listQuery.keywords === '') {
        this.listQuery.keywords = undefined
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleTypeFilter() {
      if (this.listQueryType.keywords === '') {
        this.listQueryType.keywords = undefined
      }
      if (this.listQueryType.vibType === '') {
        this.listQueryType.vibType = undefined
      }
      if (this.date && this.date.length > 0) {
        this.listQueryType.beginTime = this.date[0]
        this.listQueryType.alarmTime = this.date[1]
      } else {
        this.listQueryType.beginTime = undefined
        this.listQueryType.alarmTime = undefined
      }
      this.listQueryType.page = 1
      this.getHistoryList()
    },
    handleDetail(row) {
      if (this.$i18n.locale === 'cn') {
        if (!checkPermission(['aiModel/info'])) {
          this.$message.error('您没有详情权限')
          return false
        }
      } else if (this.$i18n.locale === 'en') {
        if (!checkPermission(['aiModel/info'])) {
          this.$message.error('You don’t have detailed permission')
          return false
        }
      }
      this.dialogDetVisible = true
      getInfo({ id: row.id }).then(response => {
        this.modelInfo = response.data
      })
    },
    handleCurrentChangeType(val) {
      this.listQueryType.page = val
      this.getHistoryList()
    },
    handleSizeChangeType(val) {
      this.listQueryType.limit = val
      this.getHistoryList()
    },
    handleImport(row) {
      if (this.$i18n.locale === 'cn') {
        this.$confirm('导入前会删除AITrain文件夹中的所有文件，请谨慎操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploadVisible = true
          this.params.id = row.id
        })
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('All files in the AITrain folder will be deleted before importing, please be careful!', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.uploadVisible = true
          this.params.id = row.id
        })
      }
    },
    handleHistoryChange(val) {
      this.ids = []
      val.forEach((item, index) => {
        this.ids.push(item.id)
      })
    },
    // 训练
    handleTrain(row) {
      this.listLoading = true
      practice({ id: row.id }).then(response => {
        if (response.data) {
          this.init(row.id)
          this.status = true
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 标记
    handleSign(row) {
      this.aiModelId = row.id
      this.dialogSignVisible = true
      this.getHistoryList()
      this.getMtList()
    },
    // 标记
    signCreate() {
      if (this.$i18n.locale === 'cn') {
        if (this.ids.length === 0) {
          this.$message.error('至少需要选择一条数据')
          return false
        }
        if (!this.signEdit.typeId) {
          this.$message.error('请选择标记类型')
          return false
        }
        this.signEdit.alarmIdList = this.ids
        bindAlarm(this.signEdit).then((response) => {
          if (response.data) {
            this.$message.success('标记成功')
            this.dialogSignVisible = false
            this.getList()
          } else {
            this.$message.error('标记失败')
          }
        })
      } else if (this.$i18n.locale === 'en') {
        if (this.ids.length === 0) {
          this.$message.error('At least one piece of data needs to be selected')
          return false
        }
        if (!this.signEdit.typeId) {
          this.$message.error('Please select mark type')
          return false
        }
        this.signEdit.alarmIdList = this.ids
        bindAlarm(this.signEdit).then((response) => {
          if (response.data) {
            this.$message.success('Mark successful')
            this.dialogSignVisible = false
            this.getList()
          } else {
            this.$message.error('Mark failed')
          }
        })
      }
    },
    handleChangeStatus(row) {
      if (this.$i18n.locale === 'cn') {
        this.$confirm('将重启系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          enable({ id: row.id }).then(res => {
            if (res.data) {
              this.AiWs(res.data)
            } else {
              this.$message.error('操作失败')
            }
          })
        })
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('The system will be restarted, do you want to continue?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          enable({ id: row.id }).then(res => {
            if (res.data) {
              this.AiWs(res.data)
            } else {
              this.$message.error('operation failed')
            }
          })
        })
      }
    },
    // 新增
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    // 修改
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      getInfo({ id: row.id }).then(response => {
        this.modelEdit = response.data
      })
    },
    // 添加类型
    handleAdd(row) {
      this.id = row.id
      this.dialogAddVisible = true
    },
    // 新增提交
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.$i18n.locale === 'cn') {
          if (valid) {
            save(this.modelEdit).then((response) => {
              if (response.data) {
                this.$message.success('操作成功')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('操作失败')
              }
            })
          }
        } else if (this.$i18n.locale === 'en') {
          if (valid) {
            save(this.modelEdit).then((response) => {
              if (response.data) {
                this.$message.success('Successful operation')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('Operation failed')
              }
            })
          }
        }
      })
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$i18n.locale === 'cn') {
            update(this.modelEdit).then(response => {
              if (response.data) {
                this.$message.success('修改成功')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('修改失败')
              }
            })
          } else if (this.$i18n.locale === 'en') {
            update(this.modelEdit).then(response => {
              if (response.data) {
                this.$message.success('Successfully modified')
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message.error('Fail to edit')
              }
            })
          }
        }
      })
    },
    handlestop() {
      if (this.$i18n.locale === 'cn') {
        this.$confirm('将终止所有训练进度, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopPractice().then((response) => {
            if (response.data) {
              this.$message.success('终止成功')
              this.out()
            } else {
              this.$message.error('终止失败')
            }
          })
        })
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('All training progress will be terminated, do you want to continue?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          stopPractice().then((response) => {
            if (response.data) {
              this.$message.success('Terminated successfully')
              this.out()
            } else {
              this.$message.error('Termination failed')
            }
          })
        })
      }
    },
    // 添加类型提交
    typeData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$i18n.locale === 'cn') {
            this.typeEdit.modelId = this.id
            saveType(this.typeEdit).then((response) => {
              if (response.data) {
                this.$message.success('操作成功')
                this.dialogAddVisible = false
                this.getList()
              } else {
                this.$message.error('操作失败')
              }
            })
          } else if (this.$i18n.locale === 'en') {
            this.typeEdit.modelId = this.id
            saveType(this.typeEdit).then((response) => {
              if (response.data) {
                this.$message.success('Successful operation')
                this.dialogAddVisible = false
                this.getList()
              } else {
                this.$message.error('Operation failed')
              }
            })
          }
        }
      })
    },
    // 导出
    handleExport(row) {
      window.open(process.env.VUE_APP_BASE_API + 'api-web/ai/aiModel/exportZip?id=' + row.id)
    },
    // 删除
    handleDelete(row) {
      if (this.$i18n.locale === 'cn') {
        this.$confirm('将删除该条记录并中断训练, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteData({ id: row.id }).then(response => {
            if (response.data) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('This record will be deleted and training will be interrupted. Do you want to continue?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deleteData({ id: row.id }).then(response => {
            if (response.data) {
              this.$message.success('Successfully deleted')
              this.getList()
            } else {
              this.$message.error('Failed to delete')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Undeleted'
          })
        })
      }
    },
    excelImport() {
      this.uploadVisible = true
    },
    importSuccess(response, file, fileList) {
      if (this.$i18n.locale === 'cn') {
        if (response.code !== 200) {
          this.excelFlag = false
          this.$message.error(response.msg)
        } else {
          this.$message.success('导入成功！')
          this.excelFlag = false
          this.uploadVisible = false
        }
      } else if (this.$i18n.locale === 'en') {
        if (response.code !== 200) {
          this.excelFlag = false
          this.$message.error(response.msg)
        } else {
          this.$message.success('Imported successfully!')
          this.excelFlag = false
          this.uploadVisible = false
        }
      }
    },
    importError(err, file, fileList) {
      if (this.$i18n.locale === 'cn') {
        this.excelFlag = false
        this.$message.error('导入出现错误')
        console.log(err)
      } else if (this.$i18n.locale === 'en') {
        this.excelFlag = false
        this.$message.error('Import error')
        console.log(err)
      }
    },
    uploadExcelProcess(event, file, fileList) {
      this.excelFlag = true
      this.uploadPercent = parseInt(file.percentage)
    },
    // 上传图片
    uploadAvatarSuccess1(response, file, fileList) {
      this.$set(this.typeEdit, 'typeIcon', response.data)
    },
    uploadAvatarSuccess2(response, file, fileList) {
      this.$set(this.modelEdit, 'alarmIconRed', response.data)
    },
    uploadAvatarSuccess3(response, file, fileList) {
      this.$set(this.modelEdit, 'alarmIconOrange', response.data)
    },
    uploadAvatarSuccess4(response, file, fileList) {
      this.$set(this.modelEdit, 'alarmIconYellow', response.data)
    },
    uploadAvatarSuccess5(response, file, fileList) {
      this.$set(this.modelEdit, 'alarmIconBlue', response.data)
    },

    // 文件大小限制提示
    beforeAvatarUpload(file) {
      // if (!checkPermission(['ossUpload/**'])) {
      //   this.$message.error('您没有文件上传权限')
      //   return false
      // }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (this.$i18n.locale === 'cn') {
        if (!isLt2M) {
          this.$message.error('上传大小不能超过 5MB!')
        }
      } else if (this.$i18n.locale === 'en') {
        if (!isLt2M) {
          this.$message.error('Upload size cannot exceed 5MB!')
        }
      }
      return isLt2M
    },
    beforeAvatarUpload1(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (this.$i18n.locale === 'cn') {
        if (!isLt2M) {
          this.$message.error('上传大小不能超过 5MB!')
        }
      } else if (this.$i18n.locale === 'en') {
        if (!isLt2M) {
          this.$message.error('Upload size cannot exceed 5MB!')
        }
      }
      return isLt2M
    },
    AiWs(data) {
      if (window.WebSocket) {
        // this.websocket = new WebSocket('ws://' + process.env.LINK_API)
        this.websocket = new WebSocket('ws://192.168.8.131:9005/')

        // 当有消息过来的时候触发
        const that = this
        this.websocket.onmessage = function(event) {
          const data = JSON.parse(event.data)
          that.getWsData(data)
        }

        // 连接关闭的时候触发
        this.websocket.onclose = function(event) {
          console.log('断开连接')
        }

        // 连接打开的时候触发
        this.websocket.onopen = function(event) {
          that.websocket.send(data)
          console.log('建立连接')
        }

        this.websocket.onclose = function(event) {
          console.log('连接断开')
          // that.contextAudioStop()
        }
      } else {
        if (this.$i18n.locale === 'cn') {
          this.$message.error('浏览器不支持WebSocket')
        } else if (this.$i18n.locale === 'en') {
          this.$message.error('The browser does not support WebSocket')
        }
      }
    },
    getReboot() {
      reboot().then(response => {
      })
    },
    getWsData(data) {
      if (this.$i18n.locale === 'cn') {
        if (data.SysConfig_AIModelPath === true) {
          this.$message.success('启用新模型，系统重启中')
          this.reboot()
          this.getList()
        }
      } else if (this.$i18n.locale === 'en') {
        if (data.SysConfig_AIModelPath === true) {
          this.$message.success('The new model is enabled and the system is restarting')
          this.reboot()
          this.getList()
        }
      }

      if (this.websocket) {
        this.websocket.close()
        this.websocket = null
      }
    }
  }
}
</script>
<style>
.el-progress-bar__innerText {
    display: inline-block;
    vertical-align: middle;
    color: #000;
    font-size: 12px;
    margin: 0 5px;
}

</style>
