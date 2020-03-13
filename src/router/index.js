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
 * Detail see: https://panjiachen.github.io/vue-element-超级管理员-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['超级管理员','editor']    control the page roles (you can set multiple roles)
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
export const constantRoutes = [
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
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/systemtest',
    component: Layout,
    redirect: '/systemtest',
    // alwaysShow: true, // 总是显示根菜单吗
    name: 'systemtest',
    meta: {
      title: '系统测试',
      icon: 'lock',
      roles: ['超级管理员', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'systemtest',
        component: () => import('@/views/systemtest/index'),
        name: 'Systemtest',
        meta: {
          title: '系统测试',
          roles: ['超级管理员'] // 或者只能在子导航中设置角色
        }
      }
    ]
  },
  {
    path: '/signal',
    component: Layout,
    redirect: '/signal',
    alwaysShow: true, // 总是显示根菜单吗
    name: 'Signal',
    meta: {
      title: '信号调节',
      icon: 'lock',
      roles: ['超级管理员', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'squiggle',
        component: () => import('@/views/signal/squiggle'),
        name: 'Squiggle',
        meta: {
          title: '波形曲线',
          roles: ['超级管理员']
        }
      },
      {
        path: 'realTimeVoice',
        component: () => import('@/views/signal/realTimeVoice'),
        name: 'RealTimeVoice',
        meta: {
          title: '实时声音',
          roles: ['超级管理员']
        }
      },
      {
        path: 'twoDimension',
        component: () => import('@/views/signal/twoDimension'),
        name: 'TwoDimension',
        meta: {
          title: '二维振动',
          roles: ['超级管理员']
        }
      }
    ]
  },
  {
    path: '/AiIdentify',
    component: Layout,
    redirect: '/AiIdentify',
    alwaysShow: true, // 总是显示根菜单吗
    name: 'AiIdentify',
    meta: {
      title: 'AI识别',
      icon: 'lock',
      roles: ['超级管理员', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'model',
        component: () => import('@/views/AiIdentify/model'),
        name: 'Model',
        meta: {
          title: '模型管理',
          roles: ['超级管理员']
        }
      },
      {
        path: 'modelTraining',
        component: () => import('@/views/AiIdentify/modelTraining'),
        name: 'ModelTraining',
        meta: {
          title: '模型训练',
          roles: ['超级管理员']
        }
      },
      {
        path: 'identifyType',
        component: () => import('@/views/AiIdentify/identifyType'),
        name: 'IdentifyType',
        meta: {
          title: '识别类型',
          roles: ['超级管理员']
        }
      }
    ]
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: '/alarm',
    alwaysShow: true, // 总是显示根菜单吗
    name: 'alarm',
    meta: {
      title: '报警管理',
      icon: 'lock',
      roles: ['超级管理员', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'realTimeAlarm',
        component: () => import('@/views/alarm/realTimeAlarm'),
        name: 'RealTimeAlarm',
        meta: {
          title: '实时报警',
          roles: ['超级管理员']
        }
      },
      {
        path: 'historicalAlarm',
        component: () => import('@/views/alarm/historicalAlarm'),
        name: 'HistoricalAlarm',
        meta: {
          title: '历史报警',
          roles: ['超级管理员']
        }
      },
      {
        path: 'timeStatistics',
        component: () => import('@/views/alarm/timeStatistics'),
        name: 'timeStatistics',
        meta: {
          title: '时间统计',
          roles: ['超级管理员']
        }
      },
      {
        path: 'regionalStatistics',
        component: () => import('@/views/alarm/regionalStatistics'),
        name: 'regionalStatistics',
        meta: {
          title: '区域统计',
          roles: ['超级管理员']
        }
      }
    ]
  },
  {
    path: '/maintain',
    component: Layout,
    redirect: '/maintain',
    // alwaysShow: true, // 总是显示根菜单吗
    meta: {
      title: '设备维护',
      icon: 'lock',
      roles: ['超级管理员', 'editor'] // 可以在根导航中设置角色
    },
    children: [
      {
        path: 'maintain',
        component: () => import('@/views/maintain/index'),
        name: 'maintain',
        meta: {
          title: '设备维护',
          roles: ['超级管理员']
        }
      }
    ]
  },
  {
    path: '/rsc',
    component: Layout,
    children: [
      {
        path: 'rsc',
        component: () => import('@/views/rsc/rscBaseStand'),
        name: 'ErrorLog',
        icon: 'lock',
        meta: { title: '基站管理', icon: 'bug' }
      }
    ]
  },

  {
    path: '/sysRole',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'lock'

    },
    children: [{
      path: 'sysUser',
      component: () => import('@/views/system/sysUser'),
      name: 'sysUser',
      meta: {
        title: '系统用户管理',
        noCache: true
      }
    },
    {
      path: 'sysRole',
      component: () => import('@/views/system/sysRole'),
      name: 'sysRole',
      meta: {
        title: '角色权限管理',
        noCache: true
      }
    },

    {
      path: 'sysLog',
      component: () => import('@/views/system/sysLog'),
      name: 'SysLog',
      meta: {
        title: '操作日志',
        noCache: true
      }
    }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['超级管理员', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['超级管理员'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['超级管理员']
        }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-超级管理员',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
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
