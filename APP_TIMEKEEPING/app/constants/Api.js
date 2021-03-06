import axios from "axios";
import { Alert } from "react-native";
import NavigationUtil from "../navigation/NavigationUtil";
import I18n from "../i18n/i18n";
import AsyncStorage from "@react-native-community/async-storage";
import { SCREEN_ROUTER } from "@constant";
import Toast, { BACKGROUND_TOAST } from "@app/utils/Toast";
// singleton  network client
function createAxios() {
  // AsyncStorage.setItem("token", '2323226DADAD') //full
  var axiosInstant = axios.create();
  axiosInstant.defaults.baseURL = "http://b51dbc098702.ngrok.io/app";
  axiosInstant.defaults.timeout = 20000;
  axiosInstant.defaults.headers = { "Content-Type": "application/json" };

  axiosInstant.interceptors.request.use(
    async config => {
      let token = await AsyncStorage.getItem("token");
      if (typeof token === "undefined" || token === null) {
        token = "";
      }
      config.headers = {
        token: token
      };
      // config.headers.token = await AsyncStorage.getItem('token', '')
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  axiosInstant.interceptors.response.use(
    response => {
      // console.log("Response:", response.data);
      if (response.data && response.data.code == 403) {
        setTimeout(() => {
          Toast.show(I18n.t("relogin"), BACKGROUND_TOAST.FAIL);
          // Alert.alert("Thông báo", I18n.t("relogin"));
        }, 100);

        AsyncStorage.setItem("token", "", () => {
          NavigationUtil.navigate(SCREEN_ROUTER.AUTH);
        });
      } else if (response.data && response.data.status != 1) {
        setTimeout(() => {
          Toast.show(response.data.message, BACKGROUND_TOAST.FAIL);
          // Alert.alert("Thông báo", response.data.message);
        }, 100);
      }
      return response;
    },
    err => {
      setTimeout(() => {
        Toast.show("Lỗi kết nối", BACKGROUND_TOAST.FAIL);
        // Alert.alert("Thông báo", "Lỗi kết nối");
      }, 100);
      return Promise.reject(err);
    }
  );
  return axiosInstant;
}

export const getAxios = createAxios();

/* Support function */
function handleResult(api) {
  return api.then(res => {
    if (res.data.status != 1) {
      return Promise.reject(new Error("Co loi xay ra"));
    }
    return Promise.resolve(res.data);
  });
}

// Application api request
export const requestLogin = payload => {
  return handleResult(getAxios.post("login", payload));
};
export const requestLogout = payload => {
  return handleResult(getAxios.get("logout"));
};



//get User infor
export const getUserInfo = () => {
  return handleResult(getAxios.get("/app/api/getUserInfo"));
};

// change pass
export const changePass = payload => {
  return handleResult(getAxios.post("app/api/changePass", payload));
};

export const getListTimekeeping = (startDate, endDate) => {
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  return handleResult(
    getAxios.get(
      `/app/api/getListTimekeeping?startDate=${startDate}&endDate=${endDate}`
    )
  );
};

export const getListAbsent = () => {
  return handleResult(getAxios.get("student/getListAbsentClass"));
};

//get notification
export const getListNotification = () => {
  return handleResult(getAxios.get("/app/api/notification"));
};

export const updateUser = payload => {
  return handleResult(getAxios.post(`app/api/changeUserInfo`, payload));
};
export const checkinTimekeeping = payload => {
  return handleResult(getAxios.post(`app/api/checkin`, payload));
};
export const checkoutTimekeeping = payload => {
  return handleResult(getAxios.post(`app/api/checkout`, payload));
};
export const workOffTimekeeping = payload => {
  console.log("adasdsa");
  return handleResult(getAxios.post(`app/api/workoff`, payload));
};
export const getListTimekeepingDayEmployee=(dateGet)=>{
  return handleResult(
    getAxios.get(
      `/app/api/getListTimekeepingDayEmployee?dateGet=${dateGet}`
    )
  );
}
export const getListTimekeepingMonthEmployee = (startDate, endDate,id_employee) => {
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  return handleResult(
    getAxios.get(
      `/app/api/getListTimekeepingMonthEmployee?startDate=${startDate}&endDate=${endDate}&id_employee=${id_employee}`
    )
  );
};
export const uploadImage = payload => {
  return handleResult(
    getAxios.post(`student/uploadImage`, payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
      // onUploadProgress: callback,
    })
  );
};
