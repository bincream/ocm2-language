import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element--site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
const constantRoutesCN = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'nested', affix: true }
      }
    ]
  }
]
const constantRoutesEN = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Home', icon: 'nested', affix: true }
      }
    ]
  }
]
const lang = JSON.parse(JSON.stringify(window.localStorage)).lang
export const constantRoutes = lang === 'cn' ? constantRoutesCN : constantRoutesEN

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/systemtest',
    component: Layout,
    // alwaysShow: true, // 总是显示根菜单吗
    name: 'systemtest',
    children: [
      {
        path: '/systemtest',
        component: () => import('@/views/systemtest/index'),
        name: 'Systemtest',
        meta: {
          title: '系统测试',
          icon: 'tab'
        }
      }
    ]
  },
  {
    path: '/signal',
    component: Layout,
    alwaysShow: true, // 总是显示根菜单吗
    name: 'Signal',
    meta: {
      title: '信号调节',
      icon: 'chart'

    },
    children: [
      {
        path: 'squiggle/rscQuery',
        component: () => import('@/views/signal/squiggle'),
        name: 'Squiggle',
        meta: {
          title: '波形曲线'
        }
      },
      {
        path: 'twoDimension',
        component: () => import('@/views/signal/twoDimension'),
        name: 'TwoDimension',
        meta: {
          title: '二维振动'
        }
      },
      {
        path: 'otdr/otdrQuery',
        component: () => import('@/views/signal/otdr'),
        name: 'OTDR',
        meta: {
          title: 'OTDR'
        }
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    redirect: 'ai',
    name: 'Ai',
    meta: {
      title: 'AI识别',
      icon: 'icon'
    },
    children: [
      {
        path: 'aiModel',
        component: () => import('@/views/Ai/aimodel'),
        name: 'aimodel',
        meta: {
          title: '识别模型'
        }
      },
      {
        path: 'aiModelType',
        component: () => import('@/views/Ai/aiModelType'),
        name: 'aiModelType',
        meta: {
          title: '识别类型'
        }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    alwaysShow: true, // 总是显示根菜单吗
    name: 'alarm',
    meta: {
      title: '报警管理',
      icon: 'dashboard'
      // roles: ['', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'alarmInfo',
        component: () => import('@/views/alarm/realTimeAlarm'),
        name: 'RealTimeAlarm',
        meta: {
          title: '实时报警'

        }
      },
      {
        path: 'alarmHis',
        component: () => import('@/views/alarm/historicalAlarm'),
        name: 'HistoricalAlarm',
        meta: {
          title: '历史报警'

        }
      },
      {
        path: 'alarmTime',
        component: () => import('@/views/alarm/timeStatistics'),
        name: 'timeStatistics',
        meta: {
          title: '时间统计'

        }
      },
      {
        path: 'alarmDistance',
        component: () => import('@/views/alarm/regionalStatistics'),
        name: 'regionalStatistics',
        meta: {
          title: '区域统计'

        }
      }
    ]
  },
  {
    path: '/maintain',
    component: Layout,
    // alwaysShow: true, // 总是显示根菜单吗
    children: [
      {
        path: '/maintain',
        component: () => import('@/views/maintain/index'),
        name: 'maintain',
        meta: {
          title: '设备维护',
          icon: 'example'
        }
      }
    ]
  },
  {
    path: '/rsc',
    component: Layout,
    children: [
      {
        path: 'baseStand',
        component: () => import('@/views/rsc/rscBaseStand'),
        name: 'Rsc',
        icon: 'tree-table',
        meta: { title: '基站管理', icon: 'list' }

      }
    ]
  },

  {
    path: '/sysRole',
    component: Layout,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'user'

    },
    children: [{
      path: 'systemUser/getList',
      component: () => import('@/views/system/sysUser'),
      name: 'sysUser',
      meta: {
        title: '系统用户管理',
        noCache: true

      }
    },
    {
      path: 'sysPer/getList',
      component: () => import('@/views/system/sysRole'),
      name: 'sysRole',
      meta: {
        title: '角色权限管理',
        noCache: true

      }
    },

    {
      path: 'sysLog/getList',
      component: () => import('@/views/system/sysLog'),
      name: 'SysLog',
      meta: {
        title: '操作日志'

      }
    }
    ]
  },
  {
    path: '/addRole',
    component: Layout,
    children: [
      {
        path: 'addRole',
        component: () => import('@/views/addRole'),
        name: 'AddRole',
        meta: { title: '添加权限', icon: 'keyuan', noCache: true }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: 'permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission'
  //         // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'

  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission'

  //       }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '404', hidden: true }
]

export const asyncRoutesEn = [

  {
    path: '/systemtest',
    component: Layout,
    // alwaysShow: true, // 总是显示根菜单吗
    name: 'systemtest',
    // meta: {
    //   title: '系统测试',
    //   icon: 'tab'
    // },
    // 11111
    children: [
      {
        path: '/systemtest',
        component: () => import('@/views/systemtest/index'),
        name: 'Systemtest',
        meta: {
          title: 'System test',
          icon: 'tab'
        }
      }
    ]
  },
  {
    path: '/signal',
    component: Layout,
    alwaysShow: true, // 总是显示根菜单吗
    name: 'Signal',
    meta: {
      title: 'Signal adjust',
      icon: 'chart'

    },
    children: [
      {
        path: 'squiggle/rscQuery',
        component: () => import('@/views/signal/squiggle'),
        name: 'Squiggle',
        meta: {
          title: 'Wave curve'
        }
      },
      {
        path: 'twoDimension',
        component: () => import('@/views/signal/twoDimension'),
        name: 'TwoDimension',
        meta: {
          title: 'Two-dimensional vibration'
        }
      },
      {
        path: 'otdr/otdrQuery',
        component: () => import('@/views/signal/otdr'),
        name: 'OTDR',
        meta: {
          title: 'OTDR'
        }
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    redirect: 'ai',
    name: 'Ai',
    meta: {
      title: 'AI recognition',
      icon: 'icon'
    },
    children: [
      {
        path: 'aiModel',
        component: () => import('@/views/Ai/aimodel'),
        name: 'aimodel',
        meta: {
          title: 'Recognition model'
        }
      },
      {
        path: 'aiModelType',
        component: () => import('@/views/Ai/aiModelType'),
        name: 'aiModelType',
        meta: {
          title: 'Identification type'
        }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    alwaysShow: true, // 总是显示根菜单吗
    name: 'alarm',
    meta: {
      title: 'Alarm MGT',
      icon: 'dashboard'
      // roles: ['', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'alarmInfo',
        component: () => import('@/views/alarm/realTimeAlarm'),
        name: 'RealTimeAlarm',
        meta: {
          title: 'Real-time alarm'

        }
      },
      {
        path: 'alarmHis',
        component: () => import('@/views/alarm/historicalAlarm'),
        name: 'HistoricalAlarm',
        meta: {
          title: 'History alarm'
        }
      },
      {
        path: 'alarmTime',
        component: () => import('@/views/alarm/timeStatistics'),
        name: 'timeStatistics',
        meta: {
          title: 'Time statistics'

        }
      },
      {
        path: 'alarmDistance',
        component: () => import('@/views/alarm/regionalStatistics'),
        name: 'regionalStatistics',
        meta: {
          title: 'Regional Statistics'

        }
      }
    ]
  },
  {
    path: '/maintain',
    component: Layout,
    // alwaysShow: true, // 总是显示根菜单吗
    children: [
      {
        path: '/maintain',
        component: () => import('@/views/maintain/index'),
        name: 'maintain',
        meta: {
          title: 'Maintenance',
          icon: 'example'
        }
      }
    ]
  },
  {
    path: '/rsc',
    component: Layout,
    // 11111
    children: [
      {
        path: 'baseStand',
        component: () => import('@/views/rsc/rscBaseStand'),
        name: 'Rsc',
        icon: 'tree-table',
        meta: { title: 'Base station MGT', icon: 'list' }

      }
    ]
  },

  {
    path: '/sysRole',
    component: Layout,
    name: 'System',
    meta: {
      title: 'System MGT',
      icon: 'user'

    },
    children: [{
      path: 'systemUser/getList',
      component: () => import('@/views/system/sysUser'),
      name: 'sysUser',
      meta: {
        title: 'System user MGT',
        noCache: true

      }
    },
    {
      path: 'sysPer/getList',
      component: () => import('@/views/system/sysRole'),
      name: 'sysRole',
      meta: {
        title: 'Role authority MGT',
        noCache: true

      }
    },

    {
      path: 'sysLog/getList',
      component: () => import('@/views/system/sysLog'),
      name: 'SysLog',
      meta: {
        title: 'Operation log'

      }
    }
    ]
  },
  {
    path: '/addRole',
    component: Layout,
    children: [
      {
        path: 'addRole',
        component: () => import('@/views/addRole'),
        name: 'AddRole',
        meta: { title: '添加权限', icon: 'keyuan', noCache: true }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: 'permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission'
  //         // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'

  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission'

  //       }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
