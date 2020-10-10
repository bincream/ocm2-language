<template>
  <div class="app-container">
    <el-button style="position:absolute;margin-top:71px;margin-left:105px;z-index:100" type="primary" icon="el-icon-plus" size="mini" circle @click="add" />
    <el-button style="position:absolute;margin-top:200px;margin-left:105px;z-index:100" type="primary" icon="el-icon-minus" size="mini" circle @click="less" />
    <div class="block">
      <el-slider
        v-model="valueSlider"
        vertical
        :step="1"
        height="100px"
        show-stops
        :max="5"
        :min="1"
        style="position:absolute;margin-top:100px;margin-left:100px;"
      />
    </div>
    <div class="line1">
      <el-tooltip v-for="(item,index) in pointList1" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point1" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line2">
      <el-tooltip v-for="(item,index) in pointList2" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point2" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line3">
      <el-tooltip v-for="(item,index) in pointList3" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point3" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line4">
      <el-tooltip v-for="(item,index) in pointList4" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point4" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line5">
      <el-tooltip v-for="(item,index) in pointList5" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point5" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line6">
      <el-tooltip v-for="(item,index) in pointList6" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point6" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line7">
      <el-tooltip v-for="(item,index) in pointList7" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point7" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line8">
      <el-tooltip v-for="(item,index) in pointList8" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point8" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line9">
      <el-tooltip v-for="(item,index) in pointList9" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point9" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <div class="line10">
      <el-tooltip v-for="(item,index) in pointList10" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point10" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
    </div>
    <!-- <div class="optical">
      <span style="background: #a5db8f;" class="text">{{ $t('dashboard.guangxianchangdu') }}</span>
    </div> -->
    <div class="img">
      <img style="width:100%;height:auto;" src="../../assets/桌面最终1.png">
    </div>
    <!-- <div class="block">
      <el-tooltip v-for="(item,index) in pointList" :key="index" effect="dark" :content="item.value" placement="top">
        <div class="point" :style="{'margin-left': item.left + '%'}" />
      </el-tooltip>
      <el-slider
        v-model="value"
        :marks="marks"
        :max="50000"
        disabled
      />
    </div> -->
  </div>
</template>

<script>
import { getAllList, getInfo, resolve } from '@/api/index'
import waves from '@/directive/waves' // 水波纹指令
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  name: 'Dashboard',
  directives: {
    waves
  },
  filters: {
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
    isAlarm: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '提醒'
          case 1:
            return '报警'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Remind'
          case 1:
            return 'Alarm'
          default:
            break
        }
      }
    },
    eventType: function(val) {
      const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
      if (lang === 'cn') {
        switch (val) {
          case 0:
            return '非反射事件'
          case 1:
            return '反射事件'
          case 2:
            return '光纤始端'
          case 3:
            return '光纤末端'
          case 4:
            return '其它事件'
          default:
            break
        }
      } else if (lang === 'en') {
        switch (val) {
          case 0:
            return 'Non-reflective event'
          case 1:
            return 'Reflection event'
          case 2:
            return 'Fiber beginning'
          case 3:
            return 'Fiber end'
          case 4:
            return 'Other events'
          default:
            break
        }
      }
    }
  },
  data() {
    return {
      currentRole: 'adminDashboard',
      valueSlider: 1,
      list: [],
      total: null,
      interval: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        beginCol: 0,
        endCol: 50000
      },
      dialogDetVisible: false,
      alarmInfo: {},
      solutionEdit: {},
      soluTypelList: [{ id: 0, value: 'Untreated' }, { id: 1, value: 'Processed' }],
      dialogFormVisible: false,
      rules: {
        solution: [{ required: true, message: '请输入', trigger: 'change' }]
      },
      ids: [],
      pointList1: [
        {
          value: '2500',
          left: 0
        },
        {
          value: '2500',
          left: 100
        }
      ],
      pointList2: [
        {
          value: '2500',
          left: 60
        },
        {
          value: '2500',
          left: 100
        }
      ],
      pointList3: [
        {
          value: '2500',
          left: 50
        }
      ],
      pointList4: [
        {
          value: '2500',
          left: 50
        }
      ],
      pointList5: [
        {
          value: '2500',
          left: 50
        }
      ],
      pointList6: [
        {
          value: '2500',
          left: 0
        },
        {
          value: '2500',
          left: 75
        },
        {
          value: '2500',
          left: 100
        }
      ],
      pointList7: [
        {
          value: '2500',
          left: 75
        }
      ],
      pointList8: [
        {
          value: '2500',
          left: 0
        },
        {
          value: '2500',
          left: 75
        },
        {
          value: '2500',
          left: 100
        }
      ],
      pointList9: [
        {
          value: '2500',
          left: 75
        }
      ],
      pointList10: [
        {
          value: '2500',
          left: 0
        },
        {
          value: '2500',
          left: 75
        },
        {
          value: '2500',
          left: 100
        }
      ],
      pointList: [],
      value: 50000,
      marks: {
        0: '0',
        5000: '5000',
        10000: '10000',
        15000: '15000',
        20000: '20000',
        25000: '25000',
        30000: '30000',
        35000: '35000',
        40000: '40000',
        45000: '45000',
        50000: '50000'
      },
      point: '5',
      left: null
    }
  },
  watch: {
    checkPermission,
    dialogDetVisible(val) {
      !val && setTimeout(() => {
        this.alarmInfo = {}
      }, 100)
    },
    dialogFormVisible(val) {
      !val && setTimeout(() => {
        this.$refs['solutionEdit'].resetFields()
        this.solutionEdit = {}
      }, 100)
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init()
    })
  },

  beforeRouteLeave(to, from, next) {
    this.out()
    next()
  },

  methods: {
    add() {
      if (this.valueSlider < 4) {
        this.valueSlider++
      }
      console.log(this.valueSlider)
    },
    less() {
      if (this.valueSlider > 1) {
        this.valueSlider--
      }
      console.log(this.valueSlider)
    },
    init() {
      const that = this
      this.interval = setInterval(function() {
        console.log('进入')
        that.getList()
      }, 5000)
    },
    out() {
      console.log(this.interval)
      if (this.interval) {
        clearInterval(this.interval) // 关闭
        this.interval = null
        console.log('离开')
      }
    },
    getList() {
      this.listLoading = true
      getAllList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        this.pointList = []
        this.list.forEach(item => {
          this.left = (item.centerCol / 500)
          this.pointList.push({ value: item.centerCol.toString(), left: this.left })
        })
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
    handleDetail(row) {
      this.dialogDetVisible = true
      getInfo({ id: row.id }).then(response => {
        this.alarmInfo = response.data
      })
    },
    // 新增
    handleSolu(row) {
      this.solutionEdit.id = row.id
      this.ids = []
      this.ids.push(row.id)
      if (this.$i18n.locale === 'cn') {
        this.$confirm('是否确认该条告警已处理？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resolve({ ids: this.ids }).then((response) => {
            if (response.data) {
              this.$message.success('操作成功')
              this.getList()
            } else {
              this.$message.error('操作失败')
            }
          })
        })
      } else if (this.$i18n.locale === 'en') {
        this.$confirm('Are you sure that the alarm has been processed?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          resolve({ ids: this.ids }).then((response) => {
            if (response.data) {
              this.$message.success('Successful operation')
              this.getList()
            } else {
              this.$message.error('Operation failed')
            }
          })
        })
      }
    },
    handleSeeSolu(row) {
      this.solutionEdit.solution = row.solution
      this.dialogFormVisible = true
    },
    slider() {
      // console.log(this.value)
      this.listQuery.beginCol = this.value[0]
      this.listQuery.endCol = this.value[1]
      this.getList()
    }
  }
}
</script>
<style lang="css">
*{
  margin: 0px;
  padding: 0px;
}
.line1, .line2, .line3, .line4, .line5, .line6, .line7, .line8, .line9, .line10 {
  position: absolute;
}
@keyframes fade {
  from {
      opacity: 1.0;
  }
  50% {
      opacity: 0.4;
  }
  to {
      opacity: 1.0;
  }
}
@-webkit-keyframes fade {
    from {
        opacity: 1.0;
    }
  50% {
        opacity: 0.4;
    }
    to {
        opacity: 1.0;
    }
}
.line1 {
  background: transparent;
  /* outline: 1px solid #ff0; */
  top: 334px;
  left: 926px;
  z-index: 50;
  width: 74px;
  height: 4px;
  transform: rotate(-90deg);
  /* IE 9 */
  /* -ms-transform: rotate(88deg); */
  /* Firefox */
  /* -moz-transform: rotate(88deg); */
  /* Safari and Chrome */
  /* -webkit-transform: rotate(8deg); */
  /* Opera */
  /* -o-transform: rotate(88deg); */
}
.line2 {
  background: transparent;
  /* outline: 5px solid #000; */
  top: 294px;
  left: 706px;
  z-index: 150;
  width: 263px;
  height: 4px;
  transform: rotate(180deg);
}
.line3 {
  background: transparent;
  /* outline: 1px solid #ff0; */
  top: 273px;
  left: 677px;
  z-index: 50;
  width: 46px;
  height: 4px;
  transform: rotate(-90deg);
  /* IE 9 */
  /* -ms-transform: rotate(88deg); */
  /* Firefox */
  /* -moz-transform: rotate(88deg); */
  /* Safari and Chrome */
  /* -webkit-transform: rotate(8deg); */
  /* Opera */
  /* -o-transform: rotate(88deg); */
}
.line4 {
  background: transparent;
  /* outline: 5px solid #000; */
  top: 248px;
  left: 451px;
  z-index: 150;
  width: 254px;
  height: 4px;
  transform: rotate(180deg);
}

.line5 {
  background: transparent;
  /* outline: 1px solid #ff0; */
  top: 456px;
  left: 235px;
  z-index: 50;
  width: 426px;
  height: 4px;
  transform: rotate(90deg);
  /* IE 9 */
  /* -ms-transform: rotate(88deg); */
  /* Firefox */
  /* -moz-transform: rotate(88deg); */
  /* Safari and Chrome */
  /* -webkit-transform: rotate(8deg); */
  /* Opera */
  /* -o-transform: rotate(88deg); */
}
.line6 {
  background: transparent;
  /* outline: 5px solid #000; */
  top: 660px;
  left: 442px;
  z-index: 150;
  width: 327px;
  height: 4px;
  transform: rotate(-4deg);
}
.line7 {
  background: transparent;
  /* outline: 1px solid #ff0; */
  top: 610px;
  left: 725px;
  z-index: 50;
  width: 90px;
  height: 4px;
  transform: rotate(-90deg);
  /* IE 9 */
  /* -ms-transform: rotate(88deg); */
  /* Firefox */
  /* -moz-transform: rotate(88deg); */
  /* Safari and Chrome */
  /* -webkit-transform: rotate(8deg); */
  /* Opera */
  /* -o-transform: rotate(88deg); */
}
.line8 {
  background: transparent;
  /* outline: 5px solid #000; */
  top: 558px;
  left: 768px;
  z-index: 150;
  width: 114px;
  height: 4px;
  transform: rotate(0deg);
}
.line9 {
  background: transparent;
  /* outline: 1px solid #ff0; */
  top: 598px;
  left: 846px;
  z-index: 50;
  width: 85px;
  height: 4px;
  transform: rotate(90deg);
  /* IE 9 */
  /* -ms-transform: rotate(88deg); */
  /* Firefox */
  /* -moz-transform: rotate(88deg); */
  /* Safari and Chrome */
  /* -webkit-transform: rotate(8deg); */
  /* Opera */
  /* -o-transform: rotate(88deg); */
}
.line10 {
  background: transparent;
  /* outline: 5px solid #000; */
  top: 637px;
  left: 882px;
  z-index: 150;
  width: 208px;
  height: 4px;
  transform: rotate(-3.5deg);
}
.el-slider__runway{
  background-color: #1890ff;
}
.el-slider__runway.disabled .el-slider__bar{
  background-color: #1890ff
}
.el-slider__runway.disabled .el-slider__button {
    opacity: 0.0;
}
.el-slider__button {
    opacity: 0.0;
}
.linear {
	height:0px;
	border: 8px solid red;
	margin-left: 30px;
	margin-top: 300px;
  background-color: #1890ff;
  position: absolute;
  z-index:900;
}
.img{
	width:1300px;
	height:auto;
	margin-left: 150px;
  margin-top: 25px;
	background:#fff;
  position: absolute;
  z-index:-1;
}
.point1{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point2{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point3{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point4{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    /* -webkit-transform: translateX(-50%);
    transform: translateX(-50%); */
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point5{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point6{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point7{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point8{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point9{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
.point10{
    position: absolute;
    z-index: 999;
    height: 8px;
    width: 8px;
    border-radius: 100%;
    background-color: red;
    animation: fade 600ms infinite;
    -webkit-animation: fade 600ms infinite;
}
</style>
