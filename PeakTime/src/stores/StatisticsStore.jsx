import { create } from "zustand";

const initialState = {
  rawdata: {
    root: {
      userId: 1,
      nickname: "main1",
      totalHikingTime: 43,
      totalHikingCount: 8,
      totalSuccessCount: 1,
      totalBlockedCount: 9,
      startTimeList: [
        "09:30",
        "09:26",
        "09:28",
        "09:39",
        "09:38",
        "09:29",
        "09:36",
        "09:31",
        "09:37",
        "09:21",
        "09:31",
        "09:39",
        "09:26",
        "09:39",
        "09:24",
        "09:22",
        "09:30",
        "09:33",
        "09:24",
        "09:23",
        "09:25",
        "09:33",
        "09:26",
        "09:40",
        "09:31",
        "09:29",
        "09:24",
        "09:20",
        "09:21",
        "09:38",
        "09:35",
        "09:24",
        "09:26",
        "09:35",
        "09:32",
        "14:05",
        "14:05",
        "14:06",
        "14:00",
        "14:01",
        "14:15",
        "14:19",
        "14:20",
        "14:04",
        "14:15",
        "14:11",
        "14:01",
        "14:13",
        "14:17",
        "14:01",
        "14:05",
        "14:06",
        "14:02",
        "14:15",
        "14:13",
        "14:09",
        "14:20",
        "14:10",
        "14:14",
        "14:14",
        "14:00",
        "14:07",
        "14:01",
        "14:05",
        "14:11",
        "14:08",
        "14:11",
        "14:16",
        "14:18",
        "14:14",
        "09:05",
        "01:18",
        "10:14",
        "11:20",
        "05:35",
        "16:50",
        "05:57",
        "04:49",
        "23:21",
        "12:05",
        "08:18",
        "20:03",
        "23:25",
        "16:26",
        "13:42",
        "02:11",
        "08:00",
        "06:32",
        "06:39",
        "18:43",
        "13:49",
        "04:24",
        "23:04",
        "07:31",
        "10:27",
        "19:38",
        "12:03",
        "16:51",
        "10:10",
        "09:47",
      ],
      mostSiteList: [
        {
          name: "flowbite-svelte.com",
          usingTime: 189,
        },
        {
          name: "www.naver.com",
          usingTime: 110,
        },
        {
          name: "extensions",
          usingTime: 66,
        },
        {
          name: "www.pearlabyss.com",
          usingTime: 46,
        },
        {
          name: "www.youtube.com",
          usingTime: 43,
        },
      ],
      mostProgramList: [
        {
          name: "chrome.exe",
          usingTime: 718,
        },
        {
          name: "electron.exe",
          usingTime: 108,
        },
        {
          name: "PeakTime.exe",
          usingTime: 4,
        },
        {
          name: "Code.exe",
          usingTime: 2,
        },
      ],
    },
    groupList: [
      {
        groupId: 8,
        groupTitle: "그룹명2",
        childList: [
          {
            userId: 9,
            nickname: "서브계정1",
            totalHikingTime: 0,
            totalHikingCount: 0,
            totalSuccessCount: 0,
            totalBlockedCount: 0,
            startTimeList: [],
            mostSiteList: [],
            mostProgramList: [],
          },
          {
            userId: 10,
            nickname: "서브계정2",
            totalHikingTime: 0,
            totalHikingCount: 0,
            totalSuccessCount: 0,
            totalBlockedCount: 0,
            startTimeList: [],
            mostSiteList: [],
            mostProgramList: [],
          },
        ],
      },
      {
        groupId: 9,
        groupTitle: "그룹명3",
        childList: [],
      },
      {
        groupId: 10,
        groupTitle: "asd",
        childList: [
          {
            userId: 11,
            nickname: "asddd",
            totalHikingTime: 0,
            totalHikingCount: 0,
            totalSuccessCount: 0,
            totalBlockedCount: 0,
            startTimeList: [],
            mostSiteList: [],
            mostProgramList: [],
          },
        ],
      },
      {
        groupId: 7,
        groupTitle: "그룹명1",
        childList: [],
      },
    ],
  },

  isRoot: JSON.parse(localStorage.getItem("user"))?.isRoot || false,

  showStatistics: {
    userId: null,
    nickname: null,
    totalHikingTime: 0,
    totalHikingCount: 0,
    totalSuccessCount: 0,
    totalBlockedCount: 0,
    startTimeList: [],
    mostSiteList: [],
    mostProgramList: [],
  },
  childList: [],

  groupId: null, // selected
  childUserId: null, // selected
};

export const useStatisticsStore = create((set) => ({
  ...initialState,

  setRawdata: (rawdata) => set({ rawdata: rawdata }),

  // 드롭다운 child 목록
  setChildList: (groupId) => {
    const group = useStatisticsStore
      .getState()
      .rawdata.groupList.find((group) => group.groupId === groupId);

    set({ childList: group?.childList || [] });
  },

  // 드롭다운에서 선택한 group 및 sub user
  setGroupId: (groupId) => set({ groupId: groupId }),
  setChildUserId: (childUserId) => set({ childUserId: childUserId }),

  // 통계 페이지에 보일 유저의 groupId, childUserId 세팅
  setUser: (groupId = null, childUserId = null) => {
    useStatisticsStore.getState().setGroupId(groupId);
    useStatisticsStore.getState().setChildUserId(childUserId);
  },

  // 통계 페이지 화면에 보일 통계 데이터
  setShowStatistics: (groupId = null, childUserId = null) => {
    const { rawdata } = useStatisticsStore.getState();
    const selectedKeys = [
      "userId",
      "nickname",
      "totalHikingTime",
      "totalHikingCount",
      "totalSuccessCount",
      "totalBlockedCount",
      "startTimeList",
      "mostSiteList",
      "mostProgramList",
    ];

    let newStatistics;

    // root user인 경우 groupId, childUserId 모두 null
    // sub user인 경우 groupId, childUserId 모두 값이 있어야 함
    if (groupId === null && childUserId === null) {
      newStatistics = Object.keys(rawdata.root)
        .filter((key) => selectedKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = rawdata.root[key];
          return obj;
        }, {});
    } else if (groupId !== null && childUserId !== null) {
      const group = rawdata.groupList.find(
        (group) => group.groupId === groupId
      );

      if (!group) {
        newStatistics = initialState.showStatistics;
      } else {
        const child = group.childList.find(
          (childInfo) => childInfo.userId === childUserId
        );
        newStatistics = child || initialState.showStatistics;
      }
    }

    set({ showStatistics: newStatistics });
  },

  resetAll: () => set({ ...initialState }),
}));
