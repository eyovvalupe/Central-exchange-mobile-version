// 市场
import { _copyList, _copyMyData, _copyMyList } from '@/api/api'

export default {
  state: {
    followListLoading:false,
    followList: [], // 跟单列表
    myCopyLoading:false,
    myCopy: [], // 我的跟单
    copyItem: JSON.parse(sessionStorage.getItem('copyItem')),
    myCopyData: {},
    copyItemDetail: JSON.parse(sessionStorage.getItem('copyItemDetail'))
  },
  mutations: {
    setCopyItemDetail(state, data) {
      state.copyItemDetail = data
    },
    setMyCopyData(state, data) {
      state.myCopyData = data
    },
    setMyCopyLoading(state,data){
      state.myCopyLoading = data
    },
    setCopyItem(state, data) {
      state.copyItem = data
    },
    setFollowList(state, data) {
      state.followList = data || []
    },
    setFollowListLoading(state, data) {
      state.followListLoading = data
    },
    setMyCopy(state, data) {
      state.myCopy = data || []
    },
  },
  actions: {
    updateFollowList({ commit }) {
      // 更新跟单列表
      return new Promise(resolve => {
        commit('setFollowListLoading',true)
        _copyList({ page: 1 })
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setFollowList', res.data || [])
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false)).finally(()=>{
            commit('setFollowListLoading', false)
          })
      })
    },
    updateMyFollowList({ commit }) {
      // 更新我的跟单列表
      return new Promise(resolve => {
        commit('setMyCopyLoading', true)
        _copyMyList()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setMyCopy', res.data || [])
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false)).finally(()=>{
            commit('setMyCopyLoading', false)
          })
      })
    },
    updateMyCopyData({ commit }) {
      // 更新我的跟单列表
      return new Promise(resolve => {
        _copyMyData()
          .then(res => {
            if (res.code == 200 && res.data) {
              commit('setMyCopyData', res.data || [])
              resolve(res.data)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
    },
  },
}
